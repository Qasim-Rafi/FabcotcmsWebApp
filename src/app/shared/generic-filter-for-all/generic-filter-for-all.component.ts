import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Dateformater } from '../dateformater';
import { ServiceService } from '../service.service';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
@Component({
  selector: 'app-generic-filter-for-all',
  templateUrl: './generic-filter-for-all.component.html',
  styleUrls: ['./generic-filter-for-all.component.css']
})
export class GenericFilterForAllComponent implements OnInit {
  dateformater: Dateformater = new Dateformater(); 
  @Input() menu; 
  @Input() departId; 
  response: any;
  buyer : any = []
  seller : any = []
  contractOwnera:any=[]
  data: any = {};
  menuName: any = {};
  departmentIdFromAdmin:any
  isDisabledStatus:boolean=false;
  article : any = [];
  agentName:any=[];
  department:any=[];
  constructor(
    private _NgbActiveModal: NgbActiveModal,
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router,
    private service: ServiceService,
    private toastr: ToastrService,
  ) { this.router.routeReuseStrategy.shouldReuseRoute = () => false; }

  ngOnInit(): void {
    this.data.year ="2023"
    this.menuName=this.menu;
    if(this.menuName =="Open Contract Report" ){
      this.data.contractStatus = "Open";
      this.isDisabledStatus=true;
    }
    else if(this.menuName =="Cancle Contarct Report"){
      this.data.contractStatus = "Cancel";
      this.isDisabledStatus=true;
    }
    this.GetBuyersDropdown();
    this.GetSellersDropdown();
    this.getContractOwnersDropdown();
    this.Articlesgetdropdown();
    this.GetDeparmentDropdown();
  }
  get activeModal() {
    return this._NgbActiveModal;
  }
  GetDeparmentDropdown() {
    this.service.getDepartment().subscribe(res => {
      this.response = res;
      if (this.response.success == true) {
        // this.response.data.splice(1, 1);
        // this.response.data.splice(9, 1);
        this.department = this.response.data;
      }
      else {
        this.toastr.error(this.response.message, 'Message.');
      }
    })
  }
  GetBuyersDropdown() {
    this.service.getBuyersAccounts(this.departId).subscribe(res => {
      this.response = res;
      if (this.response.success == true) {
        this.buyer = this.response.data;
      }
      else {
        this.toastr.error(this.response.message, 'Message.');
      }
    })
  }
  getagentname(id){
    this.service.getAgentName(id).subscribe(res => {
      this.response = res;
      if (this.response.success == true) {
        this.agentName = this.response.data;
      }
      else {
        this.toastr.error(this.response.message, 'Message.');
      }
    })
  }
  GetSellersDropdown() {
    this.http
    .get(`${environment.apiUrl}/api/Lookups/Sellers/`+this.departId.toString())
    .subscribe(res => {
      this.response = res;
     
    if(this.response.success==true)
    {
    this.seller=this.response.data;


    }
    else{
      this.toastr.error(this.response.message, 'Message.');
    }
    }, err => {
      if ( err.status == 400) {
  this.toastr.error(err.error.message, 'Message.');
      }
    });
  }
  Articlesgetdropdown(){
    this.departmentIdFromAdmin=localStorage.getItem('loggedInDepartmentId');
    let varr = {
      "buyerId":0,
      // "sellerId":this.data.sellerId == undefined?0 :this.data.sellerId,
      "sellerId":0,
      "departmentId" :parseInt(this.departId)
    }
    this.http
    .post(`${environment.apiUrl}/api/Lookups/GetArticlesByFilter`,varr)
    .subscribe(res => {
      this.response = res;
     
    if(this.response.success==true)
    {
    this.article=this.response.data;
 

    }
    else{
      this.toastr.error(this.response.message, 'Message.');
    }
    }, err => {
      if ( err.status == 400) {
  this.toastr.error(err.error.message, 'Message.');
      }
    });
  }
  BuyerChangeMethod(){
    this.departmentIdFromAdmin=localStorage.getItem('loggedInDepartmentId');
    let varr = {
      "buyerId":this.data.buyerId ==undefined ? 0 :this.data.buyerId,
      // "sellerId":this.data.sellerId == undefined?0 :this.data.sellerId,
      "sellerId":0,
      "departmentId" :parseInt(this.departId)
    }

    if(this.data.sellerId == null || this.data.sellerId == undefined){
    this.http
    .post(`${environment.apiUrl}/api/Lookups/GetSellersByFilter`,varr)
    .subscribe(res => {
      this.response = res;
     
    if(this.response.success==true)
    {
    this.seller=this.response.data;
    this.getContractOwnersDropdownChange()

    }
    else{
      this.toastr.error(this.response.message, 'Message.');
    }
    }, err => {
      if ( err.status == 400) {
  this.toastr.error(err.error.message, 'Message.');
      }
    });
  }
  }
  getContractOwnersDropdown(){
    this.http
    .get(`${environment.apiUrl}/api/Lookups/Owners`)
    .subscribe(res => {
      this.response = res;
     
    if(this.response.success==true)
    {
    this.contractOwnera=this.response.data;

    }
    else{
      this.toastr.error(this.response.message, 'Message.');
    }
    }, err => {
      if ( err.status == 400) {
  this.toastr.error(err.error.message, 'Message.');
      }
    });
  }
  getContractOwnersDropdownChange(){
    this.departmentIdFromAdmin=localStorage.getItem('loggedInDepartmentId');
    let varr = {
      "buyerId":this.data.buyerId ==undefined ? 0 :this.data.buyerId,
      "sellerId":this.data.sellerId == undefined?0 :this.data.sellerId,
      "departmentId" :this.departId
    }
    this.http
    .post(`${environment.apiUrl}/api/Lookups/GetContractOwnerByFilter`,varr)
    .subscribe(res => {
      this.response = res;
     
    if(this.response.success==true)
    {
    this.contractOwnera=this.response.data;

    }
    else{
      this.toastr.error(this.response.message, 'Message.');
    }
    }, err => {
      if ( err.status == 400) {
  this.toastr.error(err.error.message, 'Message.');
      }
    });
  }
  SellerChangeMethod(){
    this.departmentIdFromAdmin=localStorage.getItem('loggedInDepartmentId');
    let varr = {
      "buyerId":0,
      // "buyerId":this.data.buyerId ==undefined ? 0 :this.data.buyerId,
      "sellerId":this.data.sellerId == undefined?0 :this.data.sellerId,
      "departmentId" :parseInt(this.departId)
    }
   if(this.data.buyerId == null || this.data.buyerId == undefined){
    this.http
    .post(`${environment.apiUrl}/api/Lookups/GetBuyersByFilter`,varr)
    .subscribe(res => {
      this.response = res;
     
    if(this.response.success==true)
    {
    this.buyer=this.response.data;
    this.getContractOwnersDropdownChange()
    }
    else{
      this.toastr.error(this.response.message, 'Message.');
    }
    }, err => {
      if ( err.status == 400) {
  this.toastr.error(err.error.message, 'Message.');
      }
    });
  }
  }

