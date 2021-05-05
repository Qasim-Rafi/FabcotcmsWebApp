import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { id } from '@swimlane/ngx-datatable';
import { data } from 'jquery';
import { ToastrService } from 'ngx-toastr';
import { ServiceService } from 'src/app/shared/service.service';

@Component({
  selector: 'app-payment-collection',
  templateUrl: './payment-collection.component.html',
  styleUrls: ['./payment-collection.component.css']
})
export class PaymentCollectionComponent implements OnInit {

  rows: any = [  {name : ["1","2","3","4"]  } ];
  columns: any = [];
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
this.service.fetch((data)=>{

} , this.url)

  }

}
