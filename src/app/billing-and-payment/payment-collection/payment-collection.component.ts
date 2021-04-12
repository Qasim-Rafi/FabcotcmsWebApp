import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-payment-collection',
  templateUrl: './payment-collection.component.html',
  styleUrls: ['./payment-collection.component.css']
})
export class PaymentCollectionComponent implements OnInit {

  rows: any = [];
  columns: any = [];

  constructor() { }

  ngOnInit(): void {
  }

}
