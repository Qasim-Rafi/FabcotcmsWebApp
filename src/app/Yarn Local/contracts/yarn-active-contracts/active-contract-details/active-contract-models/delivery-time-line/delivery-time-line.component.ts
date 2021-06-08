import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgForm } from '@angular/forms';
import { ServiceService } from 'src/app/shared/service.service';

@Component({
  selector: 'app-delivery-time-line',
  templateUrl: './delivery-time-line.component.html',
  styleUrls: ['./delivery-time-line.component.css']
})
export class DeliveryTimeLineComponent implements OnInit {
  data: any = {};
  response: any;
  item: any[];
  values=[];
  contractCurrencyId:any[];
  itemUOMId: any=[];
  itemUOMId1: any=[];
  loomTypeId:any[];
  colorId:any[];
  FormName: any;
  uomList: any = [];
  fabric: any = [];
  uomList1: any = [];
  color: any = [];
  loomType: any = [];
  currency: any[];
  // @Input() itemId;
  // @Input() enquiryId;
  // @Input() contractId;

  @ViewChild(NgForm) deliveryForm;
  @Input() statusCheck;
  @ViewChild("focus") myInputField: ElementRef;
  
  constructor(
    private http: HttpClient,
    private toastr: ToastrService,
    private _NgbActiveModal: NgbActiveModal,
    private service: ServiceService
  ) { }

  ngOnInit(): void {
   
    this.statusCheck = this.statusCheck;
    if (this.statusCheck == 'Edit') {
      this.getById();
    }
  }
  ngAfterViewInit() {
    this.myInputField.nativeElement.focus();
    }
  get activeModal() {
    return this._NgbActiveModal;
  }
 
  getById() {
    this.http.get(`${environment.apiUrl}` )
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



  UpdateDelivery() {



    let varr = {

    }

    this.http.
      put(`${environment.apiUrl}` ,varr)
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

        }, (err: HttpErrorResponse) => {
          const messages = this.service.extractErrorMessagesFromErrorResponse(err);
          this.toastr.error(messages.toString(), 'Message.');

        });
  }



  addDelivery(form:NgForm) {



    let varr = {

    }

    this.http.
      post(`${environment.apiUrl}`, varr)
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

        }, (err: HttpErrorResponse) => {
          const messages = this.service.extractErrorMessagesFromErrorResponse(err);
          this.toastr.error(messages.toString(),'Message.');

        });

  }

}
