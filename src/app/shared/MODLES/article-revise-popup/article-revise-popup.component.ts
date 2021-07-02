import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, Input, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { environment } from 'src/environments/environment';
import { ToastrService } from 'ngx-toastr';
import { ServiceService } from '../../service.service';
import { NgForm } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-article-revise-popup',
  templateUrl: './article-revise-popup.component.html',
  styleUrls: ['./article-revise-popup.component.css']
})
export class ArticleRevisePopupComponent implements OnInit {
  @Input() statusCheck;
  @Input() rowData;
  data: any = {};
  response: any;
  displaydata:any={};
  obj:any;
  constructor(
    private _NgbActiveModal: NgbActiveModal,
    private http: HttpClient,
    private toastr: ToastrService,
    private service: ServiceService,
    private spinner: NgxSpinnerService,

  ) { }

  ngOnInit(): void {
    this.statusCheck =this.statusCheck;
    this.rowData;
    this.get();
  }

  get() {
    this.http.get(`${environment.apiUrl}/api/ExportContracts/GetContractArticleById/` + this.rowData.id)
      .subscribe(
        res => {
          this.response = res;
          this.displaydata= this.response.data;
          if(this.statusCheck == 'Edit'){
            if (this.response.success == true) {
            
              this.data = this.response.data;
            }
            else {
              this.toastr.error(this.response.message, 'Message.');
            }
          }

        }, err => {
          if (err.status == 400) {
            this.toastr.error(this.response.message, 'Message.');
          }
        });
  }
  saveData( check) {
   
    this.spinner.show();
if(this.statusCheck =='ADD'){
  
    let varr = {
    
      
      "id":  this.rowData.id,
      "articleId":  this.rowData.acrticleId,
      "contractId": this.rowData.contractId,
      "contractArticleQuantity": this.data.contractArticleQuantity,
      "contractArticleRate": this.data.contractArticleRate,
      "contractArticleCommission": this.data.contractArticleCommissionv,
      "isDeleted": this.data.isDeleted,
      "isAddedMore": this.data.isAddedMore,
      
    }
  this.http.
  post(`${environment.apiUrl}/api/ExportContracts/AddContractArticleRevised`, varr)
  .subscribe(
    res => {
      this.response = res;
      if (this.response.success == true) {
        this.toastr.success(this.response.message, 'Message.');
        this.obj = this.response.data 
        this.activeModal.close(this.obj);
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
      // if (err.status == 400) {
      //   this.toastr.error(this.response.message, 'Message.');
      // }
    });
}
else{
    this.http.
      post(`${environment.apiUrl}/api/Enquiries/AddEnquiryItem`, this.data)
      .subscribe(
        res => {
          this.response = res;
          if (this.response.success == true) {
            this.toastr.success(this.response.message, 'Message.');
            // this.buyerForm.reset();
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
          // if (err.status == 400) {
          //   this.toastr.error(this.response.message, 'Message.');
          // }
        });
      }
  }
  get activeModal() {
    return this._NgbActiveModal;
  }
}
