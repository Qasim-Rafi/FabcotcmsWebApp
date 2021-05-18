import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { ToastrService } from 'ngx-toastr';
import { ServiceService } from 'src/app/shared/service.service';
import { environment } from 'src/environments/environment';
import { GlobalConstants } from '../../Common/global-constants';
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
  rows: any = [];
  columns: any = [];
  response: any;

url = '/api/BillingPayments/GetAllContractForBillGeneration'
  ngOnInit(): void {
    this.service.fetch((data)=>{
         this.rows = data;
         console.log(this.rows)
    } , this.url)
  }

  generateBill() {
    let varr = {
      "contractId": this.data.contractId,
      "billNumber": this.data.billNum,
      "billForBuyerId": this.data.billForBuyerId,
      "billForSelerId": this.data.billForSelerId,
      "billAmount": this.data.billAmount,
      "taxAmount": this.data.taxAmount,
      "dueDate": this.data.dueDate
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
