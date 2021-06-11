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
import {EditCommissionComponent} from '../edit-commission/edit-commission.component'
// import { DateFilterComponent } from '../date-filter/date-filter.component';
import {NgxSpinnerService} from 'ngx-spinner'

@Component({
  selector: 'app-commission-payment',
  templateUrl: './commission-payment.component.html',
  styleUrls: ['./commission-payment.component.css']
})
export class CommissionPaymentComponent implements OnInit {
  rows: any = [];
  columns: any = [];
  response: any = {};
  data: any = [];
 paymentFilter : any = []
 count : any;
 copyData : any = [];
// statusCheck:any;
constructor(    private service: ServiceService,
  private http: HttpClient,
  private _clipboardService: ClipboardService,
  private router: Router,
  private toastr: ToastrService,
  private modalService: NgbModal,
  private spinner: NgxSpinnerService
  ) { }

  ngOnInit(): void {
    this.fetch((data=>{
      this.paymentFilter = [...data];

      this.rows = data;
      this.count = this.rows.length;
    }))
  }
  addNewCommsion(statusCheck ) {
    // this.statusCheck = check;
    // this.router.navigateByUrl('/new-commission');
    this.router.navigate(['/yarn-billing-and-payment/new-commission'], { queryParams: { statusCheck: statusCheck  }  });

  };
  search(event) {
    const val = event.target.value.toLowerCase();
    const temp = this.paymentFilter.filter(function (d) {
      return (d.sellerName.toLowerCase().indexOf(val) !== -1 ||  
      d.payNo.toLowerCase().indexOf(val) !== -1 ||  
      !val);
    });
    this.rows = temp;
  }
  // dateFilterForm() {
    
  //   const modalRef = this.modalService.open(DateFilterComponent, { centered: true });
  // }
  navigateEditForm(rows) {
    const modalRef = this.modalService.open(EditCommissionComponent , { centered: true });
    modalRef.componentInstance.Editid = rows.id;

    modalRef.result.then((data) => {   
     if (data == true) {
         this.fetch((data=>{
           this.rows = data;
         }))
      }
    }, (reason) => {
      // on dismiss
    });
  }
  fetch(cb) {
    
    this.http
    .get(`${environment.apiUrl}/api/BillingPayments/GetAllBillingCommissionPayment`)
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
      text: GlobalConstants.deleteMessage ,
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
     this.spinner.show();
        this.http.delete(`${environment.apiUrl}/api/BillingPayments/DeleteBillingCommissionPayment/` + row.id )
          .subscribe(
            res => {
              this.response = res;
              if (this.response.success == true) {
                this.toastr.error(this.response.message, 'Message.');
                this.fetch((data=>{
                  this.rows = data;
     this.spinner.hide();

                }))
  
              }
              else {
                this.toastr.error(this.response.message, 'Message.');
     this.spinner.hide();

              }
  
            }, err => {
              if (err.status == 400) {
                this.toastr.error(this.response.message, 'Message.');
     this.spinner.hide();

              }
            });
  
      }
    })
  
  }
  commCsvFile(){
    const filtered = this.rows.map(row => ({
      ComPayID: row.id,
      // BillFor: row.sellerName,
      Seller: row.sellerName,
      payDate: row.paymentDate,
      PayNo: row.payNo,
      Amount: row.amount,
      payMode: row.paymentMode,
      FromBankAccount: row.fromBankAccountName,
      ToBankAccount: row.toBankAccountName,
      DepositeDate: row.depositDate, }));
  
    this.service.exportAsCsvFile(filtered, 'Commission Payment');
  
  }

  copyCommList() {
    let count1 = this.rows.map(x => x.sellerName.length);
    let max1 = count1.reduce((a, b) => Math.max(a, b));
    let count3 = this.rows.map(x => x.paymentDate.length);
    let max3 = count3.reduce((a, b) => Math.max(a, b));
    let count4 = this.rows.map(x => x.payNo.length);
    let max4 = count4.reduce((a, b) => Math.max(a, b));
    max1 = max1 + 10;
    max3 = max3 + 10;
    max4 = max4 + 10;

    // ................................................ headings replace yours............................

    this.copyData.push('Comm PayId' + 'Seller Name'.padEnd(max1) + 'Payment Date'.padEnd(max3) + 'Pay No \n'.padEnd(max4));
    // ................................................ headings............................

    // ................................................ coloum data...........replace your coloum names.................
    for (let i = 0; i < this.rows.length; i++) {
      let tempData = this.rows[i].id + this.rows[i].sellerName.padEnd(max1) + this.rows[i].paymentDate.padEnd(max3)
        + this.rows[i].payNo;
      this.copyData.push(tempData);
    }
    this._clipboardService.copy(this.copyData)
    // ............................row.active == true ? "Active" : "In-Active".................... coloum this.data............................

    Swal.fire({
      title: GlobalConstants.copySuccess,
      footer: 'Copied' + '\n' + this.count + '\n' + 'rows to clipboard',
      showConfirmButton: false,
      timer: 2000,
    })
  }
}
