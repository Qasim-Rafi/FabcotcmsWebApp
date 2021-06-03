import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ServiceService } from 'src/app/shared/service.service';

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


  constructor(
    private service: ServiceService,
    private toastr: ToastrService,
  ) { }

  ngOnInit(): void {
    this.GetBuyersDropdown("start");
    this.GetUOMDropdown();
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



}
