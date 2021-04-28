import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ServiceService } from 'src/app/shared/service.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-general-settings',
  templateUrl: './general-settings.component.html',
  styleUrls: ['./general-settings.component.css']
})
export class GeneralSettingsComponent implements OnInit {
  @Input() settingsId;
  data: any = {};
  response: any;
  rows: any = [];
  cityFilter: any = [];
  CityCount: number;
  
  @ViewChild(NgForm) settingsForm;

  constructor(
    private http: HttpClient,
    private toastr: ToastrService,
    private service: ServiceService,

    // private _NgbActiveModal: NgbActiveModal
  ) { }

  ngOnInit(): void {
    // this.getSettings(this.settingsId);

  }
  // get activeModal() {
  //   return this._NgbActiveModal;
  // }
  addGeneralSettings() {
    let varr = {
"systemEmailAddress": this.data.email,
"emailFromName": this.data.name,
"beforeLCReminderDays": this.data.reminderdays,
"systemNotificationRecipient": this.data.recipient,
"contractTitleMessage": this.data.titlemessage,
"termsAndCondition":this.data.termsandcondition,
"amountDecimalPoints": this.data.amount,
"quantityDecimalPoints": this.data.quantity,
"deptEmailAddress":this.data.deptemail,
"deptPhoneNo": this.data.deptphone,
     
    }

    this.http.
      post(`${environment.apiUrl}/api/Configs/AddGeneralSetting`, varr)
      .subscribe(
        res => {

          this.response = res;
          if (this.response.success == true) {
            this.data=this.response.data;
            this.toastr.success(this.response.message, 'Message.');
            this.getbyid(this.data.id)

            // this.notifForm.reset();
            // this.activeModal.close(true);
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
// getbyid(id){

// }


getbyid(id){ {
    this.http.get(`${environment.apiUrl}/api/Configs/GetGeneralSettingById` + id)
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
}
}