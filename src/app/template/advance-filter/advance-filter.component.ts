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
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-advance-filter',
  templateUrl: './advance-filter.component.html',
  styleUrls: ['./advance-filter.component.css']
})
export class AdvanceFilterComponent implements OnInit {
  dateformater: Dateformater = new Dateformater();  
  data2:any =[];
  article: any = [];
  data:any =[];
  response: any;
  buyer: any={};
  seller: any={};
   rows:any = [];
   columns : any = {}
   billSearch : any = [];
   billSearch2 : any = [];
   loggedInDepartmentName: string;
   @ViewChild(NgForm) filterForm;


  constructor(
    private http: HttpClient,
    private service: ServiceService,
    private spinner: NgxSpinnerService,
    private router: Router,

    private toastr: ToastrService,
  ) { }

  ngOnInit(): void {
    this.loggedInDepartmentName=localStorage.getItem('loggedInDepartmentName');
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
  GetArticlesDropdown() {
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
  navigate(obj){
    if(this.loggedInDepartmentName == "Home Textile & Garment"){
      this.router.navigate(['/contract/active-contract-details'], { queryParams: {id: obj.id} });
    }
    else{

      this.router.navigate(['/FabCot/active-contract-details'], { queryParams: {id: obj.id} });
    }

  }
  navigateEditContract(obj) {
    this.router.navigate(['/FabCot/active-contract-details'], { queryParams: {id: obj.id} });
  };

  navigateTobill(obj) {
    this.router.navigate(['/yarn-billing-and-payment/open-bill'], { queryParams: {id: obj.billId} });
  };
clear(){
  this.data = [];
  this.data2 = [];
}
clear2(){
  this.billSearch = [];
  this.billSearch2= [];
}
cloneContract(obj){
  let varr = {

  }
this.spinner.show();
  
   this.http.put(`${environment.apiUrl}/api/Contracts/CloneContract/`+obj.id , varr )
        .subscribe(
          res => {
  
            this.response = res;
            if (this.response.success == true) {
              // this.data = this.response.data;
              this.data = [];
              this.data2 = [];
              this.billSearch = [];
              this.billSearch2= [];
            this.toastr.success(this.response.message, 'Message.');
         
this.spinner.hide();

             }
            else {
              this.toastr.error(this.response.message, 'Message.');
this.spinner.hide();

            }
  
          }, err => {
            if (err.status == 400) {
              this.toastr.error(this.response.message, 'Message.');
              this.spinner.hide();

            }

          });


}



deleteContract(obj) {
  Swal.fire({
    title: GlobalConstants.deleteTitle, //'Are you sure?',
    text: GlobalConstants.deleteMessage + ' ' + '"' + obj.autoContractNumber + '"',
    icon: 'error',
    showCancelButton: true,
    confirmButtonColor: '#ed5565',
    cancelButtonColor: '#dae0e5',
    cancelButtonText: 'No',
    confirmButtonText: 'Yes',
    reverseButtons: true,
    position: 'top',
  }).then((result) => {
    if (result.isConfirmed) {
      this.spinner.show();

      this.http.delete(`${environment.apiUrl}/api/Contracts/DeleteContract/` + obj.id)
        .subscribe(
          res => {
            this.response = res;
            if (this.response.success == true) {
              this.toastr.error(this.response.message, 'Message.');
              // this.getAllEnquiryItems();
              this.data = [];
              this.data2 = [];
              this.billSearch = [];
              this.billSearch2= [];
this.spinner.hide();
              

            }
            else {
              this.toastr.error(this.response.message, 'Message.');
this.spinner.hide();

            }

          }, err => {
            if (err.status == 400) {
              this.toastr.error(this.response.message, 'Message.');
this.spinner.hide();

            }
          });

    }
  })

}

 getSearch() {
    let varr = {
      "buyerId": this.data.buyerId == undefined ? 0 : this.data.buyerId ,
      "sellerId": this.data.sellerId == undefined ? 0 : this.data.sellerId,
      "poNumber": this.data.poNumber == undefined ? 'string' : this.data.poNumber,
      "autoContractNumber":this.data.autoContractNumber == undefined? 'string' : this.data.autoContractNumber,
      "contractDate": this.dateformater.toModel(this.data.contractDate) == null ? 'string' :  this.dateformater.toModel(this.data.contractDate),
      "sellerContractNo": this.data.sellerContractNo == undefined ? 'string' : this.data.sellerContractNo,
     "articleId": this.data.articleId == undefined? 0 : this.data.articleId
    }
this.spinner.show();
    this.http.
      post(`${environment.apiUrl}/api/Contracts/ContractAdvanceSearchFilter`, varr)
      .subscribe(
        res => {

          this.response = res;
          if (this.response.success == true  && this.response.data.length != 0) {
            this.toastr.success(this.response.message, 'Message.');
            this.data2 = this.response.data; 
      

         this.spinner.hide();
          }
          else if(this.data2.length == 0) {
            this.toastr.error("No such Contract Exist", 'Message.');
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
  getBill() {
    this.billSearch2 = []
    let varr = {
      "buyerId": this.billSearch.buyerId == undefined ? 0 : this.billSearch.buyerId ,
      "sellerId": this.billSearch.sellerId == undefined ? 0 : this.billSearch.sellerId,
      "billNumber": this.billSearch.billNumber == undefined ? 'string' : this.billSearch.billNumber,
      "contractNo":this.billSearch.contractNo == undefined? 'string' : this.billSearch.contractNo,
      "billDate": this.dateformater.toModel(this.billSearch.billDate) == null ? 'string' :  this.dateformater.toModel(this.billSearch.billDate),
      "billAmount":  0 
     
    }
this.spinner.show();
    this.http.
      post(`${environment.apiUrl}/api/Contracts/BillAdvanceSearchFilter`, varr)
      .subscribe(
        res => {

          this.response = res;
          if (this.response.success == true && this.response.data.length != 0) {
            this.toastr.success(this.response.message, 'Message.');
            this.billSearch2 = this.response.data; 
      

         this.spinner.hide();
          }
          else if(this.billSearch2.length == 0) {
            this.toastr.error("No such Contract Exist", 'Message.');
         this.spinner.hide();
          }
          else{
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
