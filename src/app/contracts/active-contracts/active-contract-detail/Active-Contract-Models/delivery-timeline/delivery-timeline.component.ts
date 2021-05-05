import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Dateformater } from 'src/app/shared/dateformater';
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
  mode: any = [];
  shipmentMode: any=[];
  queryParems: any = {};
  @Input() shipmentId;
  dateformater: Dateformater = new Dateformater();
  @ViewChild(NgForm) deliveryForm;
  @Input() statusCheck;
  constructor(
    private http: HttpClient,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private _NgbActiveModal: NgbActiveModal,
    private service: ServiceService) { }

  ngOnInit(): void {
    this.queryParems = this.route.snapshot.queryParams;
    // let olddate=new Date();
    // let latest_date =this.datepipe.transform(olddate, 'yyyy-MM-dd');
    // this.supplierDateField =this.dateformater.fromModel(latest_date);
    // this.buyerDateField =this.dateformater.fromModel(latest_date);
    this.GetMode();
    this.statusCheck = this.statusCheck;
    if (this.statusCheck == 'shipmentEdit') {
      this.editshipment();
    }
  }

  get activeModal() {
    return this._NgbActiveModal;
  }
  editshipment() {
    this.http.get(`${environment.apiUrl}/api/Contracts/GetContractShipmentScheduleById` + this.shipmentId)
      .subscribe(
        res => {
          this.response = res;
          if (this.response.success == true) {

            this.data = this.response.data;
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
  GetMode() {
    this.service.getMode().subscribe(res => {
      this.response = res;
      if (this.response.success == true) {
        this.mode = this.response.data;
      }
      else {
        this.toastr.error(this.response.message, 'Message.');
      }
    })
  }
  addshipment() {
    // this.data.supplierDate = this.dateformater.toModel(this.supplierDateField);
    // this.data.buyerDate = this.dateformater.toModel(this.buyerDateField);

    let varr = {
      "contractId":this.queryParems.contractId,
  "shipmentNo": this.data.shipmentNo,
  "supplierDate": this.data.supplierDate,
  "buyerDate":this.data.buyerDate,
  "shipmentLine": this.data.shipmentLine,
  "shipmentMode":this.data.shipmentMode,
  "shipmentRemarks": this.data.shipmentRemarks
    }
    // this.data.lcOpenOn = this.dateformater.toModel(this.data.lcOpenOn);

    // let varr = {

    //   "contractId": this.contractId,
    //   "lcNumber": this.data.lcNumber,
    //   "lcOpenOn": this.data.lcOpenOn,
    //   "lcShipmentOn": this.data.lcShipmentOn,
    //   "lcShipmentInfo": this.data.lcShipmentInfo,
    //   "lcExpiryDate":this.data.lcExpiryDate,
    //   "remarks": this.data.remarks,
    // }

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
  Updateshipment() {
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
      put(`${environment.apiUrl}//api/Contracts/UpdateContractShipmentSchedule/` + this.shipmentId, varr)
      .subscribe(
        res => {

          this.response = res;
          if (this.response.success == true) {
            this.toastr.success(this.response.message, 'Message.');
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
