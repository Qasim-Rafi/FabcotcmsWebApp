import { Component, OnInit, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-addmodal',
  templateUrl: './addmodal.component.html',
  styleUrls: ['./addmodal.component.css']
})
export class AddmodalComponent implements OnInit {
  listCount:number;
  myDate=Date.now();
  response: any;
  data:any={};
  country:any=[];
  buyer:any[];
  countryId:null;
  parentBuyerId:null;
  @ViewChild(NgForm) buyerForm;
  date: number;
  
  constructor(private http:HttpClient,
              private toastr: ToastrService,  
              private _NgbActiveModal: NgbActiveModal) { }

  ngOnInit(): void {
    this.getenquiryCountry();
    this.getenquiryParentBuyer();
  }

  get activeModal() {
    return this._NgbActiveModal;
  }


  getenquiryParentBuyer()
  {
    this.http.get(`${environment.apiUrl}/api/Lookups/Buyers`)
    .subscribe(
      res=> { 
        this.response = res;
        if (this.response.success == true){
          this.buyer=this.response.data;
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


  getenquiryCountry()
  {
    this.http.get(`${environment.apiUrl}/api/Lookups/Countries`)
    .subscribe(
      res=> { 
        this.response = res;
        if (this.response.success == true){
          this.country =this.response.data;
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




  addenquiryBuyer()
  {
    let varr=  {
      "buyerCode": this.data.buyerCode ,
      "buyerName": this.data.buyerName,
      "billingAddress": this.data.buyerBillAddress,
      "deliveryAddress": this.data.buyerDiliveryAddress,
      "countryId": this.data.countryId, 
      "contactNoPrimary": this.data.buyerContact,
      "contactNoSecondary": this.data.buyerOtherContact,
      "faxNumber": this.data.buyerFax,
      "ntnNumber":this.data.buyerNTN,
      "gstNumber":this.data.buyerGTS,
      "buyerDetails" : this.data.buyerDetails,
      "isParentBuyer": this.data.isParentBuyer,
      "parentBuyerId": this.data.parentBuyerId,
    }

    this.http.
    post(`${environment.apiUrl}/api/Buyers/AddBuyer`,varr)
    .subscribe(
      res=> { 
  
        this.response = res;
        if (this.response.success == true){
          this.toastr.success(this.response.message, 'Message.');
      
          this.buyerForm.reset();
          this.activeModal.close(true);
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

}
