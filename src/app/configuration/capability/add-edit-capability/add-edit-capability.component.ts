import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { GlobalConstants } from 'src/app/Common/global-constants'
import { ServiceService } from 'src/app/shared/service.service';

@Component({
  selector: 'app-add-edit-capability',
  templateUrl: './add-edit-capability.component.html',
  styleUrls: ['./add-edit-capability.component.css']
})
export class AddEditCapabilityComponent implements OnInit {
  response: any;
  data: any = {};
  active = true;
  @Input() Id;
  @Input() statusCheck;
  @Input() FormName;
  constructor(private http: HttpClient,
    private toastr: ToastrService,
    private service: ServiceService,
    private _NgbActiveModal: NgbActiveModal) { }

  ngOnInit(): void {
    this.statusCheck = this.statusCheck;
    this.FormName = this.FormName;
    if (this.statusCheck == 'edit') {
      this.editCapability();
    }
  }
  editCapability() {
    this.http.get(`${environment.apiUrl}/api/Configs/GetCapabilityById/` + this.Id)
      .subscribe(
        res => {
          this.response = res;
          if (this.response.success == true) {
            this.data = this.response.data;
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
  UpdateCapability() {
    let varr = {
      "name": this.data.name,
    
    }

    this.http.
      put(`${environment.apiUrl}/api/Configs/UpdateCapability/` + this.Id, varr)
      .subscribe(
        res => {

          this.response = res;
          if (this.response.success == true) {
            this.toastr.error(this.response.message, 'Message.');
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
  addCapability() {
    let varr = {
      "name": this.data.name,
    }
    this.http.
      post(`${environment.apiUrl}/api/Configs/AddCapability`, varr)
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
  
        }, err => {
          if (err.status == 400) {
            this.toastr.error(err.error.message, 'Message.');
          }
        });
  }
  
  get activeModal() {
    return this._NgbActiveModal;
  }
}
