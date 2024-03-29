import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ServiceService } from 'src/app/shared/service.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ThrowStmt } from '@angular/compiler';

@Component({
  selector: 'app-add-bank-account',
  templateUrl: './add-bank-account.component.html',
  styleUrls: ['./add-bank-account.component.css']
})
export class AddBankAccountComponent implements OnInit {
  banks: any = [];
  response: any;
  data: any = {};

  constructor(private http: HttpClient,
    private toastr: ToastrService,
    private _NgbActiveModal: NgbActiveModal,
    private spinner: NgxSpinnerService,
    private service: ServiceService,
    ) { }

  ngOnInit(): void {
    this.getBanks();
  }


  get activeModal() {
    return this._NgbActiveModal;
  }


  getBanks() {
    this.http.get(`${environment.apiUrl}/api/Configs/GetAllBank`)
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





  addBankAccount() {
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
      post(`${environment.apiUrl}/api/Configs/AddBankAccount`, varr)
      .subscribe(
        res => {

          this.response = res;
          if (this.response.success == true) {
            this.toastr.success(this.response.message, 'Message.');
            this.activeModal.close(true);
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

          // if (err.status == 400) {
          //   this.toastr.error(this.response.message, 'Message.');
          // }
        });
  }

}
