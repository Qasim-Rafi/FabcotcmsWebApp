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
  selector: 'app-sale-invoice-pop-up',
  templateUrl: './sale-invoice-pop-up.component.html',
  styleUrls: ['./sale-invoice-pop-up.component.css']
})
export class SaleInvoicePopUpComponent implements OnInit {

  dateformater: Dateformater = new Dateformater();  

  @Input() contractId;
  @Input() invoiceId; 
  @Input() statusCheck; 
  data:any ={};
  response: any;
uomList : any = {};
@ViewChild(NgForm) InvoiceForm;
 
  constructor(
    private _NgbActiveModal: NgbActiveModal,
    private spinner: NgxSpinnerService,
    private http: HttpClient,
    private service: ServiceService,
    private toastr: ToastrService,
  ) { }


  ngOnInit(): void {
    this.GetUOMDropdown();
    if (this.statusCheck == 'editInvoice') {
      this.editSaleInvoice();
    }
   
  }

  get activeModal() {
    return this._NgbActiveModal;
  }

  GetUOMDropdown() {
    this.service.getUOM().subscribe(res => {
      this.response = res;
      if (this.response.success == true) {
        this.uomList = this.response.data;
      }
      else {
        this.toastr.error(this.response.message, 'Message.');
      }
    })
  }
  addSaleInvoice(form:NgForm) {
    //  this.data.saleInvoiceDate = this.dateformater.toModel(this.data.saleInvoiceDate);
    let varr = {

      "contractId": parseInt(this.contractId),
      "saleInvoiceNo": this.data.saleInvoiceNo,
      "saleInvoiceDate":this.dateformater.toModel(this.data.saleInvoiceDate),
      "saleInvoiceRemarks":this.data.saleInvoiceRemarks,
      "amount": this.data.amount,
      "quantity": this.data.quantity,
      "unit": this.data.unit.toString(),
      "taxPercentage": this.data.taxPercentage,
    }
this.spinner.show();
    this.http.
      post(`${environment.apiUrl}/api/YarnContracts/AddContractSaleInvoice`, varr)
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
          this.toastr.error(messages.toString(),'Message.');
          this.spinner.hide();
          
        });
  }



  editSaleInvoice() {
    // this.spinner.show();
    this.http.get(`${environment.apiUrl}/api/YarnContracts/GetContractSaleInvoiceById/` + this.invoiceId)
      .subscribe(
        res => {
          this.response = res;
          if (this.response.success == true) {
            this.data = this.response.data;
            this.data.saleInvoiceDate = this.dateformater.fromModel(this.data.saleInvoiceDate);
            // this.spinner.hide();

          }
          else {
            this.toastr.error(GlobalConstants.exceptionMessage, 'Message.');
            // this.spinner.hide();
          }

        }, err => {
          if (err.status == 400) {
            this.toastr.error(GlobalConstants.exceptionMessage, 'Message.');
            // this.spinner.hide();
          }
        });
  }
  




  
  updateSaleInvoice(form:NgForm) {
    let varr = {
     "contractId": this.contractId,
       "saleInvoiceNo": this.data.saleInvoiceNo,
       "saleInvoiceDate":this.dateformater.toModel(this.data.saleInvoiceDate),
       "saleInvoiceRemarks":this.data.saleInvoiceRemarks,
       "amount": this.data.amount,
       "quantity": this.data.quantity,
       "unit": this.data.unit,
       "taxPercentage": this.data.taxPercentage,
    }
 this.spinner.show();
    this.http.
      put(`${environment.apiUrl}/api/YarnContracts/UpdateContractSaleInvoice/` + this.invoiceId, varr)
      .subscribe(
        res => {
 
          this.response = res;
          if (this.response.success == true) {
            this.toastr.success(GlobalConstants.updateMessage, 'Message.');
            this.activeModal.close(true);
            this.spinner.hide();
           }
          else {
            this.toastr.error(this.response.message, 'Message.');
            this.spinner.hide();
           }
 
        }, err => {
          if (err.status == 400) {
            this.toastr.error(GlobalConstants.exceptionMessage, 'Message.');
            this.spinner.hide();
           }
        });
  }
  onSubmit(buttonType): void {
    if (buttonType === "addInvoice"){
  
      this.addSaleInvoice(this.InvoiceForm); 
    }
  
    if (buttonType === "editInvoice"){
  
      this.updateSaleInvoice(this.InvoiceForm); 
  
    }
  
  }

}
