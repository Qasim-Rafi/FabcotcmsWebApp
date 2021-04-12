import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-commission-payment',
  templateUrl: './commission-payment.component.html',
  styleUrls: ['./commission-payment.component.css']
})
export class CommissionPaymentComponent implements OnInit {

  rows: any = [];
  columns: any = [];

  constructor() { }

  ngOnInit(): void {
  }

}
