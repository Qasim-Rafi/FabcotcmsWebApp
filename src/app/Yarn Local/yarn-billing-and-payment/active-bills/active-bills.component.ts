import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { ToastrService } from 'ngx-toastr';
import { ServiceService } from 'src/app/shared/service.service';
import { environment } from 'src/environments/environment';
// import { GlobalConstants } from '../../Common/global-constants';
// import { DateFilterComponent } from '../date-filter/date-filter.component';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { ClipboardService } from 'ngx-clipboard';
import pdfMake from "pdfmake/build/pdfmake";
import { ColumnMode, SelectionType } from '@swimlane/ngx-datatable';
import {NgxSpinnerService} from 'ngx-spinner'
import { NgxNumToWordsService, SUPPORTED_LANGUAGE } from 'ngx-num-to-words';
import { Dateformater } from 'src/app/shared/dateformater';
import { process,State  } from '@progress/kendo-data-query';
import { DataBindingDirective } from '@progress/kendo-angular-grid';

@Component({
  selector: 'app-active-bills',
  templateUrl: './active-bills.component.html',
  styleUrls: ['./active-bills.component.css']
})
export class ActiveBillsComponent implements OnInit {
  dateformater: Dateformater = new Dateformater();  

  selected: any = [];
  expordtcountrycondition:any;
  columns: any = [];
  response: any = [];
  printResponse: any = [];
  
  copyData: any = [];
  listCount: number;
  // rows: any = [{nmbr: 1}];
  rows: any = [];
  dashboardAmnt: number;

  data: any = [];
  bulkData: any = [];
  totalQuantity = 0 ;
  words : string;

  checkboxData: any = [];
  activeData : any =  [];
  SelectionType = SelectionType;
  ids : string;
  billFilter: any = {};
  selectedids: any ={};
image2: any ;
image  :any; 
totalAmount = 0;
totalAmount1 : any;
totalAmount2 : number;
arrayNew: any  = [];
printData = [] 
data2:any = []
item: any;
itemBID: any=[];
status  ;
gridApi :  any;
objList : any;
 defaultColDef : any;
 id : any;
 buyerids : any;
 rowSelection : any ;
loggedInDepartmentName: string;
public mySelection: string[] = this.rows;
  url = '/api/BillingPayments/GetAllContractBill'
  lang : SUPPORTED_LANGUAGE = 'en';
  @ViewChild(DataBindingDirective) dataBinding: DataBindingDirective;
  constructor(    private service: ServiceService,
    private http: HttpClient,
    private _clipboardService: ClipboardService,
    private router: Router,
    private toastr: ToastrService,
    private modalService: NgbModal,
    private spinner: NgxSpinnerService,
    private ngxNumToWordsService: NgxNumToWordsService

    ) {  this.defaultColDef = {
      flex: 1,
      minWidth: 100,
      resizable: true,
     
    };
    this.rowSelection = 'multiple';
    { } this.router.routeReuseStrategy.shouldReuseRoute = () => false; 
    let body = document.getElementsByTagName('body')[0];
    body.classList.add('sidebar-collapse'); 
    let footer = document.getElementsByTagName('footer')[0];
    footer.classList.add('d-none'); }

    navigatePaymentForm(statusCheck , obj ) {
      this.router.navigate(['/yarn-billing-and-payment/payment-form'], { queryParams: { statusCheck: statusCheck 
         , id:obj.id , contractId:obj.contractId}  });
   };
  
    navigateOpenBill(obj) {

      
        let foundID = this.rows.filter(x=>x.id == obj.id)
        if(foundID != undefined && foundID[0].billSource == "Buyer" ){
          var idBuyer =foundID[0].id;
          obj.id= null
        }
     

      this.router.navigate(['/yarn-billing-and-payment/open-bill'] , { queryParams: {id: obj.id,idbuyer:idBuyer} });
    };
    navigateEditContract(obj) {
      this.router.navigate(['/FabCot/active-contract-details'], { queryParams: {id: obj.contractId} });
    };
  ngOnInit(): void {
    this.loggedInDepartmentName=localStorage.getItem('loggedInDepartmentName');
    this.http.get('/assets/fabcot.png', { responseType: 'blob' })
    .subscribe(res => {
      const reader = new FileReader();
      reader.onloadend = () => {
        var base64data = reader.result;                
            console.log(base64data);
            this.image2 = base64data;
      }
 
      reader.readAsDataURL(res); 
      console.log(res);
      this.image = res;
     
    });
this.fetch();
  }
  
  // search(event) {
  //   const val = event.target.value.toLowerCase();

  //   const temp = this.billFilter.filter(function (d) {
  //     return (
  //       d.autoContractNumber.toLowerCase().indexOf(val) !== -1 ||
  //       !val);
  //   });
  //   this.rows = temp;
  // }
  search(event) {
    const val = event.target.value.toLowerCase();
    const temp = this.billFilter.filter(function (d) {
      return (d.autoContractNumber.toLowerCase().indexOf(val) !== -1 ||
      d.billNumber.toLowerCase().indexOf(val) !== -1 ||
        //  d.buyerName.toLowerCase().indexOf(val) !== -1 || 
        
        !val);
    });
    this.rows = temp;

  }

