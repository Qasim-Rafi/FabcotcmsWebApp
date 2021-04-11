import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import { ServiceService } from '../../service.service';

@Component({
  selector: 'app-quotation',
  templateUrl: './quotation.component.html',
  styleUrls: ['./quotation.component.css']
})
export class QuotationComponent implements OnInit {

  @Input() statusCheck;
  data: any = {};
  response: any = [];
  enquiryItem: any = [];
  seller: any = [];
  currency: any = [];
  uom: any = [];
  @Input() EnquiryItemId;




  constructor(
    private _NgbActiveModal: NgbActiveModal,
    private http: HttpClient,
    private toastr: ToastrService,
    private service: ServiceService,

  ) { }

  ngOnInit(): void {
    this.GetSellersDropdown();
    this.GetEnquiryItemDropdown();
    this.GetUOMDropdown();
    this.GetCurrencyDropdown();
  }

  get activeModal() {
    return this._NgbActiveModal;
  }


  GetEnquiryItemDropdown() {
    this.service.getEnquiryItem().subscribe(res => {
      this.response = res;
      if (this.response.success == true) {
        this.enquiryItem = this.response.data;
      }
      else {
        this.toastr.error(this.response.message, 'Message.');
      }
    })
  }

  GetSellersDropdown() {
    this.service.getSellers().subscribe(res => {
      this.response = res;
      if (this.response.success == true) {
        this.seller = this.response.data;
      }
      else {
        this.toastr.error(this.response.message, 'Message.');
      }
    })
  }


  GetCurrencyDropdown() {
    this.service.getCurrency().subscribe(res => {
      this.response = res;
      if (this.response.success == true) {
        this.currency = this.response.data;
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
        this.uom = this.response.data;
      }
      else {
        this.toastr.error(this.response.message, 'Message.');
      }
    })
  }





  addQuotation() {
    let varr =
    {
      "enquiryItemId": this.data.enquiryItemId,
      "sellerId": this.data.sellerId,
      "rate": this.data.rate,
      "currencyId": this.data.currencyId,
      "uomId": this.data.uomId,
      "validity": this.data.validity,
      "remarks": this.data.remarks,
      "active": this.data.active,
    }

    this.http.
      post(`${environment.apiUrl}/api/Enquiries/AddVendorQuotation`, varr)
      .subscribe(
        res => {
          this.response = res;
          if (this.response.success == true) {
            this.toastr.success(this.response.message, 'Message.');
            // this.buyerForm.reset();
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
