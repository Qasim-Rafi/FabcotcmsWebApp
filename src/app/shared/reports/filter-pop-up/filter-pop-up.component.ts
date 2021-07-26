import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Dateformater } from '../../dateformater';

@Component({
  selector: 'app-filter-pop-up',
  templateUrl: './filter-pop-up.component.html',
  styleUrls: ['./filter-pop-up.component.css']
})
export class FilterPopUpComponent implements OnInit {
  menuName: any = {};
  comm: any = {};
  lc: any = {};
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
  variable:string;
  variable1:string;
  @Input() menu;
  constructor(
    private _NgbActiveModal: NgbActiveModal,
    private route: ActivatedRoute,
    private router: Router,

  ) { this.router.routeReuseStrategy.shouldReuseRoute = () => false; }

  ngOnInit(): void {
    this.menuName = this.route.snapshot.queryParams;
 this.variable=this.menuName.menuName;
 this.menuName=null;

//  this.comm=localStorage.getItem('comm')
//  this.lc=localStorage.getItem('lc')
//  this.variable=this.comm
//  this.variable1=this.lc
// if(this.comm == "CommissionReport"){
//   localStorage.removetem('lc');

// }
// else if(this.lc =="LCReport"){
//   localStorage.removetem('comm');

// }
 
  }
  get activeModal() {
    return this._NgbActiveModal;
  }
  
}
