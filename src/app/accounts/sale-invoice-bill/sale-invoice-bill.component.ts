import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ServiceService } from 'src/app/shared/service.service';
import { environment } from 'src/environments/environment';
import pdfMake from "pdfmake/build/pdfmake";
import { ToWords } from 'to-words';
import {NgxSpinnerService} from 'ngx-spinner'
import { NgxNumToWordsService, SUPPORTED_LANGUAGE } from 'ngx-num-to-words';

@Component({
  selector: 'app-sale-invoice-bill',
  templateUrl: './sale-invoice-bill.component.html',
  styleUrls: ['./sale-invoice-bill.component.css']
})
export class SaleInvoiceBillComponent implements OnInit {
rows: any = [];
queryParems: any = {};
data:any={};
invoicedata:any;
response:any;
lang : SUPPORTED_LANGUAGE = 'en';
amountInWorda:string;
constructor(   private route: ActivatedRoute,
  private modalService: NgbModal,
  private http: HttpClient,
  private service: ServiceService,
  public spinner: NgxSpinnerService,
  private toastr: ToastrService,
  private ngxNumToWordsService: NgxNumToWordsService,
  ) { }

  ngOnInit(): void {
    this.queryParems = this.route.snapshot.queryParams;
    this.data = this.queryParems.contractId;
    this.getData();
  }
getData(){
  this.http
  .get(`${environment.apiUrl}/api/BillingPayments/GetContractInvoiceBillById/`+this.queryParems.contractId)
  .subscribe(res => {
    this.response = res;
   
  if(this.response.success==true)
  {
  this.data=this.response.data;
  this.amountInWorda=this.ngxNumToWordsService.inWords(this.data.invoiceTotalAmount, this.lang);
console.log(this.data)
  this.spinner.hide();

  }
  else{
    this.toastr.error(this.response.message, 'Message.');
    this.spinner.hide();
  
  }

  }, err => {
    if ( err.status == 400) {
this.toastr.error(err.error.message, 'Message.');
this.spinner.hide();

    }
  });
}
}
