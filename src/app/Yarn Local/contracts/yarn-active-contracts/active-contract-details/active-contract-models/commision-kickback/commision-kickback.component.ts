import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
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
  data : any = {};
  commission:any=[];
  agents:any=[];
  uomList:any=[];
  response: any;
  data1:any=[];
  loggedInDepartmentName: any={};
  constructor(
    private _NgbActiveModal: NgbActiveModal,
    private http: HttpClient,
    private service: ServiceService,
    private toastr: ToastrService,

  ) { }

  ngOnInit(): void {
    this.loggedInDepartmentName=localStorage.getItem('loggedInDepartmentName');

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
  addfield() {
    this.data1.push({id: this.data1.length});
  }
  removefield(i: number) {
    this.data1.splice(i, 1);
  }
  // GetUOMDropdown() {
  //   this.service.getUOM().subscribe(res => {
  //     this.response = res;
  //     if (this.response.success == true) {
  //       this.uomList = this.response.data;
  //     }
  //     else {
  //       this.toastr.error(this.response.message, 'Message.');
  //     }
  //   })
  // }

  GetUOMDropdown() {
    this.http.get(`${environment.apiUrl}/api/Lookups/UOMs`).
    subscribe(res => {
      this.response = res;
      if (this.response.success == true) {
        this.uomList = this.response.data;
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
    this.http.get(`${environment.apiUrl}/api/Contracts/GetContractCommissionKickBackById/` + this.contractId)
    .subscribe(
      res => {
        this.response = res;
        if (this.response.success == true) {
          this.data = this.response.data;
          // this.commission.agenetName= parseInt(this.commission.agenetName);
          
        }
        else {
          this.toastr.error(this.response.message, 'Message.');
        }

      },(err: HttpErrorResponse) => {
        const messages = this.service.extractErrorMessagesFromErrorResponse(err);
        this.toastr.error(messages.toString(), 'Message.');
        console.log(messages);
      });
    
  }



  addContractCommision() {


    for(let i=0; i<this.data1.length;i++ )
    {
      // this.commission[i] = Object.assign(this.data1[i], {
        
      
    
      // })
      this.commission.push({['agentId']: this.data1[i].agentId , ["agentCommission"]: this.data1[i].agentCommission}) 
    }

    let varr = {

      "contractId": this.contractId,
      "kickbackPercentage": this.data.kickbackPercentage,
      "kickbackUOMId": this.data.kickbackUOMId,
      "beneficiary": this.data.beneficiary,
      "fabCotCommision": this.data.fabCotCommision,
      "fabCotCommisionUOMId": this.data.fabCotCommisionUOMId,
      "fabcotSideCommAdditionalInfo": this.data.fabcotSideCommAdditionalInfo,
      "buyersideCommision": this.data.buyersideCommision,
      "buyersideCommisionUOMId": this.data.buyersideCommisionUOMId,
      "buyerSideCommAdditionalInfo": this.data.buyerSideCommAdditionalInfo,
      "agentCommissions": this.commission
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
            this.getContractCommisionData();
          }
          else {
            this.toastr.error(this.response.message, 'Message.');
          }

        },(err: HttpErrorResponse) => {
          const messages = this.service.extractErrorMessagesFromErrorResponse(err);
          this.toastr.error(messages.toString(), 'Message.');
          console.log(messages);
        });
  }





}
