import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgForm } from '@angular/forms';
import { ServiceService } from 'src/app/shared/service.service';
import { NgxSpinnerService } from 'ngx-spinner';
@Component({
  selector: 'app-items',
  templateUrl: './items.component.html',
  styleUrls: ['./items.component.css']
})
export class ItemsComponent implements OnInit {
  data: any = {};
  response: any;
  item: any[];
  values=[];
  contractCurrencyId:any[];
  itemUOMId: any=[];
  itemUOMId1: any=[];
  loomTypeId:any[];
  colorId:any[];
  FormName: any;
  uomList: any = [];
  fabric: any = [];
  uomList1: any = [];
  color: any = [];
  loomType: any = [];
  currency: any[];
  @Input() itemId;
  @Input() enquiryId;
  @Input() contractId;

  @ViewChild(NgForm) ItemForm;
  @Input() statusCheck;
  @ViewChild("focus") myInputField: ElementRef;
  
  constructor(
    private http: HttpClient,
    private toastr: ToastrService,
    private _NgbActiveModal: NgbActiveModal,
    private service: ServiceService,
    private spinner: NgxSpinnerService,
  ) { }

  ngOnInit(): void {
   
    this.GetCurrencyDropdown();
    this.GetUOMDropdown();
    this.GetFabricDropdown();
    this.GetColorDropdown();
    this.GetLoomDropdown();
    this.statusCheck = this.statusCheck;
    if (this.statusCheck == 'ItemEdit') {
      this.editItem();
    }
  }
  ngAfterViewInit() {
    this.myInputField.nativeElement.focus();
    }
  get activeModal() {
    return this._NgbActiveModal;
  }
 
  editItem() {
    this.http.get(`${environment.apiUrl}/api/Contracts/GetContractItemById/` + this.itemId)
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



  UpdateItem() {


    this.spinner.show();

    let varr = {
      "description": this.data.description,
      "contractId": this.contractId,
      "itemQuantity": this.data.itemQuantity,
      "itemUOMId": this.data.itemUOMId,
      "compositionPercentage": this.data.compositionPercentage,
      "compositionFebricTypeId": this.data.compositionFebricTypeId,
      "compositionAdditionalInfo": this.data.compositionAdditionalInfo,
      "construction": this.data.construction,
      "colorId": this.data.colorId,
      "weight": this.data.weight,
      "loomTypeId":this.data.loomTypeId,
      "size":this.data.size,
      "remarks": this.data.remarks,
      "active": true,
      "contractRate": this.data.contractRate,
      "contractCurrencyId": this.data.contractCurrencyId,
      "contractUOMId": this.data.contractUOMId,
      "contractCost": this.data.contractCost
    }

    this.http.
      put(`${environment.apiUrl}/api/Contracts/UpdateContractItem/`+ this.itemId ,varr)
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

        }, (err: HttpErrorResponse) => {
          const messages = this.service.extractErrorMessagesFromErrorResponse(err);
          this.toastr.error(messages.toString(), 'Message.');
          this.spinner.hide();

        });
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
  GetFabricDropdown() {
    this.service.getFabricType().subscribe(res => {
      this.response = res;
      if (this.response.success == true) {
        this.fabric = this.response.data;
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

  GetCurrencyDropdown() {
    this.service. getCurrencyType().subscribe(res => {
      this.response = res;
      if (this.response.success == true) {
        this.currency = this.response.data;
      }
      else {
        this.toastr.error(this.response.message, 'Message.');
      }
    })
  }

  addItem(form:NgForm) {


    this.spinner.show();

    let varr = {
      "description": this.data.description,
      "contractId": this.contractId,
      "itemQuantity": this.data.itemQuantity,
      "itemUOMId": this.data.itemUOMId,
      "compositionPercentage": this.data.compositionPercentage,
      "compositionFebricTypeId": this.data.compositionFebricTypeId,
      "compositionAdditionalInfo": this.data.compositionAdditionalInfo,
      "construction": this.data.construction,
      "colorId": this.data.colorId,
      "weight": this.data.weight,
      "loomTypeId":this.data.loomTypeId,
      "size":this.data.size,
      "remarks": this.data.remarks,
      "active": true,
      "contractRate": this.data.contractRate,
      "contractCurrencyId": this.data.contractCurrencyId,
      "contractUOMId": this.data.contractUOMId,
      "contractCost": this.data.contractCost
    }

    this.http.
      post(`${environment.apiUrl}/api/Contracts/AddContractItem/`, varr)
      .subscribe(
        res => {

          this.response = res;
          if (this.response.success == true) {
            this.toastr.success(this.response.message, 'Message.');

            this.ItemForm.reset();
            this.activeModal.close(true);
            this.spinner.hide();
          }
          else {
            this.toastr.error(this.response.message, 'Message.');
            this.spinner.hide();
          }

        }, (err: HttpErrorResponse) => {
          const messages = this.service.extractErrorMessagesFromErrorResponse(err);
          this.toastr.error(messages.toString(),'Message.');
          this.spinner.hide();

        });

  }
}

  