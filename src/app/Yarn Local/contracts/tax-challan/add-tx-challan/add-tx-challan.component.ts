import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ServiceService } from 'src/app/shared/service.service';
import { environment } from 'src/environments/environment';
import { HttpClient  , HttpErrorResponse} from '@angular/common/http';
import { Dateformater } from 'src/app/shared/dateformater';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-add-tx-challan',
  templateUrl: './add-tx-challan.component.html',
  styleUrls: ['./add-tx-challan.component.css']
})
export class AddTxChallanComponent implements OnInit {
  dateformater: Dateformater = new Dateformater();

  buyer: any=[];
  seller: any=[];
  currency: any=[];
  data:any = {}
  columns: any
  response: any
  @ViewChild(NgForm) enquiryForm;

  rows = []

  constructor(
    private service: ServiceService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private http: HttpClient,
    private router: Router,

  ) { }

  ngOnInit(): void {
    this.GetCurrencyDropdown();
    this.GetBuyersDropdown();
    this.GetSellerDropdown();
  }

  GetBuyersDropdown() {
    this.service.getBuyers().subscribe(res => {
      this.response = res;
      if (this.response.success == true) {

        this.buyer = this.response.data;
        // this.newBuyer = this.response.data.lastId



        // if(type == "other")
        // {
        //   this.buyer.id = this.newBuyer;
        //   this.data.buyerId = this.buyer.id
        // }
       
      }
      else {
        this.toastr.error(this.response.message, 'Message.');
      }
    })
  }

  GetSellerDropdown() {
    this.service.getSellerLookup().subscribe(res => {
      this.response = res;
      if (this.response.success == true) {

        this.seller = this.response.data;
        // this.newSeller = this.response.data



        // if(type == "other")
        // {
        //   this.seller.id = this.newSeller;
        //   this.data.sellerId = this.seller.id
        // }
       
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


  addChallan() {

      let varr = {
        "buyerId": this.data.buyerId,
        "sellerId": this.data.sellerId,
        "challanDate": this.dateformater.toModel(this.data.chalanDate),
        "amount": this.data.amount,
        "currencyId": this.data.currencyId,
        "cprNumber": this.data.cprNumber,
        "remarks": this.data.remarks
      
   
      }
this.spinner.show();    
this.http.post(`${environment.apiUrl}/api/YarnContracts/AddTaxChallan`, varr)
.subscribe(
        res => {

          this.response = res;
          if (this.response.success == true) {
            // this.data = this.response.data;
            this.enquiryForm.reset();
            this.router.navigate(['/FabCot/tax']);

            this.toastr.success(this.response.message, 'Message.');
            this.spinner.hide();
          }
          else {
            this.toastr.error(this.response.message, 'Message.');
          this.spinner.hide();
          }

        }, (err: HttpErrorResponse) => {
          const messages = this.service.extractErrorMessagesFromErrorResponse(err);
          this.toastr.error(messages.toString(), 'Message.');
          console.log(messages);
          this.spinner.hide();
        });
  }





}
