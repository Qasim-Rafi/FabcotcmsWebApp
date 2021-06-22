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
  selector: 'app-add-edit-weft',
  templateUrl: './add-edit-weft.component.html',
  styleUrls: ['./add-edit-weft.component.css']
})
export class AddEditWeftComponent implements OnInit {

  response: any;
  data: any = {};
  active = true;
  @Input() BlendingRatioWeftId;
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
      this.editBlendingRatioWeft();
    }
  }
 
  get activeModal() {
    return this._NgbActiveModal;
  }
  refreshPage() {
    this._document.defaultView.location.reload();
  }
  editBlendingRatioWeft() {
    this.spinner.show();
    this.http.get(`${environment.apiUrl}/api/FLConfigs/GetBlendingRatioWeftById/` + this.BlendingRatioWeftId)
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

  UpdateBlendingRatioWeft(form:NgForm) {

    let varr = {
      "blendingRatioWeftName": this.data.blendingRatioWeftName,
      "description": this.data.description,
      "active": this.active
    }
this.spinner.show();
    this.http.
      put(`${environment.apiUrl}/api/FLConfigs/UpdateBlendingRatioWeft/` + this.BlendingRatioWeftId, varr)
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

  addBlendingRatioWeft(form:NgForm) {

  

    let varr = {
      "blendingRatioWeftName": this.data.blendingRatioWeftName,
      "description": this.data.description,
      "active": this.active
    }
this.spinner.show();
    this.http.
      post(`${environment.apiUrl}/api/FLConfigs/AddBlendingRatioWeft`, varr)
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
  if (buttonType === "addBlendingRatioWeft"){

    this.addBlendingRatioWeft(this.addAgentForm); 
  }

  if (buttonType === "UpdateBlendingRatioWeft"){

    this.UpdateBlendingRatioWeft(this.addAgentForm); 

  }

}


}

