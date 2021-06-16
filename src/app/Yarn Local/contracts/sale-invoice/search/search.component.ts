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

  @Input() buyerName;
  @Input() sellerName;
  @Input() autoContractNumbr;

  bankAcc : any = []
   data:any = [];
 search:any;
 bankFilter: any = [];
 searchBank: any = [];
 temp: any[];
 response:any;
 contractNumber: any;
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
     this.autoContractNumbr = this.autoContractNumbr;
     this.buyerName = this.buyerName;
     this.sellerName = this.sellerName;
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
         //  let number=parseInt(this.data.contractNmbr);
         this.http.get(`${environment.apiUrl}/api/Lookups/GetContractsAgainstNumber?contractNo=`+ this.data.contractNo).
    subscribe(res => {
      this.response = res;
      if (this.response.success == true) {
        this.bankAcc = this.response.data;
        this.bankAcc.contractNumber =  this.response.data[0].autoContractNumber
        this.bankAcc.buyerName =  this.response.data[0].buyerName
        this.bankAcc.sellerName =  this.response.data[0].sellerName

      }
      else {
        this.toastr.error(this.response.message, 'Message.');
      }
    })
   }

   Save(){
     this.activeModal.close(this.bankAcc)
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
 
 