import { Component, OnInit, ViewChild } from '@angular/core';
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
import { process } from '@progress/kendo-data-query';
import { DataBindingDirective } from '@progress/kendo-angular-grid';

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
status  ;
gridApi :  any;
objList : any;
 defaultColDef : any;
 rowSelection : any ;
loggedInDepartmentName: string;
public mySelection: string[] = [];
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
    this.rowSelection = 'multiple';}

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
                    field: 'buyerName',
                    operator: 'contains',
                    value: inputValue
                },
                {
                    field: 'sellerName',
                    operator: 'contains',
                    value: inputValue
                },
                {
                    field: 'budget',
                    operator: 'contains',
                    value: inputValue
                },
                {
                    field: 'phone',
                    operator: 'contains',
                    value: inputValue
                },
                {
                    field: 'address',
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
    let selectedNodes = this.gridApi.getSelectedNodes();
    let selectedData = selectedNodes.map(node => node.data.id);
    // alert(`Selected Nodes:\n${JSON.stringify(selectedData)}`);
    console.log(selectedData)
    if(selectedData.length === 0 ){
      this.toastr.error("PLease select atleast one bill to generate print" , 'Message')
    }
    else{
       this.item = [...new Set(selectedData)];
  localStorage.setItem('bulkPrint', this.item);
  this.router.navigate([]).then((result) => {
    window.open('/bulkPrint' , '_blank');
  });
  }

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
      ContractNo: row.contractId,
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
      ContractNo: row.contractId,
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
                  {text: row.autoContractNumber, style:'tableheader3' } ,

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
                  {text: row.autoContractNumber, style:'tableheader3' } ,

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
