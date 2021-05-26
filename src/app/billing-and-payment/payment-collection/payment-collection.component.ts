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
      this.rows = data;
      this.listCount = this.rows.length;
    });

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

}
