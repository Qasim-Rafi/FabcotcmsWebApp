import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { GlobalConstants } from 'src/app/Common/global-constants';
import { ServiceService } from 'src/app/shared/service.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-payment-form',
  templateUrl: './payment-form.component.html',
  styleUrls: ['./payment-form.component.css']
})
export class PaymentFormComponent implements OnInit {
  statusCheck:any={};
  queryParems:any={};
  paymentId:any={};
  data: any = {};
  rows: any = {};
  currency: any = {};
  saleInvoice: any = {};
  paymentMode: any = {};
  bankAcc: any = {};

  bill: any = {};


  response: any;
  constructor(

    private route: ActivatedRoute,
    private modalService: NgbModal,
    private http: HttpClient,
    private service: ServiceService,
    private toastr: ToastrService,

  ) { }


  ngOnInit(): void {
    this.statusCheck = this.route.snapshot.queryParams;

    this.queryParems = this.route.snapshot.queryParams;
    this.paymentId = this.queryParems.id;

    this.fetch((data) => {
      this.rows = data;
      // this.listCount= this.rows.length;
    });
    this.GetCurrencyDropdown()
    this.GetSaleInvoiceDropdown()
    this.GetPaymentModeDropdown()
    this.GetBankAccDropdown()
  }
  fetch(cb) {
    
    this.http
    .get(`${environment.apiUrl}/api/BillingPayments/GetContractBillById/` + this.paymentId)
    .subscribe(res => {
      this.response = res;
     
    if(this.response.success==true)
    {
    this.data =this.response.data;
    cb(this.data);
    }
    else{
      this.toastr.error(this.response.message, 'Message.');
    }
      // this.spinner.hide();
    }, err => {
      if ( err.status == 400) {
 this.toastr.error(err.error.message, 'Message.');
      }
    //  this.spinner.hide();
    });
  }

 


  UpdatePayment() {
    let varr = {
      "contractId": this.data.contractId,
      "contractBillId": this.data.contractBillId,
      "selerId": this.data.selerId,
      "receiptNumber": this.data.receiptNumber,
      // "paymentDate": this.data.paymentDate,
      "paidAmount": this.data.paidAmount,
      "taxAmount": this.data.taxAmount,
      "deductionAmount": this.data.deductionAmount,
      "paymentMode": this.data.paymentMode,
      "paymentDescription":this.data.paymentDescription,
      "bankAccountId": this.data.bankAccountId,
      "accountDescription": this.data.accountDescription,
      "isDepositedInBank": this.data.isDepositedInBank,
      "depositeDate": this.data.depositeDate
    }

    this.http.
      put(`${environment.apiUrl}/api/Configs/UpdateCountry/` + this.paymentId, varr)
      .subscribe(
        res => {

          this.response = res;
          if (this.response.success == true) {
            this.toastr.success(GlobalConstants.updateMessage, 'Message.');
         
          }
          else {
            this.toastr.error(this.response.message, 'Message.');
          }

        }, err => {
          if (err.status == 400) {
            this.toastr.error(GlobalConstants.exceptionMessage, 'Message.');
          }
        });
  }


  addPayment() {

      let varr = {
        // "contractId": this.bill.contractId,
        // "contractBillId": this.paymentId,
        "buyerId": this.bill.buyerName,
        "selerId": this.bill.sellerName,
        "saleInvoiceId": this.data.saleInvoiceId,
        "receiptNumber": this.data.receiptNumber,
        "paymentDate": this.data.paymentDate,
        "paidAmount": this.data.paidAmount,
        "taxAmount": this.data.taxAmount,
        "deductionAmount": this.data.deductionAmount,
        "paymentMode": this.data.paymentMode,
        "paymentDescription":this.data.paymentDescription,
        "bankAccountId": this.data.bankAccountId,
        "accountDescription": this.data.accountDescription,
        "isDepositedInBank": this.data.isDepositedInBank,
        "depositeDate": this.data.depositeDate
      }
    

    this.http.
      post(`${environment.apiUrl}/api/BillingPayments/AddBillPayment/`, varr)
      .subscribe(
        res => {

          this.response = res;
          if (this.response.success == true) {
            this.toastr.success(this.response.message, 'Message.');
         
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
  GetSaleInvoiceDropdown() {
    this.http.get(`${environment.apiUrl}/api/Lookups/SaleInvoices/` + this.paymentId).
    subscribe(res => {
      this.response = res;
      if (this.response.success == true) {
        this.saleInvoice = this.response.data;
    
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
}
