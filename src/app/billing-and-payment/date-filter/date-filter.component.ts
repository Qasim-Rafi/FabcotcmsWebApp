import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-date-filter',
  templateUrl: './date-filter.component.html',
  styleUrls: ['./date-filter.component.css']
})
export class DateFilterComponent implements OnInit {
  
  constructor(  private modalService: NgbModal,  private _NgbActiveModal: NgbActiveModal) { }

  ngOnInit(): void {

  }

  get activeModal() {
    return this._NgbActiveModal;
  }



}
