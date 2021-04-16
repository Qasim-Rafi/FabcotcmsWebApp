import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-sale-invoice',
  templateUrl: './sale-invoice.component.html',
  styleUrls: ['./sale-invoice.component.css']
})
export class SALEINVOICEComponent implements OnInit {

  constructor(
    private _NgbActiveModal: NgbActiveModal
  ) { }

  ngOnInit(): void {
  }

  get activeModal() {
    return this._NgbActiveModal;
  }
}
