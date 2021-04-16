import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-quantity-costing',
  templateUrl: './quantity-costing.component.html',
  styleUrls: ['./quantity-costing.component.css']
})
export class QuantityCostingComponent implements OnInit {

  constructor( private _NgbActiveModal: NgbActiveModal) { }

  ngOnInit(): void {
  }
  get activeModal() {
    return this._NgbActiveModal;
  }

}
