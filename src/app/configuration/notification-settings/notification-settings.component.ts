import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
// import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-notification-settings',
  templateUrl: './notification-settings.component.html',
  styleUrls: ['./notification-settings.component.css']
})
export class NotificationSettingsComponent implements OnInit {
  id: any;
  localId: any;
  data: any = {};
  response: any;
  @ViewChild(NgForm) notifForm;
  constructor(
    private http: HttpClient,
    private toastr: ToastrService,
    // private _NgbActiveModal: NgbActiveModal
  ) { }
  ngOnInit(): void {
    this.localId = localStorage.getItem('NotificationSettingsID')
    if(this.localId != null){
      this.getbyid(this.localId);
  }
}
addNotification(){
  let SomeId =localStorage.getItem('NotificationSettingsID')
    if (SomeId != null) {
    let varr = {
      "daysCloseUnBilled":this.data.daysCloseUnBilled,
      "daysBGpaymentpending":this.data.daysBGpaymentpending,
      "daysBGPartialPaymentPendingDays": this.data.daysBGPartialPaymentPendingDays,
      "daysContractWorkingState":this.data.daysContractWorkingState,
      "daysAgentNotLogin":this.data.daysAgentNotLogin,
      "daysCEOApprovalForVoucher":this.data.daysCEOApprovalForVoucher,
      "daysLeftLCClosureNotDeliver": this.data.daysLeftLCClosureNotDeliver,
      "notificationDetail": this.data.notificationDetail

    }
    this.http.put(`${environment.apiUrl}/api/Configs/UpdateNotificationSetting/` + this.localId, varr)
      .subscribe(
        res => {
          this.response = res;
          if (this.response.success == true) {
            this.id = this.response.data;
            this.toastr.success(this.response.message, 'Message.');
            this.getbyid(this.id);
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
  else {
    let varr = {
      "daysCloseUnBilled":this.data.daysCloseUnBilled,
      "daysBGpaymentpending":this.data.daysBGpaymentpending,
      "daysBGPartialPaymentPendingDays": this.data.daysBGPartialPaymentPendingDays,
      "daysContractWorkingState":this.data.daysContractWorkingState,
      "daysAgentNotLogin":this.data.daysAgentNotLogin,
      "daysCEOApprovalForVoucher":this.data.daysCEOApprovalForVoucher,
      "daysLeftLCClosureNotDeliver": this.data.daysLeftLCClosureNotDeliver,
      "notificationDetail": this.data.notificationDetail

    }

    this.http.
      post(`${environment.apiUrl}/api/Configs/AddNotificationSetting`, varr)
      .subscribe(
        res => {

          this.response = res;
          if (this.response.success == true) {
            this.id = this.response.data;
            this.toastr.success(this.response.message, 'Message.');
            localStorage.setItem('NotificationSettingsID', this.id);
            this.getbyid(this.id);

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
}
// getbyid(id){

// }


getbyid(id) {

  this.http.get(`${environment.apiUrl}/api/Configs/GetNotificationSettingById/` + id)
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
