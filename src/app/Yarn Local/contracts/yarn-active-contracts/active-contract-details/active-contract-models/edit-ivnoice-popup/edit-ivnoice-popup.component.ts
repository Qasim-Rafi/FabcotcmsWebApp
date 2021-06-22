import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-edit-ivnoice-popup',
  templateUrl: './edit-ivnoice-popup.component.html',
  styleUrls: ['./edit-ivnoice-popup.component.css']
})
export class EditIvnoicePopupComponent implements OnInit {

  constructor(
    private _NgbActiveModal: NgbActiveModal,

  ) { }

  ngOnInit(): void {
  }
  get activeModal() {
    return this._NgbActiveModal;
  }
}
