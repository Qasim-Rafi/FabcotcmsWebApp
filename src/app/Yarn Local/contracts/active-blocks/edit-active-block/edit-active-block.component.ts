import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Dateformater } from 'src/app/shared/dateformater';
import { ServiceService } from 'src/app/shared/service.service';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-edit-active-block',
  templateUrl: './edit-active-block.component.html',
  styleUrls: ['./edit-active-block.component.css']
})
export class EditActiveBlockComponent implements OnInit {
  data:any={};
  dateformater: Dateformater = new Dateformater();
  loggedInDepartmentCode: string;
  loggedInDepartmentName: string;
  response: any;
  buyer: any = [];
  article: any = [];
  seller: any = [];
  uomList: any = [];
  currency: any = [];
packing: any = [];
queryParems: any = {};
contractId: any ;
Article: any = [];

  constructor(
    private service: ServiceService,
    private toastr: ToastrService,
    private modalService: NgbModal,
    private spinner: NgxSpinnerService,
    private router: Router,
    private route: ActivatedRoute,
    private http: HttpClient,
    public datepipe: DatePipe,
  ) { }

  ngOnInit(): void {
    this.queryParems = this.route.snapshot.queryParams;
    this.contractId = this.queryParems.id;
    this.GetBuyersDropdown();
    this.GetSellerDropdown();
    this.GetArticleDropdown();
    this.GetCurrencyDropdown();
    this.GetUOMDropdown()
    this.GetpackingDropdown();
this.getbyIdblock()


  }
  getbyIdblock(){
    this.service.getByIdBlock(this.contractId).subscribe(res => {
      this.response = res;
      if (this.response.success == true) {
        this.data = this.response.data;
        this.data.enquiryDate =this.dateformater.fromModel(this.data.createdDateTime);

        this.Article =this.data.blockBookingArticleList
        for (var i = 0; i < this.Article.length; i++) {
          this.Article[i].mode = 2;
          this.Article[i].isHide =false // Add "total": 2 to all objects in array
      }
      }
      else {
        this.toastr.error(this.response.message, 'Message.');
      }
    })
  }
  editblock(form: NgForm) {
    this.spinner.show()
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
      "deliverTerms": this.data.deliverTerms,
      "condition": this.data.condition,
      "whtExemption": this.data.whtExemption,
      "remarks": this.data.remarks,
      "otherTerms": this.data.otherTerms,
      "note": this.data.note,
      "blockBookingArticleList": this.Article,
    }
    this.service.updateBlock(this.contractId,varr).subscribe(res => {
      this.response = res;
      if (this.response.success == true) {
        this.data = this.response.data;
        this.getbyIdblock();
        this.spinner.hide();
      }
      else {
        this.toastr.error(this.response.message, 'Message.');
        this.spinner.hide();
      }
    })

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
  GetSellerDropdown() {
    this.service.GetSellerDropdownbydepartment().subscribe(res => {
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
  addArticle() {
    this.Article.push({ id: 0 ,mode:1,isHide:false});

  }
  removeArticle(i: number) {
    if(this.Article[i].id == 0 && this.Article[i].mode == 1){
      this.Article.splice(i, 1);
    }
    else if(this.Article[i].id != 0){
      this.Article[i].mode =3
      this.Article[i].isHide =true

    }
    
  }
}
