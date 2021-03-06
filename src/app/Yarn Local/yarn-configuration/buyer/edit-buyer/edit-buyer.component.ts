import { Component, Inject, Input, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgForm } from '@angular/forms';
import { ServiceService } from 'src/app/shared/service.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-edit-buyer',
  templateUrl: './edit-buyer.component.html',
  styleUrls: ['./edit-buyer.component.css']
})
export class EditBuyerComponent implements OnInit {
  @Input() buyerId;
  data: any = {};
  country: any = [];
  response: any;
  states: any;
  buyer: any[];
  countryId: null;
  active: boolean;



  constructor(private http: HttpClient,
    private service: ServiceService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private _NgbActiveModal: NgbActiveModal,
    @Inject(DOCUMENT) private _document: Document) { }

  ngOnInit(): void {
    this.editBuyer(this.buyerId);
    this.getCountry();
    this.getParentBuyer();
  }

  get activeModal() {
    return this._NgbActiveModal;
  }
  refreshPage() {
    this._document.defaultView.location.reload();
  }
  getParentBuyer() {
    this.http.get(`${environment.apiUrl}/api/Lookups/Buyers`)
      .subscribe(
        res => {
          this.response = res;
          if (this.response.success == true) {
            this.buyer = this.response.data;
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


  getCountry() {
    this.http.get(`${environment.apiUrl}/api/Lookups/Countries`)
      .subscribe(
        res => {
          this.response = res;
          if (this.response.success == true) {
            this.country = this.response.data;
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



  editBuyer(id) {
    this.spinner.show();
    this.http.get(`${environment.apiUrl}/api/Buyers/GetBuyer/` + id)
      .subscribe(
        res => {
          this.response = res;
          if (this.response.success == true) {
            this.data = this.response.data;
            this.active = this.data.isParentBuyer
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


  updateBuyer(form:NgForm) {

  
    let varr = {
      "buyerCode": this.data.buyerCode,
      "buyerName": this.data.buyerName,
      "billingAddress": this.data.billingAddress,
      "deliveryAddress": this.data.deliveryAddress,
      "countryId": this.data.countryId,
      "contactNoPrimary": this.data.contactNoPrimary,
      "contactNoSecondary": this.data.contactNoSecondary,
      "faxNumber": this.data.faxNumber,
      "ntnNumber": this.data.ntnNumber,
      "gstNumber": this.data.gstNumber,
      "buyerDetails": this.data.buyerDetails,
      "isParentBuyer": this.active,
      "parentBuyerId": this.data.parentBuyerId,
    }
this.spinner.show();
    this.http.
      put(`${environment.apiUrl}/api/Buyers/UpdateBuyer/` + this.buyerId, varr)
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

        },(err: HttpErrorResponse) => {
          const messages = this.service.extractErrorMessagesFromErrorResponse(err);
          this.toastr.error(messages.toString(), 'Message.');
          console.log(messages);
this.spinner.hide();
});
  }
}
// }
