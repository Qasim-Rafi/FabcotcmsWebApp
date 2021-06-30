import { Component, ElementRef, Inject, Input, OnInit, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ServiceService } from 'src/app/shared/service.service';
import { NgForm } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { DOCUMENT } from '@angular/common';
import { Dateformater } from 'src/app/shared/dateformater';

@Component({
  selector: 'app-add-edit-config-contract-owner',
  templateUrl: './add-edit-config-contract-owner.component.html',
  styleUrls: ['./add-edit-config-contract-owner.component.css']
})
export class AddEditConfigContractOwnerComponent implements OnInit {

  @Input() ContractOwnerId;
  @Input() statusCheck;
  @Input() FormName;
  response: any;
  data: any = {};
  departmentUsers:any=[];
  filterUsers:any=[];
  dateformater: Dateformater = new Dateformater();
  @ViewChild(NgForm) BeneficiaryForm;
 
  constructor(private http: HttpClient,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private _NgbActiveModal: NgbActiveModal,
    private service: ServiceService,
    @Inject(DOCUMENT) private _document: Document
    ) { }

  ngOnInit(): void {
    this.statusCheck =this.statusCheck;
    this.FormName = this.FormName;
    this.GetDepartmentUsersDropdown();
    this.GetUsersDropdown();
    if(this.statusCheck == 'ContractOwnerEdit'){
      this.getContractOwner();
    }
  }

  getContractOwner() {
    this.http.get(`${environment.apiUrl}/api/Configs/GetDocumentUserTypeById/`+this.ContractOwnerId)
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

  addcontractOwner() {
    // this.data.poDate = this.dateformater.toModel(this.data.poDate);
    let varr = {
      "userId": this.data.userId,
      "description": this.data.description,
    }
this.spinner.show();
    this.http.
      post(`${environment.apiUrl}/api/Configs/AddDocumentUserType`, varr)
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


  UpdatecontractOwner() {
    // this.data.poDate = this.dateformater.toModel(this.data.poDate);
    let varr = {
      "userId": this.data.userId,
      "description": this.data.description,
    }
this.spinner.show();
    this.http.
      put(`${environment.apiUrl}/api/Configs/UpdateDocumentUserType/`+this.ContractOwnerId, varr)
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
  GetDepartmentUsersDropdown() {
    this.http.get(`${environment.apiUrl}/api/Lookups/Users`).
    subscribe(res => {
      this.response = res;
      if (this.response.success == true) {
        this.departmentUsers = this.response.data;
        // this.temp = [...this.owner];
      }
      else {
        this.toastr.error(this.response.message, 'Message.');
      }
    })
  }

  GetUsersDropdown() {
    this.http.get(`${environment.apiUrl}/api/Lookups/DocumentUserTypes`).
    subscribe(res => {
      this.response = res;
      if (this.response.success == true) {
        this.filterUsers = this.response.data;
        // this.temp = [...this.owner];
      }
      else {
        this.toastr.error(this.response.message, 'Message.');
      }
    })
  }

  get activeModal() {
    return this._NgbActiveModal;
  }

}
