import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';;
import { environment } from 'src/environments/environment';
import {NgxSpinnerModule, NgxSpinnerService} from 'ngx-spinner'
import { NgxNumToWordsService, SUPPORTED_LANGUAGE } from 'ngx-num-to-words';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-bulk-print',
  templateUrl: './bulk-print.component.html',
  styleUrls: ['./bulk-print.component.css']
})
export class BulkPrintComponent implements OnInit {
  queryParems: any = {};
  nmbr = [];
  response: any;
  printData: any = {};
  words : string;
  words2 : string = "word";
  totalAmount = 0;
  totalAmount1 : any;
  totalAmount2 : number;
lang : SUPPORTED_LANGUAGE = 'en';
length : any;
  constructor( private route: ActivatedRoute,
    private http: HttpClient,
    private spinner:NgxSpinnerService,
    private ngxNumToWordsService: NgxNumToWordsService,
    private toastr: ToastrService,

    ) { }

  ngOnInit(): void {
    this.queryParems = this.route.snapshot.queryParams;
    
    this.nmbr = this.queryParems.nmbr;

this.fetch2()

  }

  fetch2(){
    this.http
  .get(`${environment.apiUrl}/api/BillingPayments/BulkPrint/`+ this.nmbr)
  .subscribe(res => {
    this.response = res;
   
  if(this.response.success==true)
  {
  this.printData=this.response.data;
  // this.length = this.response.data[0].contractSaleInvoices.length;
  // console.log(this.length)
  // for(let i = 0 ; i<this.length ; i++){
  //   this.printData[i].contractSaleInvoices[i].totalAmount = this.printData[i].contractSaleInvoices[i].amount * this.printData[i].contractSaleInvoices[i].commission
  //   this.printData[i].contractSaleInvoices[i].totalAmount = this.printData[i].contractSaleInvoices[i].totalAmount/100
    
  // }
  this.spinner.hide();

//   for(let j=0;j<this.printData.contractSaleInvoices.length;j++){   
//     this.totalAmount=this.totalAmount + this.printData.contractSaleInvoices[j].totalAmount ;
   
// } 
// console.log(this.printData)
this.totalAmount1 =this.totalAmount.toFixed(2)
this.totalAmount2 = parseFloat(this.totalAmount1)


  this.words = this.ngxNumToWordsService.inWords(this.totalAmount2, this.lang);

  }
  else{
    this.toastr.error(this.response.message, 'Message.');
  
  }

  }, err => {
    if ( err.status == 400) {
this.toastr.error(err.error.message, 'Message.');

    }
  });
}

}
