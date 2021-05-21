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

@Component({
  selector: 'app-active-bills',
  templateUrl: './active-bills.component.html',
  styleUrls: ['./active-bills.component.css']
})
export class ActiveBillsComponent implements OnInit {

  // rows: any = [  {name : ["1","2","3","4"]  } ];
  columns: any = [];
  response: any = [];
  copyData: any = [];
  listCount: number;
  rows: any = [];
  data: any = [];


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
      this.rows = data;
      this.listCount = this.rows.length;
    });
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
  dateFilterForm() {
    
    const modalRef = this.modalService.open(DateFilterComponent, { centered: true });
  
   
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
