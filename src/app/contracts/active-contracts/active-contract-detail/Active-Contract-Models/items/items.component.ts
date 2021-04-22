import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-items',
  templateUrl: './items.component.html',
  styleUrls: ['./items.component.css']
})
export class ItemsComponent implements OnInit {

  constructor(
    private _NgbActiveModal: NgbActiveModal
  ) { }

  ngOnInit(): void {
  }
  get activeModal() {
    return this._NgbActiveModal;
  }
}
