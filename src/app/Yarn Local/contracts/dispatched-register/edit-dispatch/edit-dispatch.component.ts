import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { GlobalConstants } from 'src/app/Common/global-constants';
import { Dateformater } from 'src/app/shared/dateformater';
import { ServiceService } from 'src/app/shared/service.service';
import { environment } from 'src/environments/environment';
import {FormsModule , NgForm, ReactiveFormsModule}  from '@angular/forms'
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-edit-dispatch',
  templateUrl: './edit-dispatch.component.html',
  styleUrls: ['./edit-dispatch.component.css']
})
export class EditDispatchComponent implements OnInit {
  dateformater: Dateformater = new Dateformater();  
  data:any ={};
  @Input() dispatchId; 

  response: any;
  @ViewChild(NgForm) dispatchForm;
 
  constructor(
    private _NgbActiveModal: NgbActiveModal,
    private spinner: NgxSpinnerService,
    private http: HttpClient,
    private service: ServiceService,
    private toastr: ToastrService,
  ) { }


  ngOnInit(): void {
    this.getDispatch();

  }

  get activeModal() {
    return this._NgbActiveModal;
  }

  getDispatch() {
    this.spinner.show();
    this.http.get(`${environment.apiUrl}` + this.dispatchId)
      .subscribe(
        res => {
          this.response = res;
          if (this.response.success == true) {
            this.data = this.response.data;
            this.data.dispatchDate = this.dateformater.fromModel(this.data.dispatchDate);
            
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
  
  updateDispatch(form:NgForm) {
     this.data.dispatchDate = this.dateformater.toModel(this.data.dispatchDate);
    let varr = {
    }
this.spinner.show();
    this.http.
      put(`${environment.apiUrl}`, varr)
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

        }, err => {
          if (err.status == 400) {
            this.toastr.error(this.response.message, 'Message.');
          this.spinner.hide();
          }
        });
  }
  onSubmit(){
  this.updateDispatch(this.dispatchForm)
  }
}
