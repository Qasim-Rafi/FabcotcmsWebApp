import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, Input, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { environment } from 'src/environments/environment';
import { ToastrService } from 'ngx-toastr';
import { ServiceService } from '../../service.service';
import { NgForm } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-history-contract',
  templateUrl: './history-contract.component.html',
  styleUrls: ['./history-contract.component.css']
})
export class HistoryContractComponent implements OnInit {
  @Input() contractId;
  response: any;
  data: any = {}; 
  temp = [];
  rows = [];
  columns: any = [];
  constructor(
    private _NgbActiveModal: NgbActiveModal,
    private http: HttpClient,
    private toastr: ToastrService,
    private service: ServiceService,
    private spinner: NgxSpinnerService,

  ) { }
  ngOnInit(): void {
    this.fetch((dataList) => {
      this.temp = [...dataList];
      this.rows = dataList;

    });
  }
  fetch(cb) {
    let that = this;
    that.http
      .get(`${environment.apiUrl}/api/Contracts/GetContractStatusHistory/` + this.contractId)
      .subscribe(res => {
        this.response = res;
        if (this.response.success == true) {
          this.data = this.response.data;
          cb(this.data);

        }
        else {
          this.toastr.error('Something went Worng', 'Message.');
        }
        //  this.reload();
      }, err => {
        if (err.status == 400) {
          this.toastr.error('Something went Worng', 'Message.');
        }

      });
   
  }
  get activeModal() {
    return this._NgbActiveModal;
  }
}
