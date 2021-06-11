import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgForm } from '@angular/forms';
import { ServiceService } from 'src/app/shared/service.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-add-bank',
  templateUrl: './add-bank.component.html',
  styleUrls: ['./add-bank.component.css']
})
export class AddBankComponent implements OnInit {

  response: any;
  data: any = {};

  constructor(private http: HttpClient,
    private service: ServiceService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private _NgbActiveModal: NgbActiveModal) { }

  ngOnInit(): void {
  }


  get activeModal() {
    return this._NgbActiveModal;
  }


  addBank(form: NgForm) {
    this.spinner.show();
    // if (form.status == "INVALID") {

    //   this.toastr.error("Invalid Form", 'Message.');
    // }
    // else{

    let varr = {
      "name": this.data.name,
      "branchCode": this.data.branchCode,
      "branchName": this.data.branchName,
      "location": this.data.location,
      "address": this.data.address,
      "details": this.data.details,

    }

    this.http.
      post(`${environment.apiUrl}/api/Configs/AddBank`, varr)
      .subscribe(
        res => {

          this.response = res;
          if (this.response.success == true) {
            this.toastr.success(this.response.message, 'Message.');

            // this.buyerForm.reset();
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

          // if (err.status == 400) {
          //   this.toastr.error(this.response.message, 'Message.');
          // }
        });
  }
}


// }
