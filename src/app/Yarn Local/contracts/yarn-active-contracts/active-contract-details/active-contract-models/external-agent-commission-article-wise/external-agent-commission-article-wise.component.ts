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
  test: any = [];
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
    if (this.statusCheck == 'Add') {
      this.test = [{ id: 0,isHide:false,isAdded:true,isDelete:false}];
    }

  }
  get activeModal() {
    return this._NgbActiveModal;
  }
  // addfield() {
  //   this.test.push({ id: 0 });

  // }
  // removefield(i: number) {
  //   this.test.splice(i, 1);

  // }


  addfield() {
    this.test.push({id: 0,isHide:false,isAdded:true,isDelete:false});
    
  }
  removefield(i: number,b) {
    if (this.statusCheck == 'Edit') {

      if(b.id == 0){
        this.test.splice(i, 1);
      }
      else{
        var found=this.test.filter(x=>x.id == b.id);
        if(found.length>0){
         found[0].isHide=true;
         found[0].isDeleted=true;
        }
      }

    }else{
      this.test.splice(i, 1);
    }
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
        `${environment.apiUrl}/api/ExternalAgentCommissionArticleWise/GetExternalAgentCommissionArticleWiseById/` +
        this.RowData.id
      )
      .subscribe(
        (res) => {
          this.response = res;
          if (this.response.success == true) {
            this.test = this.response.data;

          } else {
            this.toastr.error(this.response.message, 'Message.');
            this.test = [{ id: 0,isHide:false,isAdded:true,isDelete:false}];
            this.statusCheck == 'Add'
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
this.test.forEach(d=> {
  d.contractId = this.contractId;
  d.contractArticleId =this.RowData.id;
});

    this.http.
      post(`${environment.apiUrl}/api/ExternalAgentCommissionArticleWise/AddExternalAgentCommissionArticleWise`, this.test)
      .subscribe(
        res => {

          this.response = res;
          if (this.response.success == true) {
            this.toastr.success(this.response.message, 'Message.');
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
    this.test.forEach(d=> {
      d.contractId = this.contractId;
      d.contractArticleId =this.RowData.id;
    });
    this.spinner.show();
    this.http
      .post(
        `${environment.apiUrl}/api/ExternalAgentCommissionArticleWise/UpdateExternalAgentCommissionArticleWise`,
        this.test
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
    if (buttonType === 'Add' && this.statusCheck == 'Add') {
      this.add();
    }

    if (buttonType === 'update' && this.statusCheck == 'Edit') {
      this.update();
    }
  }
}
