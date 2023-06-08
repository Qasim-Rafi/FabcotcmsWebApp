import { Component, Inject, Input, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgForm } from '@angular/forms';
import { ServiceService } from 'src/app/shared/service.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-edit-agent-form',
  templateUrl: './edit-agent-form.component.html',
  styleUrls: ['./edit-agent-form.component.css']
})
export class EditAgentFormComponent implements OnInit {
  @Input() userId;
  data: any = {};
  response: any;
  Side: any = [];
  Type: any = [];
  city: any = [];
  banks: any = [];

  constructor(private http: HttpClient,
    private service: ServiceService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private _NgbActiveModal: NgbActiveModal,
    @Inject(DOCUMENT) private _document: Document) { }

  ngOnInit(): void {
    this.getBanks();
    this.getCity();
    this.GetAgentSide();
    this.GetAgentType();
    this.editAgent();
  }

  get activeModal() {
    return this._NgbActiveModal;
  }
  refreshPage() {
    this._document.defaultView.location.reload();
  }
  getCity() {
    this.spinner.show();
    this.http.get(`${environment.apiUrl}/api/Configs/GetAllCity`)
      .subscribe(
        res => {
          this.response = res;
          if (this.response.success == true) {
            this.city = this.response.data;
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

  GetAgentSide() {
    this.service.getAgentSide().subscribe(res => {
      this.response = res;
      if (this.response.success == true) {
        this.Side = this.response.data;
      }
      else {
        this.toastr.error(this.response.message, 'Message.');
      }
    })
  }

  GetAgentType() {
    this.service.getAgentType().subscribe(res => {
      this.response = res;
      if (this.response.success == true) {
        this.Type = this.response.data;
      }
      else {
        this.toastr.error(this.response.message, 'Message.');
      }
    })
  }

  getBanks() {
    this.http.get(`${environment.apiUrl}/api/Lookups/Banks`)
      .subscribe(
        res => {
          this.response = res;
          if (this.response.success == true) {
            this.banks = this.response.data;
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


  editAgent() {
    this.spinner.show();
    this.http.get(`${environment.apiUrl}/api/Configs/GetExternalAgentById/` + this.userId)
      .subscribe(
        res => {
          this.response = res;
          if (this.response.success == true) {
            this.data = this.response.data;
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


  UpdateAgent() {

    this.spinner.show();
    this.data.emailAddress =this.data.emailAddress ==""?null:this.data.emailAddress;
    this.http.
      put(`${environment.apiUrl}/api/Configs/UpdateExternalAgent/` + this.userId, this.data)
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
}
// }
