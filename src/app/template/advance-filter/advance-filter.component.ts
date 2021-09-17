import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ServiceService } from 'src/app/shared/service.service';

@Component({
  selector: 'app-advance-filter',
  templateUrl: './advance-filter.component.html',
  styleUrls: ['./advance-filter.component.css']
})
export class AdvanceFilterComponent implements OnInit {
  data:any ={};
  response: any;
  buyer: any={};
  seller: any={};
  article: any={};
   rows:any = [];
   columns : any = {}
  constructor(
    private http: HttpClient,
    private service: ServiceService,
    private spinner: NgxSpinnerService,

    private toastr: ToastrService,
  ) { }

  ngOnInit(): void {
    this.GetBuyersDropdown();
    this.GetSellersDropdown();
    this.GetArticleDropdown();
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

//   addSaleInvoice(form:NgForm) {
//     let varr = {
//       "buyerId":this.data.buyerId,
//       "lcNumber": this.data.lcNumber,
//       "lcOpenOn": this.dateformater.toModel(this.data.lcOpenOn),
//       "lcShipmentInfo": this.data.lcShipmentInfo,

//       "remarks": this.data.remarks
     
//     }
// this.spinner.show();
//     this.http.
//       post(`${environment.apiUrl}/api/Contracts/AddContractLetterCredit`, varr)
//       .subscribe(
//         res => {

//           this.response = res;
//           if (this.response.success == true) {
//             this.toastr.success(this.response.message, 'Message.');
//             this.activeModal.close(true);
//           // localStorage.setItem('quantity',this.data.quantity);
//          this.spinner.hide();
//           }
//           else {
//             this.toastr.error(this.response.message, 'Message.');
//          this.spinner.hide();
//           }

//         }, (err: HttpErrorResponse) => {
//           const messages = this.service.extractErrorMessagesFromErrorResponse(err);
//           this.toastr.error(messages.toString(),'Message.');
//           this.spinner.hide();
          
//         });
//   }

}
