import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { id } from '@swimlane/ngx-datatable';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ServiceService } from 'src/app/shared/service.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-seller-poc',
  templateUrl: './seller-poc.component.html',
  styleUrls: ['./seller-poc.component.css']
})
export class SellerPocComponent implements OnInit {

  @Input() sellerPOCid;
  @Input() buyerPOCid;
  @Input() parentSellerId;
  @Input() parentBuyerId;
  @Input() statusCheck;
  data: any = {};
  response: any;
  SellerName: any = {};
  BuyerName: any = {};
  @ViewChild(NgForm) sellerPOC;

  // includeInContractPreview = true;

  constructor(private http: HttpClient,
    private service: ServiceService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private _NgbActiveModal: NgbActiveModal) { }

  ngOnInit(): void {

    if (this.statusCheck == "SellerAddPOC") {
      this.getSellerNameById(this.parentSellerId);
    }
    if (this.statusCheck == "SellerEditPOC") {
      this.editSellerPOC();
      this.getSellerNameById(this.parentSellerId);

    }


    if (this.statusCheck == "BuyerAddPOC") {
      this.getBuyerNameById(this.parentBuyerId);
    }
    if (this.statusCheck == "BuyerEditPOC") {
      this.editBuyerPOC();
      this.getBuyerNameById(this.parentBuyerId);

    }


  }


  get activeModal() {
    return this._NgbActiveModal;
  }


  // ----------------------- For Seller Displaying Name-------------------------//


  getSellerNameById(id) {
    this.http.get(`${environment.apiUrl}/api/Sellers/GetSeller/` + id)
      .subscribe(
        res => {
          this.response = res;
          if (this.response.success == true) {
            this.SellerName = this.response.data.sellerName;
            // this.SellerName = this.data.sellerName;


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


  // ----------------------- Add Seller POC-------------------------//


  addSellerPOC(form:NgForm) {
  
 this.spinner.show();
    let varr = {
      "name": this.data.name,
      "email": this.data.email,
      "mobileNumber": this.data.mobileNumber,
      "landlineNumber": this.data.landlineNumber,
      "description": this.data.description,
      "dealsIn": this.data.dealsIn,
      "sellerId": this.parentSellerId.toString(),
      "includeInContractPreview": this.data.includeInContractPreview,
    }

    this.http.
      post(`${environment.apiUrl}/api/Sellers/AddPOC`, varr)
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

        },(err: HttpErrorResponse) => {
          const messages = this.service.extractErrorMessagesFromErrorResponse(err);
          this.toastr.error(messages.toString(), 'Message.');
          console.log(messages);
          this.spinner.hide();
        });
  }



  // ------------------Edit Seller Poc---------------------------------//

  editSellerPOC() {
    this.http.get(`${environment.apiUrl}/api/Sellers/GetPOCById/` + this.sellerPOCid)
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



  UpdateSellerPOC(form:NgForm) {
 
    let varr = {

      "name": this.data.name,
      "email": this.data.email,
      "mobileNumber": this.data.mobileNumber,
      "landlineNumber": this.data.landlineNumber,
      "description": this.data.description,
      "dealsIn": this.data.dealsIn,
      "sellerId": this.parentSellerId.toString(),
      "includeInContractPreview": this.data.includeInContractPreview,

    }

    this.http.
      put(`${environment.apiUrl}/api/Sellers/UpdatePOC/` + this.sellerPOCid, varr)
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



  // ----------------------- For Buyer Displaying Name-------------------------//


  getBuyerNameById(id) {
    this.http.get(`${environment.apiUrl}/api/Buyers/GetBuyer/` + id)
      .subscribe(
        res => {
          this.response = res;
          if (this.response.success == true) {
            this.BuyerName = this.response.data.buyerName;
            // this.BuyerName = this.data.buyerName;


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

  // -------------------------------Add Buyer POC----------------------------//

  addBuyerPOC(form:NgForm) {
  
    let varr = {
      "name": this.data.name,
      "email": this.data.email,
      "mobileNumber": this.data.mobileNumber,
      "landlineNumber": this.data.landlineNumber,
      "description": this.data.description,
      "dealsIn": this.data.dealsIn,
      "buyerId": this.parentBuyerId.toString(),
      "includeInContractPreview": this.data.includeInContractPreview,
    }

    this.http.
      post(`${environment.apiUrl}/api/Buyers/AddPOC`, varr)
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

        },(err: HttpErrorResponse) => {
          const messages = this.service.extractErrorMessagesFromErrorResponse(err);
          this.toastr.error(messages.toString(), 'Message.');
          console.log(messages);
        });
  
}


  // ------------------Edit Buyer Poc---------------------------------//

  editBuyerPOC() {
    this.http.get(`${environment.apiUrl}/api/Buyers/GetPOCById/` + this.buyerPOCid)
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



  UpdateBuyerPOC(form:NgForm) {
    if (form.status == "INVALID") {

      this.toastr.error("Invalid Form", 'Message.');
    }

    else{
    let varr = {

      "name": this.data.name,
      "email": this.data.email,
      "mobileNumber": this.data.mobileNumber,
      "landlineNumber": this.data.landlineNumber,
      "description": this.data.description,
      "dealsIn": this.data.dealsIn,
      "buyerId": this.parentBuyerId.toString(),
      "includeInContractPreview": this.data.includeInContractPreview,

    }

    this.http.
      put(`${environment.apiUrl}/api/Buyers/UpdatePOC/` + this.buyerPOCid, varr)
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

        }, err => {
          if (err.status == 400) {
            this.toastr.error(this.response.message, 'Message.');
          }
        });
  }
}


  onSubmit(buttonType): void {
    if (buttonType === "addSellerPOC") {

      this.addSellerPOC(this.sellerPOC); 
    }

    if (buttonType === "UpdateSellerPOC") {
    
    this.UpdateSellerPOC(this.sellerPOC); }

    
    if (buttonType === "addBuyerPOC") {

    
        this.addBuyerPOC(this.sellerPOC);
      }
    
     if (buttonType === "UpdateBuyerPOC")  {
    
        this.UpdateBuyerPOC(this.sellerPOC);
      
    }




  }

}