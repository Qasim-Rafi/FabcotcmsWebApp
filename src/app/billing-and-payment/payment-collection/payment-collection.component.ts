import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-payment-collection',
  templateUrl: './payment-collection.component.html',
  styleUrls: ['./payment-collection.component.css']
})
export class PaymentCollectionComponent implements OnInit {

  rows: any = [  {name : ["1","2","3","4"]  } ];
  columns: any = [];

 
    constructor(    private router: Router,) { }
  navigatePaymentForm(statusCheck ) {
    this.router.navigate(['/billing-and-payment/payment-form'], { queryParams: { statusCheck: statusCheck  }  });
 };
  ngOnInit(): void {
  }

}
