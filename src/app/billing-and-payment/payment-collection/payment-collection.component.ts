import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ServiceService } from 'src/app/shared/service.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-payment-collection',
  templateUrl: './payment-collection.component.html',
  styleUrls: ['./payment-collection.component.css']
})
export class PaymentCollectionComponent implements OnInit {

  rows: any = {};
  data: any = {};

response: any = {};

  columns: any = {};
  url = '/api/BillingPayments/GetAllBillPayment'
  constructor(    private service: ServiceService,
    private http: HttpClient,
    private router: Router,
    private toastr: ToastrService,
    private modalService: NgbModal
    ) { }
  navigatePaymentForm(statusCheck  , obj) {
    this.router.navigate(['/billing-and-payment/payment-form'], { queryParams: { statusCheck: statusCheck  , id:obj.id }  });
 };
  ngOnInit(): void {
    this.fetch((data) => {
      this.rows = data;
      console.log(this.rows)
      // this.listCount= this.rows.length;
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
}
