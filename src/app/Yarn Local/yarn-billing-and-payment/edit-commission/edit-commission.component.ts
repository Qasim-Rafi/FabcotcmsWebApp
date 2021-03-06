import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ServiceService } from 'src/app/shared/service.service';
import { environment } from 'src/environments/environment';
import { Dateformater } from 'src/app/shared/dateformater';
import {NgxSpinnerService} from 'ngx-spinner'
import { from } from 'rxjs';
@Component({
  selector: 'app-edit-commission',
  templateUrl: './edit-commission.component.html',
  styleUrls: ['./edit-commission.component.css']
})
export class EditCommissionComponent implements OnInit {
  dateformater: Dateformater = new Dateformater();

  response: any;
  data: any = {};
  @Input()  Editid;
  @ViewChild(NgForm) paymentForm;

  constructor(

    private route: ActivatedRoute,
    private modalService: NgbModal,
    private http: HttpClient,
    private service: ServiceService,
    private toastr: ToastrService,
    private router: Router,
    private _NgbActiveModal: NgbActiveModal,
    private spinner : NgxSpinnerService
  
  ) { }

  ngOnInit(): void {
    this.getCommission()
  }
  get activeModal() {
    return this._NgbActiveModal;
  }
  getCommission() {
    this.http.get(`${environment.apiUrl}/api/BillingPayments/GetBillingCommissionPaymentById/` + this.Editid )
      .subscribe(
        res => {
          this.response = res;
          if (this.response.success == true) {
            this.data = this.response.data;
            this.data.paymentDate = this.dateformater.fromModel(this.data.paymentDate);
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
  
  UpdatePayment(form:NgForm) {

    let varr = {
      "paymentDate": this.dateformater.toModel(this.data.paymentDate),
      "paymentRemarks": this.data.paymentRemarks,
    }
 this.spinner.show();
    this.http.put(`${environment.apiUrl}/api/BillingPayments/UpdateBillingCommissionPayment/` + this.Editid, varr)
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

onSubmit(): void {

    this.UpdatePayment(this.paymentForm); 


}
}
