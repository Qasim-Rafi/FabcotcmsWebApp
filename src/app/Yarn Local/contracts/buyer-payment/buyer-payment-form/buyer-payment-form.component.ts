import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ServiceService } from 'src/app/shared/service.service';

@Component({
  selector: 'app-buyer-payment-form',
  templateUrl: './buyer-payment-form.component.html',
  styleUrls: ['./buyer-payment-form.component.css']
})
export class BuyerPaymentFormComponent implements OnInit {
  
  
  data: any ={};
  rows: any = [];
  columns: any = [];
  response: any;
  buyer: any= [];
  seller: any= [];
  article: any= [];
  uomList: any= [];
  currency: any= [];
  newBuyer: number;

  constructor(
    private service: ServiceService,
    private toastr: ToastrService,
  ) { }

  ngOnInit(): void {
    this.GetBuyersDropdown();
    this.GetSellerDropdown();
    this.GetCurrencyDropdown();
  }



  GetBuyersDropdown() {
    this.service.getBuyers().subscribe(res => {
      this.response = res;
      if (this.response.success == true) {

        this.buyer = this.response.data.list;
   
       
      }
      else {
        this.toastr.error(this.response.message, 'Message.');
      }
    })
  }


  GetSellerDropdown() {
    this.service.getBuyers().subscribe(res => {
      this.response = res;
      if (this.response.success == true) {

        this.seller = this.response.data.list;
        
       
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

        this.currency = this.response.data.list;
        
       
      }
      else {
        this.toastr.error(this.response.message, 'Message.');
      }
    })
  }






}
