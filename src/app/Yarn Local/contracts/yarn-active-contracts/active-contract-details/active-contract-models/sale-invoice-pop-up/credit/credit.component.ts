import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { GlobalConstants } from 'src/app/Common/global-constants';
import { Dateformater } from 'src/app/shared/dateformater';
import { ServiceService } from 'src/app/shared/service.service';
import { environment } from 'src/environments/environment';
import {FormsModule , NgForm, ReactiveFormsModule}  from '@angular/forms'

@Component({
  selector: 'app-credit',
  templateUrl: './credit.component.html',
  styleUrls: ['./credit.component.css']
})
export class CreditComponent implements OnInit {

  dateformater: Dateformater = new Dateformater();  
  data:any ={};
  currency:any = []
  uomList:any = []
  count : any = []
  @Input() saleInvoiceId; 
  @Input() creditId; 
  @Input() statusCheck; 
  @Input() contractId; 
  response: any;
  @Input() saleInvoiceNo;
  @Input() saleInvoiceDate;
  @Input() saleInvoiceQuantity;
 @Input() quantity;
  timeout: any = null;
  loggedInDepartmentName:string;
  quantitya:any;
  calculatedcost:any;
  rate:any;


  @ViewChild(NgForm) creditForm;
 
  constructor(
    private _NgbActiveModal: NgbActiveModal,
    private http: HttpClient,
    private service: ServiceService,
    private toastr: ToastrService,
  ) { }


  ngOnInit(): void {
    this.GetCurrencyDropdown();
    this.loggedInDepartmentName = localStorage.getItem('loggedInDepartmentName');

    this.statusCheck = this.statusCheck
    this.saleInvoiceNo = this.saleInvoiceNo
    this.saleInvoiceDate=this.saleInvoiceDate
 this.saleInvoiceId=this.saleInvoiceId
this.getContractCostingData();
    if(this.statusCheck == 'Edit')
    {
    this.getCredit();
  }
//   if(this.statusCheck == 'Edit2')
//   {
//   this.getCredit();
// }


  this.GetUOMDropdown();
  //  this.GetCreditDropdown();
  }

  get activeModal() {
    return this._NgbActiveModal;
  }

  // GetCreditDropdown() {
  //   this.http.get(`${environment.apiUrl}/api/YarnContracts/CreditPopUpFields/`+this.contractId).
  //   subscribe(res => {
  //     this.response = res;
  //     if (this.response.success == true) {
  //       this.count = this.response.data;
  //     }
  //     else {
  //       this.toastr.error(this.response.message, 'Message.');
  //     }
  //   })
  // }
 
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
  GetCurrencyDropdown() {
    this.service.getCurrencyType().subscribe(res => {
      this.response = res;
      if (this.response.success == true) {
        this.currency = this.response.data;
      }
      else {
        this.toastr.error(this.response.message, 'Message.');
      }
    })
  }

  getContractCostingData() {
    this.http.get(`${environment.apiUrl}/api/Contracts/GetContractCostingById/` + this.contractId)
      .subscribe(
        res => {
          this.response = res;
          if (this.response.success == true) {
            this.rate = this.response.data.rate;
         
          
          }
  
          else {
            this.toastr.error(this.response.message, 'Message.');
          }
  
        },(err: HttpErrorResponse) => {
          const messages = this.service.extractErrorMessagesFromErrorResponse(err);
          this.toastr.error(messages.toString(), 'Message.');
          console.log(messages);
        });
  }


  getquantity(event){
    clearTimeout(this.timeout);
    
      if (event.keyCode != 13) {
        if(this.loggedInDepartmentName=="Yarn Local"){
          this.quantitya=event.target.value;
          this.calculatedcost= this.quantitya*this.rate*10;
          this.data.amount=this.calculatedcost;
        }else{
          this.quantitya=event.target.value;
          this.calculatedcost= this.quantitya*this.rate;
          this.data.amount=this.calculatedcost;
        }
      }
    
   }

  getCredit() {
    this.http.get(`${environment.apiUrl}/api/YarnContracts/GetInvoiceDebitCreditNoteById/` + this.saleInvoiceId)
      .subscribe(
        res => {
          this.response = res;
          if (this.response.success == true && this.response.data != null) {
            this.data = this.response.data;
            // this.data.date = this.dateformater.fromModel(this.data.date);
            

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




  addCredit(form:NgForm) {
    // let sum=parseInt(this.quantitya)+parseInt(this.saleInvoiceQuantity);
    // if(sum>this.quantity ){
    //   this.toastr.error("Total Sale Invoice Quantity"+"["+sum+"]"+ "should be less than contract quantity"+"["+this.quantity+"]", 'Message.');

    // }
    // else{
    let varr = {

      "saleInvoiceId": this.saleInvoiceId,
      "saleInvoiceDate": this.data.saleInvoiceDate,
      "creditNoteNo": this.data.creditNoteNo,
      "creditNoteDate": this.dateformater.toModel(this.data.creditNoteDate),
      "debitNoteNo": this.data.debitNoteNo,
      "debitNoteDate":this.dateformater.toModel(this.data.debitNoteDate),
      "quantity": this.data.quantity,
      "uomId": this.data.uomId,
      "amount": this.data.amount,
      "currencyId": this.data.currencyId,
      "taxPercentage": this.data.taxPercentage,
      "reason":this.data.reason
    }

    this.http.
      post(`${environment.apiUrl}/api/YarnContracts/AddInvoiceDebitCreditNote`, varr)
      .subscribe(
        res => {

          this.response = res;
          if (this.response.success == true) {
            this.toastr.success(this.response.message, 'Message.');

            this.creditForm.reset();
            this.activeModal.close(true);
          }
          else {
            this.toastr.error(this.response.message, 'Message.');
          }

        }, (err: HttpErrorResponse) => {
          const messages = this.service.extractErrorMessagesFromErrorResponse(err);
          this.toastr.error(messages.toString(),'Message.');

        });
      // }
  }





  updateCredit(form:NgForm) {
    //  this.data.creditDate = this.dateformater.toModel(this.data.creditDate);
    let varr = {
      "contractId":this.contractId, 
      "number": this.data.number,
      "date": this.dateformater.toModel(this.data.date),
      "quantity": this.data.quantity,
      "uomId": this.data.uomId,
      "salesTax": this.data.salesTax,
    "saleInvoiceNo": this.data.saleInvoiceNo,
      "remarks": this.data.remarks,
    }

    this.http.
      put(`${environment.apiUrl}/api/YarnContracts/UpdateCreditRegister/` +this.creditId, varr)
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

        },(err: HttpErrorResponse) => {
          const messages = this.service.extractErrorMessagesFromErrorResponse(err);
          this.toastr.error(messages.toString(), 'Message.');
          console.log(messages);
        });
  }
  // onSubmit(){
  // this.updateCredit(this.creditForm)
  // }
}
