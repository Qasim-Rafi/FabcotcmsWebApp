import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { GlobalConstants } from 'src/app/Common/global-constants'
import { NgForm } from '@angular/forms';

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
    this.http.get(`${environment.apiUrl}/api/Configs/GetCountryById/` + this.countryId)
      .subscribe(
        res => {
          this.response = res;
          if (this.response.success == true) {
            this.data = this.response.data;
          }
          else {
            this.toastr.error(GlobalConstants.exceptionMessage, 'Message.');
          }

        }, err => {
          if (err.status == 400) {
            this.toastr.error(GlobalConstants.exceptionMessage, 'Message.');
          }
        });
  }

  UpdateCountry(form:NgForm) {

     if (form.status == "INVALID") {

        this.toastr.error("Invalid Form", 'Message.');
      }
      else{
    let varr = {
      "name": this.data.name,
      "details": this.data.details,
      "active": this.data.active
    }

    this.http.
      put(`${environment.apiUrl}/api/Configs/UpdateCountry/` + this.countryId, varr)
      .subscribe(
        res => {

          this.response = res;
          if (this.response.success == true) {
            this.toastr.success(GlobalConstants.updateMessage, 'Message.');
            this.activeModal.close(true);
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

  // -------------------------------------ADD COUNTRY FROM ---------------------------

  addCountry(form:NgForm) {

     if (form.status == "INVALID") {

        this.toastr.error("Invalid Form", 'Message.');
      }
      else{

    let varr = {
      "name": this.data.name,
      "details": this.data.details,
      "active": this.data.active
    }

    this.http.
      post(`${environment.apiUrl}/api/Configs/AddCountry`, varr)
      .subscribe(
        res => {

          this.response = res;
          if (this.response.success == true) {
            this.toastr.success(GlobalConstants.addMessage, 'Message.');


            this.activeModal.close(true);
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


onSubmit(buttonType): void {
  if (buttonType === "addCountry"){

    this.addCountry(this.addAgentForm); 
  }

  if (buttonType === "UpdateCountry"){

    this.UpdateCountry(this.addAgentForm); 

  }

}


}
