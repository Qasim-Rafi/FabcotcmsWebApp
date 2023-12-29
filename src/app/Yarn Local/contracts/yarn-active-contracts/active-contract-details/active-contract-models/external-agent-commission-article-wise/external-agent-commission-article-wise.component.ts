import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ServiceService } from 'src/app/shared/service.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-external-agent-commission-article-wise',
  templateUrl: './external-agent-commission-article-wise.component.html',
  styleUrls: ['./external-agent-commission-article-wise.component.css']
})
export class ExternalAgentCommissionArticleWiseComponent implements OnInit {
  @Input() contractId;
  @Input() statusCheck;
  @Input() RowData;
  response: any;
  data: any = {};
  test: any = [{id:0}];
  agents:any=[];
  constructor(
    private _NgbActiveModal: NgbActiveModal,
    private http: HttpClient,
    private service: ServiceService,
    private spinner: NgxSpinnerService,

    private toastr: ToastrService,

  ) { }

  ngOnInit(): void {
    this.statusCheck = this.statusCheck;
    this.GetAgentDropdown();
    console.log(this.RowData)
    if (this.statusCheck == 'Edit') {
      this.getById();
    }

  }
  get activeModal() {
    return this._NgbActiveModal;
  }
  addfield() {
    this.test.push({ id: 0 });

  }
  removefield(i: number) {
    this.test.splice(i, 1);

  }
  GetAgentDropdown() {
    this.service.getAgents().subscribe(res => {
      this.response = res;
      if (this.response.success == true && this.response.data != null) {
        this.agents = this.response.data;
      }
      else if(this.response.success == false) {
         
        this.toastr.error(this.response.message, 'Message.');
      }
    })
  }
  getById() {

    this.http
      .get(
        `${environment.apiUrl}/api/City/GetCity/` +
          this.contractId
      )
      .subscribe(
        (res) => {
          this.response = res;
          if (this.response.success == true) {
            this.data = this.response.data;
            // this.form.controls.NameUrl.setValue(this.data?.siteUrl);
            // this.Url = this.transform(this.data.fullpath);
            // this.form.controls.Active.setValue(this.data?.active);
            // this.spinner.hide();
            // console.log(this.Url + 'Same');
          } else {
            this.toastr.error(this.response.message, 'Message.');
            this.spinner.hide();
          }
        },
        (err) => {
          if (err.status == 400) {
            this.toastr.error(this.response.message, 'Message.');
            this.spinner.hide();
          }
        }
      );
  }

  add() {

    // if (this.data.agentId != null) {
    //   this.commission.push({ ['agentId']: this.data.agentId, ["agentCommission"]: this.data.agentCommission })

    // }
    // for (let i = 0; i < this.data1.length; i++) {

    //   this.commission.push({ ['agentId']: this.data1[i].agentId, ["agentCommission"]: this.data1[i].agentCommission })
    // }
this.spinner.show();
    let varr = {

      "contractId": this.contractId,

      "agentCommissions": this.test[0].id == 0 ? this.test[0].hasOwnProperty('agentId') == false ? undefined : this.test : this.test[0].agentId == null ? undefined : this.test 
    }

    this.http.
      post(`${environment.apiUrl}/api/Contracts/AddContractCommissionKickBack`, varr)
      .subscribe(
        res => {

          this.response = res;
          if (this.response.success == true) {
            this.toastr.success(this.response.message, 'Message.');varr
            // this.getEnquiryData(this.objEnquiry);
            this.activeModal.close(true);
this.spinner.hide();

          }
          else {
            this.toastr.error(this.response.message, 'Message.');
this.spinner.hide();

          }

        },(err: HttpErrorResponse) => {
          const messages = this.service.extractErrorMessagesFromErrorResponse(err);
          this.toastr.error(messages.toString(), 'Message.');
          console.log(messages);
this.spinner.hide();

        });
  }
  update() {
    const formData = new FormData();
  
    formData.append('provId', this.data.provId);
    formData.append('name', this.data.name);
    formData.append('active', this.data.active);
    this.spinner.show();
    this.http
      .put(
        `${environment.apiUrl}/api/City/UpdateCity/` +
          this.contractId,
        formData
      )
      .subscribe(
        (res) => {
          this.response = res;
          if (this.response.success == true) {
            this.toastr.success(this.response.message, 'Message.');
  
            this.activeModal.close(true);
            this.spinner.hide();
          } else {
            this.toastr.error(this.response.message, 'Message.');
            this.spinner.hide();
          }
        },
        (err: HttpErrorResponse) => {
          const messages =
            this.service.extractErrorMessagesFromErrorResponse(err);
          this.toastr.error(messages.toString(), 'Message.');
          console.log(messages);
          this.spinner.hide();
        }
      );
  }


  onSubmit(buttonType): void {
    if (buttonType === 'Add') {
      this.add();
    }

    if (buttonType === 'update') {
      this.update();
    }
  }
}
