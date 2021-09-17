import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { GlobalConstants } from 'src/app/Common/global-constants';
import { Dateformater } from 'src/app/shared/dateformater';
import { ServiceService } from 'src/app/shared/service.service';
import { environment } from 'src/environments/environment';
import {FormsModule , NgForm, ReactiveFormsModule}  from '@angular/forms'
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-lcinfo',
  templateUrl: './lcinfo.component.html',
  styleUrls: ['./lcinfo.component.css']
})
export class LCInfoComponent implements OnInit {
  dateformater: Dateformater = new Dateformater();  
response: any;
data:any = {};
buyer: any={};

@Input() contractId;
@Input() id; 
@Input() statusCheck; 
@ViewChild(NgForm) InvoiceForm;

  constructor(
    private _NgbActiveModal: NgbActiveModal,
    private spinner: NgxSpinnerService,
    private http: HttpClient,
    private service: ServiceService,
    private toastr: ToastrService,
  ) { }

  ngOnInit(): void {
    this.GetBuyersDropdown();
    if (this.statusCheck == 'edit') {
      this.editSaleInvoice();
    }
    
   
  }
  get activeModal() {
    return this._NgbActiveModal;
  }
  GetBuyersDropdown() {
    this.service.getBuyers().subscribe(res => {
      this.response = res;
      if (this.response.success == true && this.response.data != null) {
        this.buyer = this.response.data;
      }
      else if(this.response.success == false) {
         
        this.toastr.error(this.response.message, 'Message.');
      }
    })
  }

  addSaleInvoice(form:NgForm) {
    let varr = {
      "contractId": this.contractId,
      "buyerId":this.data.buyerId,
      "lcNumber": this.data.lcNumber,
      "lcOpenOn": this.dateformater.toModel(this.data.lcOpenOn),
      "lcShipmentOn": this.dateformater.toModel(this.data.lcShipmentOn),
      "lcShipmentInfo": this.data.lcShipmentInfo,
      "lcExpiryDate": this.dateformater.toModel(this.data.lcExpiryDate),
      "remarks": this.data.remarks
     
    }
this.spinner.show();
    this.http.
      post(`${environment.apiUrl}/api/Contracts/AddContractLetterCredit`, varr)
      .subscribe(
        res => {

          this.response = res;
          if (this.response.success == true) {
            this.toastr.success(this.response.message, 'Message.');
            this.activeModal.close(true);
          // localStorage.setItem('quantity',this.data.quantity);
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
  editSaleInvoice() {
    // this.spinner.show();
    this.http.get(`${environment.apiUrl}/api/Contracts/GetContractLetterCreditById/` + this.id)
      .subscribe(
        res => {
          this.response = res;
          if (this.response.success == true && this.response.data != null) {
            this.data = this.response.data;
         this.data.lcOpenOn = this.dateformater.fromModel(this.data.lcOpenOn)
          this.data.lcShipmentOn = this.dateformater.fromModel(this.data.lcShipmentOn)
          this.data.lcExpiryDate = this.dateformater.fromModel(this.data.lcExpiryDate)
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
  
  updateSaleInvoice(form:NgForm) {
    let varr = {
      "contractId": this.contractId,
      "buyerId":this.data.buyerId,
      "lcNumber": this.data.lcNumber,
      "lcOpenOn": this.dateformater.toModel(this.data.lcOpenOn),
      "lcShipmentOn": this.dateformater.toModel(this.data.lcShipmentOn),
      "lcShipmentInfo": this.data.lcShipmentInfo,
      "lcExpiryDate": this.dateformater.toModel(this.data.lcExpiryDate),
      "remarks": this.data.remarks
    }
 this.spinner.show();
    this.http.
      put(`${environment.apiUrl}/api/Contracts/UpdateContractLetterCredit/` + this.id, varr)
      .subscribe(
        res => {
 
          this.response = res;
          if (this.response.success == true) {
            this.toastr.success(GlobalConstants.updateMessage, 'Message.');
            this.activeModal.close(true);
            this.InvoiceForm.reset();
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
        });
  }
  onSubmit(buttonType): void {
    if (buttonType === "add"){
  
      this.addSaleInvoice(this.InvoiceForm); 
    }
  
    if (buttonType === "edit"){
  
      this.updateSaleInvoice(this.InvoiceForm); 
      this.InvoiceForm.reset();
  
    }
  
  }
}
