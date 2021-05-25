import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient } from '@angular/common/http';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { ToastrService } from 'ngx-toastr';
import { ServiceService } from 'src/app/shared/service.service';
import { environment } from 'src/environments/environment';
import { GlobalConstants } from '../../Common/global-constants';
import { DateFilterComponent } from '../date-filter/date-filter.component';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { ClipboardService } from 'ngx-clipboard';
import pdfMake from "pdfmake/build/pdfmake";
import { ColumnMode, SelectionType } from '@swimlane/ngx-datatable';

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
  rows: any = [];
  data: any = [];
  bulkData: any = [];

  checkboxData: any = [];
  activeData : any =  [];
  SelectionType = SelectionType;
  ids : string;
  billFilter: any = {};

  url = '/api/BillingPayments/GetAllContractBill'
  constructor(    private service: ServiceService,
    private http: HttpClient,
    private _clipboardService: ClipboardService,
    private router: Router,
    private toastr: ToastrService,
    private modalService: NgbModal
    ) { }

    navigatePaymentForm(statusCheck , obj ) {
      this.router.navigate(['/billing-and-payment/payment-form'], { queryParams: { statusCheck: statusCheck  , id:obj.id }  });
   };
    navigateOpenBill(obj) {
      this.router.navigate(['/billing-and-payment/open-bill'], { queryParams: {id: obj.id} });
    };
 
  ngOnInit(): void {
    this.fetch((data) => {
      // this.billFilter = [...data];
      
      this.rows = data;
      this.listCount = this.rows.length;
    });
    // this.fetch((data) => {
    //   this.bulkData = data;
    // });
    // this.getData()
  }

  search(event) {
    const val = event.target.value.toLowerCase();
    const temp = this.billFilter.filter(function (d) {
      return (d.autoContractNumber.toLowerCase().indexOf(val) !== -1 ||
        d.sellerName.toLowerCase().indexOf(val) !== -1 || d.buyerName.toLowerCase().indexOf(val) !== -1 || !val);
    });
    this.rows = temp;
  }

  fetch(cb) {
    
    this.http
    .get(`${environment.apiUrl}/api/BillingPayments/GetAllContractBill`)
    .subscribe(res => {
      this.response = res;
     
    if(this.response.success==true)
    {
    this.data =this.response.data;
    cb(this.data);
    }
    else{
      this.toastr.error(this.response.message, 'Message.');
    }
      // this.spinner.hide();
    }, err => {
      if ( err.status == 400) {
  this.toastr.error(err.error.message, 'Message.');
      }
    //  this.spinner.hide();
    });
  }
  onActivate(event) {
    // console.log('Activated Event', event );
      if (event.type === 'click' ){
        this.checkboxData.push(event.row.id);
             console.log(this.checkboxData)                    
      }      
    //   for(let i=0; i<this.checkboxData.length; i++ )
    // {
    
    //     this.activeData[i] = this.checkboxData[i].id;
    //     this.activeData[i] = this.activeData.join(',')
    //     this.activeData[i] = this.activeData.toString()
     
    //   }    
  
}

onSelect(row) {
  console.log(row)
}



  dateFilterForm() {
    
    const modalRef = this.modalService.open(DateFilterComponent, { centered: true });
  
   
  }
  // getData(){
  //   this.ids = this.checkboxData.toString(); 

  //   this.http.get(`${environment.apiUrl}/api/BillingPayments/BulkPrint/` + this.ids  )
  //   .subscribe(res => {
  //     this.printResponse = res;
     
  //   if(this.printResponse.success==true)
  //   {
  //   this.bulkData =this.printResponse.data;
  
  //   }
  //   else{
  //     this.toastr.error(this.printResponse.message, 'Message.');
  //   }
  //   }, err => {
  //     if ( err.status == 400) {
  // this.toastr.error(err.error.message, 'Message.');
  //     }
  //   });
  // }

//   bulkPrint() {
// this.getData()


//     let docDefinition = {
//       pageSize: 'A4',
//       info: {
//         title: 'Active Bills List'
//       },
//       content: [
//         {
//           text: 'Fabcot International FZE ',
//           style: 'heading',

//         },
//        {
//          text: 'Seller:'
//        },
//        {
//         text: this.bulkData.map((row=>[row.buyerName]))
//       },
//        {
//         text: 'Buyer'
//       },
//       {
//         text: 'Fabcot Contract Number'
//       },
//       {
//         text: 'Contract Date'
//       },
//       {
//         text: 'Bill No.'
//       },
//       {
//         text: 'Bill Date:'
//       }
        
