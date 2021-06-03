import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ServiceService } from 'src/app/shared/service.service';
import { ArticleComponent } from '../Modals/article/article.component';
import { BuyerComponent } from '../Modals/buyer/buyer.component';

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
  uomList: any= []
  currency: any= []
  newBuyer: number;
counter3 :number =1
  new:any=[]
  new2:any=[]
  new3:any=[]


  constructor(
    private service: ServiceService,
    private toastr: ToastrService,
    private modalService: NgbModal,
  ) { }

  ngOnInit(): void {
    this.GetBuyersDropdown("start");
    this.GetUOMDropdown();
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












}
