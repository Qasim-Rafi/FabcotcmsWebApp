import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ClipboardService } from 'ngx-clipboard';
import { ToastrService } from 'ngx-toastr';
import { ServiceService } from 'src/app/shared/service.service';
import { environment } from 'src/environments/environment';
import { EditBuyerPaymentComponent } from '../Modals/edit-buyer-payment/edit-buyer-payment.component';



@Component({
  selector: 'app-buyer-payment',
  templateUrl: './buyer-payment.component.html',
  styleUrls: ['./buyer-payment.component.css']
})
export class BuyerPaymentComponent implements OnInit {

  response: any;
  rows: any = [];
  columns: any = [];
  buyerData: any = {};


  constructor(private http: HttpClient,
    private toastr: ToastrService,
    private router: Router,
    private service: ServiceService,
    private modalService: NgbModal,) { }

  ngOnInit(): void {
    this.fetch((data)=>
    {
      this.rows = data
    });
  }
 

  navigateBuyerPaymentForm() {
    this.router.navigate(['/yarn-local/buyer-payment-form']);
 };



  editPayment(row) {
    const modalRef = this.modalService.open(EditBuyerPaymentComponent, { centered: true });
    modalRef.componentInstance.paymentId = row.id;
    modalRef.result.then((data) => {
      // on close
      if (data == true) {
       this.buyerData = data;

      }
    }, (reason) => {
      // on dismiss
    });
  }

  fetch(cb) {
    
    this.http
    .get(`${environment.apiUrl}/api/YarnContracts/GetAllBuyerToSellerPayment` )
    .subscribe(res => {
      this.response = res;
     
    if(this.response.success==true)
    {
    this.buyerData =this.response.data;

    cb(this.buyerData);
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




}
