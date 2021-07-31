import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Dateformater } from 'src/app/shared/dateformater';
import { ServiceService } from 'src/app/shared/service.service';
import { environment } from 'src/environments/environment';
import { Form, NgForm } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-product-and-specification',
  templateUrl: './product-and-specification.component.html',
  styleUrls: ['./product-and-specification.component.css']
})
export class ProductAndSpecificationComponent implements OnInit {
  dateformater: Dateformater = new Dateformater();  
  loggedInDepartmentName: string;

  @Input() contractId;
  data:any ={};
  data4:any ={};

  article: any={};
  weave:any = {};
  fabric:any = {};
  selvedge:any = {};
  pick:any = {};
  warp:any = {};
  weft:any = {};

  piece:any = {};

  @ViewChild(NgForm) prodSpecForm;

  response: any;
  constructor(
    private _NgbActiveModal: NgbActiveModal,
    private http: HttpClient,
    private service: ServiceService,
    private spinner: NgxSpinnerService,

    private toastr: ToastrService,
  ) { }


  ngOnInit(): void {
    this.loggedInDepartmentName=localStorage.getItem('loggedInDepartmentName');

    this.GetArticleDropdown();
    this.getContractProductData();
    this.GetFabricDropdown();
    this.GetPickDropdown();
this.GetPieceDropdown();
this.GetWeaveDropdown();
this.getBrand();
this.GetWeftDropdown();
this.GetWarpDropdown();
this.GetSelvedgeDropdown();
  }
  get activeModal() {
    return this._NgbActiveModal;
  }
  getBrand() {

    this.http
      .get(`${environment.apiUrl}/api/ExportConfigs/GetAllBrand`)
      .subscribe(res => {
        this.response = res;
  
        if (this.response.success == true) {
          this.data4 = this.response.data;
        }
        else {
          this.toastr.error(this.response.message, 'Message.');
        }
        // this.spinner.hide();
      }, err => {
        if (err.status == 400) {
          this.toastr.error(err.error.message, 'Message.');;
        }
        //  this.spinner.hide();
      });
  }
  GetArticleDropdown() {
    this.service.getArticles().subscribe(res => {
      this.response = res;
      if (this.response.success == true) {
        this.article = this.response.data;
      }
      else {
        this.toastr.error(this.response.message, 'Message.');
      }
    })
  }
  GetWeaveDropdown() {
    this.service.getWeave().subscribe(res => {
      this.response = res;
      if (this.response.success == true) {
        this.weave = this.response.data;
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
  GetSelvedgeDropdown() {
    this.service.getSelvedge().subscribe(res => {
      this.response = res;
      if (this.response.success == true) {
        this.selvedge = this.response.data;
      }
      else {
        this.toastr.error(this.response.message, 'Message.');
      }
    })
  }
  GetPieceDropdown() {
    this.service.getPieceLength().subscribe(res => {
      this.response = res;
      if (this.response.success == true) {
        this.piece = this.response.data;
      }
      else {
        this.toastr.error(this.response.message, 'Message.');
      }
    })
  }
  GetWarpDropdown() {
    this.service.getBrWarp().subscribe(res => {
      this.response = res;
      if (this.response.success == true) {
        this.warp = this.response.data;
      }
      else {
        this.toastr.error(this.response.message, 'Message.');
      }
    })
  }
  GetWeftDropdown() {
    this.service.getBrWeft().subscribe(res => {
      this.response = res;
      if (this.response.success == true) {
        this.weft = this.response.data;
      }
      else {
        this.toastr.error(this.response.message, 'Message.');
      }
    })
  }
  GetPickDropdown() {
    this.service.getPickInsertion().subscribe(res => {
      this.response = res;
      if (this.response.success == true) {
        this.pick = this.response.data;
      }
      else {
        this.toastr.error(this.response.message, 'Message.');
      }
    })
  }
  
  getContractProductData() {
    this.http.get(`${environment.apiUrl}/api/Contracts/GetContractProductSpecificationById/` + this.contractId)
      .subscribe(
        res => {
          this.response = res;
          if (this.response.success == true) {
            this.data = this.response.data;
            
          }
          else {
            this.toastr.error(this.response.message, 'Message.');
          }
 
        },(err: HttpErrorResponse) => {
          const messages = this.service.extractErrorMessagesFromErrorResponse(err);
          this.toastr.error(messages.toString(), 'Message.');
          console.log(messages);
        });
  }
  addContractProduct(NgForm:Form) {

    let varr = {

      "contractId": this.contractId,
      "construction": this.data.construction,
      "articleId": this.data.articleId,
      "pecenetAge": this.data.pecenetAge,
      "brandId": this.data.brandId,
      "febricId": this.data.febricId,
      "gsm": this.data.gsm,
      "tolerance": this.data.tolerance,
      "weaveId": this.data.weaveId,
      "selvedgeId": this.data.selvedgeId,
      "pieceLengthId": this.data.pieceLengthId,
      "pickInsertionId": this.data.pickInsertionId,
      "width": this.data.width,
      "blendingRatioWarpId": this.data.blendingRatioWarpId,
      "blendingRatioWeftId": this.data.blendingRatioWeftId
    }
 this.spinner.show();
    this.http.
      post(`${environment.apiUrl}/api/Contracts/AddContractProductSpecification`, varr)
      .subscribe(
        res => {

          this.response = res;
          if (this.response.success == true) {
            this.toastr.success(this.response.message, 'Message.');
            // this.getEnquiryData(this.objEnquiry);
            this.activeModal.close(true);
            this.getContractProductData();
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
onSubmit(){
this.addContractProduct(this.prodSpecForm)
}
}
