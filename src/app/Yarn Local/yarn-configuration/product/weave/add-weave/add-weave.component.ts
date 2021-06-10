import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { GlobalConstants } from 'src/app/Common/global-constants'
import { NgForm } from '@angular/forms';
import { ServiceService } from 'src/app/shared/service.service';
@Component({
  selector: 'app-add-weave',
  templateUrl: './add-weave.component.html',
  styleUrls: ['./add-weave.component.css']
})
export class AddWeaveComponent implements OnInit {

  response: any;
  data: any = {};
  active = true;
  @Input() weaveId;
  @Input() statusCheck;
  @Input() FormName;
  @ViewChild(NgForm) addAgentForm;

  constructor(private http: HttpClient,
    private service: ServiceService,
    private toastr: ToastrService,
    private _NgbActiveModal: NgbActiveModal) { }

  ngOnInit(): void {
    this.statusCheck = this.statusCheck;
    this.FormName = this.FormName;
    if (this.statusCheck == 'edit') {
      this.editWeave();
    }
  }
 
  get activeModal() {
    return this._NgbActiveModal;
  }
  editWeave() {
    this.http.get(`${environment.apiUrl}/api/YarnConfig/GetWeaveById/` + this.weaveId)
      .subscribe(
        res => {
          this.response = res;
          if (this.response.success == true) {
            this.data = this.response.data;
            this.active = this.data.active
          }
          else {
                     this.toastr.error(this.response.message, 'Message.');

          }

        }, err => {
          if (err.status == 400) {
                     this.toastr.error(this.response.message, 'Message.');

          }
        });
  }

  UpdateWeave(form:NgForm) {

    let varr = {
      "weaveName": this.data.weaveName,
      "description": this.data.description,
      "active": this.active
    }

    this.http.
      put(`${environment.apiUrl}/api/YarnConfig/UpdateWeave/` + this.weaveId, varr)
      .subscribe(
        res => {

          this.response = res;
          if (this.response.success == true) {
                   this.toastr.success(this.response.message, 'Message.');

            this.activeModal.close(true);
          }
          else {
            this.toastr.error(this.response.message, 'Message.');
          }

        }, (err: HttpErrorResponse) => {
          const messages = this.service.extractErrorMessagesFromErrorResponse(err);
          this.toastr.error(messages.toString(), 'Message.');
          console.log(messages);
        });
  
}

  // -------------------------------------ADD COUNTRY FROM ---------------------------

  addWeave(form:NgForm) {

  

    let varr = {
      "weaveName": this.data.weaveName,
      "description": this.data.description,
      "active": this.active
    }

    this.http.
      post(`${environment.apiUrl}/api/YarnConfig/AddWeave`, varr)
      .subscribe(
        res => {

          this.response = res;
          if (this.response.success == true) {
            this.toastr.success(this.response.message, 'Message.');
            this.activeModal.close(true);
          }
          else {
            this.toastr.error(this.response.message, 'Message.');
          }

        }, (err: HttpErrorResponse) => {
          const messages = this.service.extractErrorMessagesFromErrorResponse(err);
          this.toastr.error(messages.toString(), 'Message.');
          console.log(messages);
        });

}


onSubmit(buttonType): void {
  if (buttonType === "addWeave"){

    this.addWeave(this.addAgentForm); 
  }

  if (buttonType === "UpdateWeave"){

    this.UpdateWeave(this.addAgentForm); 

  }

}


}