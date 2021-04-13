import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-commission-payment',
  templateUrl: './commission-payment.component.html',
  styleUrls: ['./commission-payment.component.css']
})
export class CommissionPaymentComponent implements OnInit {

  rows: any = [];
  columns: any = [];

  constructor(  private router: Router,) { }

  ngOnInit(): void {
  }
  addNewCommsion() {
    this.router.navigateByUrl('/new-commission');
  };
}
