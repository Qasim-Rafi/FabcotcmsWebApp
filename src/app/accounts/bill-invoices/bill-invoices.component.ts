import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { ColumnMode, SelectionType } from '@swimlane/ngx-datatable';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Dateformater } from 'src/app/shared/dateformater';
import { ServiceService } from 'src/app/shared/service.service';
import { environment } from 'src/environments/environment';
import { CompositeFilterDescriptor, process,State  } from '@progress/kendo-data-query';
import { DataBindingDirective, DataStateChangeEvent } from '@progress/kendo-angular-grid';
import { SUPPORTED_LANGUAGE } from 'ngx-num-to-words';
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import { Observable } from "rxjs";
import { GridDataResult, PageChangeEvent,} from "@progress/kendo-angular-grid";

import { GridComponent } from '@progress/kendo-angular-grid';
import { PagerPosition, PagerType } from '@progress/kendo-angular-grid/dist/es2015/pager/pager-settings';
@Component({
  selector: 'app-bill-invoices',
  templateUrl: './bill-invoices.component.html',
  styleUrls: ['./bill-invoices.component.css']
})
export class BillInvoicesComponent implements OnInit {
rows: any = [];
public state: State = { skip: 0, take: 20 };
columns: any=[];
SelectionType = SelectionType;
selected: any = [];
data:any=[];
data2:any=[];
datatext:any={};
itemBID: any=[];
itemSID: any=[];
response:any=[];
dateformater: Dateformater = new Dateformater();  
dashboardAmnt : any [];
ids:any;
idsUpdates:any;
temp: any = [];
deptName : any;
public gridView: GridDataResult;
public mySelection: string[] = [];
lang : SUPPORTED_LANGUAGE = 'en';
public view: Observable<GridDataResult>;
public skip = 0;
public pageSize = 20;
public total = 100;
public pageSizeValues = [5, 10, 20, 50, 100,500];
public events: string[] = [];

public rows1: GridDataResult = { data: [], total: 0 };



public pagerTypes = ['numeric', 'input'];

public type: PagerType = 'numeric';
public buttonCount = 4;
public info = true;
public pageSizes = [ 20, 50, 100,500];
public previousNext = true;
public position: PagerPosition = 'bottom';



@ViewChild(DataBindingDirective) dataBinding: DataBindingDirective;
constructor(    private service: ServiceService,
  private http: HttpClient,
  private router: Router,
  private toastr: ToastrService,
  private spinner: NgxSpinnerService,
 

  ) {

   }

  ngOnInit(): void {
    this.sendRequest(this.state);
    // this.fetch((data) => {
    //   this.temp = [...data]; 
    //   this.rows = data;
      
    // });
  }
  public exportToExcel(grid: GridComponent): void {
    grid.saveAsExcel();
  }
  public pageChange({ skip, take }: PageChangeEvent): void {
    this.skip = skip;
    this.pageSize = take;
    if(this.rows.length >= this.pageSize){
    this.loadItems();
    }
    else{
      let page = (this.skip + this.pageSize) / this.pageSize;
      let pages=this.pageSize
      this.fetch13(page,pages)
    }
}
public sendRequest(state: State): void {
   if(state.filter ==undefined){

    //  var val =state.filter.filters
    // var val1=val[0]
    if((typeof (this.data2.toDate)) === 'string'){

    }
    else{
     this.data2.toDate = this.dateformater.toModel(this.data2.toDate)
     this.data2.FromDate = this.dateformater.toModel(this.data2.FromDate)
    }
 
  if(this.deptName == undefined){
    this.deptName = 3;
  }
  this.spinner.show();
  this.service.fetch123(this.deptName,this.data2.toDate,this.data2.FromDate,state).subscribe((response: GridDataResult) => {
      debugger

if(response.data.length >0){
      this.rows1 = response;
      this.temp=this.rows1.data ,
      this.rows=this.rows1.data ,
      this.data2.toDate = this.dateformater.fromModel(this.data2.toDate)
      this.data2.FromDate = this.dateformater.fromModel(this.data2.FromDate)
      this.spinner.hide();}
      else{
        this.rows1 = response;
        this.temp=this.rows1.data ,
        this.rows=this.rows1.data ,
        this.data2.toDate = this.dateformater.fromModel(this.data2.toDate)
        this.data2.FromDate = this.dateformater.fromModel(this.data2.FromDate)
        this.spinner.hide();
        this.toastr.error('Record Not Found')
      }
  });
    //  this.onFilter(val1)
   }
 else{
 this.filterChange(state.filter)
 }
//   this.service.fetch123(state).subscribe((response: GridDataResult) => {
//     debugger


//     this.rows1 = response;
//     // this.total=this.rows.objList[0].recordCount
//     this.spinner.hide();
// });
}
public dataStateChange(state: DataStateChangeEvent): void {
  this.state = state;
  this.sendRequest(state);
}
public loadItems(): void {
  
    this.gridView = {
        data: this.rows.slice(this.skip, this.skip + this.pageSize),
        total: this.rows.length
    };
}
  onSelect(selecterow) {
    this.selected =selecterow.selected;
  }
  saleinvoicebill(row,billname){
   
   // this.router.navigate(['/saleBill'], { queryParams: {contractId:row.contractId , invNo : row.billInvoiceNumber,billname} });
   const url = this.router.serializeUrl(
    this.router.createUrlTree(['/saleBill'],{ queryParams: {contractId:row.contractId, billNumber:row.billNumber, invNo : row.billInvoiceNumber,billname ,billfor:row.billSource}})
  );
  window.open(url, '_blank');
    // this.router.navigate(['/saleBill'],{ queryParams: {contractId:row.contractId , invNo : row.billInvoiceNumber,billname} }).then((result) => {
    //   window.open('_blank');
    // });
  }
  saleinvoiceBreakbill(row,billname){
   
    //this.router.navigate(['/saleBill'], { queryParams: {contractId:row.contractId , invNo : row.billInvoiceNumber,billname} });

    const url = this.router.serializeUrl(
      this.router.createUrlTree(['/saleBill'],{ queryParams: {contractId:row.contractId , billNumber:row.billNumber ,invNo : row.billInvoiceNumber,billname} })
    );
    window.open(url, '_blank');
  }


