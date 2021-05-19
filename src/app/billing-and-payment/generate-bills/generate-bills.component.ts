import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { ToastrService } from 'ngx-toastr';
import { ServiceService } from 'src/app/shared/service.service';
import { environment } from 'src/environments/environment';
import { GlobalConstants } from '../../Common/global-constants';
import { ColumnMode, SelectionType } from '@swimlane/ngx-datatable';

import Swal from 'sweetalert2/dist/sweetalert2.js';
@Component({
  selector: 'app-generate-bills',
  templateUrl: './generate-bills.component.html',
  styleUrls: ['./generate-bills.component.css']
})
export class GenerateBillsComponent implements OnInit {

  constructor(    private service: ServiceService,
    private http: HttpClient,
    private toastr: ToastrService,
    private modalService: NgbModal
    ) { }
  data: any = {};
  data2: any = {};

  rows: any = [];
  selected = [];
  checkboxData: any = [];
  SelectionType = SelectionType;

  columns: any = [];
  response: any;

url = '/api/BillingPayments/GetAllContractForBillGeneration'
  ngOnInit(): void {
    this.service.fetch((data)=>{
         this.rows = data;
         console.log( this.rows)
    } , this.url)
    
  }

  onSelect({ selected }) {
    console.log('Select Event', selected);
  }
  // onSelect(row) {
  //   console.log(row)
  // }

  onActivate(event) {
    console.log('Activated Event', event );
      if (event.type == 'click' && event.type != 'dblclick' && event.type != 'mouseenter'){
        this.checkboxData.push({['id']:event.row.id , ['buyerId']:event.row.buyerId ,
         ['sellerId']:event.row.sellerId , ['taxAmount']:event.row.id });
        console.log(this.checkboxData)
      }
   
}

  generateBill() {
    // console.log("checkbox data in " , this.checkboxData)
    let varr = {
      "contractId": this.checkboxData,
      "billForBuyerId": this.checkboxData[0],
      "billForSelerId": this.checkboxData.sellerId,
      "taxAmount": this.checkboxData.taxAmount,
      "dueDate": "2021-05-27"
    }
    this.http.
      post(`${environment.apiUrl}/api/BillingPayments/GenerateContractBill`, varr)
      .subscribe(
        res => {

          this.response = res;
          if (this.response.success == true) {
            this.toastr.success(GlobalConstants.addMessage, 'Message.');
          }
          else {
            this.toastr.error(this.response.message, 'Message.');
          }

        }, err => {
          if (err.status == 400) {
            this.toastr.error(GlobalConstants.exceptionMessage, 'Message.');
          }
        });
  }
}
