import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-loc',
  templateUrl: './loc.component.html',
  styleUrls: ['./loc.component.css']
})
export class LOCComponent implements OnInit {

  constructor(
    private _NgbActiveModal: NgbActiveModal
  ) { }

  ngOnInit(): void {
  }

  get activeModal() {
    return this._NgbActiveModal;
  }
}
