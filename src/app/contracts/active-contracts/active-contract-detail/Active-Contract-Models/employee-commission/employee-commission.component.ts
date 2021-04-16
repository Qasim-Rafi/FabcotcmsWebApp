import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-employee-commission',
  templateUrl: './employee-commission.component.html',
  styleUrls: ['./employee-commission.component.css']
})
export class EmployeeCommissionComponent implements OnInit {

    
    constructor(
      private _NgbActiveModal: NgbActiveModal
    ) { }

  ngOnInit(): void {
  }
  get activeModal() {
    return this._NgbActiveModal;
  }
}
