import { DatePipe } from '@angular/common';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { GlobalConstants } from 'src/app/Common/global-constants';
import { ServiceService } from 'src/app/shared/service.service';
import { environment } from 'src/environments/environment';
import {NgxSpinnerService} from 'ngx-spinner'

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  @Input() bill_id;
  bankAcc : any = {}
   data:any;
 search:any;
 bankFilter: any = [];
 searchBank: any = [];
 buyerName : any;
 temp: any[];
 response:any;
 constructor(
 
   private route: ActivatedRoute,
   private modalService: NgbModal,
   private http: HttpClient,
   private service: ServiceService,
   private toastr: ToastrService,
   private spinner: NgxSpinnerService,
   private router: Router,
   private _NgbActiveModal: NgbActiveModal
 
 ) { }
 
   ngOnInit(): void   {
     this.ContractsDropdown()
   }
   updateFilter(event) {
     const val = event.target.value.toLowerCase();
 
     const temp = this.temp.filter(function (d) {
       return (
         d.autoContractNumber.toLowerCase().indexOf(val) !== -1 ||
         d.sellerName.toLowerCase().indexOf(val) !== -1 ||
         d.buyerName.toLowerCase().indexOf(val) !== -1 ||
         !val);
     });
     this.bankAcc = temp;
 
   }
 
   get activeModal() {
     return this._NgbActiveModal;
   }
 
   ContractsDropdown() {
     this.http.get(`${environment.apiUrl}/api/YarnContracts/GetAllSaleInvoiceForMenu`).

     subscribe(res => {
       this.response = res;
       if (this.response.success == true) {
         this.bankAcc = this.response.data;
         this.temp = [...this.bankAcc];
       }
       else {
         this.toastr.error(this.response.message, 'Message.');
       }
     })
   }
   transfer(obj){
     this.buyerName = obj.buyerName
   }
Save(){
  if(this.buyerName != null){
    this.activeModal.close(this.buyerName);
  }
  else{
    this.toastr.error("select atleast one contract")
  }
}
//    change(obj){
//      let varr = {    
//      }
//      this.spinner.show();
//  this.http.put(`${environment.apiUrl}/api/BillingPayments/ChangeBankAccount/` + this.bill_id + '/' +obj.id,varr)
//    .subscribe(
//      res => {
//        this.response = res;
//        if (this.response.success == true) {
//          this.toastr.success(this.response.message, 'Message.');
//        this.activeModal.close();
//      this.spinner.hide();
       
//        }
//        else {
//          this.toastr.error(this.response.message, 'Message.');
//          this.activeModal.close();
//      this.spinner.hide();
      
//        }
 
//      }, (err: HttpErrorResponse) => {
//        const messages = this.service.extractErrorMessagesFromErrorResponse(err);
//        this.toastr.error(messages.toString(), 'Message.');
//        console.log(messages);
//        this.activeModal.close();
//      this.spinner.hide();
      
//      });
//    }
 }
 