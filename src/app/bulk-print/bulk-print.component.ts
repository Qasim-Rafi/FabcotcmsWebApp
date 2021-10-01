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
  id : any;
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
    // this.queryParems = this.route.snapshot.queryParams;
    
    // this.id = this.queryParems.id;
    this.id = localStorage.getItem('bulkPrint');

this.fetch2()

  }

  fetch2(){
    this.spinner.show();
    this.http
  .get(`${environment.apiUrl}/api/BillingPayments/BulkPrint/`+ this.id)
  .subscribe(res => {
    this.response = res;
   
  if(this.response.success==true)
  {
  this.printData=this.response.data;
  for(let i=0; i<this.printData.length; i++){
  this.printData[i].accountName = this.ngxNumToWordsService.inWords(this.printData[i].totalCalculation, this.lang);
  }
  this.spinner.hide();
 localStorage.removeItem('bulkPrint');
// this.totalAmount1 =this.totalAmount.toFixed(2)
// this.totalAmount2 = parseFloat(this.totalAmount1)



  }
  else{
    this.toastr.error(this.response.message, 'Message.');
    this.spinner.hide();
 localStorage.removeItem('bulkPrint');
  
  }

  }, err => {
    if ( err.status == 400) {
this.toastr.error(err.error.message, 'Message.');
this.spinner.hide();
localStorage.removeItem('bulkPrint');

    }
  });
}

}
