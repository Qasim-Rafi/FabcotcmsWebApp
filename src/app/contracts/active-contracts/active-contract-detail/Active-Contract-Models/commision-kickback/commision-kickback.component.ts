import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ServiceService } from 'src/app/shared/service.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-commision-kickback',
  templateUrl: './commision-kickback.component.html',
  styleUrls: ['./commision-kickback.component.css']
})
export class CommisionKickbackComponent implements OnInit {
  @Input() contractId;
  // data:any =[];
  data : any = [
    // { id: 0}
  ];
  commission:any={};
  agents:any={};
  uom:any={};
  response: any;
  
  constructor(
    private _NgbActiveModal: NgbActiveModal,
    private http: HttpClient,
    private service: ServiceService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,

  ) { }

  ngOnInit(): void {
    this.GetUOMDropdown();
    this.GetAgentDropdown();
    this.getContractCommisionData();


  }
  get activeModal() {
    return this._NgbActiveModal;
  }

  addMore() {
    this.data.push({id: this.data.length});
  }
  remove(i: number) {
    this.data.splice(i, 1);
  }


  GetUOMDropdown() {
    this.service.getUOM().subscribe(res => {
      this.response = res;
      if (this.response.success == true) {
        this.uom = this.response.data;
      }
      else {
        this.toastr.error(this.response.message, 'Message.');
      }
    })
  }

  GetAgentDropdown() {
    this.service.getAgents().subscribe(res => {
      this.response = res;
      if (this.response.success == true) {
        this.agents = this.response.data;
      }
      else {
        this.toastr.error(this.response.message, 'Message.');
      }
    })
  }




  getContractCommisionData(){
    this.http.get(`${environment.apiUrl}/api/Contracts/GetContractCommissionById/` + this.contractId)
    .subscribe(
      res => {
        this.response = res;
        if (this.response.success == true) {
          this.commission = this.response.data;
          // this.commission.agenetName= parseInt(this.commission.agenetName);
          
        }
        else {
          this.toastr.error(this.response.message, 'Message.');
        }

      }, err => {
        if (err.status == 400) {
          this.toastr.error(this.response.message, 'Message.');
        }
      });
    
  }



  addContractCommision() {


    // for(let i=0; i<this.data.length;i++ )
    // {
    //   this.data[i] = Object.assign(this.data[i], {

    //     "agentId": this.commission.agentId,
    //     "agentCommission": this.commission.agentCommission,
    
    //   })
    // }

    this.spinner.show();
    let varr = {

      "contractId": this.contractId,
      "sellerSideCommission": this.commission.sellerSideCommission,
      "sellerSideCommissionUOMId":this.commission.sellerSideCommissionUOMId,
      "sellerAdditionalInfo": this.commission.sellerAdditionalInfo,
      "buyerSideCommission": this.commission.buyerSideCommission,
      "buyerSideCommissionUOMId": this.commission.buyerSideCommissionUOMId,
      "buyerAdditionalInfo": this.commission.buyerAdditionalInfo,
      "agentId": this.commission.agentId,
      "agentCommissions": this.data,
    }

    this.http.
      post(`${environment.apiUrl}/api/Contracts/AddContractCommission`, varr)
      .subscribe(
        res => {

          this.response = res;
          if (this.response.success == true) {
            this.toastr.success(this.response.message, 'Message.');varr
            // this.getEnquiryData(this.objEnquiry);
            this.activeModal.close(true);
            this.getContractCommisionData();
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





}
