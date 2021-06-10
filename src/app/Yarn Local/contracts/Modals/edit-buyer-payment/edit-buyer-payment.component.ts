import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ServiceService } from 'src/app/shared/service.service';
import { environment } from 'src/environments/environment';
import { Dateformater } from 'src/app/shared/dateformater';

@Component({
  selector: 'app-edit-buyer-payment',
  templateUrl: './edit-buyer-payment.component.html',
  styleUrls: ['./edit-buyer-payment.component.css']
})
export class EditBuyerPaymentComponent implements OnInit {
  dateformater: Dateformater = new Dateformater();

  @Input()  paymentId;
  currency: any = [];
  payment: any = [];
  response: any;
  data: any = {};
 


  constructor(private http: HttpClient,
    private toastr: ToastrService,
    private _NgbActiveModal: NgbActiveModal,
    private service: ServiceService,
    private router: Router,) { }

  ngOnInit(): void {
    this.GetCurrencyDropdown();
    this.getData();
  }

  get activeModal() {
    return this._NgbActiveModal;
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



  GetPaymentDropdown() {
    this.service.getPaymentMode().subscribe(res => {
      this.response = res;
      if (this.response.success == true) {
        this.payment = this.response.data;
      }
      else {
        this.toastr.error(this.response.message, 'Message.');
      }
    })
  }
  getData() {
    this.http.get(`${environment.apiUrl}/api/YarnContracts/GetBuyerToSellerPaymentById/` + this.paymentId)
    .subscribe(res => {
      this.response = res;
          if (this.response.success == true) {
            this.data = this.response.data;
            this.data.paymentDate = this.dateformater.fromModel(this.data.paymentDate);
            this.data.depositeDate = this.dateformater.fromModel(this.data.depositeDate);
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


  updatePayment() {
    // this.paymentAdddata.paymentDate = this.dateformater.toModel(this.paymentAdddata.paymentDate);
    // this.paymentAdddata.depositeDate = this.dateformater.toModel(this.paymentAdddata.depositeDate);
      let varr = {
        "buyerId": this.data.buyerId,
        "sellerId": this.data.sellerId,
        "paymentDate": this.dateformater.toModel(this.data.paymentDate),
        "amount": this.data.amount,
        "currencyId": this.data.currencyId,
        "paymentMode": this.data.paymentMode,
        "additionalDetails": this.data.additionalDetails,
        "depositDate": this.dateformater.toModel(this.data.depositeDate),
        "taxChalan": this.data.taxChalan,
        "remarks": this.data.remarks
      
   
      }
      // /api​/YarnContracts​/UpdateBuyerToSellerPayment​/
    this.http.
      put(`${environment.apiUrl}/api/YarnContracts/UpdateBuyerToSellerPayment/`+ this.paymentId, varr)
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
          console.log(messages);
        });
  }




}
