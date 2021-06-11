import { Component, OnInit, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgForm } from '@angular/forms';
import { ServiceService } from 'src/app/shared/service.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
@Component({
  selector: 'app-add-buyer',
  templateUrl: './add-buyer.component.html',
  styleUrls: ['./add-buyer.component.css']
})
export class AddBuyerComponent implements OnInit {
  listCount: number;
  response: any;
  data: any = {};
  obj : any ={};
  country: any = [];
  buyer: any[];
  active:boolean = true
  @ViewChild(NgForm) buyerForm;
  date: number;
  ok:boolean ;

  constructor(private http: HttpClient,
    private service: ServiceService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private _NgbActiveModal: NgbActiveModal) { }

  ngOnInit(): void {
    this.getCountry();
    this.getParentBuyer();
    
  }

  get activeModal() {
    return this._NgbActiveModal;
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




  addBuyer(form:NgForm) {



    let varr = {
      "buyerCode": this.data.buyerCode,
      "buyerName": this.data.buyerName,
      "billingAddress": this.data.buyerBillAddress,
      "deliveryAddress": this.data.buyerDiliveryAddress,
      "countryId": this.data.countryId,
      "contactNoPrimary": this.data.buyerContact,
      "contactNoSecondary": this.data.buyerOtherContact,
      "faxNumber": this.data.faxNumber,
      "ntnNumber": this.data.ntnNumber,
      "gstNumber": this.data.gstNumber,
      "buyerDetails": this.data.buyerDetails,
      "isParentBuyer": this.active,
      "parentBuyerId": this.data.parentBuyerId,
    }
this.spinner.show();
    this.http.
      post(`${environment.apiUrl}/api/Buyers/AddBuyer`, varr)
      .subscribe(
        res => {

          this.obj.parent = this.active;
          this.obj.status = true;
          
          
          this.response = res;
          if (this.response.success == true) {
            this.toastr.success(this.response.message, 'Message.');
            this.buyerForm.reset();
            this.activeModal.close(this.obj);
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

