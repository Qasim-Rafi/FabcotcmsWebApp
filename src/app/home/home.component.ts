import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';
import * as AdminLte from 'admin-lte';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  response: any;
  rows: any = [];
  columns: any = [];
  data: any = {};
  listCount: number;
  temp: any = [];
  rows2: any = [];
  data2: any = {};
  sellers: any = {};
  buyers: any = {};
  loggedInDepartmentId : any;

  constructor(private http: HttpClient,
    private toastr: ToastrService,
    private router: Router,
    private modalService: NgbModal,
    // private service: ServiceService,
  ) { }

  ngOnInit(): void {
    // $('[data-widget="treeview"]').each(function() {
    //   AdminLte.Treeview._jQueryInterface.call($(this), 'init');
    // });
    this.loggedInDepartmentId=localStorage.getItem('loggedInDepartmentId');

    this.contracts((data) => {
      this.rows = data;

    });
    this.dashboardAmount((dataRows) => {
      this.rows2 = dataRows;
      this.sellers = this.rows2.topSellers;
      this.buyers = this.rows2.topBuyers;

     
    });
  }
  contracts(cb) {

    this.http
      .get(`${environment.apiUrl}/api/Dashboard/GetContractCounts`)
      .subscribe(res => {
        this.response = res;
        this.listCount = this.response.data.length;

        if (this.response.success == true) {
          this.data = this.response.data;
          this.temp = [this.data];
          cb(this.data);
        }
        else {
          this.toastr.error(this.response.message, 'Message.');
        }
    
      }, err => {
        if (err.status == 400) {
          this.toastr.error(err.error.message, 'Message.');;
        }
     
      });
  }
  dashboardAmount(cb) {
    this.http
      .get(`${environment.apiUrl}/api/Dashboard/GetDashbaordCounts`)
      .subscribe(res => {
        this.response = res;
      if (this.response.success == true) {
          this.data2 = this.response.data;
          // this.temp = [this.data2];
          cb(this.data2);
        }
        else {
          this.toastr.error(this.response.message, 'Message.');
        }
      }, err => {
        if (err.status == 400) {
          this.toastr.error(err.error.message, 'Message.');;
        }
      });
  }

}
