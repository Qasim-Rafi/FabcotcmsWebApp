import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ServiceService } from 'src/app/shared/service.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-change-bank-account',
  templateUrl: './change-bank-account.component.html',
  styleUrls: ['./change-bank-account.component.css']
})
export class ChangeBankAccountComponent implements OnInit {
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
    this.GetBankAccDropdown((data)=>{

      this.bankAcc = data
      console.log(this.bankAcc)
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
  Show(id){
console.log("id" , id)
  }
}
