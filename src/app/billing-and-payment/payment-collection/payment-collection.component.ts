import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-payment-collection',
  templateUrl: './payment-collection.component.html',
  styleUrls: ['./payment-collection.component.css']
})
export class PaymentCollectionComponent implements OnInit {

  rows: any = [  {name : ["1","2","3","4"]  } ];
  columns: any = [];

  constructor() { }

  ngOnInit(): void {
  }

}
