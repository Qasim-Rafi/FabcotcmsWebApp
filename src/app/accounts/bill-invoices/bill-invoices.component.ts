import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { ColumnMode, SelectionType } from '@swimlane/ngx-datatable';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Dateformater } from 'src/app/shared/dateformater';
import { ServiceService } from 'src/app/shared/service.service';
import { environment } from 'src/environments/environment';
import { process,State  } from '@progress/kendo-data-query';
import { DataBindingDirective } from '@progress/kendo-angular-grid';
import { SUPPORTED_LANGUAGE } from 'ngx-num-to-words';

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
temp: any = [];
deptName : any;
public mySelection: string[] = this.rows;
lang : SUPPORTED_LANGUAGE = 'en';
@ViewChild(DataBindingDirective) dataBinding: DataBindingDirective;
constructor(    private service: ServiceService,
  private http: HttpClient,
  private router: Router,
  private toastr: ToastrService,
  private spinner: NgxSpinnerService,
 

  ) { }

  ngOnInit(): void {
    this.fetch((data) => {
      this.temp = [...data]; 
      this.rows = data;
    });
  }
  
  onSelect(selecterow) {
    this.selected =selecterow.selected;
  }
  saleinvoicebill(row){
   
    this.router.navigate(['/saleBill'], { queryParams: {contractId:row.contractId , invNo : row.billInvoiceNumber} });
  }
  public onFilter(inputValue: string): void {
    this.rows = process(this.temp, {
        filter: {
            logic: "or",
            filters: [
                {
                    field: 'sellerName',
                    operator: 'contains',
                    value: inputValue
                },
           
                {
                    field: 'billNumber',
                    operator: 'contains',
                    value: inputValue
                },

                {
                  field: 'billInvoiceNumber',
                  operator: 'contains',
                  value: inputValue
              },
                {
                    field: 'autoContractNumber',
                    operator: 'contains',
                    value: inputValue
                },
             
                {
                    field: 'billGeneratedDateTime',
                    operator: 'contains',
                    value: inputValue
                }
                ,
                {
                    field: 'taxAmount',
                    operator: 'contains',
                    value: inputValue
                }
                ,
                {
                    field: 'billAmount',
                    operator: 'contains',
                    value: inputValue
                }
                ,
                {
                    field: 'saleInvoiceNo',
                    operator: 'contains',
                    value: inputValue
                }
            ],
        }
    }).data;

    this.dataBinding.skip = 0;
}
  Filter(event) {
    const val = event.target.value.toLowerCase();
    // filter our data
    const temp = this.temp.filter(function (d) {
      return ( 
       // d.sellerName != null && d.sellerName != "" ? d.sellerName.toLowerCase().indexOf(val) !== -1:'' || 
        d.billNumber!= null && d.billNumber!= ""?d.billNumber.indexOf(val) !== -1 :'' || 
        d.billInvoiceNumber != null && d.billInvoiceNumber != ""?d.billInvoiceNumber.toString().indexOf(val) !== -1 : ''|| 
         d.autoContractNumber !=null && d.autoContractNumber !=""?d.autoContractNumber.toLowerCase().indexOf(val) !== -1 :''|| 
        // d.billGeneratedDateTime.toString().indexOf(val) !== -1 || 
        // d.saleInvoiceNo != null && d.saleInvoiceNo!= ""? d.saleInvoiceNo.toString().indexOf(val) !== -1 :'' || 
         d.billAmount != null && d.billAmount != ""?  d.billAmount.toString().indexOf(val) !== -1 :'' || 
        // d.taxAmount !=null && d.taxAmount !=""? d.taxAmount.toString().indexOf(val) !== -1 :'' || 
        !val );
    });
    this.rows = temp;
  }
  fetch(cb) {
    this.data2.toDate = this.dateformater.toModel(this.data2.toDate)
    this.data2.FromDate = this.dateformater.toModel(this.data2.FromDate)
   
    if(this.deptName == undefined){
      this.deptName = 3;
    }
    this.spinner.show();
    this.http
    .get(`${environment.apiUrl}/api/BillingPayments/GetAllContractBillForInvoices/`+ this.deptName+ '/'   + this.data2.toDate + '/' + this.data2.FromDate)
    .subscribe(res => {
      this.response = res;
     
    if(this.response.success==true)
    {
    this.data=this.response.data;
    this.dashboardAmnt = this.data
    this.rows = this.data.objList;


     cb(this.data.objList);
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

  fetch1() {
    this.data2.toDate = this.dateformater.toModel(this.data2.toDate)
    this.data2.FromDate = this.dateformater.toModel(this.data2.FromDate)
    if(this.deptName == undefined){
      this.deptName = 3;
    }
    this.spinner.show();
    this.http
    .get(`${environment.apiUrl}/api/BillingPayments/GetAllContractBillForInvoices/`+this.deptName+'/'+ this.data2.toDate + '/' + this.data2.FromDate)
    .subscribe(res => {
      this.response = res;
     
    if(this.response.success==true)
    {
    this.data=this.response.data;
    this.dashboardAmnt = this.data
    this.temp = [...this.data.objList]; 
    this.rows = this.data.objList;


     //cb(this.data.objList);
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
  getdept(event){
    this.deptName = event.target.value
   this.deptName =  parseInt(this.deptName);
    this.fetch((data) => {
      this.temp = [...data]; 
      this.rows = data;
    });
  }
  genrateInvoices(){
 if(this.datatext.textValue == 0){
  this.toastr.error("PLease enter valid tax%" , 'Message')
 }
 else{
    this.ids=this.mySelection;
    let varr=  {
      "taxPercentage": this.datatext.textValue,
       "contractIds":this.ids,
       "departmentId":this.deptName
    }
    this.spinner.show();
    this.http.
    post(`${environment.apiUrl}/api/BillingPayments/GenerateInvices`,varr)
    .subscribe(
      res=> {   
        this.response = res;
        if (this.response.success == true){
          this.toastr.success(this.response.message, 'Message.');
          this.datatext.textValue = ''
          this.fetch((data) => {
            this.temp = [...data]; 
            this.rows = data;
          });
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

  print(){
  
    this.ids=this.mySelection;

  
    if(this.ids.length === 0  || this.mySelection.length === 0  ){
      this.toastr.error("PLease select atleast one bill to generate print" , 'Message')
    }
    else{
       this.ids = [...new Set(this.ids)];
  localStorage.setItem('bulkPrint', this.ids);
  this.router.navigate([]).then((result) => {
    window.open('/accBulk' , '_blank');
  });
  }
  }

}
