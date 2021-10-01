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
import { NgxNumToWordsService, SUPPORTED_LANGUAGE } from 'ngx-num-to-words';
import { Dateformater } from 'src/app/shared/dateformater';

@Component({
  selector: 'app-active-bills',
  templateUrl: './active-bills.component.html',
  styleUrls: ['./active-bills.component.css']
})
export class ActiveBillsComponent implements OnInit {
  dateformater: Dateformater = new Dateformater();  

  selected: any = [];

  columns: any = [];
  response: any = [];
  printResponse: any = [];
  
  copyData: any = [];
  listCount: number;
  // rows: any = [{nmbr: 1}];
  rows: any = [];
  dashboardAmnt: any = [];

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
status  ;
  url = '/api/BillingPayments/GetAllContractBill'
  lang : SUPPORTED_LANGUAGE = 'en';
  constructor(    private service: ServiceService,
    private http: HttpClient,
    private _clipboardService: ClipboardService,
    private router: Router,
    private toastr: ToastrService,
    private modalService: NgbModal,
    private spinner: NgxSpinnerService,
    private ngxNumToWordsService: NgxNumToWordsService

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
    this.dashboardAmnt = this.data
    this.rows = this.data.objList;
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
  
  for(let i=0; i<this.selectedids.selected.length; i++){
    this.arrayNew[i] = this.selectedids.selected[i].id;
  }

  if(this.arrayNew.length === 0  || this.selectedids.selected.length === 0  ){
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
      ContractNo: row.contractId,
      BillDate: row.billDate,
      NoOfSaleInv: row.numberOfSaleInvoices,
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
      ContractNo: row.contractId,
      BillDate: row.billDate,
      NoOfSaleInv: row.numberOfSaleInvoices,
      BillAMount: row.billAmount,
      TaxAmount: row.taxAmount,
      }));
  
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
            widths: [40, 50, 50, 40, 70 , 60,80,70,70],
            body: [
              ['S No.', 'Bill For', 'Bill To', 'Bill#', 'Contract No' ,'Bill Date' , 'No. of Sale Inv','Bill Amount','Tax Amount'],
              ...this.rows.map(row => (
                [row.contractId, row.sellerName, row.buyerName,row.billNumber ,
                  row.contractId , row.billDate,row.numberOfSaleInvoices,row.billAmount, row.taxAmount]
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
            widths: [40, 50, 50, 40, 70 , 60,80,70,70],
            body: [
              ['S No.', 'Bill For', 'Bill To', 'Bill#', 'Contract No' ,'Bill Date' , 'No. of Sale Inv','Bill Amount','Tax Amount'],
              ...this.rows.map(row => (
                [row.contractId, row.sellerName, row.buyerName,row.billNumber ,
                  row.contractId , row.billDate,row.numberOfSaleInvoices,row.billAmount, row.taxAmount]
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