  datatransfer(){
    // this.data.branch;
    // let statuss :any =string []=[];
    this.departmentIdFromAdmin=localStorage.getItem('loggedInDepartmentId');
    if(this.menu!= "Contract Voucher Report"){
      // if(this.data.contractStatus.length == 1){
      //   statuss =[];
      //   statuss.push(this.data.contractStatus)
      // }
    let varr = {
      "buyerId":this.data.buyerId ==undefined ? 0 :this.data.buyerId,
      "sellerId":this.data.sellerId == undefined?0 :this.data.sellerId,
      "autoContractNumber":this.data.autoContractNumber == undefined ? '': this.data.autoContractNumber,
      "contractNo":this.data.contractNo == undefined ? '': this.data.contractNo,
       "startContractDate" :  this.data.startContractDate == undefined?'null':this.dateformater.toModel(this.data.startContractDate),
       "endContractDate" :  this.data.endContractDate == undefined?'null':this.dateformater.toModel(this.data.endContractDate),
       "ageStart":this.data.ageStart == undefined ? 0: this.data.ageStart,
       "ageEnd":this.data.ageEnd == undefined ? 0: this.data.ageEnd,
       "agentId":this.data.agentId ==undefined ? 0 :this.data.agentId,
      //  "status":this.data.contractStatus == undefined? "All": this.data.contractStatus,
       "statuss": this.data.contractStatus,
      "articleId":this.data.articleId == undefined? 0:this.data.articleId,
       "AdminDepartmentId" :this.departId,
       "isAccounts":true,

    }
    
    this.activeModal.close(varr);
  }
  else{
    let year = new Date().getFullYear()
    let varr1 = {
      "buyerId":this.data.buyerId ==undefined ? 0 :this.data.buyerId,
      "sellerId":this.data.sellerId == undefined?0 :this.data.sellerId,
      "autoContractNumber":this.data.autoContractNumber == undefined ? '': this.data.autoContractNumber,
      "startDate":this.data.startContractDate == undefined? 'null': this.dateformater.toModel(this.data.startContractDate),
      "endDate":this.data.endContractDate == undefined?'null':this.dateformater.toModel(this.data.endContractDate),
      "status" : this.data.contractStatus == undefined? "All" :this.data.contractStatus ,
      "year" : this.data.year == undefined? 0:parseInt(this.data.year) ,
      "departmentId" : this.departId,
      "agentId" : this.data.agentId,
      "billNumber" : this.data.billNo == undefined?0 :this.data.billNo,
      "voucherNumber" : this.data.voucherNo == undefined ? '': this.data.voucherNo,
      // "status": this.data.contractStatus ,
    }
    this.activeModal.close(varr1);
  }





  }
}
