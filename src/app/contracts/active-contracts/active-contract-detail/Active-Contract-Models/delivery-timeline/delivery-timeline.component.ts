import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-delivery-timeline',
  templateUrl: './delivery-timeline.component.html',
  styleUrls: ['./delivery-timeline.component.css']
})
export class DeliveryTimelineComponent implements OnInit {

  constructor(  private _NgbActiveModal: NgbActiveModal) { }

  ngOnInit(): void {
  }

  get activeModal() {
    return this._NgbActiveModal;
  }



}
