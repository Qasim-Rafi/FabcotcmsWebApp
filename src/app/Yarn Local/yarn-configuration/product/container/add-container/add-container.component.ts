import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { GlobalConstants } from 'src/app/Common/global-constants'
import { NgForm } from '@angular/forms';
import { ServiceService } from 'src/app/shared/service.service';

@Component({
  selector: 'app-add-container',
  templateUrl: './add-container.component.html',
  styleUrls: ['./add-container.component.css']
})
export class AddContainerComponent implements OnInit {

  response: any;
  data: any = {};
  active = true;
  @Input() containerId;
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
      this.editContainer();
    }
  }
 
  get activeModal() {
    return this._NgbActiveModal;
  }
  editContainer() {
    this.http.get(`${environment.apiUrl}/api/YarnConfig/GetContainerById/` + this.containerId)
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

  UpdateContainer(form:NgForm) {

    let varr = {
      "containerName": this.data.containerName,
      "description": this.data.description,
      // "departmentId": 6 ,
      "active": this.active
    }

    this.http.
      put(`${environment.apiUrl}/api/YarnConfig/UpdateContainer/` + this.containerId, varr)
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

  addContainer(form:NgForm) {

  

    let varr = {
      "containerName": this.data.containerName,
      "description":this.data.description,
      // "departmentId": 6 ,
      "active": this.active
    }

    this.http.
      post(`${environment.apiUrl}/api/YarnConfig/AddContainer`, varr)
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
  if (buttonType === "addContainer"){

    this.addContainer(this.addAgentForm); 
  }

  if (buttonType === "UpdateContainer"){

    this.UpdateContainer(this.addAgentForm); 

  }

}


}
