import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { GlobalConstants } from 'src/app/Common/global-constants';
import { Dateformater } from 'src/app/shared/dateformater';
import { ServiceService } from 'src/app/shared/service.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-sale-invoice',
  templateUrl: './sale-invoice.component.html',
  styleUrls: ['./sale-invoice.component.css']
})
export class SALEINVOICEComponent implements OnInit {
  dateformater: Dateformater = new Dateformater();  

  @Input() contractId;
  @Input() invoiceId; 
  @Input() statusCheck; 
  data:any ={};
  response: any;
 
  constructor(
    private _NgbActiveModal: NgbActiveModal,
    private http: HttpClient,
    private service: ServiceService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
  ) { }


  ngOnInit(): void {
    this.invoiceId = this.invoiceId;
    if (this.statusCheck == 'editInvoice') {
      this.editSaleInvoice();
    }
  }

  get activeModal() {
    return this._NgbActiveModal;
  }

  
  addSaleInvoice() {
    this.spinner.show();
     this.data.saleInvoiceDate = this.dateformater.toModel(this.data.saleInvoiceDate);
    let varr = {

      "contractId": this.contractId,
      "saleInvoiceNo": this.data.saleInvoiceNo,
      "saleInvoiceDate":this.data.saleInvoiceDate,
      "saleInvoiceRemarks":this.data.saleInvoiceRemarks
    }

    this.http.
      post(`${environment.apiUrl}/api/Contracts/AddContractSaleInvoice`, varr)
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

        }, err => {
          if (err.status == 400) {
            this.toastr.error(this.response.message, 'Message.');
            this.spinner.hide();
          }
        });
  }



  editSaleInvoice() {
    this.http.get(`${environment.apiUrl}/api/Contracts/GetContractSaleInvoiceById/` + this.invoiceId)
      .subscribe(
        res => {
          this.response = res;
          if (this.response.success == true) {
            this.data = this.response.data;
            this.data.saleInvoiceDate = this.dateformater.fromModel(this.data.saleInvoiceDate);
            

          }
          else {
            this.toastr.error(GlobalConstants.exceptionMessage, 'Message.');
          }

        }, err => {
          if (err.status == 400) {
            this.toastr.error(GlobalConstants.exceptionMessage, 'Message.');
          }
        });
  }
  




  
  updateSaleInvoice() {
    this.spinner.show();
    this.data.saleInvoiceDate = this.dateformater.toModel(this.data.saleInvoiceDate);
   let varr = {
    "contractId": this.contractId,
    "saleInvoiceNo": this.data.saleInvoiceNo,
    "saleInvoiceDate":this.data.saleInvoiceDate,
    "saleInvoiceRemarks":this.data.saleInvoiceRemarks
   }

   this.http.
     put(`${environment.apiUrl}/api/Contracts/UpdateContractSaleInvoice/` + this.invoiceId, varr)
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





}
