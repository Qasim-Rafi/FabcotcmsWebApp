import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { GlobalConstants } from 'src/app/Common/global-constants';
import { Dateformater } from 'src/app/shared/dateformater';
import { ServiceService } from 'src/app/shared/service.service';
import { environment } from 'src/environments/environment';
import {FormsModule , NgForm, ReactiveFormsModule}  from '@angular/forms'

@Component({
  selector: 'app-dispatch-register',
  templateUrl: './dispatch-register.component.html',
  styleUrls: ['./dispatch-register.component.css']
})
export class DispatchRegisterComponent implements OnInit {

  dateformater: Dateformater = new Dateformater();  
  data:any ={};
  @Input() dispatchId; 
  @Input() statusCheck; 
  response: any;
  @ViewChild(NgForm) dispatchForm;
 
  constructor(
    private _NgbActiveModal: NgbActiveModal,
    private http: HttpClient,
    private service: ServiceService,
    private toastr: ToastrService,
  ) { }


  ngOnInit(): void {
    this.statusCheck = this.statusCheck
    if(this.statusCheck == 'Edit'){
    this.getDispatch();}

  }

  get activeModal() {
    return this._NgbActiveModal;
  }

  getDispatch() {
    this.http.get(`${environment.apiUrl}` + this.dispatchId)
      .subscribe(
        res => {
          this.response = res;
          if (this.response.success == true) {
            this.data = this.response.data;
            this.data.dispatchDate = this.dateformater.fromModel(this.data.dispatchDate);
            

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
  addDispatch(form:NgForm) {



    let varr = {

    }

    this.http.
      post(`${environment.apiUrl}`, varr)
      .subscribe(
        res => {

          this.response = res;
          if (this.response.success == true) {
            this.toastr.success(this.response.message, 'Message.');

            this.dispatchForm.reset();
            this.activeModal.close(true);
          }
          else {
            this.toastr.error(this.response.message, 'Message.');
          }

        }, (err: HttpErrorResponse) => {
          const messages = this.service.extractErrorMessagesFromErrorResponse(err);
          this.toastr.error(messages.toString(),'Message.');

        });

  }
  updateDispatch() {
     this.data.dispatchDate = this.dateformater.toModel(this.data.dispatchDate);
    let varr = {
    }

    this.http.
      put(`${environment.apiUrl}`, varr)
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
            this.toastr.error(this.response.message, 'Message.');
          }
        });
  }
  // onSubmit(){
  // this.updateDispatch(this.dispatchForm)
  // }
}
