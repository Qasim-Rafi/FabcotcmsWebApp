import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { GlobalConstants } from 'src/app/Common/global-constants';
import { ServiceService } from 'src/app/shared/service.service';
import { environment } from 'src/environments/environment';

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
response:any;
constructor(

  private route: ActivatedRoute,
  private modalService: NgbModal,
  private http: HttpClient,
  private service: ServiceService,
  private toastr: ToastrService,
  public datepipe: DatePipe,
  private router: Router,
  private _NgbActiveModal: NgbActiveModal

) { }

  ngOnInit(): void   {
    console.log(this.bill_id)
    this.GetBankAccDropdown((data)=>{

      this.bankAcc = data
     
    })
    this.service.getDocumentType().subscribe(res => {
      this.response = res;
      if (this.response.success == true) {
        this.search = this.response.data;
      }
      else {
        this.toastr.error(this.response.message, 'Message.');
      }
    })
  }
  get activeModal() {
    return this._NgbActiveModal;
  }

  GetBankAccDropdown(cb) {
    this.http.get(`${environment.apiUrl}/api/Lookups/BankAccounts`).
    subscribe(res => {
      this.response = res;
      if (this.response.success == true) {
        this.bankAcc = this.response.data;
  cb(this.bankAcc)
      }
      else {
        this.toastr.error(this.response.message, 'Message.');
      }
    })
  }
  Show(obj){
    let varr = {    
    }
this.http.put(`${environment.apiUrl}/api/BillingPayments/ChangeBankAccount/` + this.bill_id + obj.id,varr)
  .subscribe(
    res => {

      this.response = res;
      if (this.response.success == true) {
        this.toastr.success(GlobalConstants.updateMessage, 'Message.');
      }
      else {
        this.toastr.error(this.response.message, 'Message.');
      }

    }, err => {
      if (err.status == 400) {
        this.toastr.error(GlobalConstants.exceptionMessage, 'Message.');
      }
    });
  }
}
