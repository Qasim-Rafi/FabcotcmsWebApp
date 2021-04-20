import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-product-plan',
  templateUrl: './product-plan.component.html',
  styleUrls: ['./product-plan.component.css']
})
export class PRODUCTPLANComponent implements OnInit {

  constructor(
    private _NgbActiveModal: NgbActiveModal
  ) { }

  ngOnInit(): void {
  }


  get activeModal() {
    return this._NgbActiveModal;
  }
}
