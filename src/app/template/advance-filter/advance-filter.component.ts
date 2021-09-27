import { HttpClient, HttpErrorResponse } from '@angular/common/http';
// import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ServiceService } from 'src/app/shared/service.service';
import { Component, Inject, Input, OnInit, ViewChild } from '@angular/core';
import { GlobalConstants } from 'src/app/Common/global-constants';
import { Dateformater } from 'src/app/shared/dateformater';
import { environment } from 'src/environments/environment';
import {FormsModule , NgForm, ReactiveFormsModule}  from '@angular/forms'
@Component({
  selector: 'app-advance-filter',
  templateUrl: './advance-filter.component.html',
  styleUrls: ['./advance-filter.component.css']
})
export class AdvanceFilterComponent implements OnInit {
  dateformater: Dateformater = new Dateformater();  
  data2:any =[];

  data:any =[];
  response: any;
  buyer: any={};
  seller: any={};
  article: any={};
   rows:any = [];
   columns : any = {}
   @ViewChild(NgForm) filterForm;


  constructor(
    private http: HttpClient,
    private service: ServiceService,
    private spinner: NgxSpinnerService,

    private toastr: ToastrService,
  ) { }

  ngOnInit(): void {
    this.GetBuyersDropdown();
    this.GetSellersDropdown();
    this.GetArticleDropdown();
  }
  GetBuyersDropdown() {
    this.service.getBuyers().subscribe(res => {
      this.response = res;
      if (this.response.success == true) {
        this.buyer = this.response.data;
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
clear(){
  this.data = [];
  this.data2 = [];
}
 getSearch() {
    let varr = {
      "buyerId": this.data.buyerId == undefined ? 0 : this.data.buyerId ,
      "sellerId": this.data.sellerId == undefined ? 0 : this.data.sellerId,
      "poNumber": this.data.poNumber == undefined ? 'string' : this.data.poNumber,
      "autoContractNumber":this.data.autoContractNumber == undefined? 'string' : this.data.autoContractNumber,
      "contractDate": this.dateformater.toModel(this.data.contractDate) == null ? 'string' :  this.dateformater.toModel(this.data.contractDate),
      "sellerContractNo": this.data.sellerContractNo == undefined ? 'string' : this.data.sellerContractNo
     
    }
this.spinner.show();
    this.http.
      post(`${environment.apiUrl}/api/Contracts/ContractAdvanceSearchFilter`, varr)
      .subscribe(
        res => {

          this.response = res;
          if (this.response.success == true) {
            this.toastr.success(this.response.message, 'Message.');
            this.data2 = this.response.data; 
      

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
