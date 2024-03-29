import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgForm } from '@angular/forms';
import { ServiceService } from 'src/app/shared/service.service';
import { Dateformater } from 'src/app/shared/dateformater';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-deliveryTL',
  templateUrl: './deliveryTL.component.html',
  styleUrls: ['./deliveryTL.component.css']
})
export class DeliveryTLComponent implements OnInit {
  dateformater: Dateformater = new Dateformater();

  data: any = {};
  response: any;
uomList : any = {};
containers:any={}
  // @Input() itemId;
  // @Input() enquiryId;
  @Input() contractId;
  @Input() deliveryId;

  @ViewChild(NgForm) deliveryForm;
  @Input() statusCheck;
  @ViewChild("focus") myInputField: ElementRef;
  loggedInDepartmentName: string;
  
  constructor(
    private http: HttpClient,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private _NgbActiveModal: NgbActiveModal,
    private service: ServiceService
  ) { }

  ngOnInit(): void {
    this.loggedInDepartmentName = localStorage.getItem('loggedInDepartmentName');
   this.GetUOMDropdown();
   this.GetContainersDropdown();
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
    this.http.get(`${environment.apiUrl}/api/YarnContracts/GetContractDeliveryScheduleById/`+ this.deliveryId )
      .subscribe(
        res => {
          this.response = res;
          if (this.response.success == true && this.response.data != null) {

            this.data = this.response.data;
            this.data.supplierDateMonth=this.data.supplierDateDay+'-'+this.data.supplierDateMonth+'-'+this.data.supplierDateYear;
            this.data.buyerDateMonth=this.data.buyerDateDay+'-'+this.data.buyerDateMonth+'-'+this.data.buyerDateYear;
            this.data.buyerDate = this.dateformater.fromModel(this.data.buyerDate);
            this.data.supplierDate = this.dateformater.fromModel(this.data.supplierDate);
          }
          else if(this.response.success == false) {
         
            this.toastr.error(this.response.message, 'Message.');
          }

        },(err: HttpErrorResponse) => {
          const messages = this.service.extractErrorMessagesFromErrorResponse(err);
          this.toastr.error(messages.toString(), 'Message.');
          console.log(messages);
        });
  }



  UpdateDelivery(Form:NgForm) {

  

    let varr = {
      "contractId": this.contractId,
      "supplierDateDay": this.data.supplierDateDay,
      "supplierDateMonth": this.data.supplierDateMonth,
      "supplierDateYear": this.data.supplierDateYear,
      "buyerDateDay": this.data.buyerDateDay,
      "buyerDateMonth": this.data.buyerDateMonth,
      "buyerDateYear": this.data.buyerDateYear,
      "quantity": this.data.quantity,
       "containerId":this.data.containerId,
       "quantityUOMId": this.data.quantityUOMId,
    }
this.spinner.show();
    this.http.
      put(`${environment.apiUrl}/api/YarnContracts/UpdateContractDeliverySchedule/`+ this.deliveryId ,varr)
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

        }, (err: HttpErrorResponse) => {
          const messages = this.service.extractErrorMessagesFromErrorResponse(err);
          this.toastr.error(messages.toString(), 'Message.');
this.spinner.hide();
        });
  }

  GetUOMDropdown() {
    this.http.get(`${environment.apiUrl}/api/Lookups/UOMs`).
    subscribe(res => {
      this.response = res;
      if (this.response.success == true) {
        this.uomList = this.response.data;
      }
      else {
        this.toastr.error(this.response.message, 'Message.');
      }
    })
  }
  GetContainersDropdown() {
    this.http.get(`${environment.apiUrl}/api/Lookups/Containers`).
    subscribe(res => {
      this.response = res;
      if (this.response.success == true) {
        this.containers = this.response.data;
      }
      else {
        this.toastr.error(this.response.message, 'Message.');
      }
    })
  }
  addDelivery(form:NgForm) {

    let varr = {
      "contractId": this.contractId,
      "supplierDateDay": this.data.supplierDateDay,
      "supplierDateMonth": this.data.supplierDateMonth,
      "supplierDateYear": this.data.supplierDateYear,
      "buyerDateDay": this.data.buyerDateDay,
      "buyerDateMonth": this.data.buyerDateMonth,
      "buyerDateYear": this.data.buyerDateYear,
      "quantity": this.data.quantity,
      "quantityUOMId": this.data.quantityUOMId,
      "active": true,
       "containerId":this.data.containerId
    }
this.spinner.show();
    this.http.
      post(`${environment.apiUrl}/api/YarnContracts/AddContractDeliverySchedule`, varr)
      .subscribe(
        res => {

          this.response = res;
          if (this.response.success == true) {
            this.toastr.success(this.response.message, 'Message.');
            // this.data.buyerDateMonth=this.data.buyerDateDay+'-'+this.data.buyerDateMonth+'-'+this.data.buyerDateYear;
            // this.deliveryForm.reset();
            this.activeModal.close(true);
            this.spinner.hide();
          }
          else {
            this.toastr.error(this.response.message, 'Message.');
            this.spinner.hide();
          }

        }, (err: HttpErrorResponse) => {
          const messages = this.service.extractErrorMessagesFromErrorResponse(err);
          this.toastr.error(messages.toString(),'Message.');
          this.spinner.hide();

        });

  }
  onSubmit(buttonType): void {
    if (buttonType === "Add"){
  
      this.addDelivery(this.deliveryForm); 
    }
  
    if (buttonType === "Edit"){
  
      this.UpdateDelivery(this.deliveryForm); 
  
    }
  
  }
}

  