//       ],
//       styles: {
//         heading: {
//           fontSize: 18,
//           alignment: 'center',
//           margin: [0, 15, 0, 30]
//         }
//       }
//     };

    // const win = window.open('', "tempWinForPdf");
  //   pdfMake.createPdf(docDefinition).print();

  // }



  print() {
    this.ids = this.checkboxData.toString(); 

    this.http.get(`${environment.apiUrl}/api/BillingPayments/BulkPrint/` + this.ids  )
    .subscribe(res => {
      
      this.printResponse = res;
     
    if(this.printResponse.success==true)
    {
    this.bulkData =this.printResponse.data;
  
    }
    else{
      this.toastr.error(this.printResponse.message, 'Message.');
    }
    }, err => {
      if ( err.status == 400) {
  this.toastr.error(err.error.message, 'Message.');
      }
    });

    let docDefinition = {
      pageSize: 'A4',     
      info: {
        title: 'Active Bills List'
      },
      content: [
        {
          text: 'Fabcot International FZE ',
          style: 'heading',

        },
        {
    text: 'Flexi Office ,RAKEZ Business ZONE F-Z RAK , United Arab Emirates.',
    style: 'heading2'
       
  },
       {text: 'Seller:'  },
       { text: this.bulkData['sellerName'], style:'text1'},
      {  text:'Bill No.:' , style:'text2'},
      { text: this.bulkData['billNumber'], style:'text3'},
      {  text:'Bill Date:' , style:'text4' },
      { text: this.bulkData['billDate'], style:'text5'},
       {  text: 'Buyer:'  , style:'text6'},
       { text: this.bulkData['buyerName'], style:'text1'},
      {  text: 'Fabcot Contract Number :' , style:'text9' },
      { text: this.bulkData['contractNumber'], style:'text10'},
      {text: 'Contract Date :' , style:'text11'},
      { text: this.bulkData['contractDate'], style:'text12'},
      {text: 'Article :' , },
      { text: this.bulkData['contractArticleName'], style:'text13'},
      {
        margin: [0 , 10 , 0 , 0],

        table:{

          headerRows:1,
          widths: [75, 90, 130, 70, 120],

          body:[
            ['SaleInvoice #', 'SaleInvoice Date', 'Invoice Amount(PKR)', 'Commission', 'Total Amount(PKR)'],
        // ...this.rows['contractSaleInvoices'].map((row=>
        //   [row.saleInvoiceNo]
        //   ))
          ]
        }
      },
      {  text: 'Sub Total :' , style:'text14' },
      { text: this.bulkData['invoiceSubTotalAmount'], style:'text15'},
      {text: 'Tax :' , style:'text16'},
      { text: this.bulkData['invoiceTaxAmount'], style:'text15'},
      {text: 'Total:' , style:'text18' },
      { text: this.bulkData['invoiceTotalAmount']},
         ],
      styles: {
        heading: {
          fontSize: 18,
          alignment: 'center',
          margin: [0, 0, 0, 0]
        },
        
          heading2:{
                fontSize: 10,
                alignment: 'center',
                // [ left , up , right  , down]
                margin: [0 , -3 , 0 , 25]

          },
          text1 : {
            margin:[38 ,-15, 0 ,0 ]
          },
          text2 : {margin:[380 ,0, 0 ,0 ]},
          text3 : {margin:[425 ,-15, 0 ,0 ]},
          text4 : {margin:[380 ,0, 0 ,0 ]},
          text5 : {margin:[430 , -15, 0 ,0 ]},
          text6 : {margin:[0 , -25, 0 ,0 ]},
          text10 : {margin:[140 , -15, 0 ,0 ]},
          text12 : {margin:[90 , -15, 0 ,0 ]},
          text13 : {margin:[50 , -15, 0 ,0 ]},
          text14 : {margin:[380 , 20, 0 ,0 ]},
          text15 : {margin:[440 , -13, 0 ,0 ]},
          text16 : {margin:[400 , 0, 0 ,0 ]},
          text18 : {margin:[300 , 0, 0 ,0 ]},        
      }
    };

    // const win = window.open('', "tempWinForPdf");
    pdfMake.createPdf(docDefinition).print();

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
    title: GlobalConstants.copySuccess,
    footer: 'Copied' + '\n' + this.listCount + '\n' + 'row/s to clipboard',
    showConfirmButton: false,
    timer: 2000,
  })
  }

  activeBillsExcelFile(){
    const filtered = this.rows.activeBills.map(row => ({
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
    const filtered = this.rows.activeBills.map(row => ({
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
              ...this.rows.activeBills.map(row => (
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
              ...this.rows.activeBills.map(row => (
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
