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

@Component({
  selector: 'app-add-new-contracts',
  templateUrl: './add-new-contracts.component.html',
  styleUrls: ['./add-new-contracts.component.css']
})
export class AddNewContractsComponent implements OnInit {

  response: any;
  data: any = {}
  buyer: any= []
  seller: any= []
  article: any= []
  packing: any= []
  uomList: any= []
  currency: any= []
  newBuyer: number;
  newSeller: number;
  counter3 :number =1
  new:any=[]
  new2:any=[]
  new3:any=[] 
  @ViewChild(NgForm) contractForm;


  constructor(
    private service: ServiceService,
    private toastr: ToastrService,
    private modalService: NgbModal,
    private router: Router,
    private http: HttpClient,
  ) { }

  ngOnInit(): void {
    this.GetBuyersDropdown("start");
    this.GetSellerDropdown("start");
    this.GetUOMDropdown();
    this.GetArticleDropdown();
    this.GetCurrencyDropdown();
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

        this.buyer = this.response.data.list;
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

        this.seller = this.response.data.list;
        this.newSeller = this.response.data.lastId



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


  GetArticleDropdown() {
    this.service.getArticles().subscribe(res => {
      this.response = res;
      if (this.response.success == true) {
        this.article = this.response.data.list;
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
    const modalRef = this.modalService.open(BuyerComponent, { centered: true });
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
    const modalRef = this.modalService.open(ArticleComponent, { centered: true });
    modalRef.result.then((data) => {
      // on close
      if (data == true) {
     
       

      }
    }, (reason) => {
      // on dismiss
    });

  }

  navigate() {
    this.router.navigateByUrl('/yarn-local/active-contract');
  };


  addContract() {
    // /api/Dashboard/GetNotifications?`+ 'EnquiryId ='+5+ +'&'+ 'departmentId ='+8 ,varr)


  
    // let varr = {

    //   "enquiryDate": this.data.enquiryDate,
    //   "buyerId": this.data.buyerId,
    //   "articleId": this.data.articleId,
    //   "processId": this.data.processId,
    //   "processTypeId": this.data.processTypeId,
    //   "designTypeId": this.data.designTypeId,
    //   "packagingId": this.data.packagingId,
    //   "paymentTermId": this.data.paymentTermId,
    //   "paymentTermDays": this.data.paymentTermDays  == undefined ? 0 : this.data.paymentTermDays ,
    //   "paymentTermInfo": this.data.paymentTermInfo,
    //   "priceTermId": this.data.priceTermId,
    //   "destinationId": this.data.destinationId,
    //   "sellerSideCommission": this.data.sellerSideCommission.toString(),
    //   "sellerSideCommissionUOMId": this.data.sellerSideCommissionUOMId,
    //   "sellerSideCommissionInfo": this.data.sellerSideCommissionInfo,
    //   "buyerSideCommission": this.data.buyerSideCommission.toString(),
    //   "buyerSideCommissionUOMId": this.data.buyerSideCommissionUOMId,
    //   "buyerSideCommissionInfo": this.data.buyerSideCommissionInfo,
    //   "certificateIds": this.data.certificateIds != null ? this.data.certificateIds.toString() : null,
    //   "remarks": this.data.remarks,
    //   "additionalInfo": this.data.additionalInfo,
    //   "departmentId": this.data.departmentId,

    // }

    this.http.
      post(`${environment.apiUrl}/api/YarnContracts/AddContract`, this.data)
      .subscribe(
        res => {

          this.response = res;
          if (this.response.success == true) {
            this.toastr.success(this.response.message, 'Message.');
            this.contractForm.reset();
             this.router.navigate(['/yarn-local/active-contract'], { queryParams: {id: this.response.data} });
            // this.router.navigate(['/enquiry/active-enquiries']);
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







}
