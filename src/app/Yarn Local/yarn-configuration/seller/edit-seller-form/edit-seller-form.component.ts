import { Component, Inject, Input, OnInit } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ServiceService } from 'src/app/shared/service.service';
import { NgForm } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-edit-seller-form',
  templateUrl: './edit-seller-form.component.html',
  styleUrls: ['./edit-seller-form.component.css']
})
export class EditSellerFormComponent implements OnInit {
  @Input() Id;
  data: any = {};
  response: any;
  seller: any[];
  country: any = [];
  countryId = null;
  machineId = null;
  capabilitiesId = null;
  sellerCertificate: any = []
  certification: any = [];
  capabilities:any=[];

  constructor(private http: HttpClient,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private service: ServiceService,
    private _NgbActiveModal: NgbActiveModal,
    @Inject(DOCUMENT) private _document: Document) { }


  ngOnInit() {

    this.editSeller(this.Id);
    this.getCountry();
    this.getParentSellers();
    this.GetCertificationDropdown();
    this.GetCapabilitiesDropdown();
  }

  get activeModal() {
    return this._NgbActiveModal;
  }
  refreshPage() {
    this._document.defaultView.location.reload();
  }
  GetCertificationDropdown() {
    this.service.getCertification().subscribe(res => {
      this.response = res;
      if (this.response.success == true) {
        this.certification = this.response.data.list;
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


  editSeller(Id) {
    this.http.get(`${environment.apiUrl}/api/Sellers/GetSeller/` + Id)
      .subscribe(
        res => {
          this.response = res;
          if (this.response.success == true) {
            this.data = this.response.data;

            this.data.machineIds = this.data.machineIds.split(',');
            this.data.capabilitiesIds = this.data.capabilitiesIds.split(',');
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



  updateSeller() {
    let varr = {
      "sellerCode": this.data.sellerCode,
      "sellerName": this.data.sellerName,
      "billingAddress": this.data.billingAddress,
      "countryId": this.data.countryId,
      "contactNoPrimary": this.data.contactNoPrimary,
      "contactNoSecondary": this.data.contactNoSecondary,
      "faxNumber": this.data.faxNumber,
      "ntnNumber": this.data.ntnNumber,
      "gstNumber": this.data.gstNumber,
      "certificateIds": this.data.certificateIds !=null?this.data.certificateIds.toString():null,
      "capabilitiesIds": this.data.capabilitiesIds != null ?this.data.capabilitiesIds.toString() : null,
      "majorStrength": this.data.majorStrength,
      "leadTime": this.data.leadTime,
      "sellerDetails": this.data.sellerDetails,
      "isParentSeller": true,
      "parentSellerId": this.data.parentSellerId,
    }
this.spinner.show();
    this.http.
      put(`${environment.apiUrl}/api/Sellers/UpdateSeller/` + this.Id, varr)
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
