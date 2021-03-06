import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { NgbActiveModal, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker'
import { Dateformater } from 'src/app/shared/dateformater';
import { NgForm } from '@angular/forms';
import { ServiceService } from 'src/app/shared/service.service';
import { NgxSpinnerService } from 'ngx-spinner';




@Component({
  selector: 'app-edit-certificate',
  templateUrl: './edit-certificate.component.html',
  styleUrls: ['./edit-certificate.component.css']
})
export class EditCertificateComponent implements OnInit {

  @ViewChild(NgForm) certificateForm;
  datePickerConfig: Partial<BsDatepickerConfig>;
  data: any = {};
  response: any;
  @Input() Id;
  @Input() parentSellerId;
  @Input() certificateID;
  @Input() statusCheck;
  active = true;
  rows: any = [];
  temp: any = [];
  certificate: any = []

  dateformater: Dateformater = new Dateformater();

  constructor(
    private http: HttpClient,
    private service: ServiceService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private _NgbActiveModal: NgbActiveModal,



  ) { }

  ngOnInit(): void {
    this.datePickerConfig = Object.assign
      ({}, {
        containerClass: 'theme-default ',
        isAnimated: true,
        showWeekNumbers: false,
        dateInputFormat: 'DD/MM/YYYY',
      }),

      this.getCertificate();
    this.statusCheck = this.statusCheck;

    if (this.statusCheck == 'CertificateEdit') {
      this.editCertificate();
    }

    if (this.statusCheck == 'SellerEdit') {
      this.editSellerCertificate();

    }

  }

  get activeModal() {
    return this._NgbActiveModal;
  }






  //-------------------------Add Seller Certificates-----------------------------------------




  addSellerCertificate(form:NgForm) {
    // if (form.status == "INVALID") {

    //   this.toastr.error("Invalid Form", 'Message.');
    // }
    // else{
      this.spinner.show();
    this.data.validityDate = this.dateformater.toModel(this.data.validityDate);
    let varr = {
      "certificateId": this.data.certificateId,
      "validityDate": this.data.validityDate,
      "description": this.data.description,
      "sellerId": this.parentSellerId.toString(),
      "active": true
    }


    this.http.
      post(`${environment.apiUrl}/api/Sellers/AddCertificate`, varr)
      .subscribe(
        res => {


          this.response = res;
          if (this.response.success == true) {
            this.toastr.success(this.response.message, 'Message.');

            // this.buyerForm.reset();
            this.activeModal.close(true);
            this.spinner.hide();
          }
          else {
            this.toastr.error(this.response.message, 'Message.');
            this.spinner.hide();
          }

        }, (err: HttpErrorResponse) => {
          const messages = this.service.extractErrorMessagesFromErrorResponse(err);
          this.toastr.error(messages.toString(), 'Message.');
          console.log(messages);
          this.spinner.hide();
          if (err.status == 400) {
            this.toastr.error(this.response.message, 'Message.');
            this.spinner.hide();
          }
        });
  }
// }


  // -------------------------------------Edit Certificate------------------------------------

  editSellerCertificate() {
    this.http.get(`${environment.apiUrl}/api/Sellers/GetCertificateById/` + this.certificateID)
      .subscribe(
        res => {
          this.response = res;
          if (this.response.success == true) {
            this.data = this.response.data;
            this.data.validityDate = this.dateformater.fromModel(this.data.validityDate);
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



  UpdateSellerCertificate(form:NgForm) {
    // if (form.status == "INVALID") {

    //   this.toastr.error("Invalid Form", 'Message.');
    // }
    // else{
      this.spinner.show();
    this.data.validityDate = this.dateformater.toModel(this.data.validityDate);
    let varr = {
      "certificateId": this.data.certificateId,
      "validityDate": this.data.validityDate,
      "description": this.data.description,
      "sellerId": this.parentSellerId.toString(),
      "active": true,
    }

    this.http.
      put(`${environment.apiUrl}/api/Sellers/UpdateCertificate/` + this.certificateID, varr)
      .subscribe(
        res => {

          this.response = res;
          if (this.response.success == true) {
            this.toastr.success(this.response.message, 'Message.');
            this.activeModal.close(true);
            this.spinner.hide();
          }
          else {
            this.toastr.error(this.response.message, 'Message.');
            this.spinner.hide();
          }

        }, (err: HttpErrorResponse) => {
          const messages = this.service.extractErrorMessagesFromErrorResponse(err);
          this.toastr.error(messages.toString(), 'Message.');
          console.log(messages);
          this.spinner.hide();
          if (err.status == 400) {
            this.toastr.error(this.response.message, 'Message.');
            this.spinner.hide();
          }
        });
  }
// }

  //-------------------------get All Certificates-----------------------------------------//

  getCertificate() {
    this.http.get(`${environment.apiUrl}/api/TextileGarments/GetAllCertificate`)
      .subscribe(
        res => {

          this.response = res;
          if (this.response.success == true) {
            this.certificate = this.response.data;
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





  //-------------------------Add Certificates-----------------------------------------



  addCertificate(form:NgForm) {
  
    let varr = {
      "name": this.data.name,
      "description": this.data.description,
      "active": this.active,
    }

    this.http.
      post(`${environment.apiUrl}/api/TextileGarments/AddCertificate`, varr)
      .subscribe(
        res => {

          this.response = res;
          if (this.response.success == true) {
            this.toastr.success(this.response.message, 'Message.');

            // this.buyerForm.reset();
            this.activeModal.close(true);
          }
          else {
            this.toastr.error(this.response.message, 'Message.');
          }

        }, (err: HttpErrorResponse) => {
          const messages = this.service.extractErrorMessagesFromErrorResponse(err);
          this.toastr.error(messages.toString(), 'Message.');
          console.log(messages);
        });
  }






  //-------------------------Edit Certificates-----------------------------------------


  editCertificate() {
    this.http.get(`${environment.apiUrl}/api/TextileGarments/GetCertificateById/` + this.Id)
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



  UpdateCertificate(form:NgForm) {
  
    let varr = {
      "name": this.data.name,
      "description": this.data.description,
      "active": this.data.active,
    }

    this.http.
      put(`${environment.apiUrl}/api/TextileGarments/UpdateCertificate/` + this.Id, varr)
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

        }, (err: HttpErrorResponse) => {
          const messages = this.service.extractErrorMessagesFromErrorResponse(err);
          this.toastr.error(messages.toString(), 'Message.');
          console.log(messages);
        });
  }




  onSubmit(buttonType): void {
    if (buttonType === "addCertificate") {

      this.addCertificate(this.certificateForm); 
    }

    if (buttonType === "UpdateCertificate") {
    
    this.UpdateCertificate(this.certificateForm); }

    
    if (buttonType === "addSellerCertificate") {

    
        this.addSellerCertificate(this.certificateForm);
      }
    
     if (buttonType === "UpdateSellerCertificate")  {
    
        this.UpdateSellerCertificate(this.certificateForm);
      
    }




  }

}