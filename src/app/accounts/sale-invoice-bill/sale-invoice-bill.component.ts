import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sale-invoice-bill',
  templateUrl: './sale-invoice-bill.component.html',
  styleUrls: ['./sale-invoice-bill.component.css']
})
export class SaleInvoiceBillComponent implements OnInit {
rows: any = []
  constructor() { }

  ngOnInit(): void {
  }

}
