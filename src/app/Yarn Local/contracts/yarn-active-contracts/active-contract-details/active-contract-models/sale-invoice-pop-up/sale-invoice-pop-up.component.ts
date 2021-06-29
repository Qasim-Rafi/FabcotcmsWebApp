import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, Input, OnInit, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { GlobalConstants } from 'src/app/Common/global-constants';
import { Dateformater } from 'src/app/shared/dateformater';
import { ServiceService } from 'src/app/shared/service.service';
import { environment } from 'src/environments/environment';
import {FormsModule , NgForm, ReactiveFormsModule}  from '@angular/forms'
import { NgxSpinnerService } from 'ngx-spinner';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-sale-invoice-pop-up',
  templateUrl: './sale-invoice-pop-up.component.html',
  styleUrls: ['./sale-invoice-pop-up.component.css']
})
export class SaleInvoicePopUpComponent implements OnInit {

  dateformater: Dateformater = new Dateformater();  
  timeout: any = null;
  @Input() contractId;
  @Input() invoiceId; 
  @Input() statusCheck; 
  @Input() quantity; 
  @Input() saleInvoiceQuantity; 

  data:any ={};
  rate:any;
  condition:string="17"
  quantitya:any;
  calculatedcost:any;
  response: any;
  saleInvoiceNo:string;
  loggedInDepartmentName:string;
uomList : any = {};
@ViewChild(NgForm) InvoiceForm;
  saleInvoiceDate: any;
 
  constructor(
    private _NgbActiveModal: NgbActiveModal,
    private spinner: NgxSpinnerService,
    private http: HttpClient,
    private service: ServiceService,
    private toastr: ToastrService,
    @Inject(DOCUMENT) private _document: Document
  ) { }


  ngOnInit(): void {
    this.quantity = this.quantity;
    this.saleInvoiceQuantity=this.saleInvoiceQuantity;
    this.loggedInDepartmentName = localStorage.getItem('loggedInDepartmentName');

    this.GetUOMDropdown();
    if (this.statusCheck == 'editInvoice') {
      this.editSaleInvoice();
    }
   
  }
  refreshPage() {
    this._document.defaultView.location.reload();
  }
  get activeModal() {
    return this._NgbActiveModal;
  }

  getquantity(event){
    clearTimeout(this.timeout);
    
    this.rate=parseInt(localStorage.getItem('rate'))
      if (event.keyCode != 13) {
    this.quantitya=event.target.value;
 this.calculatedcost= this.quantitya*this.rate;
 this.data.amount=this.calculatedcost;
//  if(this.data.unit){
  // this.data.amount=calculatedcost*10;
 
    //  }
      }
    
   }

   getunit(event:any){
    // clearTimeout(this.timeout);
   
      if (event.keyCode != 13) {

if(event==7){
 
  this.data.amount=this.calculatedcost*10;
}else if(event==8){
  this.data.amount=this.calculatedcost;
}
      }
    
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
    let sum=parseInt(this.quantitya)+parseInt(this.saleInvoiceQuantity);
    if(sum>this.quantity ){
      this.toastr.error("Total Sale Invoice Quantity"+"["+sum+"]"+ "should be less than contract quantity"+"["+this.quantity+"]", 'Message.');

    }
    //  this.data.saleInvoiceDate = this.dateformater.toModel(this.data.saleInvoiceDate);
    else{
    let varr = {

      "contractId": parseInt(this.contractId),
      "saleInvoiceNo": this.data.saleInvoiceNo,
      "saleInvoiceDate":this.dateformater.toModel(this.data.saleInvoiceDate),
      "saleInvoiceRemarks":this.data.saleInvoiceRemarks,
      "amount": this.data.amount,
      "quantity": this.data.quantity,
      "unit": this.data.unit.toString(),
      "taxPercentage": this.data.taxPercentage == null ?  this.condition :this.data.taxPercentage,
      // this.data.otherConditionRemarks == null ?  this.condition : this.data.otherConditionRemarks 
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
    this._document.defaultView.location.reload();
          localStorage.setItem('quantity',this.data.quantity);
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
  }



  editSaleInvoice() {
    // this.spinner.show();
    this.http.get(`${environment.apiUrl}/api/YarnContracts/GetContractSaleInvoiceById/` + this.invoiceId)
      .subscribe(
        res => {
          this.response = res;
          if (this.response.success == true) {
            this.data = this.response.data;
            this.saleInvoiceNo=this.data.saleInvoiceNo;
            this.data.saleInvoiceDate = this.dateformater.fromModel(this.data.saleInvoiceDate);
            this.saleInvoiceDate=this.data.saleInvoiceDate;
            this.quantity=this.quantity
            this.saleInvoiceQuantity=this.saleInvoiceQuantity
            // this.spinner.hide();

          }
          else {
            this.toastr.error(GlobalConstants.exceptionMessage, 'Message.');
            // this.spinner.hide();
          }

        },(err: HttpErrorResponse) => {
          const messages = this.service.extractErrorMessagesFromErrorResponse(err);
          this.toastr.error(messages.toString(), 'Message.');
          console.log(messages);
        });
  }
  




  
  updateSaleInvoice(form:NgForm) {
    let sum=parseInt(this.quantitya)+parseInt(this.saleInvoiceQuantity);
    if(sum>this.quantity ){
      this.toastr.error("Total Sale Invoice Quantity"+"["+sum+"]"+ "should be less than contract quantity"+"["+this.quantity+"]", 'Message.');

    }else{
    let varr = {
     "contractId": this.contractId,
       "saleInvoiceNo": this.data.saleInvoiceNo,
       "saleInvoiceDate":this.dateformater.toModel(this.data.saleInvoiceDate),
       "saleInvoiceRemarks":this.data.saleInvoiceRemarks,
       "amount": this.data.amount,
       "quantity": this.data.quantity,
       "unit": this.data.unit,
       "taxPercentage": this.data.taxPercentage == null ?  this.condition :this.data.taxPercentage,
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
  }}
  onSubmit(buttonType): void {
    if (buttonType === "addInvoice"){
  
      this.addSaleInvoice(this.InvoiceForm); 
    }
  
    if (buttonType === "editInvoice"){
  
      this.updateSaleInvoice(this.InvoiceForm); 
      this.InvoiceForm.reset();
  
    }
  
  }

}