  public filter: CompositeFilterDescriptor = {
    logic: "or",
    filters: [],
  };
  public filterChange(filter): void {
    if(filter.filters.length != 0){
    this.filter = filter.filters;

    let val2=filter.filters[0]
    const val =val2.value.toLowerCase();
    const temp = this.rows.filter(function (d) {
      return (d.sellerName.toLowerCase().indexOf(val) !== -1   
      || d.billInvoiceNumber.toLowerCase().indexOf(val) !==-1 
      || d.billNumber.toLowerCase().indexOf(val) !==-1 
      || d.autoContractNumber.toLowerCase().indexOf(val) !==-1 
      || !val);
    });
    this.rows1 = temp;
  }
  else{
    this.sate2(this.state)
  }
    //this.loadData();
  }

  public sate2(state: State): void {
 
     //  var val =state.filter.filters
     // var val1=val[0]
     if((typeof (this.data2.toDate)) === 'string'){

     }
     else{
      this.data2.toDate = this.dateformater.toModel(this.data2.toDate)
      this.data2.FromDate = this.dateformater.toModel(this.data2.FromDate)
     }

  
   if(this.deptName == undefined){
     this.deptName = 3;
   }
   this.spinner.show();
   this.service.fetch123(this.deptName,this.data2.toDate,this.data2.FromDate,state).subscribe((response: GridDataResult) => {
       debugger
 
 
       this.rows1 = response;
       this.temp=this.rows1.data ,
       this.rows=this.rows1.data ,
       this.data2.toDate = this.dateformater.fromModel(this.data2.toDate)
       this.data2.FromDate = this.dateformater.fromModel(this.data2.FromDate)
       this.spinner.hide();
   });

  }
  public loadData(): void {
    this.rows1 = process(this.temp, this.temp);
    //this.gridData = process(sampleProducts, { filter: this.filter });
  }
  public onFilter(inputValue: any): void {
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
    let skip =1;
    let pagesize=20;
    this.http
    .get(`${environment.apiUrl}/api/BillingPayments/GetAllContractBillForInvoices/`+ this.deptName+ '/'   + this.data2.toDate + '/' + this.data2.FromDate+'/'+skip+'/'+pagesize)
    .subscribe(res => {
      this.response = res;
     
    if(this.response.success==true)
    {
      
    this.data=this.response.data;
    this.dashboardAmnt = this.data
    if(this.data.objList.length > 0){
    this.rows = this.data.objList;

    this.gridView = {
      data: this.rows,
      total: parseInt(this.rows[0].recordCount,10)
    };
     cb(this.data.objList);
    this.spinner.hide();
  }
  else{
    this.rows1= { data: [], total: 0 };
    this.spinner.hide();
  }
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


  fetch13(skip,pagesize) {
    this.data2.toDate = this.dateformater.toModel(this.data2.toDate)
    this.data2.FromDate = this.dateformater.toModel(this.data2.FromDate)

    if(this.data2.toDate == "undefined-undefined-undefined"){
      this.data2.toDate ="null";
      this.data2.FromDate ="null";
    }
    if(this.deptName == undefined){
      this.deptName = 3;
    }
    this.spinner.show();
    this.http
    .get(`${environment.apiUrl}/api/BillingPayments/GetAllContractBillForInvoices/`+this.deptName+'/'+ this.data2.toDate + '/' + this.data2.FromDate +'/'+skip+'/'+pagesize)
    .subscribe(res => {
      this.response = res;
     
    if(this.response.success==true)
    {
      this.data2.toDate = this.dateformater.fromModel(this.data2.toDate)
      this.data2.FromDate = this.dateformater.fromModel(this.data2.FromDate)
    this.data=this.response.data;
    this.dashboardAmnt = this.data
    this.temp = [...this.data.objList]; 
    this.rows = this.data.objList;
// this.loadItems();
this.gridView = {
  data: this.rows.slice(this.skip, this.skip + this.pageSize),
  total: parseInt(this.rows[0].recordCount,10)
};

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


  fetch1() {
    // this.data2.toDate = this.dateformater.toModel(this.data2.toDate)
    // this.data2.FromDate = this.dateformater.toModel(this.data2.FromDate)

    if(this.data2.toDate == "undefined-undefined-undefined"){
      this.data2.toDate ="null";
      this.data2.FromDate ="null";
    }
    if(this.deptName == undefined){
      this.deptName = 3;
    }
    this.spinner.show();
    this.sendRequest(this.state);
  //   this.http
  //   .get(`${environment.apiUrl}/api/BillingPayments/GetAllContractBillForInvoices/`+this.deptName+'/'+ this.data2.toDate + '/' + this.data2.FromDate+'/'+1+'/'+this.pageSize)
  //   .subscribe(res => {
  //     this.response = res;
     
  //   if(this.response.success==true)
  //   {
  //     this.data2.toDate = this.dateformater.fromModel(this.data2.toDate)
  //     this.data2.FromDate = this.dateformater.fromModel(this.data2.FromDate)
  //   this.data=this.response.data;
  //   this.dashboardAmnt = this.data
  //   this.temp = [...this.data.objList]; 
  //   this.rows = this.data.objList;


  //    //cb(this.data.objList);
  //   this.spinner.hide();

  //   }
  //   else{
  //     this.toastr.error(this.response.message, 'Message.');
  //     this.spinner.hide();
    
  //   }

  //   }, err => {
  //     if ( err.status == 400) {
  // this.toastr.error(err.error.message, 'Message.');
  // this.spinner.hide();

  //     }
  //   });
  }
  getdept(event){
    this.deptName = event.target.value
    localStorage.setItem('department',this.deptName)
   this.deptName =  parseInt(this.deptName);
    this.fetch((data) => {
      this.temp = [...data]; 
      this.rows1 = data;
    });
  }

  genrateInvoices(){
 if(this.datatext.textValue == 0){
  this.toastr.error("PLease enter valid tax%" , 'Message')
 }
 else{
    this.ids=this.mySelection;
    this.idsUpdates=this.ids
    for(let i=0;i<=this.idsUpdates.length; i++){
            var d= this.rows.filter(x=>x.id == this.idsUpdates[i]);
            if(d.length >0 ){

              this.idsUpdates[i] = d[0].contractId +'-'+ d[0].billNumber +'-'+d[0].billSource
            }
    }
    let varr=  {
      "taxPercentage": this.datatext.textValue,
       "contractIds":this.idsUpdates,
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
          this.idsUpdates =[];
          this.mySelection=[];
            this.sendRequest(this.state);
           this.rows = process(this.temp,this.state)

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
getafterGenrated(){

  if(this.data2.toDate != null || this.data2.toDate != undefined){
    this.data2.toDate = this.dateformater.toModel(this.data2.toDate)
    this.data2.FromDate = this.dateformater.toModel(this.data2.FromDate)
  }
  
    if(this.deptName == undefined){
      this.deptName = 3;
    }
    this.spinner.show();
    this.http
    .get(`${environment.apiUrl}/api/BillingPayments/GetAllContractBillForInvoices/`+this.deptName+'/'+ this.data2.toDate + '/' + this.data2.FromDate+'/'+1+'/'+this.pageSize)
    .subscribe(res => {
      this.response = res;
     
    if(this.response.success==true)
    {
      this.data2.toDate = this.dateformater.fromModel(this.data2.toDate)
      this.data2.FromDate = this.dateformater.fromModel(this.data2.FromDate)
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
  print(){
    this.ids =[];
    this.idsUpdates= [];
    this.ids=this.mySelection;
    this.idsUpdates=this.ids
  
    if(this.ids.length === 0  || this.mySelection.length === 0  ){
      this.toastr.error("PLease select atleast one bill to generate print" , 'Message')
    }
    else{
      for(let i=0;i<=this.idsUpdates.length; i++){
        var d= this.rows.filter(x=>x.id == this.idsUpdates[i]);
        if(d.length >0 ){
          if(d != undefined && d[0].billSource == "Seller" ){
          this.itemSID.push( d[0].contractId +'-'+ parseInt( d[0].billNumber));
          // this.idsUpdates = [...new Set(this.idsUpdates)];
          }
          if(d != undefined && d[0].billSource == "Buyer" ){
            this.itemBID.push(d[0].contractId +'-'+ parseInt( d[0].billNumber))
           //  this.item.splice(i, 1);
          }
        }
}
       
  localStorage.setItem('bulkPrint', this.itemSID);
  localStorage.setItem('BPbuyerId', this.itemBID);
  this.router.navigate([]).then((result) => {
    window.open('/accBulk' , '_blank');
  });
  this.itemSID =[];
  this.itemBID=[];
  this.mySelection =[];
  this.idsUpdates=[];
  }
  }



  ExcelFile(){
    const filtered = this.rows.map(row => ({
      InvoiceDepartment:row.invoiceDepartment,
      SellerName: row.sellerName,
      BillNumber: row.billNumber,
      BillInvoiceNumber: row.billInvoiceNumber ,
      AutoContractNumber: row.autoContractNumber,
      BillGeneratedDateTime: row.billGeneratedDateTime,
      SaleInvoiceNo: row.saleInvoiceNo ,
      BillAmount: row.billAmount ,
    
      TaxAmount: row.taxAmount +'%',
    }));

    this.service.exportAsExcelFile(filtered, 'Accounts Execl Report');

  }
  Pdf() {

    let docDefinition = {
      pageSize: 'A4',
      pageOrientation: 'Landscape',
      info: {
        title: 'Accounts Execl Report'
      },
      content: [
        {
          text: 'Accounts PDF Report',
          style: 'heading',

        },
        {
          margin: [-30 , 5 , 0 , 0 ],
          table:{
            headerRows : 1,
            widths : [80, 100, 100, 100 , 100 , 100 , 100 , 80 , 80  
            ],
            body:[
              [
                {text:'InvoiceDepartment' , style:'tableHeader' }
              ,{text:'SellerName' , style:'tableHeader'} ,
              {text:'BillNumber' , style:'tableHeader' }, 
              {text:'BillInvoiceNumber' , style:'tableHeader' }, 

              {text:'AutoContractNumber'  , style:'tableHeader'} , 
              {text:'BillGeneratedDateTime' , style:'tableHeader'} , 
              {text:'SaleInvoiceNo' , style:'tableHeader'},
              
              {text:'BillAmount'  , style:'tableHeader'} , 
              {text:'TaxAmount' , style:'tableHeader'} , 
            ],
              ...this.rows.map(row => (
                [
                  {text: row.invoiceDepartment , style:'tableHeader2'} ,
                {text:  row.sellerName , style:'tableHeader2'},
                {text: row.billNumber, style:'tableHeader2'} ,
                {text: row.billInvoiceNumber , style:'tableHeader2'} ,
                 {text: row.autoContractNumber, style:'tableHeader2'} ,
                  {text:row.billGeneratedDateTime  , style:'tableHeader2' }  ,
                  {text: row.saleInvoiceNo , style:'tableHeader2'},
           
                 {text: row.billAmount, style:'tableHeader2'} ,
                  {text:row.taxAmount  + "%" , style:'tableHeader2' }  ,



                ]
              ))
            ]
          }
        },
      ],
      styles: {
        heading: {
          fontSize: 13,
          alignment: 'center',
          margin: [0, 15, 0, 30]
        },
        tableHeader:{ fillColor: '#f3f3f4' , bold:true , margin:4 , alignment: 'center' ,fontSize: 7},
        tableHeader2:{   margin:3 , alignment: 'center' , fontSize: 6},
      }

    };
    pdfMake.createPdf(docDefinition).print();
  }


}
