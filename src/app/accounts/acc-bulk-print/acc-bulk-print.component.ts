import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgxNumToWordsService, SUPPORTED_LANGUAGE } from 'ngx-num-to-words';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ServiceService } from 'src/app/shared/service.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-acc-bulk-print',
  templateUrl: './acc-bulk-print.component.html',
  styleUrls: ['./acc-bulk-print.component.css']
})
export class AccBulkPrintComponent implements OnInit {
  rows: any = []
  id : any;
  response: any;
  data : any = {}
  buyerids : any;
amountInWorda:string;
lang : SUPPORTED_LANGUAGE = 'en';

  constructor( private route: ActivatedRoute,
    private http: HttpClient,
    private spinner:NgxSpinnerService,
    private ngxNumToWordsService: NgxNumToWordsService,
    private toastr: ToastrService,
    private service: ServiceService,

    ) { }

  ngOnInit(): void {
    this.id = localStorage.getItem('bulkPrint');
    this.buyerids = localStorage.getItem('BPbuyerId');
    this.bulkPrint();
  }
  bulkPrint() {



    let varr = {
      "ids":this.id,
      "idsBuyer":this.buyerids
    }
    this.spinner.show();
    this.http.
      post(`${environment.apiUrl}/api/BillingPayments/InvoiceBulkPrint`, varr)
      .subscribe(
        res => {
  
          this.response = res;
          if (this.response.success == true) {
    this.data=this.response.data;
    console.log(this.data)
    for(let i=0; i<this.data.length; i++){
      this.data[i].accountName= this.ngxNumToWordsService.inWords(this.data[i].invoiceTotalAmount, this.lang);
     
    }
  
            this.toastr.success(this.response.message, 'Message.');
            this.spinner.hide();
   localStorage.removeItem('bulkPrint');
  console.log(this.id);
          }
          else {
            this.toastr.error(this.response.message, 'Message.');
            this.spinner.hide();
   localStorage.removeItem('bulkPrint');
   localStorage.removeItem('BPbuyerId');
  
          }
  
        }, (err: HttpErrorResponse) => {
          const messages = this.service.extractErrorMessagesFromErrorResponse(err);
          this.toastr.error(messages.toString(), 'Message.');
          console.log(messages);
          this.spinner.hide();
   localStorage.removeItem('bulkPrint');
   localStorage.removeItem('BPbuyerId');
  
        });
  
  }
  
}
