import { DatePipe } from '@angular/common';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ServiceService } from 'src/app/shared/service.service';
import { Dateformater } from 'src/app/shared/dateformater';
import { environment } from 'src/environments/environment';
import {NgxSpinnerService, Spinner} from 'ngx-spinner'
// import { ToastrService } from 'ngx-toastr';
// import { HttpClient } from '@angular/common/http';
// import { environment } from 'src/environments/environment';
// import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-new-commission-payment',
  templateUrl: './new-commission-payment.component.html',
  styleUrls: ['./new-commission-payment.component.css']
})
export class NewCommissionPaymentComponent implements OnInit {
  dateformater: Dateformater = new Dateformater();
  response: any;

  paymentAdddata: any = {};
commData : any = [];
extCommData : any = [];

  statusCheck:any={};
  rows: any = [];
  columns: any = [];
  seller: any = [];
  paymentMode : any = []
  currency : any = []
  bankAcc : any = []
  agent : any = []
  buyer: any = [];
  

  constructor(

    private route: ActivatedRoute,
    private modalService: NgbModal,
    private http: HttpClient,
    private service: ServiceService,
    private toastr: ToastrService,
    public datepipe: DatePipe,
    private router: Router,
    private spinner:NgxSpinnerService

  ) { }

  ngOnInit(): void {
    this.statusCheck = this.route.snapshot.queryParams;
    this.GetBankAccDropdown();
     this.GetCurrencyDropdown();
     this.GetPaymentModeDropdown();
     this.GetSellerDropdown();
     this.GetAgentDropdown();
     this.GetBuyersDropdown();
  }
  
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
  GetCurrencyDropdown() {
    this.http.get(`${environment.apiUrl}/api/Lookups/CurrencyTypes`).
    subscribe(res => {
      this.response = res;
      if (this.response.success == true) {
        this.currency = this.response.data;
      }
      else {
        this.toastr.error(this.response.message, 'Message.');
      }
    })
  }
  GetBankAccDropdown() {
    this.http.get(`${environment.apiUrl}/api/Lookups/BankAccounts`).
    subscribe(res => {
      this.response = res;
      if (this.response.success == true) {
        this.bankAcc = this.response.data;
  
      }
      else {
        this.toastr.error(this.response.message, 'Message.');
      }
    })
  }
  GetAgentDropdown() {
    this.http.get(`${environment.apiUrl}/api/Lookups/ExternalAgents`).
    subscribe(res => {
      this.response = res;
      if (this.response.success == true) {
        this.agent = this.response.data;
  
      }
      else {
        this.toastr.error(this.response.message, 'Message.');
      }
    })
  }
  addCommissionPayment() {
      let varr = {
        "buyerId": this.commData.buyerId,
        "sellerId": this.commData.sellerId,
        "isBuyerCommission": this.commData.isBuyerCommission,
        "paymentDate": this.dateformater.toModel(this.commData.paymentDate),
        "payNo": this.commData.payNo,
        "amount":this.commData.amount,
        "currencyId": this.commData.currencyId,
        "paymentMode": this.commData.paymentMode,
        "additionalDetail":this.commData.additionalDetail,
        "fromBankAccountId": this.commData.fromBankAccountId,
        "toBankAccountId": this.commData.toBankAccountId,
        "depositInBank":this.commData.depositInBank,
        "depositDate": this.dateformater.toModel(this.commData.depositDate),
        "paymentRemarks":this.commData.paymentRemarks,
        "active": true
      }
this.spinner.show();
    this.http.
      post(`${environment.apiUrl}/api/BillingPayments/AddBillingCommissionPayment`, varr)
      .subscribe(
        res => {

          this.response = res;
          if (this.response.success == true) {
            this.toastr.success(this.response.message, 'Message.');
            // this.paymentForm.reset();
            this.router.navigate(['yarn-billing-and-payment/commission-payment']);
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

        });
  }
  addExtCommissionPayment() {
    let varr = {
      "agentId": this.extCommData.agentId,
  "sellerId": this.extCommData.sellerId,
  "paymentDate": this.dateformater.toModel(this.extCommData.paymentDate),
  "payNo": this.extCommData.payNo,
  "amount": this.extCommData.amount,
  "currencyId" : this.extCommData.currencyId,
  "paymentMode": this.extCommData.paymentMode,
  "additionalDetail": this.extCommData.additionalDetail,
  "recieveDate": this.dateformater.toModel(this.extCommData.recieveDate),
  "paymentRemarks": this.extCommData.paymentRemarks,
  "active": true
    }
    this.spinner.show();

  this.http.
    post(`${environment.apiUrl}/api/BillingPayments/AddBillingExternalAgentCommission`, varr)
    .subscribe(
      res => {

        this.response = res;
        if (this.response.success == true) {
          this.toastr.success(this.response.message, 'Message.');
          // this.paymentForm.reset();
          this.router.navigate(['yarn-billing-and-payment/external-agent']);
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
    
      });
}
}
