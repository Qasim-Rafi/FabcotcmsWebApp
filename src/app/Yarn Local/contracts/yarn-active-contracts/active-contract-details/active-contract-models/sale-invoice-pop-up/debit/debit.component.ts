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
  selector: 'app-debit',
  templateUrl: './debit.component.html',
  styleUrls: ['./debit.component.css']
})
export class DebitComponent implements OnInit {

  dateformater: Dateformater = new Dateformater();  
  data:any ={};
  uomList = []
  count : any = []

  @Input() debitId; 
  @Input() statusCheck; 
  @Input() contractId; 
  response: any;
  @Input() buyerName;
  @Input() sellerName;
  @Input() contractNmbr;

  @ViewChild(NgForm) debitForm;
 
  constructor(
    private _NgbActiveModal: NgbActiveModal,
    private http: HttpClient,
    private service: ServiceService,
    private toastr: ToastrService,
  ) { }


  ngOnInit(): void {
    this.statusCheck = this.statusCheck
    this.buyerName = this.buyerName
    this.sellerName = this.sellerName
    this.contractNmbr = this.contractNmbr

    if(this.statusCheck == 'Edit')
    {
    this.getDebit();
  }
  if(this.statusCheck == 'Edit2')
  {
  this.getDebit();
}


  this.GetUOMDropdown();
   this.GetDebitDropdown();
  }

  get activeModal() {
    return this._NgbActiveModal;
  }

  GetDebitDropdown() {
    this.http.get(`${environment.apiUrl}/api/YarnContracts/DebitPopUpFields/`+this.contractId).
    subscribe(res => {
      this.response = res;
      if (this.response.success == true) {
        this.count = this.response.data;
      }
      else {
        this.toastr.error(this.response.message, 'Message.');
      }
    })
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


  getDebit() {
    this.http.get(`${environment.apiUrl}/api/YarnContracts/GetDebitRegisterById/` + this.debitId)
      .subscribe(
        res => {
          this.response = res;
          if (this.response.success == true) {
            this.data = this.response.data;
            this.data.date = this.dateformater.fromModel(this.data.date);
            

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




  addDebit(form:NgForm) {

    let varr = {

      "contractId":this.contractId, 
      "number": this.data.number,
      "date": this.dateformater.toModel(this.data.date),
      "quantity": this.data.quantity,
      "uomId": this.data.uomId,
      "remarks": this.data.remarks,
    }

    this.http.
      post(`${environment.apiUrl}/api/YarnContracts/AddDebitRegister`, varr)
      .subscribe(
        res => {

          this.response = res;
          if (this.response.success == true) {
            this.toastr.success(this.response.message, 'Message.');

            this.debitForm.reset();
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





  updateDebit(form:NgForm) {
    //  this.data.debitDate = this.dateformater.toModel(this.data.debitDate);
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
      put(`${environment.apiUrl}/api/YarnContracts/UpdateDebitRegister/` +this.debitId, varr)
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
  // this.updateDebit(this.debitForm)
  // }
}
