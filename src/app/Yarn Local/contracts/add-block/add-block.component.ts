import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Dateformater } from 'src/app/shared/dateformater';
import { ServiceService } from 'src/app/shared/service.service';
import { AddBuyerComponent } from '../../yarn-configuration/buyer/add-buyer/add-buyer.component';
import { AddSellerFormComponent } from '../../yarn-configuration/seller/add-seller-form/add-seller-form.component';
import { AddPackingComponent } from '../../yarn-configuration/product/packing/add-packing/add-packing.component';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-add-block',
  templateUrl: './add-block.component.html',
  styleUrls: ['./add-block.component.css']
})
export class AddBlockComponent implements OnInit {
data:any={};
dateformater: Dateformater = new Dateformater();
loggedInDepartmentCode: string;
loggedInDepartmentName: string;
response: any;
sellerPOC: any = [];
buyerPOC: any = [];
newBuyer: any;
buyer: any = [];
newSeller: number;
seller: any = [];
Article: any = [{ id: 1 }];
article: any = [];
newArticle: any;
uomList: any = [];
selected: any;
currency: any = [];
packing: any = [];
newPacking: any;
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
    this.loggedInDepartmentName = localStorage.getItem('loggedInDepartmentName');
    this.loggedInDepartmentCode = localStorage.getItem('loggedInDepartmentCode');
    let olddate = new Date();
    let latest_date = this.datepipe.transform(olddate, 'yyyy-MM-dd');
    this.data.enquiryDate = this.dateformater.fromModel(latest_date);
this.getBlockNumber()
    this.GetBuyersDropdown("start");
    this.GetSellerDropdown("start");
    this.GetArticleDropdown("start");
    this.GetCurrencyDropdown();
    this.GetUOMDropdown()
    this.GetpackingDropdown("start");
  }


  addblock(form: NgForm) {
    
    let varr = {
      "contractNumber": this.data.contractNumber,
      "to": this.data.to,
      "attention": this.data.attention,
      "sellerId": this.data.sellerId,
      "buyerId": this.data.buyerId,
      "packingId": this.data.packingId,
      "commission": this.data.commission,
      "commisionUOMId": this.data.commisionUOMId,
      "termOfPayment": this.data.termOfPayment,
      "delivery": this.data.delivery,
      "sellerDelivery": this.data.sellerDelivery,
      "deliverTerms": this.data.deliverTerms,
      "sellerDeliverTerms": this.data.sellerDeliverTerms,
      "condition": this.data.condition,
      "whtExemption": this.data.whtExemption,
      "remarks": this.data.remarks,
      "otherTerms": this.data.otherTerms,
      "note": this.data.note,
      "quantity": this.data.quantity,
      "quantityUOM": this.data.quantityUOM,
      "blockBookingArticleList": this.Article,
    }
    this.service.addBlock(varr).subscribe(res => {
      this.response = res;
      if (this.response.success == true) {
        this.data = this.response.data;
        
        this.router.navigate(['/FabCot/edit-active-block'], { queryParams: {id: this.data} });
      }
      else {
        this.toastr.error(this.response.message, 'Message.');
      }
    })
  }
  getBlockNumber() {
    this.http.get(`${environment.apiUrl}/api/BlockBooking/GetNextBlockNumber`)
      .subscribe(
        res => {

          this.response = res;
          if (this.response.success == true) {
            this.data.contractNumber = this.response.data.contractNumber;
          }
          else {
            this.toastr.error('Something went Worng', 'Message.');
          }

        }, err => {
          if (err.status == 400) {
            this.toastr.error('Something went Worng', 'Message.');
          }
        });
  }
  addYarnPackingForm() {
    const modalRef = this.modalService.open(AddPackingComponent, { centered: true });
    modalRef.result.then((data) => {
      // on close
      if (data.parent == true) {

        this.newPacking = data.id
        this.GetpackingDropdown("other");




      }
    }, (reason) => {
      // on dismiss
    });
  }
  GetpackingDropdown(type: string) {
    this.service.getPackaging().subscribe(res => {
      this.response = res;
      if (this.response.success == true) {
        this.packing = this.response.data;
        // if (type == "other") {
        //   // this.seller.id = this.newSeller;
        //   this.data.packingId = this.newPacking
        // }

      }
      else {
        this.toastr.error(this.response.message, 'Message.');
      }
    })
  }
  GetArticleDropdown(type: string) {
    this.service.getArticles().subscribe(res => {
      this.response = res;
      if (this.response.success == true) {
        this.article = this.response.data;
        
        if (type == "other") {
          // this.seller.id = this.newSeller;
          this.data.articleId = this.newArticle
        }
      }
      else {
        this.toastr.error(this.response.message, 'Message.');
      }
    })
  }
  getBuyerPOC(event) {
    let id = event;
    this.service.getBuyersPOC(id).subscribe(res => {
      this.response = res;
      if (this.response.success == true) {
        this.buyerPOC = this.response.data;
        if (this.buyerPOC.length == 0) {

          this.data.buyerPOCId = null
        }
        else {
          this.data.buyerPOCId = this.buyerPOC[0].id
        }
        // this.data.beneficiaryCriteriaId = 2; 

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
        this.selected = this.uomList[0].name;
        if (this.loggedInDepartmentName =='Yarn Local Karachi') {
        this.data.quantityUOMId =this.uomList[0].name;
      this.data.rateUOMId = this.uomList[0].name;
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
  getSellersPOC(event) {
    let id = event;
    this.service.getSellersPOC(id).subscribe(res => {
      this.response = res;
      if (this.response.success == true) {
        this.sellerPOC = this.response.data;
        if (this.sellerPOC.length == 0) {

          this.data.sellerPOCId = null
        }
        else {
          this.data.sellerPOCId = this.sellerPOC[0].id
        }
        // this.data.beneficiaryCriteriaId = 2; 

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
  GetBuyersDropdown(type: string) {
    this.service.getBuyers().subscribe(res => {
      this.response = res;
      if (this.response.success == true) {

        this.buyer = this.response.data;
        // this.newBuyer = this.response.data.lastId



        if (type == "other") {
          // this.buyer.id = this.newBuyer;
          this.data.buyerId = this.newBuyer;
        }

      }
      else {
        this.toastr.error(this.response.message, 'Message.');
      }
    })
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
  GetSellerDropdown(type: string) {
    this.service.GetSellerDropdownbydepartment().subscribe(res => {
      this.response = res;
      if (this.response.success == true) {

        this.seller = this.response.data;
        // this.newSeller = this.response.data



        if (type == "other") {
          // this.seller.id = this.newSeller;
          this.data.sellerId = this.newSeller
        }

      }
      else {
        this.toastr.error(this.response.message, 'Message.');
      }
    })
  }
  addArticle() {
    this.Article.push({ id: this.Article.length });
    // this.Article.push({ id: 0 });

  }
  removeArticle(i: number) {
    this.Article.splice(i, 1);
  }
}
