import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgForm } from '@angular/forms';

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
  parentSellerId: null;
  @ViewChild(NgForm) sellerForm;
  @ViewChild('sellerName') private elementRef: ElementRef;



  constructor(
    private http: HttpClient,
    private toastr: ToastrService,
    private _NgbActiveModal: NgbActiveModal
  ) { }

  ngOnInit(): void {
    this.getCountry();
    this.getParentSellers();
  }


  public ngAfterViewInit(): void {
    this.elementRef.nativeElement.focus();
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
            this.toastr.error('Something went Worng', 'Message.');
          }

        }, err => {
          if (err.status == 400) {
            this.toastr.error('Something went Worng', 'Message.');
          }
        });
  }



  get activeModal() {
    return this._NgbActiveModal;
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
            this.toastr.error('Something went Worng', 'Message.');
          }

        }, err => {
          if (err.status == 400) {
            this.toastr.error('Something went Worng', 'Message.');
          }
        });
  }



  addSeller() {
    let varr = {
      "sellerCode": this.data.sellerCode,
      "sellerName": this.data.sellerName,
      "billingAddress": this.data.sellerBillAddress,
      "countryId": this.data.countryId,
      "contactNoPrimary": this.data.sellerContact,
      "contactNoSecondary": this.data.sellerOtherContact,
      "faxNumber": this.data.sellerFax,
      "ntnNumber": this.data.sellerNTN,
      "gstNumber": this.data.sellerGST,
      "machineId": this.data.machineId,
      "capabilitiesId": this.data.capabilitiesId,
      "majorStrength": this.data.sellerStrenght,
      "leadTime": this.data.leadTime,
      "sellerDetails": this.data.sellerDetails,
      "isParentSeller": this.data.isParentSeller,
      "parentSellerId": this.parentSellerId
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
