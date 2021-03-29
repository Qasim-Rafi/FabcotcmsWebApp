import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
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
  // includeInContractPreview = true;

  constructor(private http: HttpClient,
    private toastr: ToastrService,
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
            this.toastr.error('Something went Worng', 'Message.');
          }

        }, err => {
          if (err.status == 400) {
            this.toastr.error('Something went Worng', 'Message.');
          }
        });
  }


  // ----------------------- Add Seller POC-------------------------//


  addSellerPOC() {
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
            this.toastr.error('Something went Worng', 'Message.');
          }

        }, err => {
          if (err.status == 400) {
            this.toastr.error('Something went Worng', 'Message.');
          }
        });
  }



  UpdateSellerPOC() {
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

        }, err => {
          if (err.status == 400) {
            this.toastr.error(this.response.message, 'Message.');
          }
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
            this.toastr.error('Something went Worng', 'Message.');
          }

        }, err => {
          if (err.status == 400) {
            this.toastr.error('Something went Worng', 'Message.');
          }
        });
  }

  // -------------------------------Add Buyer POC----------------------------//

  addBuyerPOC() {
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

        }, err => {
          if (err.status == 400) {
            this.toastr.error(this.response.message, 'Message.');
          }
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
            this.toastr.error('Something went Worng', 'Message.');
          }

        }, err => {
          if (err.status == 400) {
            this.toastr.error('Something went Worng', 'Message.');
          }
        });
  }



  UpdateBuyerPOC() {
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