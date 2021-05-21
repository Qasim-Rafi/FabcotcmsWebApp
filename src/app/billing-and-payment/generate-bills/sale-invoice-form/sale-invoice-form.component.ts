import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-sale-invoice-form',
  templateUrl: './sale-invoice-form.component.html',
  styleUrls: ['./sale-invoice-form.component.css']
})
export class SaleInvoiceFormComponent implements OnInit {
  columns: any = [];
  rows: any = [];

  constructor(private _NgbActiveModal: NgbActiveModal){}


  ngOnInit(): void {
    
  }
  
  get activeModal() {
    return this._NgbActiveModal;
  }
}
