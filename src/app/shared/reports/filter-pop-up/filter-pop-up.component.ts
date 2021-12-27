import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Dateformater } from '../../dateformater';
import { ServiceService } from '../../service.service';

@Component({
  selector: 'app-filter-pop-up',
  templateUrl: './filter-pop-up.component.html',
  styleUrls: ['./filter-pop-up.component.css']
})
export class FilterPopUpComponent implements OnInit {
  menuName: any = {};
  comm: any = {};
  lc: any = {};
  includingBuyer: any = [];
  excludingBuyer: any = [];
  country: any = [];
  departments: any = [];
  users: any = [];
  response: any;
 data: any = [];
 Bendata: any = [];
  obj: any = {};
  dateformater: Dateformater = new Dateformater();  
  status = true;
  FormName: any;
  userName : any;
  userrole:string;
  typeId : any;
  deptId : any;
  deptId2 : any;
  variable:string;
  variable1:string;
  buyer : any = []
  seller : any = []
  article : any = []
  @Input() menu;
  constructor(
    private _NgbActiveModal: NgbActiveModal,
    private route: ActivatedRoute,
    private router: Router,
    private service: ServiceService,
    private toastr: ToastrService,
  ) { this.router.routeReuseStrategy.shouldReuseRoute = () => false; }

  ngOnInit(): void {
    this.data.paymentStatus =null;
    this.data.maturityStatus =null;
    this.menuName = this.route.snapshot.queryParams;
 this.variable=this.menuName.menuName;
 this.menuName=null;
 this.GetBuyersDropdown();
 this.GetSellersDropdown();
 this.GetArticleDropdown();
 
  }
  get activeModal() {
    return this._NgbActiveModal;
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
  datatransfer(){
    // this.data.branch;

    let varr = {
      "buyerId":this.data.buyerId ==undefined ? 0 :this.data.buyerId,
      "sellerId":this.data.sellerId == undefined?0 :this.data.sellerId,
      "contractNo":this.data.contractNo == undefined ? '': this.data.contractNo,
       "startInvoiceDate" :  this.data.startInvoiceDate == undefined?'':this.dateformater.toModel(this.data.startInvoiceDate),
       "endInvoiceDate" :  this.data.endInvoiceDate == undefined?'':this.dateformater.toModel(this.data.endInvoiceDate),
       "startBillDate" :  this.data.startBillDate == undefined?'':this.dateformater.toModel(this.data.startBillDate),
       "endIBillDate" :  this.data.endIBillDate == undefined?'':this.dateformater.toModel(this.data.endIBillDate),
       "billNo":this.data.billNo == undefined ? '': this.data.billNo,
       "saleInvoiceNo":this.data.saleInvoiceNo == undefined ? '': this.data.saleInvoiceNo,
       "articleId":this.data.articleId ==undefined ? 0 :this.data.articleId,
       "maturityStatus":this.data.maturityStatus,
       "paymentStatus":this.data.paymentStatus,


    }

    this.activeModal.close(varr);

  }
}
