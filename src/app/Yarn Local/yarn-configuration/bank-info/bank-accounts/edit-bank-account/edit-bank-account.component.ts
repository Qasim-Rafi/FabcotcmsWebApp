import { Component, Input, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ServiceService } from 'src/app/shared/service.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-edit-bank-account',
  templateUrl: './edit-bank-account.component.html',
  styleUrls: ['./edit-bank-account.component.css']
})
export class EditBankAccountComponent implements OnInit {

  data: any = {};
  response: any;
  banks: any = [];

  @Input() userId;

  constructor(private http: HttpClient,
    private service: ServiceService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private _NgbActiveModal: NgbActiveModal) { }


  ngOnInit(): void {
    this.editBankAccount();
    this.getBanks();
  }

  get activeModal() {
    return this._NgbActiveModal;
  }


  getBanks() {
    this.http.get(`${environment.apiUrl}/api/Lookups/Banks`)
      .subscribe(
        res => {
          this.response = res;
          if (this.response.success == true) {
            this.banks = this.response.data;
          }
          else {
             this.toastr.success(this.response.message, 'Message.');
          }

        }, err => {
          if (err.status == 400) {
             this.toastr.success(this.response.message, 'Message.');
          }
        });
  }




  editBankAccount() {
    this.spinner.show();
    this.http.get(`${environment.apiUrl}/api/Configs/GetBankAccountById/` + this.userId)
      .subscribe(
        res => {
          this.response = res;
          if (this.response.success == true) {
            this.data = this.response.data;
            this.spinner.hide();
          }
          else {
             this.toastr.success(this.response.message, 'Message.');
             this.spinner.hide();
            }

        }, err => {
          if (err.status == 400) {
             this.toastr.success(this.response.message, 'Message.');
             this.spinner.hide();
            }
        });
  }


  UpdateBankAccount() {
    let varr = {
      "bankId": this.data.bankId,
      "accountName": this.data.accountName,
      "accountNumber": this.data.accountNumber,
      "iban": this.data.iban,
      "swiftCode": this.data.swiftCode,
      "type": this.data.type,
      "printable": this.data.printable,
      "default": this.data.default,
      "active": this.data.active,
    }
this.spinner.show();
    this.http.
      put(`${environment.apiUrl}/api/Configs/UpdateBankAccount/` + this.userId, varr)
      .subscribe(
        res => {

          this.response = res;
          if (this.response.success == true) {
            this.toastr.success(this.response.message, 'Message.');
            this.activeModal.close(true);
            this.spinner.hide();
          }
          else {
             this.toastr.success(this.response.message, 'Message.');
             this.spinner.hide();
            }

        }, (err: HttpErrorResponse) => {
          const messages = this.service.extractErrorMessagesFromErrorResponse(err);
          this.toastr.error(messages.toString(), 'Message.');
          console.log(messages); });
          this.spinner.hide();
        }



}

