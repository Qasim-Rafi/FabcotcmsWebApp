import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { GlobalConstants } from 'src/app/Common/global-constants'
import { ServiceService } from 'src/app/shared/service.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-add-edit-shipment-line',
  templateUrl: './add-edit-shipment-line.component.html',
  styleUrls: ['./add-edit-shipment-line.component.css']
})
export class AddEditShipmentLineComponent implements OnInit {

  response: any;
  data: any = {};
  mode: any = []
  active = true;
  @Input() Id;
  @Input() statusCheck;
  @Input() FormName;
  constructor(private http: HttpClient,
    private toastr: ToastrService,
    private service: ServiceService,
    private spinner: NgxSpinnerService,
    private _NgbActiveModal: NgbActiveModal) { }

  ngOnInit(): void {
    this.GetShipmentModeDropdown();
    this.statusCheck = this.statusCheck;
    this.FormName = this.FormName;

    if(this.statusCheck == 'editShipment')
    {
      this.editShipment();
    }
  
  }
  get activeModal() {
    return this._NgbActiveModal;
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

  addShipment() {
    this.spinner.show();
    let varr = {
      "shipmentLineType": this.data.shipmentLineType,
      "shipmentMode": this.data.shipmentMode,
      "details": this.data.details
    }

    this.http.
      post(`${environment.apiUrl}/api/Configs/AddShipmentLine`, varr)
      .subscribe(
        res => {
          
          this.response = res;
          if (this.response.success == true) {
            this.toastr.success(this.response.message, 'Message.');
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





  editShipment()
  
  {
    this.spinner.show();
    this.http.get(`${environment.apiUrl}/api/Configs/GetShipmentLineById/`+this.Id )
    .subscribe(
      res=> { 
        this.response = res;
        if (this.response.success == true){
          this.data =this.response.data; 
          this.spinner.hide();
        }
        else {
          this.toastr.success(this.response.message, 'Message.');
          this.spinner.hide();
            }

      }, err => {
        if (err.status == 400) {
          this.toastr.success(this.response.message, 'Message.');
          this.spinner.hide();
        }
      });
  }


  UpdateShipment()
  
  {
    this.spinner.show();
    let varr=  {
      "shipmentLineType": this.data.shipmentLineType,
      "shipmentMode": this.data.shipmentMode,
      "details": this.data.details
    }

    this.http.
    put(`${environment.apiUrl}/api/Configs/UpdateShipmentLine/`+this.Id,varr)
    .subscribe(
      res=> { 
  
        this.response = res;
        if (this.response.success == true){
          this.toastr.success(this.response.message, 'Message.');
          this.activeModal.close(true);
          this.spinner.hide();
        }
        else {
          this.toastr.success(this.response.message, 'Message.');
          this.spinner.hide();
            }

      }, (err: HttpErrorResponse) => {
        const messages = this.service.extractErrorMessagesFromErrorResponse(err);
        this.toastr.error(messages.toString(), 'Message.');
        console.log(messages);
        this.spinner.hide();
      });
  }



}
