import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ServiceService } from 'src/app/shared/service.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-product-and-specification',
  templateUrl: './product-and-specification.component.html',
  styleUrls: ['./product-and-specification.component.css']
})
export class ProductAndSpecificationComponent implements OnInit {


  @Input() contractId;
  data:any ={};
  response: any;
  article: any={};
  designType: any={};
  processType: any={};
  process: any={};

  constructor(
    private _NgbActiveModal: NgbActiveModal,
    private http: HttpClient,
    private service: ServiceService,
    private toastr: ToastrService,
  ) { }

  ngOnInit(): void {

    this.GetDesignTypeDropdown();
    this.GetProcessTypeDropdown();
    this.GetProcessDropdown();
    this.GetArticleDropdown();
    this.getContractProductData();
  }
  get activeModal() {
    return this._NgbActiveModal;
  }

  GetArticleDropdown() {
    this.service.getArticles().subscribe(res => {
      this.response = res;
      if (this.response.success == true) {
        this.article = this.response.data ;
      }
      else {
        this.toastr.error(this.response.message, 'Message.');
      }
    })
  }

  GetProcessDropdown() {
    this.service.getProcess().subscribe(res => {
      this.response = res;
      if (this.response.success == true) {
        this.process = this.response.data ;
      }
      else {
        this.toastr.error(this.response.message, 'Message.');
      }
    })
  }


  GetProcessTypeDropdown() {
    this.service.getProcessType().subscribe(res => {
      this.response = res;
      if (this.response.success == true) {
        this.processType = this.response.data ;
      }
      else {
        this.toastr.error(this.response.message, 'Message.');
      }
    })
  }

  GetDesignTypeDropdown() {
    this.service.getDesignType().subscribe(res => {
      this.response = res;
      if (this.response.success == true) {
        this.designType = this.response.data ;
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
 
        }, err => {
          if (err.status == 400) {
            this.toastr.error(this.response.message, 'Message.');
          }
        });
  }




  addContractProduct(form:NgForm) {

    let varr = {

      "contractId": this.contractId,
      "articleId": this.data.articleId,
      "processId": this.data.processId,
      "processTypeId": this.data.processTypeId,
      "designTypeId": this.data.designTypeId,
    }

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





}
