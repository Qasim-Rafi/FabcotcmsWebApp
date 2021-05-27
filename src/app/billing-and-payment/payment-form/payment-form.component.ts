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


    this.fetch((data) => {
      this.rows = data;
    });
    this.getData(this.paymentId);

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
    this.http
    .get(`${environment.apiUrl}/api/BillingPayments/GetBillPaymentById/` + id)
    .subscribe(res => {
      this.response = res;
          if (this.response.success == true) {
            this.paymentdata = this.response.data;
            this.paymentdata.paymentDate = this.dateformater.fromModel(this.paymentdata.paymentDate);
           this.paymentdata.depositeDate = this.dateformater.fromModel(this.paymentdata.depositeDate);
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
    this.paymentdata.paymentDate = this.dateformater.toModel(this.paymentDateField);
    this.paymentdata.depositeDate = this.dateformater.toModel(this.depositeDateField);
    let varr = {
      "contractId": this.paymentdata.contractId,
      "contractBillId": this.paymentId,
      "buyerId": this.paymentdata.billForBuyerId,
      "selerId": this.paymentdata.billForSelerId,
      "saleInvoiceId": this.data.saleInvoiceId,
      "receiptNumber": this.paymentdata.receiptNumber,
      "paymentDate": this.paymentdata.paymentDate,
      "paidAmount": this.paymentdata.paidAmount,
      "taxAmount": this.paymentdata.taxAmount,
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
    this.data.paymentDate = this.dateformater.toModel(this.data.paymentDate);
    this.data.depositeDate = this.dateformater.toModel(this.data.depositeDate);
      let varr = {
       
        "contractId": this.data.contractId,
        "contractBillId": this.paymentId,
        "buyerId": this.data.billForBuyerId,
        "selerId": this.data.billForSelerId,
        "saleInvoiceId": this.data.saleInvoiceId,
        "receiptNumber": this.data.receiptNumber,
        "paymentDate": this.data.paymentDate,
        "paidAmount": this.data.paidAmount,
        "taxAmount": this.data.taxAmount,
        "currencyId": this.data.currencyId,
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
