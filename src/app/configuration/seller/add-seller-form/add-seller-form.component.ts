import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgForm } from '@angular/forms';
import { ServiceService } from 'src/app/shared/service.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-add-seller-form',
  templateUrl: './add-seller-form.component.html',
  styleUrls: ['./add-seller-form.component.css']
})
export class AddSellerFormComponent implements OnInit {
  data: any = {};
  response: any;
  seller: any[];
  country: any = [];
  countryId: null;
  certification:any=[];
  capabilities:any=[];
  active: boolean = true;
  @ViewChild(NgForm) sellerForm;
  // @ViewChild('sellerName') private elementRef: ElementRef;



  constructor(
    private service: ServiceService,
    private http: HttpClient,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private _NgbActiveModal: NgbActiveModal
  ) { }

  ngOnInit(): void {
    this.getCountry();
    this.getParentSellers();
    this.GetCertificationDropdown();
    this.GetCapabilitiesDropdown();
  }


  // public ngAfterViewInit(): void {
  //   this.elementRef.nativeElement.focus();
  // }


  get activeModal() {
    return this._NgbActiveModal;
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

  GetCertificationDropdown() {
    this.service.getCertification().subscribe(res => {
      this.response = res;
      if (this.response.success == true) {
        this.certification = this.response.data;
      }
      else {
        this.toastr.error(this.response.message, 'Message.');
      }
    })
  }
  GetCapabilitiesDropdown() {
    this.service.getCapabilities().subscribe(res => {
      this.response = res;
      if (this.response.success == true) {
        this.capabilities = this.response.data;
      }
      else {
        this.toastr.error(this.response.message, 'Message.');
      }
    })
  }



  getParentSellers() {
    this.http.get(`${environment.apiUrl}/api/Lookups/Sellers`)
      .subscribe(
        res => {

          this.response = res;
          if (this.response.success == true) {
            this.seller = this.response.data;

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



  addSeller() {
    this.spinner.show();
    let varr = {
      "sellerName": this.data.sellerName,
      "billingAddress": this.data.sellerBillAddress,
      "countryId": this.data.countryId,
      "contactNoPrimary": this.data.sellerContact,
      "contactNoSecondary": this.data.sellerOtherContact,
      "faxNumber": this.data.sellerFax,
      "ntnNumber": this.data.sellerNTN,
      "gstNumber": this.data.sellerGST,
      "certificateIds": this.data.certificateIds != null ?this.data.certificateIds.toString() : null,
      "capabilitiesIds": this.data.capabilitiesIds != null ?this.data.capabilitiesIds.toString() : null,
      "majorStrength": this.data.sellerStrenght,
      "leadTime": this.data.leadTime,
      "sellerDetails": this.data.sellerDetails,
      "isParentSeller": this.active,
      "parentSellerId": this.data.parentSellerId,
      // "active": true
    }

    this.http.
      post(`${environment.apiUrl}/api/Sellers/AddSeller`, varr)
      .subscribe(
        res => {
          this.response = res;
          if (this.response.success == true) {
            this.toastr.success(this.response.message, 'Message.');
            this.sellerForm.reset();
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
