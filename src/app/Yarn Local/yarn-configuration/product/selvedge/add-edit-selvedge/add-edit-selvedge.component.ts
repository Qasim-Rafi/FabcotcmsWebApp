import { Component, ElementRef, Inject, Input, OnInit, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { GlobalConstants } from 'src/app/Common/global-constants'
import { NgForm } from '@angular/forms';
import { ServiceService } from 'src/app/shared/service.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-add-edit-selvedge',
  templateUrl: './add-edit-selvedge.component.html',
  styleUrls: ['./add-edit-selvedge.component.css']
})
export class AddEditSelvedgeComponent implements OnInit {
  response: any;
  data: any = {};
  active = true;
  @Input() selvedgeId;
  @Input() statusCheck;
  @Input() FormName;
  @ViewChild(NgForm) addAgentForm;

  constructor(private http: HttpClient,
    private service: ServiceService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private _NgbActiveModal: NgbActiveModal,
    @Inject(DOCUMENT) private _document: Document
    ) { }

  ngOnInit(): void {
    this.statusCheck = this.statusCheck;
    this.FormName = this.FormName;
    if (this.statusCheck == 'edit') {
      this.editselvedge();
    }
  }
 
  get activeModal() {
    return this._NgbActiveModal;
  }
  refreshPage() {
    this._document.defaultView.location.reload();
  }
  editselvedge() {
    this.spinner.show();
    this.http.get(`${environment.apiUrl}/api/FLConfigs/GetSelvedgeById/` + this.selvedgeId)
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

  Updateselvedge(form:NgForm) {

    let varr = {
      "selvedgeName": this.data.selvedgeName,
      "description": this.data.description,
      "active": this.active
    }
this.spinner.show();
    this.http.
      put(`${environment.apiUrl}/api/FLConfigs/UpdateSelvedge/` + this.selvedgeId, varr)
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

  addselvedge(form:NgForm) {

  

    let varr = {
      "selvedgeName": this.data.selvedgeName,
      "description": this.data.description,
      "active": this.active
    }
this.spinner.show();
    this.http.
      post(`${environment.apiUrl}/api/FLConfigs/AddSelvedge`, varr)
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
  if (buttonType === "addselvedge"){

    this.addselvedge(this.addAgentForm); 
  }

  if (buttonType === "Updateselvedge"){

    this.Updateselvedge(this.addAgentForm); 

  }

}


}
