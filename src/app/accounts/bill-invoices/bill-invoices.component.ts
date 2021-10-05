import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { ColumnMode, SelectionType } from '@swimlane/ngx-datatable';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Dateformater } from 'src/app/shared/dateformater';
import { ServiceService } from 'src/app/shared/service.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-bill-invoices',
  templateUrl: './bill-invoices.component.html',
  styleUrls: ['./bill-invoices.component.css']
})
export class BillInvoicesComponent implements OnInit {
rows: any = [];
columns: any=[];
SelectionType = SelectionType;
selected: any = [];
data:any=[];
data2:any=[];
datatext:any={};
response:any=[];
dateformater: Dateformater = new Dateformater();  
dashboardAmnt : any [];
ids:any;

constructor(    private service: ServiceService,
  private http: HttpClient,
  private router: Router,
  private toastr: ToastrService,
  private spinner: NgxSpinnerService,
 

  ) { }

  ngOnInit(): void {
    this.fetch();
  }
  
  onSelect(selecterow) {
    this.selected =selecterow.selected;
  }
  saleinvoicebill(row){
   
    this.router.navigate(['/saleBill'], { queryParams: {contractId:row.contractId} });
  }
  print(){
    this.router.navigate(['/accBulk']);

  }
  fetch() {
    this.data2.toDate = this.dateformater.toModel(this.data2.toDate)
    this.data2.FromDate = this.dateformater.toModel(this.data2.FromDate)
    this.spinner.show();
    this.http
    .get(`${environment.apiUrl}/api/BillingPayments/GetAllContractBillForInvoices/`+ this.data2.toDate + '/' + this.data2.FromDate)
    .subscribe(res => {
      this.response = res;
     
    if(this.response.success==true)
    {
    this.data=this.response.data;
    this.dashboardAmnt = this.data
    this.rows = this.data.objList;


    // cb(this.data);
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

  genrateInvoices(){
  
    this.ids=this.selected.map(a => a.contractId);
    let varr=  {
      "taxPercentage": this.datatext.textValue,
       "contractIds":this.ids
    }
    this.spinner.show();
    this.http.
    post(`${environment.apiUrl}/api/BillingPayments/GenerateInvices`,varr)
    .subscribe(
      res=> {   
        this.response = res;
        if (this.response.success == true){
          this.toastr.success(this.response.message, 'Message.');
          this.fetch();
    this.spinner.hide();

        }
        else {
          this.toastr.error(this.response.message, 'Message.');
    this.spinner.hide();

            }

      },(err: HttpErrorResponse) => {
        const messages = this.service.extractErrorMessagesFromErrorResponse(err);
        this.toastr.error(messages.toString(), 'Message.');
        console.log(messages);
    this.spinner.hide();
      });
  }



}
