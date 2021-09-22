import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient } from '@angular/common/http';
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
@Component({
  selector: 'app-active-bills',
  templateUrl: './active-bills.component.html',
  styleUrls: ['./active-bills.component.css']
})
export class ActiveBillsComponent implements OnInit {
  selected: any = [];

  columns: any = [];
  response: any = [];
  printResponse: any = [];
  
  copyData: any = [];
  listCount: number;
  rows: any = [{nmbr: 1}];
  dashboardAmnt: any = [];

  data: any = [];
  bulkData: any = [];

  checkboxData: any = [];
  activeData : any =  [];
  SelectionType = SelectionType;
  ids : string;
  billFilter: any = {};
  selectedids: any ={};
image2: any ;
image  :any; 

  url = '/api/BillingPayments/GetAllContractBill'

  constructor(    private service: ServiceService,
    private http: HttpClient,
    private _clipboardService: ClipboardService,
    private router: Router,
    private toastr: ToastrService,
    private modalService: NgbModal,
    private spinner: NgxSpinnerService
    ) { }

    navigatePaymentForm(statusCheck , obj ) {
      this.router.navigate(['/yarn-billing-and-payment/payment-form'], { queryParams: { statusCheck: statusCheck 
         , id:obj.id , contractId:obj.contractId}  });
   };

    navigateOpenBill(obj) {
      this.router.navigate(['/yarn-billing-and-payment/open-bill'] , { queryParams: {id: obj.id} });
    };
    navigateEditContract(obj) {
      this.router.navigate(['/FabCot/active-contract-details'], { queryParams: {id: obj.contractId} });
    };
  ngOnInit(): void {
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
    this.fetch((data) => {
      this.dashboardAmnt = data
      this.rows = data.activeBills;
      this.billFilter = [...this.rows];
      this.listCount = this.rows.length;
    });
  }
  
  search(event) {
    const val = event.target.value.toLowerCase();

    const temp = this.billFilter.filter(function (d) {
      return (
        d.autoContractNumber.toLowerCase().indexOf(val) !== -1 ||
        !val);
    });
    this.rows = temp;
  }


