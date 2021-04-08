import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { environment } from 'src/environments/environment';
import { ToastrService } from 'ngx-toastr';
import { ServiceService } from '../../service.service';

@Component({
  selector: 'app-enquiry-items',
  templateUrl: './enquiry-items.component.html',
  styleUrls: ['./enquiry-items.component.css']
})
export class EnquiryItemsComponent implements OnInit {

  @Input() statusCheck;
  @Input() EnquiryId;
  @Input() EnquiryItemId;
  data: any = {};
  response: any;
  uomList: any = [];
  color: any = [];
  loomType: any = [];
  fabricType: any = [];



  constructor(
    private _NgbActiveModal: NgbActiveModal,
    private http: HttpClient,
    private toastr: ToastrService,
    private service: ServiceService,

  ) { }

  ngOnInit(): void {
    this.GetUOMDropdown();
    this.GetColorDropdown();
    this.GetLoomDropdown();
    this.GetFabricDropdown();

    if (this.statusCheck == 'EditEnquiryItem') {
      this.editEnquiry(this.EnquiryItemId);
    }
  }

  get activeModal() {
    return this._NgbActiveModal;
  }



  GetUOMDropdown() {
    this.service.getUOM().subscribe(res => {
      this.response = res;
      if (this.response.success == true) {
        this.uomList = this.response.data;
      }
      else {
        this.toastr.error(this.response.message, 'Message.');
      }
    })
  }


  GetColorDropdown() {
    this.service.getColor().subscribe(res => {
      this.response = res;
      if (this.response.success == true) {
        this.color = this.response.data;
      }
      else {
        this.toastr.error(this.response.message, 'Message.');
      }
    })
  }


  GetLoomDropdown() {
    this.service.getLoom().subscribe(res => {
      this.response = res;
      if (this.response.success == true) {
        this.loomType = this.response.data;
      }
      else {
        this.toastr.error(this.response.message, 'Message.');
      }
    })
  }

  GetFabricDropdown() {
    this.service.getFabricType().subscribe(res => {
      this.response = res;
      if (this.response.success == true) {
        this.fabricType = this.response.data;
      }
      else {
        this.toastr.error(this.response.message, 'Message.');
      }
    })
  }




  addEnquiryItem() {
    let varr =
    {
      "enquiryId": this.EnquiryId,
      "description": this.data.description,
      "itemQuantity": this.data.itemQuantity,
      "itemUOMId": this.data.itemUOMId,
      "compositionPercentage": this.data.compositionPercentage,
      "compositionFebricTypeId": this.data.compositionFebricTypeId,
      "compositionAdditionalInfo": this.data.compositionAdditionalInfo,
      "construction": this.data.construction,
      "colorId": this.data.colorId,
      "weight": this.data.weight,
      "loomTypeId": this.data.loomTypeId,
      "size": this.data.size,
      "remarks": this.data.remarks,
      "active": this.data.active,
    }

    this.http.
      post(`${environment.apiUrl}/api/Enquiries/AddEnquiryItem`, varr)
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



  editEnquiry(id) {
    this.http.get(`${environment.apiUrl}/api/Enquiries/GetEnquiryItemById/` + id)
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



  updateEnquiry() {
    let varr = {
      "enquiryId": this.data.enquiryId,
      "description": this.data.description,
      "itemQuantity": this.data.itemQuantity,
      "itemUOMId": this.data.itemUOMId,
      "compositionPercentage": this.data.compositionPercentage,
      "compositionFebricTypeId": this.data.compositionFebricTypeId,
      "compositionAdditionalInfo": this.data.compositionAdditionalInfo,
      "construction": this.data.construction,
      "colorId": this.data.colorId,
      "weight": this.data.weight,
      "loomTypeId": this.data.loomTypeId,
      "size": this.data.size,
      "remarks": this.data.remarks,
      "active": this.data.active,
    }

    this.http.
      put(`${environment.apiUrl}/api/Enquiries/UpdateEnquiryItem/` + this.EnquiryItemId, varr)
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
