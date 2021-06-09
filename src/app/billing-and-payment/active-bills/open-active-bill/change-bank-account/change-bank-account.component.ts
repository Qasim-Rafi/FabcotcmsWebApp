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
  selector: 'app-change-bank-account',
  templateUrl: './change-bank-account.component.html',
  styleUrls: ['./change-bank-account.component.css']
})
export class ChangeBankAccountComponent implements OnInit {
  @Input() bill_id;
 bankAcc : any = {}
  data:any;
search:any;
bankFilter: any = [];
searchBank: any = [];

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
    this.GetBankAccDropdown()
    // this.service.getDocumentType().subscribe(res => {
    //   this.response = res;
    //   if (this.response.success == true) {
    //     this.search = this.response.data;
    //   }
    //   else {
    //     this.toastr.error(this.response.message, 'Message.');
    //   }
    // })
  }
  updateFilter(event) {
    const val = event.target.value.toLowerCase();

    const temp = this.temp.filter(function (d) {
      return (
        d.bankAddress.toLowerCase().indexOf(val) !== -1 ||
        d.accountName.toLowerCase().indexOf(val) !== -1 ||
        d.bankName.toLowerCase().indexOf(val) !== -1 ||
        !val);
    });
    this.bankAcc = temp;

  }

  get activeModal() {
    return this._NgbActiveModal;
  }

  GetBankAccDropdown() {
    this.http.get(`${environment.apiUrl}/api/Lookups/BankAccounts`).
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
  change(obj){
    let varr = {    
    }
    this.spinner.show();
this.http.put(`${environment.apiUrl}/api/BillingPayments/ChangeBankAccount/` + this.bill_id + '/' +obj.id,varr)
  .subscribe(
    res => {
      this.response = res;
      if (this.response.success == true) {
        this.toastr.success(this.response.message, 'Message.');
      this.activeModal.close();
    this.spinner.hide();
      
      }
      else {
        this.toastr.error(this.response.message, 'Message.');
        this.activeModal.close();
    this.spinner.hide();
     
      }

    }, (err: HttpErrorResponse) => {
      const messages = this.service.extractErrorMessagesFromErrorResponse(err);
      this.toastr.error(messages.toString(), 'Message.');
      console.log(messages);
      this.activeModal.close();
    this.spinner.hide();
     
    });
  }
}
