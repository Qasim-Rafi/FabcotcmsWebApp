import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgForm } from '@angular/forms';
import { ServiceService } from 'src/app/shared/service.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-add-time-action',
  templateUrl: './add-time-action.component.html',
  styleUrls: ['./add-time-action.component.css']
})
export class AddTimeActionComponent implements OnInit {

  data: any = {};
  response: any;
  active = true; 

  constructor(private http: HttpClient,
    private service: ServiceService,
    private toastr: ToastrService,private spinner: NgxSpinnerService,
    private _NgbActiveModal: NgbActiveModal) { }

  ngOnInit(): void {
  }
  get activeModal() {
    return this._NgbActiveModal;
  }


  addAction(form:NgForm) {
    this.spinner.show();
    let varr = {
      "name": this.data.name,
      "description": this.data.description,
      "active": this.active,
    }

    this.http.
      post(`${environment.apiUrl}/api/TextileGarments/AddTnaAction`, varr)
      .subscribe(
        res => {

          this.response = res;
          if (this.response.success == true) {
            this.toastr.success(this.response.message, 'Message.');

            // this.buyerForm.reset();
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



