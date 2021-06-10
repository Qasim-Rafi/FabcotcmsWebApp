import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgForm,ReactiveFormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ServiceService } from 'src/app/shared/service.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-general-settings',
  templateUrl: './general-settings.component.html',
  styleUrls: ['./general-settings.component.css']
})
export class GeneralSettingsComponent implements OnInit {
  // @Input() settingsId;
  data: any = {};
  response: any;
  // rows: any = [];
  id: any;
  localId: any;
  @ViewChild(NgForm) settingsForm;

  constructor(
    private http: HttpClient,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private service: ServiceService,

    // private _NgbActiveModal: NgbActiveModal
  ) { }

  ngOnInit(): void {
    this.localId = localStorage.getItem('GeneralSettingsID')
    if(this.localId != null){
      this.getbyid(this.localId);

    }
    // this.getSettings(this.settingsId);

  }
  // get activeModal() {
  //   return this._NgbActiveModal;
  // }
  addGeneralSettings() {
    this.spinner.show();
    let SomeId =localStorage.getItem('GeneralSettingsID')
    if (SomeId != null) {
      let varr = {
        "systemEmailAddress": this.data.systemEmailAddress,
        "emailFromName": this.data.emailFromName,
        "beforeLCReminderDays": this.data.beforeLCReminderDays,
        "systemNotificationRecipient": this.data.systemNotificationRecipient,
        "contractTitleMessage": this.data.contractTitleMessage,
        "termsAndCondition": this.data.termsAndCondition,
        "amountDecimalPoints": this.data.amountDecimalPoints,
        "quantityDecimalPoints": this.data.quantityDecimalPoints,
        "deptEmailAddress": this.data.deptEmailAddress,
        "deptPhoneNo": this.data.deptPhoneNo,

      }
      this.http.put(`${environment.apiUrl}/api/Configs/UpdateGeneralSetting/` + this.localId, varr)
        .subscribe(
          res => {
            this.response = res;
            if (this.response.success == true) {
              this.id = this.response.data;
              this.toastr.success(this.response.message, 'Message.');
              this.getbyid(this.id);
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
    else {
      let varr = {
        "systemEmailAddress": this.data.systemEmailAddress,
        "emailFromName": this.data.emailFromName,
        "beforeLCReminderDays": this.data.beforeLCReminderDays,
        "systemNotificationRecipient": this.data.systemNotificationRecipient,
        "contractTitleMessage": this.data.contractTitleMessage,
        "termsAndCondition": this.data.termsAndCondition,
        "amountDecimalPoints": this.data.amountDecimalPoints,
        "quantityDecimalPoints": this.data.quantityDecimalPoints,
        "deptEmailAddress": this.data.deptEmailAddress,
        "deptPhoneNo": this.data.deptPhoneNo,

      }

      this.http.
        post(`${environment.apiUrl}/api/Configs/AddGeneralSetting`, varr)
        .subscribe(
          res => {

            this.response = res;
            if (this.response.success == true) {
              this.id = this.response.data;
              this.toastr.success(this.response.message, 'Message.');
              localStorage.setItem('GeneralSettingsID', this.id);
              this.getbyid(this.id);
              this.spinner.hide();
              // this.notifForm.reset();
              // this.activeModal.close(true);
            }
            else {
              this.toastr.error(this.response.message, 'Message.');
              this.spinner.hide();
            }

          }, err => {
            if (err.status == 400) {
              this.toastr.error(err.error.message, 'Message.');
              this.spinner.hide();
            }
          });
    }
  }
  // getbyid(id){

  // }


  getbyid(id) {

    this.http.get(`${environment.apiUrl}/api/Configs/GetGeneralSettingById/` + id)
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
            this.toastr.error(err.error.message, 'Message.');
          }
        });

  }
}