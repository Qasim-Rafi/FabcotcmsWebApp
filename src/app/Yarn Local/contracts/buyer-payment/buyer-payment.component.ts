import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ClipboardService } from 'ngx-clipboard';
import { ToastrService } from 'ngx-toastr';
import { GlobalConstants } from 'src/app/Common/global-constants';
import { ServiceService } from 'src/app/shared/service.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { EditBuyerPaymentComponent } from '../Modals/edit-buyer-payment/edit-buyer-payment.component';
import { DatatableComponent, id } from '@swimlane/ngx-datatable';
import { NgxSpinnerService } from 'ngx-spinner';



@Component({
  selector: 'app-buyer-payment',
  templateUrl: './buyer-payment.component.html',
  styleUrls: ['./buyer-payment.component.css']
})
export class BuyerPaymentComponent implements OnInit {

  response: any;
  rows: any = [];
  temp: any = [];
  columns: any = [];
  data: any = {};
  @ViewChild('myTable') table: DatatableComponent;
  buyerpaymentFilter: any = {};
  buyerpaymentcount: number;


  constructor(private http: HttpClient,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private router: Router,
    private service: ServiceService,
    private modalService: NgbModal,) { }

  ngOnInit(): void {
    this.fetch((data) => {
      this.buyerpaymentFilter = [...data];
this.temp=data
      this.rows = data;
      this.buyerpaymentcount = this.rows.length;
    });
  }
 

  navigateBuyerPaymentForm() {
    this.router.navigate(['/FabCot/buyer-payment-form']);
 };



  editPayment(row) {
    const modalRef = this.modalService.open(EditBuyerPaymentComponent, { centered: true });
    modalRef.componentInstance.paymentId = row.id;
    modalRef.result.then((data) => {
      // on close
      if (data == true) {
       this.data = data;

      }
    }, (reason) => {
      // on dismiss
    });
  }
  search(event) {
    const val = event.target.value.toLowerCase();
    // filter our data
    const temp = this.temp.filter(function (d) {
      return (
        d.buyerName.toLowerCase().indexOf(val) !== -1 ||
        d.sellerName.toLowerCase().indexOf(val) !== -1 ||
        // d.invoiceNumber.indexOf(val) !== -1 ||
        // d.chequeNo.toString().indexOf(val) !== -1 ||

         !val);
    });
    this.rows = temp;
  }

  fetch(cb) {
    // this.spinner.show();
    this.http
    .get(`${environment.apiUrl}/api/YarnContracts/GetAllBuyerToSellerPayment` )
    .subscribe(res => {
      this.response = res;
     
    if(this.response.success==true)
    {
    this.data =this.response.data;

    cb(this.data);
    // this.spinner.hide();
    }
    else{
      this.toastr.error(this.response.message, 'Message.');
    // this.spinner.hide();
    }
      // this.spinner.hide();
    }, err => {
      if ( err.status == 400) {
 this.toastr.error(err.error.message, 'Message.');
// this.spinner.hide();      
}
    //  this.spinner.hide();
    });
  }


  deleteBuyer(row) {
    Swal.fire({
      title: GlobalConstants.deleteTitle, //'Are you sure?',
      text: GlobalConstants.deleteMessage + 'this Payment Receipt ' ,
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
        // /api​/YarnContracts​/DeleteBuyerToSellerPayment​/
        this.http.delete(`${environment.apiUrl}/api/YarnContracts/DeleteBuyerToSellerPayment/` + row.id )
          .subscribe(
            res => {
              this.response = res;
              if (this.response.success == true) {
                this.toastr.error(this.response.message, 'Message.');
                this.fetch((data) => {
                  this.rows = data;
                });
  this.spinner.hide();
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
   

}