  fetch(cb) {
    this.spinner.show();
    this.http
    .get(`${environment.apiUrl}/api/BillingPayments/GetAllContractBill`)
    .subscribe(res => {
      this.response = res;
     
    if(this.response.success==true)
    {
    this.data=this.response.data;
 

    cb(this.data);
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





  onSelect(selecterow) {

    this.selectedids =selecterow;

    // for(let i=0; i<this.selectedids.selected.length; i++ ){


     
    //   }
      

  }

print(){
  for(let j=0 ; j<this.selectedids.selected.length; j++){
    let docDefinition = {
      pageSize: 'A4',
      pageMargins: [ 20, 30, 30, 10 ],
      pageOrientation: 'letter',
        
            info: {
              title: 'Bill generated'
            },
            content: [
              {
                "image" : this.image2,
               fit : [140 , 140]
            
              },
              {
             
                text:'FABCOT INTERNATIONAL' , style:'heading' , margin: [0,-30,0,0]
             
              },
              {
                margin: [0 , 10 , 0 , 0],
                layout:'noBorders',
                table:{headerRows: 1 , widths:['100%'],
              body: [
                [{text:'Commission Bill' , style:'headingC'}],] }
              },
              {
                layout:'noBorders',
               
                table:{headerRows:1 ,  widths:['18%' , '67%' , '5%' , '12%'],
              body:[ [
                {text: 'Seller :' , margin: [63 , 30 , 0 , 0] , bold:true , style:'common' } , {text: this.selectedids.selected[j].sellerName ,  margin: [0 , 30 , 0 , 0] , style:'common'},
              {text:'Bill # :' , margin: [0 , 30 , 0 , 0] , bold:true , style:'common'} ,{text:this.selectedids.selected[j].billNumber , margin: [0 , 30 , 0 , 0] , style:'common'}
            
            ]]
              }
              },
              {
                
                layout:'noBorders',
                table:{headerRows:1 ,  widths:['18%' , '65%' , '10%' , '15%'],
              body:[ [{text: 'Buyer :' , margin: [63 , 4 , 0 , 0] , bold:true , style:'common'} , {text: this.selectedids.selected[j].buyerName , margin: [0 , 4 , 0 , 0] , bold:true  , style:'common'},
              {text:'Bill Date :' , margin: [0 , 4 , 0 , 0] , bold:true , style:'common'} ,{text:this.selectedids.selected[j].billDate , margin: [-20 , 4 , 0 , 0] , bold:true  , style:'common' }
            
            ]]
              }
              },
              {
               
  
                layout:'noBorders',
                table:{headerRows:1 ,  widths:['20%' , '80%' ],
              body:[ [{text: 'Fabcot Contract# :' , margin: [15 , 4 , 0 , 0] , bold:true , style:'common'} 
              , {
                
                text: this.selectedids.selected[j].autoContractNumber , margin: [-12 , 4 , 0 , 0]  , bold:true  , decoration:'underline' , style:'common'}
            
            ]]
              }
              },
              {
              
  
                layout:'noBorders',
                table:{headerRows:1 ,  widths:['20%' , '80%' ],
              body:[ [{text: 'Contract Date :' , margin: [30 , 4 , 0 , 0] , bold:true  , style:'common'}
               , {text: this.selectedids.selected[j].contractDate , margin: [-12 , 4 , 0 , 0] , bold:true , decoration:'underline' , style:'common' }
            
            ]]
              }
              },
              {
               
  
                layout:'noBorders',
                table:{headerRows:1 ,  widths:['80%' ],
              body:[ [{text: 'This refers to our contract for Weaving dispatches. Please make commission cheque in favour of M/S FABCOT INTERNATIONAL and oblige.' , margin: [20 , 10 , 0 , 0]  , style:'common'} 
            
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
                  widths : ['15%' , '10%' , '15%' , '8.75%' , '9.75%' , '12.75%' , '11.75%' , '6%' , '13%'],
                  body:[
  
                    [
                      {text:'Description' , style:'tableHeader' },
                      {text:'Sale Invoice#' , style:'tableHeader' }
                    ,{text:'Sale Invoice Date' , style:'tableHeader'} ,
                    {text:'Quantity' , style:'tableHeader' }, 
                    {text:'Rate'   , style:'tableHeader' }, 
  
                    {text:'SI Amount'   , style:'tableHeader'} , 
                    {text:'Commission' , style:'tableHeader'} , 
                    {text:'TAX' , style:'tableHeader' }, 
  
                    {text:'Amount'  , style:'tableHeader'}],
                    
                    // ...this.selectedids.selected[j].contractSaleInvoices.map(row => (
                    //   [
                    //     {text: row.description , style:'tableHeader2'} ,
  
                    //     {text: row.saleInvoiceNo , style:'tableHeader2'} ,
                    //   {text:  row.saleInvoiceDateToDisplay , style:'tableHeader2'},
                    //   {text: row.quantity + " " + row.quanityUOM  , style:'tableHeader2'} ,
                    //   {text: row.rate , style:'tableHeader2'} ,
                      
                    //    {text: row.amount
                    //        , style:'tableHeader2'} ,
                    //     {text:row.commission+ '%' , style:'tableHeader2' }  ,
                    //   {text: row.taxAmount , style:'tableHeader2'} ,
  
                    //     {text: row.totalAmount.toFixed(2) , style:'tableHeader2'}]
                    // ))
                  ]
                }
              },
  
            {
              layout:'noBorders',
              table:{headerRows:1 ,  widths:['10%' , '20%' ,  '20%' , '20%' ],
            body:[ [
              {text: 'Quantity :' , margin:[0 , 30,0,0] , bold:true , style:'common' } ,
             {text: this.selectedids.selected[j].quantitySum + ' ' + this.rows['quanityUOM'] ,margin:[-10 , 30,0,0] , bold:true , style:'common' },
              {text: 'SI Amount' + ' (' + this.rows['currencyName'] +   '):'  , margin:[0,30,0,0]  , bold:true , style:'common' } ,
             {text: this.selectedids.selected[j].amountsum  , margin:[-35,30,0,0] ,  bold:true , style:'common'}
          
          ]]
            }
            },
  
            //   {
            //     layout:'noBorders',
            //     table:{headerRows:1 ,  widths:['20%' , '50%' ,  '30%' , '10%' ],
            //   body:[ [
            //     {text: 'Amount in Words :' , margin:[0 , 20,0,0] , bold:true , style:'common' } ,
            //    {text: this.words ,margin:[-30 , 20,0,0] , bold:true , decoration:'underline' , style:'common' },
            //     {text: 'Sub Total :' , margin:[50,20,0,0]  , bold:true , style:'common' } ,
            //    {text:   this.rows['currencyName']+ ' ' + this.totalAmount2.toFixed(2)  , margin:[-60,20,0,0] , decoration:'underline'  , style:'common'}
            
            // ]]
            //   }
            //   },
              {
                layout:'noBorders',
                table:{headerRows:1 ,  widths:['90%' , '10%'  ],
              body:[ [
                {text: 'TAX:' , margin:[455 , 5,0,0] , bold:true , style:'common' } ,
               {text: "0.00" ,margin:[0 , 5,0,0] , decoration:'underline' , style:'common' },
           
            
            ]]
              }
              },
            //   {
            //     layout:'noBorders',
            //     table:{headerRows:1 ,  widths:['90%' , '10%'  ],
            //   body:[ [
            //     {text: 'Total:' , margin:[455 , 5,0,0] , bold:true , style:'common' } ,
            //    {text: this.rows['currencyName']+ ' '+  this.totalAmount2.toFixed(2) ,margin:[-10 , 5,0,0]  , decoration:'underline' , bold:true , style:'common' },
           
            
            // ]]
            //   }
            //   },
              {
                layout:'noBorders',
                table:{headerRows:1 ,  widths:['100%'   ],
              body:[ [
                {text: 'Your prompt action in this regard would be highly appreciated' , margin:[0 , 50,0,0]  , style:'common' } ,
            ]]
              }
              },
              {
                layout:'noBorders',
                table:{headerRows:1 ,  widths:['100%'   ],
              body:[ [
                {text: 'Thanking You' , margin:[0 , 5,0,0]  , style:'common' } ,
            ]]
              }
              },
              {
                layout:'noBorders',
                table:{headerRows:1 ,  widths:['20%' , '40%' ,  '30%' , '10%' ],
              body:[ [
                {text: 'Checked By:' , margin:[0 , 20,0,0] , style:'common' } ,
               {text: ' ------------------------------' ,margin:[-60 , 20,0,0]  , style:'common' },
                {text: 'Aurthorized Signatory:' , margin:[60,20,0,0]  , style:'common' } ,
               {text:   '  --------------------------'  , margin:[-15,20,0,0]  , style:'common'}
            
            ]]
              }
              },
  
            ],
            styles:{
             heading:{fontSize: 18 ,
              bold: true, alignment: 'center',   },
              headingC:{fontSize: 12 ,
                alignment: 'center',   },
              common:{fontSize:9},
              heading2:{fontSize: 9,
              bold: true, alignment: 'center' },
              tableHeader:{ fillColor: '#f3f3f4' , bold:true , margin:4 , alignment: 'center' ,fontSize: 8},
              tableHeader2:{   margin:3 , alignment: 'center' , fontSize: 8},
  
            },
  
    };
    pdfMake.createPdf(docDefinition).print();
  
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
      ContractNo: row.contractId,
      BillDate: row.billDate,
      NoOfSaleInv: row.numberOfSaleInvoices,
      BillAMount: row.billAmount,
      TaxAmount: row.taxAmount,
      DueDate: row.dueDate,
    }));

    this.service.exportAsExcelFile(filtered, 'Active Bills');

  }
  activeBillsCsvFile(){
    const filtered = this.rows.map(row => ({
      SNo: row.contractId,
      BillFor: row.sellerName,
      BillTo: row.buyerName,
      BillNo: row.billNumber,
      ContractNo: row.contractId,
      BillDate: row.billDate,
      NoOfSaleInv: row.numberOfSaleInvoices,
      BillAMount: row.billAmount,
      TaxAmount: row.taxAmount,
      DueDate: row.dueDate, }));
  
    this.service.exportAsCsvFile(filtered, 'Active Bills');
  
  }

  printActiveBillsList() {

    let docDefinition = {
      pageSize: 'A3',
      info: {
        title: 'Active Bills List'
      },
      content: [
        {
          text: 'Active Bills List',
          style: 'heading',

        },
        {
          layout: 'lightHorizontalLines',
          table: {
            headerRows: 1,
            widths: [40, 50, 50, 40, 70 , 60,80,70,70,60],
            body: [
              ['S No.', 'Bill For', 'Bill To', 'Bill#', 'Contract No' ,'Bill Date' , 'No. of Sale Inv','Bill Amount','Tax Amount','Due Date'],
              ...this.rows.map(row => (
                [row.contractId, row.sellerName, row.buyerName,row.billNumber ,
                  row.contractId , row.billDate,row.numberOfSaleInvoices,row.billAmount, row.taxAmount,row.dueDate]
              ))
            ]
           
          }
        }
      ],
      styles: {
        heading: {
          fontSize: 18,
          alignment: 'center',
          margin: [0, 15, 0, 30]
        }
      }
    };

    // const win = window.open('', "tempWinForPdf");
    pdfMake.createPdf(docDefinition).print();

  }
  ActiveBillsListPdf() {

    let docDefinition = {
      pageSize: 'A3',
      info: {
        title: 'Active Bills List'
      },
      content: [
        {
          text: 'Active Bills List',
          style: 'heading',

        },
        {
          layout: 'lightHorizontalLines',
          table: {
            headerRows: 1,
            widths: [40, 50, 50, 40, 70 , 60,80,70,70,60],
            body: [
              ['S No.', 'Bill For', 'Bill To', 'Bill#', 'Contract No' ,'Bill Date' , 'No. of Sale Inv','Bill Amount','Tax Amount','Due Date'],
              ...this.rows.map(row => (
                [row.contractId, row.sellerName, row.buyerName,row.billNumber ,
                  row.contractId , row.billDate,row.numberOfSaleInvoices,row.billAmount, row.taxAmount,row.dueDate]
              ))
            ]
           
          }
        }
      ],
      styles: {
        heading: {
          fontSize: 18,
          alignment: 'center',
          margin: [0, 15, 0, 30]
        }
      }
    };


    pdfMake.createPdf(docDefinition).download('ActiveBills.pdf');
  }



}
