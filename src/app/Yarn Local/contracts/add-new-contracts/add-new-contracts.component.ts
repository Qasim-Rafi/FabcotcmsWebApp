import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ServiceService } from 'src/app/shared/service.service';
import { ArticleComponent } from '../Modals/article/article.component';
import { BuyerComponent } from '../Modals/buyer/buyer.component';
import { NgForm } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { AddSellerFormComponent } from 'src/app/configuration/seller/add-seller-form/add-seller-form.component';
import { Dateformater } from 'src/app/shared/dateformater';
import { NgxSpinnerService } from 'ngx-spinner';
<<<<<<< Updated upstream

=======
import { AddBuyerComponent } from '../../yarn-configuration/buyer/add-buyer/add-buyer.component';
// import { AddBuyerComponent } from 'src/app/configuration/buyer/add-buyer/add-buyer.component';
>>>>>>> Stashed changes

@Component({
  selector: 'app-add-new-contracts',
  templateUrl: './add-new-contracts.component.html',
  styleUrls: ['./add-new-contracts.component.css']
})
export class AddNewContractsComponent implements OnInit {

  response: any;
  data: any = {};
  buyer: any= [];
  seller: any= [];
  article: any= [];
  packing: any= [];
  priceterm: any= [];
  uomList: any= [];
  currency: any= [];
  newBuyer: number;
  newSeller: number;
  counter3 :number =1;
  new:any=[];
  new2:any=[];
  new3:any=[];
  @ViewChild(NgForm) contractForm;
  objEnquiry=0;
  dateformater: Dateformater = new Dateformater();


  constructor(
    private service: ServiceService,
    private toastr: ToastrService,
    private modalService: NgbModal,
    private spinner: NgxSpinnerService,
    private router: Router,
    private http: HttpClient,
  ) { }

  ngOnInit(): void {
    this.GetBuyersDropdown("start");
    this.GetSellerDropdown("start");
    this.GetUOMDropdown();
    this.GetArticleDropdown();
    this.GetCurrencyDropdown();
    this.GetpackingDropdown();
    this.GetPriceTermDropdown();
  }


  addMore() {
    this.new.push({id: this.new.length});
  }
  add() {
    this.new2.push({id: this.new2.length});
  }
  add3() {
    this.new3.push({id: this.new3.length});
    this.counter3++
  }
  remove(i: number) {
    this.new.splice(i, 1);
  }
  remove2(i: number) {
    this.new2.splice(i, 1);
  }
  remove3(i: number) {
    this.new3.splice(i, 1);
    this.counter3-- ;
  }




  
  GetBuyersDropdown(type:string) {
    this.service.getBuyers().subscribe(res => {
      this.response = res;
      if (this.response.success == true) {

        this.buyer = this.response.data;
        this.newBuyer = this.response.data.lastId



        if(type == "other")
        {
          this.buyer.id = this.newBuyer;
          this.data.buyerId = this.buyer.id
        }
       
      }
      else {
        this.toastr.error(this.response.message, 'Message.');
      }
    })
  }


  GetSellerDropdown(type:string) {
    this.service.getSellerLookup().subscribe(res => {
      this.response = res;
      if (this.response.success == true) {

        this.seller = this.response.data;
        this.newSeller = this.response.data



        if(type == "other")
        {
          this.seller.id = this.newSeller;
          this.data.sellerId = this.seller.id
        }
       
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
        this.uomList = this.response.data;
      }
      else {
        this.toastr.error(this.response.message, 'Message.');
      }
    })
  }

  GetPriceTermDropdown() {
    this.service.getPriceTerm().subscribe(res => {
      this.response = res;
      if (this.response.success == true) {
        this.priceterm = this.response.data;
      }
      else {
        this.toastr.error(this.response.message, 'Message.');
      }
    })
  } 

  GetpackingDropdown() {
    this.service.getPackaging().subscribe(res => {
      this.response = res;
      if (this.response.success == true) {
        this.packing = this.response.data;
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


  GetCurrencyDropdown() {
    this.service.getCurrencyType().subscribe(res => {
      this.response = res;
      if (this.response.success == true) {
        this.currency = this.response.data;
      }
      else {
        this.toastr.error(this.response.message, 'Message.');
      }
    })
  }





  addBuyerForm() {
    const modalRef = this.modalService.open(AddBuyerComponent, { centered: true });
    modalRef.result.then((data) => {
      // on close
      if (data == true) {

  

      }
    }, (reason) => {
      // on dismiss
    });
  } 




  addArticleForm() {
    const modalRef = this.modalService.open(ArticleComponent, { centered: true });
    modalRef.result.then((data) => {
      // on close
      if (data == true) {
     
       

      }
    }, (reason) => {
      // on dismiss
    });

  }




  
  addSellerForm() {
    const modalRef = this.modalService.open(AddSellerFormComponent, { centered: true });
    modalRef.result.then((data) => {
      // on close
      if (data == true) {
     
       

      }
    }, (reason) => {
      // on dismiss
    });

  }

  navigate() {
    this.router.navigateByUrl('/FabCot/active-contract');
  };


  addContract() {
    let departmentId=parseInt(localStorage.getItem('loggedInDepartmentId'))
    let varr = {
      // "enquiryDate": this.dateformater.toModel(this.data.enquiryDate),
          "poNumber": this.data.poNumber,
          "sellerId": this.data.sellerId,
          "buyerId": this.data.buyerId,
          "articleId": this.data.articleId,
          "construction":this.data.construction,
          "quantity": this.data.quantity,        
          "quantityUOMId": this.data.quantityUOMId,        
          "toleranceValue": this.data.toleranceValue,
          "rate": this.data.rate,        
          "currencyId": this.data.currencyId,
          "rateUOMId": this.data.rateUOMId,        
          "sellerPaymentTerm": this.data.sellerPaymentTerm,
          "buyerPaymentTerm": this.data.buyerPaymentTerm,
          "packingId": this.data.packingId,        
          "priceTermId": this.data.priceTermId,        
          "sellerDeliveryDate": this.data.sellerDeliveryDate,
          "buyerDeliveryDate": this.data.buyerDeliveryDate,
          "contractRemarks": this.data.contractRemarks,
          "buyerRemarks": this.data.buyerRemarks,        
          "otherConditionRemarks": this.data.otherConditionRemarks,
          "title": this.data.title, 
    }
this.spinner.show();
    this.http.
      post(`${environment.apiUrl}/api/Contracts/AddContract?`+'enquiryId='+this.objEnquiry+'&'+'departmentId='+departmentId, varr)
      .subscribe(
        res => {

          this.response = res;
          if (this.response.success == true) {
            this.toastr.success(this.response.message, 'Message.');
            this.contractForm.reset();
             this.router.navigate(['/FabCot/active-contract'], { queryParams: {id: this.response.data} });
            // this.router.navigate(['/enquiry/active-enquiries']);
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







}
