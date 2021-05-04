import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ServiceService } from 'src/app/shared/service.service';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-delivery-timeline',
  templateUrl: './delivery-timeline.component.html',
  styleUrls: ['./delivery-timeline.component.css']
})
export class DeliveryTimelineComponent implements OnInit {
  data: any = {};
  response: any;
  @ViewChild(NgForm) deliveryForm;

  constructor(
    private http: HttpClient,
    private toastr: ToastrService,
    private _NgbActiveModal: NgbActiveModal,
    private service: ServiceService) { }

  ngOnInit(): void {
  }

  get activeModal() {
    return this._NgbActiveModal;
  }

  adddelivery() {
    let varr = {
      "contractId":this.data.contractId,
  "shipmentNo": this.data.shipmentNo,
  "supplierDate": this.data.supplierDate,
  "buyerDate":this.data.buyerDate,
  "shipmentLine": this.data.shipmentLine,
  "shipmentMode":this.data.shipmentMode,
  "shipmentRemarks": this.data.shipmentRemarks
    }

    this.http.
      post(`${environment.apiUrl}/api/Contracts/AddContractShipmentSchedule`, varr)
      .subscribe(
        res => {

          this.response = res;
          if (this.response.success == true) {
            this.toastr.success(this.response.message, 'Message.');

            this.deliveryForm.reset();
            this.activeModal.close(true);
          }
          else {
            this.toastr.error(this.response.message, 'Message.');
          }

        }, err => {
          if (err.status == 400) {
            this.toastr.error(this.response.message, 'Message.');
          }
        });
  }


}
