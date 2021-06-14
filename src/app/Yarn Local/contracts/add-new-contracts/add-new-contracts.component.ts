import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ServiceService } from 'src/app/shared/service.service';
// import { ArticleComponent } from '../Modals/article/article.component';
import { BuyerComponent } from '../Modals/buyer/buyer.component';
import { NgForm } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { AddSellerFormComponent } from '../../yarn-configuration/seller/add-seller-form/add-seller-form.component';
import { Dateformater } from 'src/app/shared/dateformater';
import { NgxSpinnerService } from 'ngx-spinner';

import { AddBuyerComponent } from '../../yarn-configuration/buyer/add-buyer/add-buyer.component';
import { AddArticleComponent } from '../../yarn-configuration/articles/add-article/add-article.component';
import { AddPackingComponent } from '../../yarn-configuration/product/packing/add-packing/add-packing.component';
import { AddPriceComponent } from '../../yarn-configuration/product/price-term/add-price/add-price.component';
import { DatePipe } from '@angular/common';


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
  newBuyer: any;
  newArticle: any;
  newPacking:any;
  newSeller: number;
  counter3 :number =1;
  new:any=[];
  new2:any=[];
  new3:any=[];
  newPrice:any;
  @ViewChild(NgForm) contractForm;
  objEnquiry=0;
  dateformater: Dateformater = new Dateformater();
selected:any;
sensorTypes:any;
selectedAttributes:any;
  constructor(
    private service: ServiceService,
    private toastr: ToastrService,
    private modalService: NgbModal,
    private spinner: NgxSpinnerService,
    private router: Router,
    private http: HttpClient,
    public datepipe: DatePipe,
  ) { }

  ngOnInit(): void {
    this.data.quantityUOMId =8
    this.data.rateUOMId =7
    let olddate=new Date();
    let latest_date =this.datepipe.transform(olddate, 'yyyy-MM-dd');
    this.data.enquiryDate =this.dateformater.fromModel(latest_date);
    this.GetBuyersDropdown("start");
    this.GetSellerDropdown("start");
    this.GetUOMDropdown();
    this.GetArticleDropdown("start");
    this.GetCurrencyDropdown();
    this.GetpackingDropdown("start");
    this.GetPriceTermDropdown("start");
    this.selected = this.uomList[0].name;
  
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
        // this.newBuyer = this.response.data.lastId



        if(type == "other")
        {
          // this.buyer.id = this.newBuyer;
          this.data.buyerId = this.newBuyer;
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
        // this.newSeller = this.response.data



        if(type == "other")
        {
          // this.seller.id = this.newSeller;
          this.data.sellerId = this.newSeller
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

  GetPriceTermDropdown(type:string) {
    this.service.getPriceTerm().subscribe(res => {
      this.response = res;
      if (this.response.success == true) {
        this.priceterm = this.response.data;
        if(type == "other")
        {
          // this.seller.id = this.newSeller;
          this.data.priceTermId = this.newPrice
        }
      }
      else {
        this.toastr.error(this.response.message, 'Message.');
      }
    })
  } 

  GetpackingDropdown(type:string) {
    this.service.getPackaging().subscribe(res => {
      this.response = res;
      if (this.response.success == true) {
        this.packing = this.response.data;
        if(type == "other")
        {
          // this.seller.id = this.newSeller;
          this.data.packingIds = this.newPacking
        }
        
      }
      else {
        this.toastr.error(this.response.message, 'Message.');
      }
    })
  }

  GetArticleDropdown(type:string) {
    this.service.getArticles().subscribe(res => {
      this.response = res;
      if (this.response.success == true) {
        this.article = this.response.data;
        if(type == "other")
        {
          // this.seller.id = this.newSeller;
          this.data.articleId = this.newArticle
        }
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
      if (data.parent == true) {

        this.newBuyer = data.id
        this.GetBuyersDropdown("other");
     

      }
    }, (reason) => {
      // on dismiss
    });
  } 




  addArticleForm() {
    const modalRef = this.modalService.open(AddArticleComponent, { centered: true });
    modalRef.result.then((data) => {
      // on close
      if (data.parent == true) {

        this.newArticle = data.id
        this.GetArticleDropdown("other");
     

      }
    }, (reason) => {
      // on dismiss
    });

  }




  
  addSellerForm() {
    const modalRef = this.modalService.open(AddSellerFormComponent, { centered: true });
    modalRef.result.then((data) => {
      // on close
      if (data.parent == true) {

        this.newSeller = data.id
        this.GetSellerDropdown("other");
     

      }
    }, (reason) => {
      // on dismiss
    });

  }
  addYarnPackingForm() {
    const modalRef = this.modalService.open(AddPackingComponent, { centered: true });
    modalRef.result.then((data) => {
      // on close
      if ( data.parent == true) {
        
        this.newPacking = data.id
        this.GetpackingDropdown("other");
    



      }
    }, (reason) => {
      // on dismiss
    });
  }
  addYarnPriceForm() {
    const modalRef = this.modalService.open(AddPriceComponent, { centered: true });
    modalRef.result.then((data) => {
      // on close
      if (data.parent == true) {
        
        this.newPrice = data.id

        this.GetPriceTermDropdown("other");
    



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
          "contractNo": this.data.contractNo,
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
