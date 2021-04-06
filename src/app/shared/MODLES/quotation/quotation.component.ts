import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-quotation',
  templateUrl: './quotation.component.html',
  styleUrls: ['./quotation.component.css']
})
export class QuotationComponent implements OnInit {

  constructor(
    private _NgbActiveModal: NgbActiveModal,
  ) { }

  ngOnInit(): void {
  }

  get activeModal() {
    return this._NgbActiveModal;
  }
}
