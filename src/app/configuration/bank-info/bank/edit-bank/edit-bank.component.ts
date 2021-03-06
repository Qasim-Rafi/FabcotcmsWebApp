import { Component, Input, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgForm } from '@angular/forms';
import { ServiceService } from 'src/app/shared/service.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-edit-bank',
  templateUrl: './edit-bank.component.html',
  styleUrls: ['./edit-bank.component.css']
})
export class EditBankComponent implements OnInit {
  data: any = {};
  response: any;
  @Input() userId;

  constructor(private http: HttpClient,
    private service: ServiceService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private _NgbActiveModal: NgbActiveModal) { }

  ngOnInit(): void {
    this.editBank();
  }


  get activeModal() {
    return this._NgbActiveModal;
  }


  editBank() {
    this.http.get(`${environment.apiUrl}/api/Configs/GetBankById/` + this.userId)
      .subscribe(
        res => {
          this.response = res;
          if (this.response.success == true) {
            this.data = this.response.data;
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



  UpdateBank(form: NgForm) {
    this.spinner.show();

    let varr = {
      "name": this.data.name,
      "branchCode": this.data.branchCode,
      "branchName": this.data.branchName,
      "location": this.data.location,
      "address": this.data.address,
      "details": this.data.details
    }

    this.http.
      put(`${environment.apiUrl}/api/Configs/UpdateBank/` + this.userId, varr)
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
          console.log(messages);
          this.spinner.hide();

        });
  }
}


