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
  @Input() EnquiryItemId;




  constructor(
    private _NgbActiveModal: NgbActiveModal,
    private http: HttpClient,
    private toastr: ToastrService,
    private service: ServiceService,

  ) { }

  ngOnInit(): void {
  }

  get activeModal() {
    return this._NgbActiveModal;
  }


  addQuotation() {
    let varr =
    {
      "enquiryItemId": this.EnquiryItemId,
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
