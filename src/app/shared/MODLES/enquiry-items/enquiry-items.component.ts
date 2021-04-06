import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-enquiry-items',
  templateUrl: './enquiry-items.component.html',
  styleUrls: ['./enquiry-items.component.css']
})
export class EnquiryItemsComponent implements OnInit {

  @Input() statusCheck;


  constructor(
    private _NgbActiveModal: NgbActiveModal,
  ) { }

  ngOnInit(): void {
  }

  get activeModal() {
    return this._NgbActiveModal;
  }

}
