import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ServiceService } from 'src/app/shared/service.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-remarks',
  templateUrl: './remarks.component.html',
  styleUrls: ['./remarks.component.css']
})
export class RemarksComponent implements OnInit {

  @Input() contractId;
  data:any ={};
  response: any;
  
  constructor(
    private _NgbActiveModal: NgbActiveModal,
    private http: HttpClient,
    private service: ServiceService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
  ) { }

  ngOnInit(): void {
    this.getContractRemarkData();

  }
  get activeModal() {
    return this._NgbActiveModal;
  }





  getContractRemarkData() {
    this.http.get(`${environment.apiUrl}/api/Contracts/GetContractRemarkById/` + this.contractId)
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


  addContractRemark() {

    this.spinner.show();
    let varr = {

      "contractId": this.contractId,
      "contractRemarks": this.data.contractRemarks,
      "buyerRemarks":this.data.buyerRemarks,
      "otherConditionRemarks":this.data.otherConditionRemarks,
      "title": this.data.title,
    }

    this.http.
      post(`${environment.apiUrl}/api/Contracts/AddContractRemark`, varr)
      .subscribe(
        res => {

          this.response = res;
          if (this.response.success == true) {
            this.toastr.success(this.response.message, 'Message.');
            // this.getEnquiryData(this.objEnquiry);
            this.activeModal.close(true);
            this.getContractRemarkData();
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
