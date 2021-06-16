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
  selector: 'app-add-edit-pick-insertion',
  templateUrl: './add-edit-pick-insertion.component.html',
  styleUrls: ['./add-edit-pick-insertion.component.css']
})
export class AddEditPickInsertionComponent implements OnInit {

  response: any;
  data: any = {};
  active = true;
  @Input() insertionId;
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
      this.editPickInsertion();
    }
  }
 
  get activeModal() {
    return this._NgbActiveModal;
  }
  editPickInsertion() {
    this.spinner.show();
    this.http.get(`${environment.apiUrl}/api/FLConfigs/GetPickInsertionById/` + this.insertionId)
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

  UpdatePickInsertion(form:NgForm) {

    let varr = {
      "pickInsetionName": this.data.pickInsetionName,
      "description": this.data.description,
      "active": this.active
    }
this.spinner.show();
    this.http.
      put(`${environment.apiUrl}/api/FLConfigs/UpdatePickInsertion/` + this.insertionId, varr)
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

  addPickInsertion(form:NgForm) {

  

    let varr = {
      "pickInsetionName": this.data.pickInsetionName,
      "description": this.data.description,
      "active": this.active
    }
this.spinner.show();
    this.http.
      post(`${environment.apiUrl}/api/FLConfigs/AddPickInsertion`, varr)
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
  if (buttonType === "addPickInsertion"){

    this.addPickInsertion(this.addAgentForm); 
  }

  if (buttonType === "UpdatePickInsertion"){

    this.UpdatePickInsertion(this.addAgentForm); 

  }

}


}
