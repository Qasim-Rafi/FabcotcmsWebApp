import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';;
import { environment } from 'src/environments/environment';
import {NgxSpinnerModule, NgxSpinnerService} from 'ngx-spinner'
import { NgxNumToWordsService, SUPPORTED_LANGUAGE } from 'ngx-num-to-words';
import { ToastrService } from 'ngx-toastr';
import { ServiceService } from '../shared/service.service';

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
loggedInDepartmentName: string;
billAmount = [];
  constructor( private route: ActivatedRoute,
    private http: HttpClient,
    private spinner:NgxSpinnerService,
    private ngxNumToWordsService: NgxNumToWordsService,
    private toastr: ToastrService,
    private service: ServiceService,

    ) { }

  ngOnInit(): void {

    this.id = localStorage.getItem('bulkPrint');
    this.loggedInDepartmentName=localStorage.getItem('loggedInDepartmentName');
    this.bulkPrint();

  }

bulkPrint() {



  let varr = {
    "ids":this.id

  }
  this.spinner.show();
  this.http.
    post(`${environment.apiUrl}/api/BillingPayments/BulkPrint`, varr)
    .subscribe(
      res => {

        this.response = res;
        if (this.response.success == true) {
  this.printData=this.response.data;
  for(let i=0; i<this.printData.length; i++){
    //this.billAmount.push(this.printData[i].totalCalculation);
    
    // this.printData[i].totalCalculation=parseFloat(this.printData[i].totalCalculation.replace(/,/g, '')) 
    this.printData[i].updatedByName = this.ngxNumToWordsService.inWords(this.printData[i].totalCalculation.replace(/,/g, ''), this.lang);
  
   
    this.printData[i].updatedByName =this.printData[i].updatedByName.split(' ')
    .map(w => w[0].toUpperCase() + w.substr(1).toLowerCase())
    .join(' ')
  }
          this.toastr.success(this.response.message, 'Message.');
          this.spinner.hide();
 localStorage.removeItem('bulkPrint');

        }
        else {
          this.toastr.error(this.response.message, 'Message.');
          this.spinner.hide();
 localStorage.removeItem('bulkPrint');

        }

      }, (err: HttpErrorResponse) => {
        const messages = this.service.extractErrorMessagesFromErrorResponse(err);
        this.toastr.error(messages.toString(), 'Message.');
        console.log(messages);
        this.spinner.hide();
 localStorage.removeItem('bulkPrint');

      });

}



}
