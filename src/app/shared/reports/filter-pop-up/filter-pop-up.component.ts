import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Dateformater } from '../../dateformater';

@Component({
  selector: 'app-filter-pop-up',
  templateUrl: './filter-pop-up.component.html',
  styleUrls: ['./filter-pop-up.component.css']
})
export class FilterPopUpComponent implements OnInit {

  includingBuyer: any = [];
  excludingBuyer: any = [];
  country: any = [];
  departments: any = [];
  users: any = [];
  response: any;
  Bendata: any = [];
  obj: any = {};
  dateformater: Dateformater = new Dateformater();  
  status = true;
  FormName: any;
  userName : any;
  userrole:string;
  typeId : any;
  deptId : any;
  deptId2 : any;
  constructor(
    private _NgbActiveModal: NgbActiveModal,

  ) { }

  ngOnInit(): void {
  }
  get activeModal() {
    return this._NgbActiveModal;
  }
}
