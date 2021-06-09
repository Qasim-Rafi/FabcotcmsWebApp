import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { GlobalConstants } from 'src/app/Common/global-constants'
import { NgForm } from '@angular/forms';
import { ServiceService } from 'src/app/shared/service.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-edit-country',
  templateUrl: './edit-country.component.html',
  styleUrls: ['./edit-country.component.css']
})
export class EditCountryComponent implements OnInit {
  response: any;
  data: any = {};
  active = true;
  @Input() countryId;
  @Input() statusCheck;
  @Input() FormName;
  @ViewChild(NgForm) addAgentForm;

  constructor(private http: HttpClient,
    private service: ServiceService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private _NgbActiveModal: NgbActiveModal) { }

  ngOnInit(): void {
    this.statusCheck = this.statusCheck;
    this.FormName = this.FormName;
    if (this.statusCheck == 'edit') {
      this.editCountry();
    }
  }
 
  get activeModal() {
    return this._NgbActiveModal;
  }
  editCountry() {
    this.spinner.show();
    this.http.get(`${environment.apiUrl}/api/Configs/GetCountryById/` + this.countryId)
      .subscribe(
        res => {
          this.response = res;
          if (this.response.success == true) {
            this.data = this.response.data;
            this.active = this.data.active;
            this.spinner.hide();
          }
          else {
                     this.toastr.error(this.response.message, 'Message.');
this.spinner.hide();
          }

        }, err => {
          if (err.status == 400) {
                     this.toastr.error(this.response.message, 'Message.');
this.spinner.hide();
          }
        });
  }

  UpdateCountry(form:NgForm) {

    let varr = {
      "name": this.data.name,
      "details": this.data.details,
      "active": this.active
    }
this.spinner.show();
    this.http.
      put(`${environment.apiUrl}/api/Configs/UpdateCountry/` + this.countryId, varr)
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

        });
  
}

  // -------------------------------------ADD COUNTRY FROM ---------------------------

  addCountry(form:NgForm) {

  

    let varr = {
      "name": this.data.name,
      "details": this.data.details,
      "active": this.active
    }
this.spinner.show();
    this.http.
      post(`${environment.apiUrl}/api/Configs/AddCountry`, varr)
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

        });
}


onSubmit(buttonType): void {
  if (buttonType === "addCountry"){

    this.addCountry(this.addAgentForm); 
  }

  if (buttonType === "UpdateCountry"){

    this.UpdateCountry(this.addAgentForm); 

  }

}


}
