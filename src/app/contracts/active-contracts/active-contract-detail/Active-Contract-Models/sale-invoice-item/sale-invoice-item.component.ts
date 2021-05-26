import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Dateformater } from 'src/app/shared/dateformater';
import { ServiceService } from 'src/app/shared/service.service';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-sale-invoice-item',
  templateUrl: './sale-invoice-item.component.html',
  styleUrls: ['./sale-invoice-item.component.css']
})
export class SaleInvoiceItemComponent implements OnInit {
  @Input() statusCheck;
  @Input() contractId;
  @Input() contractSaleInvoiceId;
  @Input() invoiceItemId;
  data:any ={};
  response: any;
  itemData:any=[];
  dateformater: Dateformater = new Dateformater();

  constructor(
    private http: HttpClient,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private _NgbActiveModal: NgbActiveModal,
    private service: ServiceService) { }


  ngOnInit(): void {
    this.statusCheck = this.statusCheck;
    this.getdropdown();
    if (this.statusCheck == 'edit') {
    this.getSaleInvoiceItem();
      
    }
  
  }

  addSaleInvoiceItem() {
   
   let varr = {

    "contractSaleInvoiceId": this.contractSaleInvoiceId ,
    "invoiceItem": this.data.invoiceItem,
    "quatity":this.data.quatity ,
    "amount": this.data.amount,
    "saleInvoiceItemRemarks":this.data.saleInvoiceItemRemarks ,
   }

   this.http.
     post(`${environment.apiUrl}/api/Contracts/AddSaleInvoiceItem`, varr)
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

       }, err => {
         if (err.status == 400) {
           this.toastr.error(this.response.message, 'Message.');
         }
       });
 }




  get activeModal() {
    return this._NgbActiveModal;
  }



  
  getdropdown() {
    this.http.get(`${environment.apiUrl}/api/Lookups/ContractSaleInvoiceItems/` + this.contractId)
      .subscribe(
        res => {
          this.response = res;
          if (this.response.success == true) {
            this.itemData = this.response.data;
            
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





  getSaleInvoiceItem() {
    this.http.get(`${environment.apiUrl}/api/Contracts/GetSaleInvoiceItemById/`+ this.invoiceItemId )
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


  updateInvoiceItem() {
  
    let varr = {
      
      "contractSaleInvoiceId": this.contractSaleInvoiceId ,
      "invoiceItem": this.data.invoiceItem,
      "quatity":this.data.quatity ,
      "amount": this.data.amount,
      "saleInvoiceItemRemarks":this.data.saleInvoiceItemRemarks ,
    }

    this.http.
      put(`${environment.apiUrl}/api/Contracts/UpdateSaleInvoiceItem/` + this.invoiceItemId, varr)
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

        }, err => {
          if (err.status == 400) {
            this.toastr.error(this.response.message, 'Message.');
          }
        });
  }

  




}