  public onFilter(inputValue: string): void {
    this.rows = process(this.billFilter, {
        filter: {
            logic: "or",
            filters: [
                {
                    field: 'buyerName,sellerName',
                    operator: 'contains',
                    value: inputValue
                },
                {
                    field: 'sellerName,buyerName',
                    operator: 'contains',
                    value: inputValue
                },
                {
                    field: 'billNumber',
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

  fetch() {
    this.data2.toDate = this.dateformater.toModel(this.data2.toDate)
    this.data2.FromDate = this.dateformater.toModel(this.data2.FromDate)
    this.spinner.show();
    this.http
    .get(`${environment.apiUrl}/api/BillingPayments/GetAllContractBill/`+ this.data2.toDate + '/' + this.data2.FromDate)
    .subscribe(res => {
      this.response = res;
     
    if(this.response.success==true)
    {
    this.data=this.response.data;
    this.rows = this.data.objList;
    for(let i = 0 ; i < this.rows.length ; i++){
      this.rows[i].billGeneratedDateTime = this.rows[i].billGeneratedDateTime.slice(0 ,10)
    }

    this.dashboardAmnt = this.data.totalBillAmount;
    this.billFilter = [...this.rows];

    this.listCount = this.rows.length;
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
  getSelectedRowData() {
    //let selectedNodes = this.gridApi.getSelectedNodes();
    let selectedData = this.mySelection
    
    // alert(`Selected Nodes:\n${JSON.stringify(selectedData)}`);
    console.log(selectedData)
    if(selectedData.length === 0 ){
      this.toastr.error("PLease select atleast one bill to generate print" , 'Message')
    }
    else{
       this.item = [...new Set(selectedData)];
       for(let i=0; i<this.item.length; i++){
         let foundID = this.rows.filter(x=>x.id == this.item[i])
         if(foundID != undefined && foundID[0].billSource == "Buyer" ){
           this.itemBID.push(foundID[0].id)
          //  this.item.splice(i, 1);
         }

       }
       if(this.itemBID != undefined){
       this.item = this.item.filter(val => !this.itemBID.includes(val));
       }
  localStorage.setItem('bulkPrint', this.item);
  localStorage.setItem('BPbuyerId', this.itemBID);
  this.itemBID=[];
  this.router.navigate([]).then((result) => {
    window.open('/bulkPrint' , '_blank');
  });
  }

  }


  getSelectedRowDataExportYran() {
    //let selectedNodes = this.gridApi.getSelectedNodes();
    let selectedData = this.mySelection
    
    // alert(`Selected Nodes:\n${JSON.stringify(selectedData)}`);
    console.log(selectedData)
    if(selectedData.length === 0 ){
      this.toastr.error("PLease select atleast one bill to generate print" , 'Message')
    }
    else{
       this.item = [...new Set(selectedData)];
       for(let i=0; i<this.item.length; i++){
         let foundID = this.rows.filter(x=>x.id == this.item[i])
         if(foundID != undefined && foundID[0].billSource == "Buyer" ){
           this.itemBID.push(foundID[0].id)
          //  this.item.splice(i, 1);
         }

       }
       if(this.itemBID != undefined){
       this.item = this.item.filter(val => !this.itemBID.includes(val));
       }
  localStorage.setItem('bulkPrint', this.item);
  localStorage.setItem('BPbuyerId', this.itemBID);
  this.bulkPrint()
 
  // this.router.navigate([]).then((result) => {
  //   window.open('/bulkPrintYE' , '_blank');
  // });
  }

  }


  bulkPrint() {
    this.id = localStorage.getItem('bulkPrint');
    this.buyerids = localStorage.getItem('BPbuyerId');


    let varr = {
      "ids":this.id,
      "idsBuyer":this.buyerids
  
    }
    this.spinner.show();
    this.http.
      post(`${environment.apiUrl}/api/BillingPayments/BulkPrint`, varr)
      .subscribe(
        res => {
  
          this.response = res;
          if (this.response.success == true) {
    this.printData=this.response.data;
    this.expordtcountrycondition =this.response.data.countryId;
    this.expordtcountrycondition =this.response.data[0].owneName;
    console.log(this.response.data)
    for(let i=0; i<this.printData.length; i++){
      this.printData[i].updatedByName = this.ngxNumToWordsService.inWords(this.printData[i].totalCalculation.replace(/,/g, ''), this.lang);
      this.printData[i].updatedByName =this.printData[i].updatedByName.split(' ')
      .map(w => w[0].toUpperCase() + w.substr(1).toLowerCase())
      .join(' ')
    }
            this.toastr.success(this.response.message, 'Message.');
            this.spinner.hide();
            this.itemBID=[];
            if(this.loggedInDepartmentName =='Yarn Export'){

              this.print3()
            }else{
              this.print33()
            }
            localStorage.removeItem('bulkPrint');
            localStorage.removeItem('BPbuyerId');
  console.log(this.printData)
          }
          else {
            this.toastr.error(this.response.message, 'Message.');
            this.spinner.hide();
            this.itemBID=[];
            localStorage.removeItem('bulkPrint');
            localStorage.removeItem('BPbuyerId');
          }
  
        }, (err: HttpErrorResponse) => {
          const messages = this.service.extractErrorMessagesFromErrorResponse(err);
          this.toastr.error(messages.toString(), 'Message.');
          console.log(messages);
          this.spinner.hide();
          this.itemBID=[];
          localStorage.removeItem('bulkPrint');
          localStorage.removeItem('BPbuyerId');
        });
  
  }

  print3(){

    let docDefinition = {
      pageSize: 'A4',
      pageMargins: [ 20, 30, 30, 10 ],
      pageOrientation: 'letter',
        
            info: {
              title: 'Bill generated'
            },
            content: [
             
  
  
            ],
    styles:{}
    };


    this.printData.forEach((data, index) => {
      // Add content of each page to the main docDefinition
      docDefinition.content.push(
        // ... (your existing content for each page)
        {
          "image" : this.image2,
         fit : [120 , 120]
      
        },
        {
       
          text:'FABCOT INTERNATIONAL FZE ®' , style:'heading' , margin: [0,-40,0,0]
       
        },
        {
       
          text:this.loggedInDepartmentName , style:'headingG' , margin: [430,-20,0,0]
       
        },
        {
          margin: [5 , 10 , 0 , 0],
          layout:'noBorders',
          table:{headerRows: 1 , widths:['100%'],
        body: [
          [{text:'Flexi Office, RAKEZ Business ZONE F-Z RAK , United Arab Emirates ' , style:'headingC'}
        ],] }
        },
        {
          margin: [5 , -4 , 0 , 0],
          layout:'noBorders',
          table:{headerRows: 1 , widths:['100%'],
        body: [
          [{text:this.loggedInDepartmentName == 'Yarn Import'?'faisal@fabcot.net': this.expordtcountrycondition =="sohail ahmed"?'Email: Sohail@fabcot.net' :'Asif@fabcot.net' , style:'headingC'}],] }
        },
        {
          layout:'noBorders',
         
          table:{headerRows:1 ,  widths:['18%' , '67%' , '5%' , '12%'],
        body:[ [
          {text: 'Seller :' , margin: [20 , 30 , 0 , 0] , bold:true , style:'common' } , {text: data['sellerName'] , bold:true , margin: [-43 , 30 , 0 , 0] , style:'common'},
        {text:'Bill # :' , margin: [0 , 30 , 0 , 0] , bold:true , style:'common'} ,{text:data['billNumber'] , margin: [0 , 30 , 0 , 0] , style:'common'}
      
      ]]
        }
        },
        {
          
          layout:'noBorders',
          table:{headerRows:1 ,  widths:['18%' , '65%' , '10%' , '15%'],
        body:[ [{text: 'Buyer :' , margin: [20 , 4 , 0 , 0] , bold:true , style:'common'} , {text: data['buyerName'] , margin: [-43 , 4 , 0 , 0] , bold:true  , style:'common'},
        {text:'Bill Date :' , margin: [0 , 4 , 0 , 0] , bold:true , style:'common'} ,{text:data['billDate'] , margin: [-20 , 4 , 0 , 0] , bold:true  , style:'common' }
      
      ]]
        }
        },
        {
         

          layout:'noBorders',
          table:{headerRows:1 ,  widths:['20%' , '80%' ],
        body:[ [{text: 'Fabcot Contract# :' , margin: [20 , 4 , 0 , 0] , bold:true , style:'common'} , {text: data['contractNumber'] , margin: [-12 , 4 , 0 , 0]  , bold:true  , decoration:'underline' , style:'common'}
      
      ]]
        }
        },
        {
         

          layout:'noBorders',
          table:{headerRows:1 ,  widths:['20%' , '80%' ],
        body:[ [{text: 'Supplier Contract# :' , margin: [20 , 4 , 0 , 0] , bold:true , style:'common'} , {text: data['supplierContractNumber'] , margin: [-10 , 4 , 0 , 0]  , bold:true  , decoration:'underline' , style:'common'}
      
      ]]
        }
        },
        {
        

          layout:'noBorders',
          table:{headerRows:1 ,  widths:['20%' , '80%' ],
        body:[ [{text: 'Contract Date :' , margin: [20 , 4 , 0 , 0] , bold:true  , style:'common'} , {text: data['contractDate'] , margin: [-25 , 4 , 0 , 0] , bold:true , decoration:'underline' , style:'common' }
      
      ]]
        }
        },

        {
         

          layout:'noBorders',
          table:{headerRows:1 ,  widths:['100%' ],
        body:[ [{text: 'Detail as under' , margin: [20 , 0 , 0 , 0]  , style:'common'} 
      
      ]]
        }
        },

        {
          margin: [0 , 20 , 0 , 0 ],
          table:{
            headerRows : 1,
            widths : [ '10%', '15%' , '15%' , '15%' , '10%' , '15%'  , '10%' , '15%'],
            body:[

              [
                {text:'Sale Invoice#' , style:'tableHeader' }
              ,{text:'Sale Invoice Date' , style:'tableHeader'} ,
              {text:'Article' , style:'tableHeader'} ,

              {text:'Quantity' , style:'tableHeader' }, 
              {text:'Rate'  +'(' + data.currencyName+')' , style:'tableHeader' }, 

              {text:'Inv Amount' +'(' + data.currencyName+')'  , style:'tableHeader'} , 
              {text:'Comm%' , style:'tableHeader'} , 

              {text:'Amount' +'(' + data.currencyName+')' , style:'tableHeader'}],
              
              ...data['contractSaleInvoices'].map(row => (
                [

                  {text: row.saleInvoiceNo , style:'tableHeader2'} ,
                {text:  row.saleInvoiceDateToDisplay , style:'tableHeader2'},
                {text: row.articleName  +' '+ row.construction , style:'tableHeader2'},

                {text:  row.quantity + " " + row.quanityUOM   , style:'tableHeader2'} ,
                {text: row.rate + "/" + row.quanityUOM , style:'tableHeader2'} ,
                
                 {text: "$ " + row.amount
                     , style:'tableHeader2'} ,
                  {text:row.commission+ ' ' + row.commissionUnit  , style:'tableHeader2' }  ,

                  {text: "$ " + row.billAmount , style:'tableHeader2'}]
              ))
            ]
          }
        },

      {
        layout:'noBorders',
        table:{headerRows:1 ,  widths:['10%' , '20%' ,  '25%' , '25%' ],
      body:[ [
        {text: 'Quantity :' , margin:[0 , 30,0,0] , bold:true , style:'common' } ,
       {text: data['quantitySum'] + " " + data['quanityUOM']  ,margin:[-10 , 30,0,0] , bold:true , style:'common' },
        {text: this.loggedInDepartmentName =='Yarn Import'? '':'Invoice Amount' + ' (' + data['currencyName'] +   '):'  , margin:[0,30,0,0]  , bold:true , style:'common' } ,
       {text:  this.loggedInDepartmentName =='Yarn Import'? '':data['amountsum']  , margin:[-35,30,0,0] ,  bold:true , style:'common'}
    
    ]]
      }
      },

        {
          layout:'noBorders',
          table:{headerRows:1 ,  widths:['20%' , '50%' ,  '30%' , '10%' ],
        body:[ [
          {text: 'Amount in Words :' , margin:[0 , 20,0,0] , bold:true , style:'common' } ,
         {text: data['updatedByName'] ,margin:[-30 , 20,0,0] , bold:true , decoration:'underline' , style:'common' },
          {text: 'TOTAL :' , margin:[50,20,0,0]  , bold:true , style:'common' } ,
         {text:   data['currencyName']+ ' ' + data.totalCalculation , bold:true  , margin:[-70,20,0,0] , decoration:'underline'  , style:'common'}
      
      ]]
        }
        },
   

      {
        layout:'noBorders',
        table:{headerRows:1 ,  widths:['100%' ],
      body:[ [
        {text: 'Our Bank detail as under FTT:' , margin:[0 , 20,0,0] , bold:true , style:'common' } ,
      
    ]]
      }
      },
      {
        layout:'noBorders',
        table:{headerRows:1 ,  widths:['20%' , '50%'  ],
      body:[ [
        {text: 'Title of Account :' , margin:[0 , 10,0,0] , bold:true , style:'common' } ,
       {text: data['accountName'] ,margin:[-20 , 10,0,0]  , style:'common' },
     
    
    ]]
      }
      },

      {
        layout:'noBorders',
        table:{headerRows:1 ,  widths:['20%' , '50%'  ],
      body:[ [
        {text: 'Address :' , margin:[0 , 0,0,0] , bold:true , style:'common' } ,
       {text: data['address'] ,margin:[-20 , 0,0,0]  , style:'common' },
     
    
    ]]
      }
      },
      {
        layout:'noBorders',
        table:{headerRows:1 ,  widths:['20%' , '50%'  ],
      body:[ [
        {text: 'Bank Name :' , margin:[0 , 0,0,0] , bold:true , style:'common' } ,
       {text: data['bankName'] ,margin:[-20 , 0,0,0]  , style:'common' },
     
    
    ]]
      }
      },
      {
        layout:'noBorders',
        table:{headerRows:1 ,  widths:['20%' , '50%'  ],
      body:[ [
        {text: 'IBAN Number:' , margin:[0 , 0,0,0] , bold:true , style:'common' } ,
       {text: data['iban'] ,margin:[-20 , 0,0,0]  , style:'common' },
     
    
    ]]
      }
      },
      {
        layout:'noBorders',
        table:{headerRows:1 ,  widths:['20%' , '50%'  ],
      body:[ [
        {text: 'Swift Code :' , margin:[0 , 0,0,0] , bold:true , style:'common' } ,
       {text: data['swiftCode'] ,margin:[-20 , 0,0,0]  , style:'common' },
     
    
    ]]
      }
      },

      {
        layout:'noBorders',
        table:{headerRows:1 ,  widths:['20%' , '50%'  ],
      body:[ [
        {text: 'Bank Address :' , margin:[0 , 0,0,0] , bold:true , style:'common' } ,
       {text: data['bankAddress'] ,margin:[-20 , 0,0,0]  , style:'common' },
     
    
    ]]
      }
      },
      {
        layout:'noBorders',
        table:{headerRows:1 ,  widths:['100%'   ],
      body:[ [
        {text: 'For FABCOT INTERNATIONAL' , margin:[0 , 30,0,0]  , bold: true , style:'common' } ,
    ]]
      }
      },
      index < this.printData.length - 1 ? { text: '', pageBreak: 'after' } : null
        // ... (other content for each page)
      );
    });






    docDefinition.styles = {
      heading: { fontSize: 18, bold: true, alignment: 'center' },
      headingC: { fontSize: 9, alignment: 'center' },
      headingG: { fontSize: 12, alignment: 'center', bold: true },
      common: { fontSize: 9 },
      heading2: { fontSize: 9, bold: true, alignment: 'center' },
      tableHeader: { fillColor: '#f3f3f4', bold: true, margin: 4, alignment: 'center', fontSize: 8 },
      tableHeader2: { margin: 3, alignment: 'center', fontSize: 8 },
    };







    pdfMake.createPdf(docDefinition).print();
  }

  print33(){


    let docDefinition = {
      pageSize: 'A4',
      pageMargins: [ 20, 30, 30, 10 ],
      pageOrientation: 'letter',
        
            info: {
              title: 'Bill generated'
            },
            content: [
             
  
  
            ],
    styles:{}
    };


    this.printData.forEach((data, index) => {
      // Add content of each page to the main docDefinition
      docDefinition.content.push(


        {
          "image" : this.image2,
         fit : [120 , 120]
      
        },
        {
       
          text:'FABCOT INTERNATIONAL FZE ®' , style:'heading' , margin: [0,-40,0,0]
       
        },
        {
       
          text:this.loggedInDepartmentName , style:'headingG' , margin: [430,-20,0,0]
       
        },
        {
          margin: [5 , 10 , 0 , 0],
          layout:'noBorders',
          table:{headerRows: 1 , widths:['100%'],
        body: [
          [{text:'Flexi Office, RAKEZ Business ZONE F-Z RAK , United Arab Emirates ' , style:'headingC'}
        ],] }
        },
        {
          margin: [5 , -4 , 0 , 0],
          layout:'noBorders',
          table:{headerRows: 1 , widths:['100%'],
        body: [
          [{text:'Email: Sohail@fabcot.net' , style:'headingC'}],] }
        },
        {
          layout:'noBorders',
         
          table:{headerRows:1 ,  widths:['18%' , '67%' , '5%' , '12%'],
        body:[ [
          {text: 'Seller :' , margin: [20 , 30 , 0 , 0] , bold:true , style:'common' } , {text: data['sellerName'] , bold:true , margin: [-43 , 30 , 0 , 0] , style:'common'},
        {text:'Bill # :' , margin: [0 , 30 , 0 , 0] , bold:true , style:'common'} ,{text:data['billNumber'] , margin: [0 , 30 , 0 , 0] , style:'common'}
      
      ]]
        }
        },
        {
          
          layout:'noBorders',
          table:{headerRows:1 ,  widths:['18%' , '65%' , '10%' , '15%'],
        body:[ [{text: 'Buyer :' , margin: [20 , 4 , 0 , 0] , bold:true , style:'common'} , {text: data['buyerName'] , margin: [-43 , 4 , 0 , 0] , bold:true  , style:'common'},
        {text:'Bill Date :' , margin: [0 , 4 , 0 , 0] , bold:true , style:'common'} ,{text:data['billDate'] , margin: [-20 , 4 , 0 , 0] , bold:true  , style:'common' }
      
      ]]
        }
        },
        {
         

          layout:'noBorders',
          table:{headerRows:1 ,  widths:['20%' , '80%' ],
        body:[ [{text: 'Fabcot Contract# :' , margin: [20 , 4 , 0 , 0] , bold:true , style:'common'} , {text: data['contractNumber'] , margin: [-12 , 4 , 0 , 0]  , bold:true  , decoration:'underline' , style:'common'}
      
      ]]
        }
        },
        {
         

          layout:'noBorders',
          table:{headerRows:1 ,  widths:['20%' , '80%' ],
        body:[ [{text: 'Supplier Contract# :' , margin: [20 , 4 , 0 , 0] , bold:true , style:'common'} , {text: data['supplierContractNumber'] , margin: [-10 , 4 , 0 , 0]  , bold:true  , decoration:'underline' , style:'common'}
      
      ]]
        }
        },
        {
        

          layout:'noBorders',
          table:{headerRows:1 ,  widths:['20%' , '80%' ],
        body:[ [{text: 'Contract Date :' , margin: [20 , 4 , 0 , 0] , bold:true  , style:'common'} , {text: data['contractDate'] , margin: [-25 , 4 , 0 , 0] , bold:true , decoration:'underline' , style:'common' }
      
      ]]
        }
        },

     
        {
         

          layout:'noBorders',
          table:{headerRows:1 ,  widths:['100%' ],
        body:[ [{text: 'Detail as under' , margin: [20 , 0 , 0 , 0]  , style:'common'} 
      
      ]]
        }
        },

        {
          margin: [0 , 20 , 0 , 0 ],
          table:{
            headerRows : 1,
            widths : [ '10%', '15%' , '15%' , '15%' , '10%' , '15%'  , '10%' , '15%'],
            body:[

              [
                {text:'Sale Invoice#' , style:'tableHeader' }
              ,{text:'Sale Invoice Date' , style:'tableHeader'} ,
              {text:'Article' , style:'tableHeader'} ,

              {text:'Quantity' , style:'tableHeader' }, 
              {text:'Rate'  +'(' + data.currencyName+')' , style:'tableHeader' }, 

              {text:'Inv Amount' +'(' + data.currencyName+')'  , style:'tableHeader'} , 
              {text:'Comm%' , style:'tableHeader'} , 

              {text:'Amount' +'(' + data.currencyName+')' , style:'tableHeader'}],
              
              ...data['contractSaleInvoices'].map(row => (
                [

                  {text: row.saleInvoiceNo , style:'tableHeader2'} ,
                {text:  row.saleInvoiceDateToDisplay , style:'tableHeader2'},
                {text: row.articleName  +' '+ row.construction , style:'tableHeader2'},

                {text:  row.quantity + " " + row.quanityUOM   , style:'tableHeader2'} ,
                {text: row.rate + "/" + row.quanityUOM , style:'tableHeader2'} ,
                
                 {text: "$ " + row.amount
                     , style:'tableHeader2'} ,
                  {text:row.commission+ ' ' + row.commissionUnit  , style:'tableHeader2' }  ,

                  {text: "$ " + row.billAmount , style:'tableHeader2'}]
              ))
            ]
          }
        },

      {
        layout:'noBorders',
        table:{headerRows:1 ,  widths:['10%' , '20%' ,  '25%' , '25%' ],
      body:[ [
        {text: 'Quantity :' , margin:[0 , 30,0,0] , bold:true , style:'common' } ,
       {text: data['quantitySum'] + " " + data['quanityUOM']  ,margin:[-10 , 30,0,0] , bold:true , style:'common' },
        {text: this.loggedInDepartmentName =='Yarn Import'? '':'Invoice Amount' + ' (' + data['currencyName'] +   '):'  , margin:[0,30,0,0]  , bold:true , style:'common' } ,
       {text:  this.loggedInDepartmentName =='Yarn Import'? '':data['amountsum']  , margin:[-35,30,0,0] ,  bold:true , style:'common'}
    
    ]]
      }
      },

        {
          layout:'noBorders',
          table:{headerRows:1 ,  widths:['20%' , '50%' ,  '30%' , '10%' ],
        body:[ [
          {text: 'Amount in Words :' , margin:[0 , 20,0,0] , bold:true , style:'common' } ,
         {text: data['updatedByName'] ,margin:[-30 , 20,0,0] , bold:true , decoration:'underline' , style:'common' },
          {text: 'TOTAL :' , margin:[50,20,0,0]  , bold:true , style:'common' } ,
         {text:   data['currencyName']+ ' ' + data.totalCalculation , bold:true  , margin:[-70,20,0,0] , decoration:'underline'  , style:'common'}
      
      ]]
        }
        },
   

      {
        layout:'noBorders',
        table:{headerRows:1 ,  widths:['100%' ],
      body:[ [
        {text: 'Our Bank detail as under FTT:' , margin:[0 , 20,0,0] , bold:true , style:'common' } ,
      
    ]]
      }
      },
      {
        layout:'noBorders',
        table:{headerRows:1 ,  widths:['20%' , '50%'  ],
      body:[ [
        {text: 'Title of Account :' , margin:[0 , 10,0,0] , bold:true , style:'common' } ,
       {text: data['accountName'] ,margin:[-20 , 10,0,0]  , style:'common' },
     
    
    ]]
      }
      },

      {
        layout:'noBorders',
        table:{headerRows:1 ,  widths:['20%' , '50%'  ],
      body:[ [
        {text: 'Address :' , margin:[0 , 0,0,0] , bold:true , style:'common' } ,
       {text: data['address'] ,margin:[-20 , 0,0,0]  , style:'common' },
     
    
    ]]
      }
      },
      {
        layout:'noBorders',
        table:{headerRows:1 ,  widths:['20%' , '50%'  ],
      body:[ [
        {text: 'Bank Name :' , margin:[0 , 0,0,0] , bold:true , style:'common' } ,
       {text: data['bankName'] ,margin:[-20 , 0,0,0]  , style:'common' },
     
    
    ]]
      }
      },
      {
        layout:'noBorders',
        table:{headerRows:1 ,  widths:['20%' , '50%'  ],
      body:[ [
        {text: 'IBAN Number:' , margin:[0 , 0,0,0] , bold:true , style:'common' } ,
       {text: data['iban'] ,margin:[-20 , 0,0,0]  , style:'common' },
     
    
    ]]
      }
      },
      {
        layout:'noBorders',
        table:{headerRows:1 ,  widths:['20%' , '50%'  ],
      body:[ [
        {text: 'Swift Code :' , margin:[0 , 0,0,0] , bold:true , style:'common' } ,
       {text: data['swiftCode'] ,margin:[-20 , 0,0,0]  , style:'common' },
     
    
    ]]
      }
      },

      {
        layout:'noBorders',
        table:{headerRows:1 ,  widths:['20%' , '50%'  ],
      body:[ [
        {text: 'Bank Address :' , margin:[0 , 0,0,0] , bold:true , style:'common' } ,
       {text: data['bankAddress'] ,margin:[-20 , 0,0,0]  , style:'common' },
     
    
    ]]
      }
      },
      {
        layout:'noBorders',
        table:{headerRows:1 ,  widths:['100%'   ],
      body:[ [
        {text: 'For FABCOT INTERNATIONAL' , margin:[0 , 30,0,0]  , bold: true , style:'common' } ,
    ]]
      }
      },

      index < this.printData.length - 1 ? { text: '', pageBreak: 'after' } : null
        // ... (other content for each page)
      );
    });


    docDefinition.styles = {
      heading: {
        fontSize: 18,
        bold: true, alignment: 'center',
      },
      headingC: {
        fontSize: 9,
        alignment: 'center',
      },
      headingG: {
        fontSize: 12,
        alignment: 'center', bold: true
      },
      common: { fontSize: 9 },
      heading2: {
        fontSize: 9,
        bold: true, alignment: 'center'
      },
      tableHeader: { fillColor: '#f3f3f4', bold: true, margin: 4, alignment: 'center', fontSize: 8 },
      tableHeader2: { margin: 3, alignment: 'center', fontSize: 8 },
    };

    pdfMake.createPdf(docDefinition).print();

  }
  
  // onRowSelected(event) {
  //   var rowCount = event.data.id;
  //   console.log(rowCount)
  // }

  onGridReady(params) {
    this.gridApi = params.api;
    this.data2.toDate = this.dateformater.toModel(this.data2.toDate)
    this.data2.FromDate = this.dateformater.toModel(this.data2.FromDate)
    this.http
      .get(
        `${environment.apiUrl}/api/BillingPayments/GetAllContractBill/`+ this.data2.toDate + '/' + this.data2.FromDate
      )
      .subscribe(res => {
        this.response = res;
       
      if(this.response.success==true)
      {
      this.data=this.response.data;
      this.rows = this.data.objList;
      for(let i = 0 ; i < this.rows.length ; i++){
        this.rows[i].billGeneratedDateTime = this.rows[i].billGeneratedDateTime.slice(0 ,10)
      }
  
      this.dashboardAmnt = this.data.totalBillAmount;
      this.billFilter = [...this.rows];
  
      this.listCount = this.rows.length;
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


  // fetch2() {
  //   this.data2.toDate = this.dateformater.toModel(this.data2.toDate)
  //   this.data2.FromDate = this.dateformater.toModel(this.data2.FromDate)
  //   this.spinner.show();
  //   this.http
  //   .get(`${environment.apiUrl}/api/BillingPayments/GetAllContractBill/`+ this.data2.toDate + '/' + this.data2.FromDate)
  //   .subscribe(res => {
  //     this.response = res;
     
  //   if(this.response.success==true)
  //   {
  //   this.data=this.response.data;
  //   this.rows = this.data.objList;
  //   this.data2.toDate =  this.data2.toDate
  //   this.data2.FromDate =this.data2.FromDate
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
  // }

  onSelect(selecterow) {
    this.selectedids =selecterow;
  }




print(){
  this.selectedids = this.mySelection
  
  for(let i=0; i<this.selectedids.length; i++){
    this.arrayNew[i] = this.selectedids[i];
  }

  if(this.arrayNew.length === 0  || this.selectedids.length === 0  ){
    this.toastr.error("PLease select atleast one bill to generate print" , 'Message')
  }
  else{
     this.item = [...new Set(this.arrayNew)];
localStorage.setItem('bulkPrint', this.item);
this.router.navigate([]).then((result) => {
  window.open('/bulkPrint' , '_blank');
});
}
}


  copyBillsList() {
    this.copyData.push('S. No.'.padEnd(10) + 'Bill For'.padEnd(10) +
    'Bill To'.padEnd(10) +'Bill #'.padEnd(10)+ 'Contract #'.padEnd(10)+
     'Bill Date'.padEnd(10)+ 'No. Sale Inv'.padEnd(10)+ 'Bill Amount'.padEnd(10)+ 'Tax Amount'.padEnd(10)+
     'Due Date \n');
  
  for (let i = 0; i < this.rows.length; i++) {
    let tempData =  this.rows[i].contractId
      +''.padEnd(5)
    + this.rows[i].sellerName
    +''.padEnd(5)
    + this.rows[i].buyerName
    +''.padEnd(5)
    + this.rows[i].billNumber
    +''.padEnd(5)
    + this.rows[i].contractId
    +''.padEnd(5)
    + this.rows[i].billDate
    +''.padEnd(5)
    + this.rows[i].numberOfSaleInvoices
    +''.padEnd(5)
    + this.rows[i].billAmount
    +''.padEnd(5)
    + this.rows[i].taxAmount
    +''.padEnd(5)
    + this.rows[i].dueDate
    +'\n';
    this.copyData.push(tempData);
  }
  this._clipboardService.copy(this.copyData)
  
  Swal.fire({
    // title: GlobalConstants.copySuccess,
    footer: 'Copied' + '\n' + this.listCount + '\n' + 'row/s to clipboard',
    showConfirmButton: false,
    timer: 2000,
  })
  }

  activeBillsExcelFile(){
    const filtered = this.rows.map(row => ({
      SNo: row.contractId,
      BillFor: row.sellerName,
      BillTo: row.buyerName,
      BillNo: row.billNumber,
      ContractNo: row.autoContractNumber,
      ManualNo: row.manualContractNumber,
      BillDate: row.billDate,
      NoOfSaleInv: row.saleInvoiceNo,
      BillAMount: row.billAmount,
      TaxAmount: row.taxAmount,
    }));

    this.service.exportAsExcelFile(filtered, 'Active Bills');

  }
  activeBillsCsvFile(){
    const filtered = this.rows.map(row => ({
      SNo: row.contractId,
      BillFor: row.sellerName,
      BillTo: row.buyerName,
      BillNo: row.billNumber,
      ContractNo: row.autoContractNumber,
      ManualNo: row.manualContractNumber,
      BillDate: row.billDate,
      NoOfSaleInv: row.saleInvoiceNo,
      BillAMount: row.billAmount,
      TaxAmount: row.taxAmount,
      }));
  
    this.service.exportAsCsvFile(filtered, 'Active Bills');
  
  }

  printActiveBillsList() {

    let docDefinition = {
      pageSize: 'A4',
      info: {
        title: 'Active Bills List'
      },
      content: [
        {
        table: {
          headerRows: 1,
          widths: ['100%'],
          body: [
            [{
              style: 'heading',
              text: 'Bill Report'
            }],
          ]

        }
      },

        {
        margin:[-20,40,0,0],
          table: {
            headerRows: 1,
            widths: ['10%' , '20%' , '10%' , '15%' , '15%', '15%' , '15%' , '7%'],
            body: [
              [{ text: 'Bill For', style: 'tableheader', }, { text: 'Bill To', style: 'tableheader' },
              { text: 'Bill#', style: 'tableheader' }, { text: 'Contract#', style: 'tableheader' }
                , { text: 'Bill Date', style: 'tableheader' }, { text: 'No of Sale Invoices', style: 'tableheader' },
              { text: 'Bill Amount', style: 'tableheader' }, { text: 'Tax%', style: 'tableheader' }
              ],
           
              ...this.rows.map((row =>
                [
                  
                  {text: 'Buyer \n Seller'  , style:'tableheader3'} ,
                  {text: row.sellerName+ '\n' + row.buyerName , style:'tableheader3'} ,
                  {text: row.billNumber , style:'tableheader3'} ,
                  {text: row.autoContractNumber +' ('+ row.manualContractNumber +')', style:'tableheader3' } ,

                  {text: row.billGeneratedDateTime , style:'tableheader3'} ,
                  {text: row.saleInvoiceNo , style:'tableheader3' } ,
                  {text: row.billAmount  , style:'tableheader3'} ,
                  {text: row.taxAmount+"%"  , style:'tableheader3'} ,
                  
            
              ]
              ))

            ]
          }
        },
        {text: "Total Amount: " , bold: true , margin:[360 , 20,0,0] ,style:'totalAmount' },
        {text: this.dashboardAmnt , bold: true , margin:[420 , -9,0,0] ,style:'totalAmount' }




      ],
      styles: {
        heading: {
          fillColor: '#f3f3f4',
          fontSize: 18,
          bold: true,
          color: '#4d4b4b',
          alignment: 'center',
          margin: 4
        },
             
        tableheader3: {
          fontSize: 8,
         alignment:'center',
        
         },
         tableheader: {
          fillColor: '#f3f3f4',
          fontSize: 10,
          bold: true,
          color: '#4d4b4b',
          alignment: 'center',

        },
        totalAmount:{
    fontSize:8
        },
         heading3:{fontSize: 6  , color:'#4d4b4b'
        },
      }
    };

    // const win = window.open('', "tempWinForPdf");
    pdfMake.createPdf(docDefinition).print();

  }
  ActiveBillsListPdf() {

    let docDefinition = {
      pageSize: 'A4',
      info: {
        title: 'Active Bills List'
      },
      content: [
        {
        table: {
          headerRows: 1,
          widths: ['100%'],
          body: [
            [{
              style: 'heading',
              text: 'Bill Report'
            }],
          ]

        }
      },

        {
        margin:[-20,40,0,0],
          table: {
            headerRows: 1,
            widths: ['10%' , '20%' , '10%' , '15%' , '15%', '15%' , '15%' , '7%'],
            body: [
              [{ text: 'Bill For', style: 'tableheader', }, { text: 'Bill To', style: 'tableheader' },
              { text: 'Bill#', style: 'tableheader' }, { text: 'Contract#', style: 'tableheader' }
                , { text: 'Bill Date', style: 'tableheader' }, { text: 'No of Sale Invoices', style: 'tableheader' },
              { text: 'Bill Amount', style: 'tableheader' }, { text: 'Tax%', style: 'tableheader' }
              ],
           
              ...this.rows.map((row =>
                [
                  
                  {text: 'Buyer \n Seller'  , style:'tableheader3'} ,
                  {text: row.sellerName+ '\n' + row.buyerName , style:'tableheader3'} ,
                  {text: row.billNumber , style:'tableheader3'} ,
                  {text: row.autoContractNumber+' ('+ row.manualContractNumber +')', style:'tableheader3' } ,

                  {text: row.billGeneratedDateTime , style:'tableheader3'} ,
                  {text: row.saleInvoiceNo , style:'tableheader3' } ,
                  {text: row.billAmount  , style:'tableheader3'} ,
                  {text: row.taxAmount+"%"  , style:'tableheader3'} ,
                  
            
              ]
              ))

            ]
          }
        },
        {text: "Total Amount: " , bold: true , margin:[360 , 20,0,0] ,style:'totalAmount' },
        {text: this.dashboardAmnt , bold: true , margin:[420 , -9,0,0] ,style:'totalAmount' }




      ],
      styles: {
        heading: {
          fillColor: '#f3f3f4',
          fontSize: 18,
          bold: true,
          color: '#4d4b4b',
          alignment: 'center',
          margin: 4
        },
             
        tableheader3: {
          fontSize: 8,
         alignment:'center',
        
         },
         tableheader: {
          fillColor: '#f3f3f4',
          fontSize: 10,
          bold: true,
          color: '#4d4b4b',
          alignment: 'center',

        },
        totalAmount:{
    fontSize:8
        },
         heading3:{fontSize: 6  , color:'#4d4b4b'
        },
      }
    };

    // const win = window.open('', "tempWinForPdf");
    pdfMake.createPdf(docDefinition).download('Active Bills List');

  }



}
