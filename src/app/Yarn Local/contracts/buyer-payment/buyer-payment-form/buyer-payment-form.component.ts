import { Component, Input, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ServiceService } from 'src/app/shared/service.service';
import { environment } from 'src/environments/environment';
import { HttpClient  , HttpErrorResponse} from '@angular/common/http';
import { Dateformater } from 'src/app/shared/dateformater';
import { Router } from '@angular/router';
@Component({
  selector: 'app-buyer-payment-form',
  templateUrl: './buyer-payment-form.component.html',
  styleUrls: ['./buyer-payment-form.component.css']
})
export class BuyerPaymentFormComponent implements OnInit {
  dateformater: Dateformater = new Dateformater();
  
  data: any ={};
  rows: any = [];
  columns: any = [];
  response: any;
  buyer: any= [];
  seller: any= [];
  article: any= [];
  uomList: any= [];
  currency: any= [];
  paymentMode: any= [];

  newBuyer: number;

  constructor(
    private service: ServiceService,
    private router: Router,
    private toastr: ToastrService,
    private http: HttpClient,
  ) { }

  ngOnInit(): void {
    this.GetBuyersDropdown();
    this.GetSellerDropdown();
    this.GetCurrencyDropdown();
    this.GetPaymentModeDropdown();
  }
 


  navigateBuyerPaymentForm() {
    this.router.navigate(['/yarn-local/buyer-payment']);
 };

  GetBuyersDropdown() {
    this.service.getBuyers().subscribe(res => {
      this.response = res;
      if (this.response.success == true) {

        this.buyer = this.response.data;
   
       
      }
      else {
        this.toastr.error(this.response.message, 'Message.');
      }
    })
  }


  GetSellerDropdown() {
    this.service.getSellerLookup().subscribe(res => {
      this.response = res;
      if (this.response.success == true) {

        this.seller = this.response.data;
        
       
      }
      else {
        this.toastr.error(this.response.message, 'Message.');
      }
    })
  }


  GetCurrencyDropdown() {
    this.service.getCurrencyType().subscribe(res => {
      this.response = res;
      if (this.response.success == true) {

        this.currency = this.response.data;
        
       
      }
      else {
        this.toastr.error(this.response.message, 'Message.');
      }
    })
  }

  GetPaymentModeDropdown() {
    this.http.get(`${environment.apiUrl}/api/Lookups/PaymentModes`).
    subscribe(res => {
      this.response = res;
      if (this.response.success == true) {
        this.paymentMode = this.response.data;
    
      }
      else {
        this.toastr.error(this.response.message, 'Message.');
      }
    })
  }


  addPayment() {
    // this.paymentAdddata.paymentDate = this.dateformater.toModel(this.paymentAdddata.paymentDate);
    // this.paymentAdddata.depositeDate = this.dateformater.toModel(this.paymentAdddata.depositeDate);
      let varr = {
        "buyerId": this.data.buyerId,
        "sellerId": this.data.sellerId,
        "paymentDate": this.dateformater.toModel(this.data.paymentDate),
        "amount": this.data.amount,
        "currencyId": this.data.currencyId,
        "paymentMode": this.data.paymentMode,
        "additionalDetails": this.data.additionalDetails,
        "depositDate": this.dateformater.toModel(this.data.depositeDate),
        "taxChalan": this.data.taxChalan,
        "remarks": this.data.remarks
      
   
      }

    this.http.
      post(`${environment.apiUrl}/api/YarnContracts/AddBuyerToSellerPayment`, varr)
      .subscribe(
        res => {

          this.response = res;
          if (this.response.success == true) {
            this.data = this.response.data;
            this.toastr.success(this.response.message, 'Message.');

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


}
