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

    this.bulkPrint();
  }
  bulkPrint() {



    let varr = {
      "ids":this.id
  
    }
    this.spinner.show();
    this.http.
      post(`${environment.apiUrl}/api/BillingPayments/InvoiceBulkPrint`, varr)
      .subscribe(
        res => {
  
          this.response = res;
          if (this.response.success == true) {
    this.data=this.response.data;
    for(let i=0; i<this.data.length; i++){
      this.amountInWorda= this.ngxNumToWordsService.inWords(this.data[i].invoiceTotalAmount, this.lang);
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
