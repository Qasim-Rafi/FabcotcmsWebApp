import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
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
  loggedInDepartmentName: any={};
  container: any= {};



  constructor(   private _NgbActiveModal: NgbActiveModal,
    private http: HttpClient,
    private service: ServiceService,
    private spinner: NgxSpinnerService,

    private toastr: ToastrService,) { }

  ngOnInit(): void {
    this.loggedInDepartmentName=localStorage.getItem('loggedInDepartmentName');

    this.GetPaymentDropdown();
    this.GetPaymentModeDropdown();
    this.GetPackingDropdown();
    this.GetDestinationDropdown();
    this.GetPriceDropdown();
    this.getContractPaymentData();
    this.GetContainerDropdown();
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
        this.payment = this.response.data;
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
        this.packing = this.response.data;
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
        this.city = this.response.data;
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
        this.price = this.response.data;
      }
      else {
        this.toastr.error(this.response.message, 'Message.');
      }
    })
  }
  GetContainerDropdown() {
    this.service.getContainer().subscribe(res => {
      this.response = res;
      if (this.response.success == true) {
        this.container = this.response.data;
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
          if (this.response.success == true && this.response.data != null) {
            this.data = this.response.data;
            
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



  addContractPaymentDelivery(form:NgForm) {
 
    let varr = {

      "contractId": this.contractId,
      "paymentMode": this.data.paymentMode,
    
      "sellerPaymentTermId": this.data.sellerPaymentTermId,
      "sellerPaymentTermDays": this.data.sellerPaymentTermDays,
      "sellerPaymentTermInfo": this.data.sellerPaymentTermInfo,
      "paymentTermId": this.data.paymentTermId,
      "paymentTermDays": this.data.paymentTermDays,
      "paymentTermInfo": this.data.paymentTermInfo,
      "buyerPaymentTerm": this.data.buyerPaymentTerm,
      "buyerPaymentTermId": this.data.buyerPaymentTermId,
      "buyerPaymentTermDays": this.data.buyerPaymentTermDays,

      "buyerSidePaymentTermInfo": this.data.buyerSidePaymentTermInfo,
      "packingId": this.data.packingId,
      "priceTermId": this.data.priceTermId,
      "destinationId": this.data.destinationId,
      "count": this.data.count == "" ? 0 : this.data.count,
      "containerId": this.data.containerId

    
     

    }
this.spinner.show();
    this.http.
      post(`${environment.apiUrl}/api/Contracts/AddContractPaymentDelivery`, varr)
      .subscribe(
        res => {

          this.response = res;
          if (this.response.success == true) {
            this.toastr.success(this.response.message, 'Message.');
            this.activeModal.close(true);
            this.getContractPaymentData();
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
