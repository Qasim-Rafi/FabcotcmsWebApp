import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
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
  // supplierDateField:any;
  // buyerDateField:any;
  data: any = {};
  response: any;
  mode: any = [];
  line: any = [];
  shipmentMode: any=[];
  queryParems: any = {};
  @Input() shipmentId;
  dateformater: Dateformater = new Dateformater();
  @ViewChild(NgForm) deliveryForm;
  @Input() statusCheck;
  @Input() contractId;
  constructor(
    private http: HttpClient,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private _NgbActiveModal: NgbActiveModal,
    private spinner: NgxSpinnerService,
    private service: ServiceService) { }

  ngOnInit(): void {
    this.queryParems = this.route.snapshot.queryParams;
    this.GetShipmentModeDropdown();
    this.GetShipmentLineDropdown();
    this.statusCheck = this.statusCheck;
    if (this.statusCheck == 'edit') {
      this.editshipment();
    }
  }

  get activeModal() {
    return this._NgbActiveModal;
  }

  editshipment() {
    this.http.get(`${environment.apiUrl}/api/Contracts/GetContractShipmentScheduleById/` + this.shipmentId)
      .subscribe(
        res => {
          this.response = res;
          if (this.response.success == true) {
            this.data = this.response.data;
            this.data.supplierDate = this.dateformater.fromModel(this.data.supplierDate);
            this.data.buyerDate = this.dateformater.fromModel(this.data.buyerDate);
            
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


  GetShipmentModeDropdown() {
    this.http.get(`${environment.apiUrl}/api/Lookups/ShipmentModes`).
    subscribe(res => {
      this.response = res;
      if (this.response.success == true) {
        this.mode = this.response.data;
      }
      else {
        this.toastr.error(this.response.message, 'Message.');
      }
    })
  }
 
 
  GetShipmentLineDropdown() {
    this.http.get(`${environment.apiUrl}/api/Lookups/ShipmentLine`).
    subscribe(res => {
      this.response = res;
      if (this.response.success == true) {
        this.line = this.response.data;
      }
      else {
        this.toastr.error(this.response.message, 'Message.');
      }
    })
  }
 
 
  addshipment(form:NgForm) {
    // this.data.supplierDate = this.dateformater.toModel(this.data.supplierDate);
    // this.data.buyerDate = this.dateformater.toModel(this.data.buyerDate);

    this.spinner.show();
    let varr = {
      "contractId":this.contractId,
      "shipmentNo": this.data.shipmentNo,
      "supplierDate": this.dateformater.toModel(this.data.supplierDate),
      "buyerDate":this.dateformater.toModel(this.data.buyerDate),
      "shipmentLineId": this.data.shipmentLine,
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
            this.spinner.hide();
          }
          else {
            this.toastr.error(this.response.message, 'Message.');
            this.spinner.hide();
          }

        },(err: HttpErrorResponse) => {
          const messages = this.service.extractErrorMessagesFromErrorResponse(err);
          this.toastr.error(messages.toString(), 'Message.');
          console.log(messages);
          this.spinner.hide();
          
        });
  }
  Updateshipment(form:NgForm) {

    this.spinner.show();

    // this.data.supplierDate = this.dateformater.toModel(this.data.supplierDate);
    // this.data.buyerDate = this.dateformater.toModel(this.data.buyerDate);
    let varr = {
      "contractId":this.contractId,
      "shipmentNo": this.data.shipmentNo,
      "supplierDate": this.dateformater.toModel(this.data.supplierDate),
      "buyerDate":this.dateformater.toModel(this.data.buyerDate),
      "shipmentLineId": this.data.shipmentLine,
      "shipmentMode":this.data.shipmentMode,
      "shipmentRemarks": this.data.shipmentRemarks
    }

    this.http.
      put(`${environment.apiUrl}/api/Contracts/UpdateContractShipmentSchedule/` + this.shipmentId, varr)
      .subscribe(
        res => {

          this.response = res;
          if (this.response.success == true) {
            // this.data = this.response.data;
            this.data.supplierDate = this.dateformater.fromModel(this.data.supplierDate);
            this.data.buyerDate = this.dateformater.fromModel(this.data.buyerDate);
            this.toastr.success(this.response.message, 'Message.');
            this.activeModal.close(true);
            this.spinner.hide();
          }
          else {
            this.toastr.error(this.response.message, 'Message.');
            this.spinner.hide();
          }

        }, (err: HttpErrorResponse) => {
          const messages = this.service.extractErrorMessagesFromErrorResponse(err);
          this.toastr.error(messages.toString(), 'Message.');
          this.spinner.hide();

        });
  }


}
