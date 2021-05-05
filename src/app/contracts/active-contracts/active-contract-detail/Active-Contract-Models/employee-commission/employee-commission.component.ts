import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
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
  data:any ={};
  user:any ={};
  criteria:any ={};
  response: any;
    
    constructor(
      private _NgbActiveModal: NgbActiveModal,
      private http: HttpClient,
    private service: ServiceService,
    private toastr: ToastrService,
    ) { }

  ngOnInit(): void {
      this.GetUserDropdown();
      this.GetCriteriaDropdown();
      this.getContractEmployeeCommissionData();

  }
  get activeModal() {
    return this._NgbActiveModal;
  }




  GetUserDropdown() {
    this.service.getUsers().subscribe(res => {
      this.response = res;
      if (this.response.success == true) {
        this.user = this.response.data;
      }
      else {
        this.toastr.error(this.response.message, 'Message.');
      }
    })
  }


  GetCriteriaDropdown() {
    this.service.getCriteria( this.user.id).subscribe(res => {
      this.response = res;
      if (this.response.success == true) {
        this.criteria = this.response.data;
      }
      else {
        this.toastr.error(this.response.message, 'Message.');
      }
    })
  }



  getContractEmployeeCommissionData() {
    this.http.get(`${environment.apiUrl}/api/Contracts/GetBeneficiaryCriteriaById/` + this.contractId)
      .subscribe(
        res => {
          this.response = res;
          if (this.response.success == true) {
            this.data = this.response.data;
            
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




  addContractEmployeeCommission() {
    
    let varr = {
      "contractId": this.contractId,
      "userId": this.data.userId,
      "beneficiaryCriteriaId": this.data.beneficiaryCriteriaId,
      "criteriaDetail": this.data.criteriaDetail,
    }

    this.http.
      post(`${environment.apiUrl}/api/Contracts/AddContractBeneficiary`, varr)
      .subscribe(
        res => {

          this.response = res;
          if (this.response.success == true) {
            this.toastr.success(this.response.message, 'Message.');
            // this.getEnquiryData(this.objEnquiry);
            this.activeModal.close(true);
            this.getContractEmployeeCommissionData();
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




}
