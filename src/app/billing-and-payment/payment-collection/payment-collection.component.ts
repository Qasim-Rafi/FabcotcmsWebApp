import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ClipboardService } from 'ngx-clipboard';
import { ToastrService } from 'ngx-toastr';
import { GlobalConstants } from 'src/app/Common/global-constants';
import { ServiceService } from 'src/app/shared/service.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import pdfMake from "pdfmake/build/pdfmake";

@Component({
  selector: 'app-payment-collection',
  templateUrl: './payment-collection.component.html',
  styleUrls: ['./payment-collection.component.css']
})
export class PaymentCollectionComponent implements OnInit {

  rows: any = {};
  data: any = {};
  copyData: any = [];
response: any = {};
listCount: number;
paymentFilter: any = {};

  columns: any = {};
  url = '/api/BillingPayments/GetAllBillPayment'
  constructor(    private service: ServiceService,
    private http: HttpClient,
    private _clipboardService: ClipboardService,
    private router: Router,
    private toastr: ToastrService,
    private modalService: NgbModal
    ) { }
  navigatePaymentForm(statusCheck  , obj) {
    this.router.navigate(['/billing-and-payment/payment-form'], { queryParams: { statusCheck: statusCheck  , 
      id:obj.id , contractId:obj.contractId }  });
 };
  ngOnInit(): void {
    this.fetch((data) => {
      this.paymentFilter = [...data];

      this.rows = data;
      this.listCount = this.rows.length;
    });

  }
  search(event) {
    const val = event.target.value.toLowerCase();
    const temp = this.paymentFilter.filter(function (d) {
      return (d.receiptNumber.toLowerCase().indexOf(val) !== -1 ||
        d.billNumber.toLowerCase().indexOf(val) !== -1 || d.contractNumber.toLowerCase().indexOf(val) !== -1 || !val);
    });
    this.rows = temp;
  }
  fetch(cb) {
    
    this.http
    .get(`${environment.apiUrl}/api/BillingPayments/GetAllBillPayment`)
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

  deletePayment(row) {
    Swal.fire({
      title: GlobalConstants.deleteTitle, //'Are you sure?',
      text: GlobalConstants.deleteMessage + 'Payment Receipt# ' + '"' + row.receiptNumber + '"',
      icon: 'error',
      showCancelButton: true,
      confirmButtonColor: '#ed5565',
      cancelButtonColor: '#dae0e5',
      cancelButtonText: 'No',
      confirmButtonText: 'Yes',
      reverseButtons: true,
      position: 'top',
    }).then((result) => {
      if (result.isConfirmed) {
  
        this.http.delete(`${environment.apiUrl}/api/BillingPayments/DeleteBillPayment/` + row.id )
          .subscribe(
            res => {
              this.response = res;
              if (this.response.success == true) {
                this.toastr.error(this.response.message, 'Message.');
                this.fetch((data) => {
                  this.rows = data;
                });
  
              }
              else {
                this.toastr.error(this.response.message, 'Message.');
              }
  
            }, err => {
              if (err.status == 400) {
                this.toastr.error(this.response.message, 'Message.');
              }
            });
  
      }
    })
  
  }
  

  copyPaymentList() {
    this.copyData.push('S:Seller/B:Buyer'.padEnd(10) + 'Receipt'.padEnd(10) +
    'Bill'.padEnd(10) +'Contract'.padEnd(10)+ 'Sale Invoice'.padEnd(10)+ 'Bill Date'.padEnd(10)+ 'Payment On'.padEnd(10)+ 'Net Amount'.padEnd(10)+ 'Payment Mode \n');
  
  for (let i = 0; i < this.rows.length; i++) {
    let tempData =  this.rows[i].selerName
    +this.rows[i].buyerName
      +''.padEnd(5)
    + this.rows[i].receiptNumber
    +''.padEnd(5)
    + this.rows[i].billNumber
    +''.padEnd(5)
    + this.rows[i].contractNumber
    +''.padEnd(5)
    + this.rows[i].saleInvoiceId
    +''.padEnd(5)
    + this.rows[i].paymentDate
    +''.padEnd(5)
    + this.rows[i].paymentMode
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

  paymentExcelFile(){
    const filtered = this.rows.map(row => ({
      SNo: row.contractId,
      Seller:row.sellerName ,
      Buyer: row.buyerName,
      ReceiptNo: row.receiptNumber,
      BillNo: row.billNumber,
      ContractNo: row.contractNumber,
      SaleInvoice: row.saleInvoiceNo,
      PaymentOn: row.paymentDate,
      NetAmount: row.netAmount,
      PaymentMode: row.paymentMode
      
    }));

    this.service.exportAsExcelFile(filtered, 'Payment List');

  }
  paymentCsvFile(){
    const filtered = this.rows.map(row => ({
      SNo: row.contractId,
      Seller:row.sellerName ,
      Buyer: row.buyerName,
      ReceiptNo: row.receiptNumber,
      BillNo: row.billNumber,
      ContractNo: row.contractNumber,
      SaleInvoice: row.saleInvoiceNo,
      PaymentOn: row.paymentDate,
      NetAmount: row.netAmount,
      PaymentMode: row.paymentMode
      
    }));

    this.service.exportAsCsvFile(filtered, 'Payment List');

  }

  printActiveBillsList() {

    let docDefinition = {
      pageSize: 'A3',
      info: {
        title: 'Payment List'
      },
      content: [
        {
          text: 'Payment List',
          style: 'heading',

        },
        {
          layout: 'lightHorizontalLines',
          table: {
            headerRows: 1,
            widths: [40, 50, 50, 40, 70 , 60,80,70,70,60],
            body: [
              ['S No.', 'Seller Name', 'Buyer Name','Receipt Number' , 'Bill#',
               'Contract No' ,'Sale Invoice' , 'Payment On','Net Amount','Payment Mode'],
              ...this.rows.map(row => (
                [row.contractId, row.sellerName, row.buyerName, row.receiptNumber ,row.billNumber ,
                  row.contractNumber , row.saleInvoiceNo,row.paymentDate,row.netAmount, row.paymentMode]
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
  printActiveBillspdf() {

    let docDefinition = {
      pageSize: 'A3',
      info: {
        title: 'Payment List'
      },
      content: [
        {
          text: 'Payment List',
          style: 'heading',

        },
        {
          layout: 'lightHorizontalLines',
          table: {
            headerRows: 1,
            widths: [40, 50, 50, 40, 70 , 60,80,70,70,60],
            body: [
              ['S No.', 'Seller Name', 'Buyer Name','Receipt Number' , 'Bill#',
               'Contract No' ,'Sale Invoice' , 'Payment On','Net Amount','Payment Mode'],
              ...this.rows.map(row => (
                [row.contractId, row.sellerName, row.buyerName, row.receiptNumber ,row.billNumber ,
                  row.contractNumber , row.saleInvoiceNo,row.paymentDate,row.netAmount, row.paymentMode]
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
    pdfMake.createPdf(docDefinition).download('Payment List');

  }

}
