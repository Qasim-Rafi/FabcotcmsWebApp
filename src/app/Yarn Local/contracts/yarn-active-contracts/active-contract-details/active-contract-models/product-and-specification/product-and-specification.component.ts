import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Dateformater } from 'src/app/shared/dateformater';
import { ServiceService } from 'src/app/shared/service.service';
import { environment } from 'src/environments/environment';
import { Form, NgForm } from '@angular/forms';

@Component({
  selector: 'app-product-and-specification',
  templateUrl: './product-and-specification.component.html',
  styleUrls: ['./product-and-specification.component.css']
})
export class ProductAndSpecificationComponent implements OnInit {
  dateformater: Dateformater = new Dateformater();  
  @Input() contractId;
  data:any ={};
  article: any={};
  @ViewChild(NgForm) prodSpecForm;

  response: any;
  constructor(
    private _NgbActiveModal: NgbActiveModal,
    private http: HttpClient,
    private service: ServiceService,
    private toastr: ToastrService,
  ) { }


  ngOnInit(): void {
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
        this.article = this.response.data;
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
  addContractProduct(NgForm:Form) {

    let varr = {

      "contractId": this.contractId,
      "construction": this.data.construction,
      "articleId": this.data.articleId,
   
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
onSubmit(){
this.addContractProduct(this.prodSpecForm)
}
}
