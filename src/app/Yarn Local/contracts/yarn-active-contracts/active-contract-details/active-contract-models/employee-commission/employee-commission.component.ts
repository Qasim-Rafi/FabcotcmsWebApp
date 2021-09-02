import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { resetFakeAsyncZone } from '@angular/core/testing';
import { NgForm } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ServiceService } from 'src/app/shared/service.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-employee-commission',
  templateUrl: './employee-commission.component.html',
  styleUrls: ['./employee-commission.component.css']
})
export class EmployeeCommissionComponent implements OnInit {

  @Input() contractId;
  @Input() statusCheck;
  @Input() beneficiaryId;
  data:any ={};
  user:any = [];
  users:any = [];

  criteria:any = {};
  response: any;
    
    constructor(
      private _NgbActiveModal: NgbActiveModal,
      private http: HttpClient,
    private service: ServiceService,
    private spinner: NgxSpinnerService,

    private toastr: ToastrService,
    ) { }

  ngOnInit(): void {
      this.GetUserDropdown();
      this.GetUserDropdown();
      this.getdropdown();
      if(this.statusCheck == 'editCommission'){

            this.getContractEmployeeCommissionData();
      }

  }
  get activeModal() {
    return this._NgbActiveModal;
  }


  getdropdown() {
    this.http.get(`${environment.apiUrl}/api/Lookups/GetBeneficiaryUsers`)
      .subscribe(
        res => {
          this.response = res;
          if (this.response.success == true) {
            this.users = this.response.data;
            
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

  GetUserDropdown() {
    this.service.getUsers().subscribe(res => {
      this.response = res;
      if (this.response.success == true && this.response.data != null) {
        this.user = this.response.data;
      }
      else if(this.response.success == false) {
         
        this.toastr.error(this.response.message, 'Message.');
      }
    })
  }


  GetCriteriaDropdown(event) {
    let id = event;
    this.http.get(`${environment.apiUrl}/api/Lookups/BeneficiaryDetail/`+ id).subscribe(res => {
      this.response = res;
      if (this.response.success == true && this.response.data != null) {
        this.criteria = this.response.data;
        if(this.criteria.length == 0){

            this.data.beneficiaryCriteriaId = null
        }
        else if(this.response.success == false) {
         
          this.toastr.error(this.response.message, 'Message.');
        }
        // this.data.beneficiaryCriteriaId = 2; 

      }
      else {
        this.toastr.error(this.response.message, 'Message.');
      }
    })
  }

  GetCriteriaDropdownEdit(idEdit) {
    let id = idEdit;
    this.http.get(`${environment.apiUrl}/api/Lookups/BeneficiaryDetail/`+ id).subscribe(res => {
      this.response = res;
      if (this.response.success == true && this.response.data != null) {
        this.criteria = this.response.data;
        if(this.criteria.length == 0){

            this.data.beneficiaryCriteriaId = null
        }
        else if(this.response.success == false) {
         
          this.toastr.error(this.response.message, 'Message.');
        }
        // this.data.beneficiaryCriteriaId = 2; 

      }
      else {
        this.toastr.error(this.response.message, 'Message.');
      }
    })
  }



  getContractEmployeeCommissionData() {
    this.http.get(`${environment.apiUrl}/api/Contracts/GetContractBeneficiaryById/` + this.beneficiaryId)
      .subscribe(
        res => {
          this.response = res;
          if (this.response.success == true && this.response.data != null) {
            this.data = this.response.data;
            this.GetCriteriaDropdownEdit(this.data.commissionRatioId)
          }
          else if(this.response.success == false) {
         
            this.toastr.error(this.response.message, 'Message.');
          }
 
        },(err: HttpErrorResponse) => {
          const messages = this.service.extractErrorMessagesFromErrorResponse(err);
          this.toastr.error(messages.toString(), 'Message.');
          console.log(messages);
        });
  }




  addContractEmployeeCommission(form:NgForm) {
   
    let varr = {
      "contractId": this.contractId,
      "userId": this.data.userId,
      "commossionRatioId": this.data.commissionRatioId,
      "criteriaDetail": this.data.criteriaDetail,
    }
this.spinner.show();
    this.http.
      post(`${environment.apiUrl}/api/Contracts/AddContractBeneficiary`, varr)
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






  updateContractEmployeeCommission(form:NgForm) {
  
    let varr = {
      "contractId": this.contractId,
      "userId": this.data.userId,
      "commissionRatioId": this.data.commissionRatioId,
      "criteriaDetail": this.data.criteriaDetail,
    }

    this.http.
      put(`${environment.apiUrl}/api/Contracts/UpdateContractBeneficiary/`+ this.beneficiaryId , varr)
      .subscribe(
        res => {

          this.response = res;
          if (this.response.success == true) {
            this.toastr.success(this.response.message, 'Message.');
      
            this.activeModal.close(true);
         
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
