import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ServiceService } from 'src/app/shared/service.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-payment-delivery',
  templateUrl: './payment-delivery.component.html',
  styleUrls: ['./payment-delivery.component.css']
})
export class PaymentDeliveryComponent implements OnInit {

  
  
  @Input() contractId;
  data:any ={};
  response: any;
  price: any= {};
  payment: any= {};
  paymentMode: any= {};
  city: any= {};
  packing: any= {};



  constructor(   private _NgbActiveModal: NgbActiveModal,
    private http: HttpClient,
    private service: ServiceService,
    private toastr: ToastrService,) { }

  ngOnInit(): void {
    this.GetPaymentDropdown();
    this.GetPaymentModeDropdown();
    this.GetPackingDropdown();
    this.GetDestinationDropdown();
    this.GetPriceDropdown();
    this.getContractPaymentData();
  }
  get activeModal() {
    return this._NgbActiveModal;
  }


  GetPaymentModeDropdown() {
    this.service.getPaymentMode().subscribe(res => {
      this.response = res;
      if (this.response.success == true) {
        this.paymentMode = this.response.data;
      }
      else {
        this.toastr.error(this.response.message, 'Message.');
      }
    })
  }
  GetPaymentDropdown() {
    this.service.getPaymentTerm().subscribe(res => {
      this.response = res;
      if (this.response.success == true) {
        this.payment = this.response.data.list;
      }
      else {
        this.toastr.error(this.response.message, 'Message.');
      }
    })
  }


  GetPackingDropdown() {
    this.service.getPackaging().subscribe(res => {
      this.response = res;
      if (this.response.success == true) {
        this.packing = this.response.data.list;
      }
      else {
        this.toastr.error(this.response.message, 'Message.');
      }
    })
  }


  GetDestinationDropdown() {
    this.service.getCity().subscribe(res => {
      this.response = res;
      if (this.response.success == true) {
        this.city = this.response.data.list;
      }
      else {
        this.toastr.error(this.response.message, 'Message.');
      }
    })
  }


  GetPriceDropdown() {
    this.service.getPriceTerm().subscribe(res => {
      this.response = res;
      if (this.response.success == true) {
        this.price = this.response.data.list;
      }
      else {
        this.toastr.error(this.response.message, 'Message.');
      }
    })
  }



  
  getContractPaymentData() {
    this.http.get(`${environment.apiUrl}/api/Contracts/GetContractPaymentDeliveryById/` + this.contractId)
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



  addContractPaymentDelivery(form:NgForm) {
    if(form.status == "INVALID"){

      this.toastr.error("Invalid Form", 'Message.');
    }
    else{
    let varr = {

      "contractId": this.contractId,
      "paymentMode": this.data.paymentMode,
      "paymentTermId": this.data.paymentTermId,
      "paymentTermDays": this.data.paymentTermDays,
      "paymentTermInfo": this.data.paymentTermInfo,
      "buyerSidePaymentTermInfo": this.data.buyerSidePaymentTermInfo,
      "packingId": this.data.packingId,
      "priceTermId": this.data.priceTermId,
      "destinationId": this.data.destinationId,
    
    }

    this.http.
      post(`${environment.apiUrl}/api/Contracts/AddContractPaymentDelivery`, varr)
      .subscribe(
        res => {

          this.response = res;
          if (this.response.success == true) {
            this.toastr.success(this.response.message, 'Message.');
            // this.getEnquiryData(this.objEnquiry);
            this.activeModal.close(true);
            this.getContractPaymentData();

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















}
