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

  data: any = {};
  response: any;
  @ViewChild(NgForm) notifForm;
  constructor(
    private http: HttpClient,
    private toastr: ToastrService,
    // private _NgbActiveModal: NgbActiveModal
  ) { }
  ngOnInit(): void {
  }



  addNotification() {
    let varr = {
      "daysCloseUnBilled":this.data.daysclosedunbilled,
"daysBGpaymentpending":this.data.paymentpending,
"daysBGPartialPaymentPendingDays": this.data.partialpaymentpending,
"daysContractWorkingState":this.data.workingstate,
"daysAgentNotLogin":this.data.agentnotlogin,
"daysCEOApprovalForVoucher":this.data.approval,
"daysLeftLCClosureNotDeliver": this.data.closure,
"notificationDetail": this.data.details
    }

    this.http.
      post(`${environment.apiUrl}/api/Configs/AddNotificationSetting`, varr)
      .subscribe(
        res => {

          this.response = res;
          if (this.response.success == true) {
            this.toastr.success(this.response.message, 'Message.');
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
