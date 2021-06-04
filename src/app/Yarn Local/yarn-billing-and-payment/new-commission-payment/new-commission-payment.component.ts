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

  statusCheck:any={};
  rows: any = [];
  columns: any = [];
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
    // this.objEnquiry = this.queryParems;
    console.log(this.statusCheck)
  }
  addPayment(form:NgForm) {
    // this.paymentAdddata.paymentDate = this.dateformater.toModel(this.paymentAdddata.paymentDate);
    // this.paymentAdddata.depositeDate = this.dateformater.toModel(this.paymentAdddata.depositeDate);
      let varr = {
       
        // "contractId": this.paymentAdddata.contractId,
        // "contractBillId": this.paymentAdddata.contractBillId,
        // "buyerId": this.paymentAdddata.billForBuyerId,
        // "selerId": this.paymentAdddata.billForSelerId,
        // "saleInvoiceId": this.paymentAdddata.saleInvoiceId,
        // "receiptNumber": this.paymentAdddata.receiptNumber,
        // "paymentDate": this.dateformater.toModel(this.paymentAdddata.paymentDate),
        // "paidAmount": this.paymentAdddata.paidAmount,
        // "taxAmount": this.paymentAdddata.taxamount,
        // "currencyId": this.paymentAdddata.currencyId,
        // "deductionAmount": this.paymentAdddata.deductionAmount,
        // "paymentMode": this.paymentAdddata.paymentMode,
        // "paymentDescription":this.paymentAdddata.paymentDescription,
        // "bankAccountId": this.paymentAdddata.bankAccountId,
        // "accountDescription": this.paymentAdddata.accountDescription,
        // "isDepositedInBank": this.paymentAdddata.isDepositedInBank,
        // "depositeDate":  this.dateformater.toModel(this.paymentAdddata.depositeDate),
      }

    this.http.
      post(`${environment.apiUrl}`, varr)
      .subscribe(
        res => {

          this.response = res;
          if (this.response.success == true) {
            this.toastr.success(this.response.message, 'Message.');
            // this.paymentForm.reset();
            this.router.navigate(['']);

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
