import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-enquiry-notes',
  templateUrl: './enquiry-notes.component.html',
  styleUrls: ['./enquiry-notes.component.css']
})
export class EnquiryNotesComponent implements OnInit {

  constructor(
    private _NgbActiveModal: NgbActiveModal,

  ) { }

  ngOnInit(): void {
  }


  get activeModal() {
    return this._NgbActiveModal;
  }


}
