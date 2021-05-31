import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { GlobalConstants } from 'src/app/Common/global-constants';
import { Dateformater } from 'src/app/shared/dateformater';
import { ServiceService } from 'src/app/shared/service.service';
import { environment } from 'src/environments/environment';
import { DatePipe } from '@angular/common';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-payment-form',
  templateUrl: './payment-form.component.html',
  styleUrls: ['./payment-form.component.css']
})
export class PaymentFormComponent implements OnInit {

  dateformater: Dateformater = new Dateformater();
  statusCheck:any={};
  contractId:any={};

  queryParems:any={};
  paymentId:any={};
  data: any = {};
  paymentAdddata: any = {};

  @ViewChild(NgForm) paymentForm;
  paymentdata: any = {};
  rows: any = {};
  currency: any = {};
  saleInvoice: any = {};
  paymentMode: any = {};
  bankAcc: any = {};
  paymentDateField:any;
  depositeDateField:any;

  bill: any = {};


  response: any;
  constructor(

    private route: ActivatedRoute,
    private modalService: NgbModal,
    private http: HttpClient,
    private service: ServiceService,
    private toastr: ToastrService,
    public datepipe: DatePipe,
    private router: Router,

  ) { }


  ngOnInit(): void {
    this.statusCheck = this.route.snapshot.queryParams;

    this.queryParems = this.route.snapshot.queryParams;
    this.paymentId = this.queryParems.id;
    this.contractId = this.queryParems.contractId

    // let olddate=new Date();
    // let latest_date =this.datepipe.transform(olddate, 'yyyy-MM-dd');
    // this.paymentDateField =this.dateformater.fromModel(latest_date);
    // this.depositeDateField =this.dateformater.fromModel(latest_date);


    // this.fetch((data) => {
    //   this.paymentAdddata = data;
    // });
    if(this.statusCheck.statusCheck == 'addPayment'){
    this.fetch(this.paymentId);}

    if(this.statusCheck.statusCheck == 'editPayment'){
    this.getData(this.paymentId);}

    this.GetCurrencyDropdown()
    this.GetSaleInvoiceDropdown()
    this.GetPaymentModeDropdown()
    this.GetBankAccDropdown()
  }
  fetch(id) {
    
    this.http
    .get(`${environment.apiUrl}/api/BillingPayments/GetContractBillById/` + id)
    .subscribe(res => {
      this.response = res;
     
    if(this.response.success==true)
    {
    this.paymentAdddata =this.response.data;
    // cb(this.paymentAdddata);
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

//   fetch2(cb) {
    
//     this.http.get(`${environment.apiUrl}/api​/BillingPayments​/GetBillPaymentById​/` + this.paymentId)
//     .subscribe(res => {
//       this.response = res;
     
//     if(this.response.success==true)
//     {
//     this.data =this.response.data;
//     cb(this.data);
//     }
//     else{
//       this.toastr.error(this.response.message, 'Message.');
//     }
//       // this.spinner.hide();
//     }, err => {
//       if ( err.status == 400) {
//  this.toastr.error(err.error.message, 'Message.');
//       }
//     //  this.spinner.hide();
//     });
//   }


   getData(id) {
    this.http.get(`${environment.apiUrl}/api/BillingPayments/GetBillPaymentById/` + id)
    .subscribe(res => {
      this.response = res;
          if (this.response.success == true) {
            this.paymentdata = this.response.data;
            this.paymentdata.paymentDate = this.dateformater.fromModel(this.paymentdata.paymentDate);
            this.paymentdata.depositeDate = this.dateformater.fromModel(this.paymentdata.depositeDate);
        console.log("payment data" , this.paymentdata)
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


  UpdatePayment() {
    this.paymentdata.paymentDate = this.dateformater.toModel(this.paymentdata.paymentDate);
    this.paymentdata.depositeDate = this.dateformater.toModel(this.paymentdata.depositeDate);
    let varr = {
      "contractId": this.paymentdata.contractId,
      "contractBillId": this.paymentdata.contractBillId,
      "buyerId": this.paymentdata.buyerId,
      "selerId": this.paymentdata.selerId,
      "billNumber": this.paymentdata.billNumber,
      "saleInvoiceId": this.paymentdata.saleInvoiceId,
      "receiptNumber": this.paymentdata.receiptNumber,
      "paymentDate": this.paymentdata.paymentDate,
      "paidAmount": this.paymentdata.paidAmount,
      "taxAmount": this.paymentdata.taxAmount,
      "currencyId": this.data.currencyId,
      "deductionAmount": this.paymentdata.deductionAmount,
      "paymentMode": this.paymentdata.paymentMode,
      "paymentDescription":this.paymentdata.paymentDescription,
      "bankAccountId": this.paymentdata.bankAccountId,
      "accountDescription": this.paymentdata.accountDescription,
      "isDepositedInBank": this.paymentdata.isDepositedInBank,
      "depositeDate": this.paymentdata.depositeDate
    }

    this.http.
      put(`${environment.apiUrl}/api/BillingPayments/UpdateBillPayment/` + this.paymentId, varr)
      .subscribe(
        res => {

          this.response = res;
          if (this.response.success == true) {
            this.toastr.success(GlobalConstants.updateMessage, 'Message.');
            this.router.navigate(['/billing-and-payment/payment-collection']);
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
    this.paymentAdddata.paymentDate = this.dateformater.toModel(this.paymentAdddata.paymentDate);
    this.paymentAdddata.depositeDate = this.dateformater.toModel(this.paymentAdddata.depositeDate);
      let varr = {
       
        "contractId": this.paymentAdddata.contractId,
        "contractBillId": this.paymentAdddata.contractBillId,
        "buyerId": this.paymentAdddata.billForBuyerId,
        "selerId": this.paymentAdddata.billForSelerId,
        "saleInvoiceId": this.paymentAdddata.saleInvoiceId,
        "receiptNumber": this.paymentAdddata.receiptNumber,
        "paymentDate": this.paymentAdddata.paymentDate,
        "paidAmount": this.paymentAdddata.paidAmount,
        "taxAmount": this.paymentAdddata.taxAmount,
        "currencyId": this.paymentAdddata.currencyId,
        "deductionAmount": this.paymentAdddata.deductionAmount,
        "paymentMode": this.paymentAdddata.paymentMode,
        "paymentDescription":this.paymentAdddata.paymentDescription,
        "bankAccountId": this.paymentAdddata.bankAccountId,
        "accountDescription": this.paymentAdddata.accountDescription,
        "isDepositedInBank": this.paymentAdddata.isDepositedInBank,
        "depositeDate": this.paymentAdddata.depositeDate
      }

    this.http.
      post(`${environment.apiUrl}/api/BillingPayments/AddBillPayment/`, varr)
      .subscribe(
        res => {

          this.response = res;
          if (this.response.success == true) {
            this.toastr.success(this.response.message, 'Message.');
            this.paymentForm.reset();
            this.router.navigate(['/billing-and-payment/payment-collection']);

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
    this.http.get(`${environment.apiUrl}/api/Lookups/SaleInvoices/` + this.contractId).
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
