import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { GlobalConstants } from 'src/app/Common/global-constants'
import { ServiceService } from 'src/app/shared/service.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-add-edit-system-user',
  templateUrl: './add-edit-system-user.component.html',
  styleUrls: ['./add-edit-system-user.component.css']
})
export class AddEditSystemUserComponent implements OnInit {
  response: any;
  data: any = {};
  active = true;
  @Input() userId;
  @Input() statusCheck;
  @Input() FormName;
  userType:any=[];
  department:any=[];
  @ViewChild(NgForm) addAgentForm;

  constructor(private http: HttpClient,
    private toastr: ToastrService,
    private service: ServiceService,
    private _NgbActiveModal: NgbActiveModal) { }

  ngOnInit(): void {
    this.GetUserTypeDropdown();
    this.GetDepartmentDropdown();
    this.statusCheck = this.statusCheck;
    this.FormName = this.FormName;
    if (this.statusCheck == 'edit') {
      this.editSystemUser();
    }
  }

  editSystemUser() {
    this.http.get(`${environment.apiUrl}/api/Users/GetUser/` + this.userId)
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

  UpdateSystemUse(form:NgForm) {

    if(form.status == 'INVALID'){

       this.toastr.error("Invalid Form", 'Message.');
    }
    else{
    let varr = {
      "username": this.data.username,
      "fullName": this.data.fullName,
      "email": this.data.email,
      "userTypeId": this.data.userTypeId,
      "departmentId": this.data.departmentId,
    }

    this.http.
      put(`${environment.apiUrl}/api/Users/UpdateUser/` + this.userId, varr)
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
// -------------------------------------ADD User FROM ---------------------------

addSystemUser(form:NgForm) {

  if(form.status == 'INVALID'){

     this.toastr.error("Invalid Form", 'Message.');

  }
  else{
  let varr = {
    "username": this.data.username,
    "fullName": this.data.fullName,
    "email": this.data.email,
    "userTypeId": this.data.userTypeId,
    "departmentId": this.data.departmentId,
    "password": this.data.password,
    // "active": this.active
  }
  this.http.
    post(`${environment.apiUrl}/api/Auth/Register`, varr)
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
          this.toastr.error(err.error.message, 'Message.');
        }
      });
}
}

GetUserTypeDropdown() {
  this.service.getUserType().subscribe(res => {
    this.response = res;
    if (this.response.success == true) {
      this.userType = this.response.data;
    }
    else {
      this.toastr.error(this.response.message, 'Message.');
    }
  })
}

GetDepartmentDropdown() {
  this.service.getDepartment().subscribe(res => {
    this.response = res;
    if (this.response.success == true) {
      this.department = this.response.data;
    }
    else {
      this.toastr.error(this.response.message, 'Message.');
    }
  })
}

  get activeModal() {
    return this._NgbActiveModal;
  }

  onSubmit(buttonType): void {
    if (buttonType === "addSystemUser"){
  
      this.addSystemUser(this.addAgentForm); 
    }
  
    if (buttonType === "UpdateSystemUse"){
  
      this.UpdateSystemUse(this.addAgentForm); 
  
    }
  
  }
}
