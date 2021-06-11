import { Component, Input, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgForm } from '@angular/forms';
import { ServiceService } from 'src/app/shared/service.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-edit-loom-type',
  templateUrl: './edit-loom-type.component.html',
  styleUrls: ['./edit-loom-type.component.css']
})
export class EditLoomTypeComponent implements OnInit {
  data: any = {};
  response: any;
  @Input() userId;

  constructor(private http: HttpClient,
    private service: ServiceService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private _NgbActiveModal: NgbActiveModal) { }

  ngOnInit(): void {
    this.editLoom();
  }

  get activeModal() {
    return this._NgbActiveModal;
  }


  editLoom() {
    this.http.get(`${environment.apiUrl}/api/TextileGarments/GetLoomTypeById/` + this.userId)
      .subscribe(
        res => {
          this.response = res;
          if (this.response.success == true) {
            this.data = this.response.data;
          }
          else {
            this.toastr.error('Something went Worng', 'Message.');
          }

        }, (err: HttpErrorResponse) => {
          const messages = this.service.extractErrorMessagesFromErrorResponse(err);
          this.toastr.error(messages.toString(), 'Message.');
          console.log(messages);
          
        });
  }


  UpdateLoom(form:NgForm) {
    // if (form.status == "INVALID") {

    //   this.toastr.error("Invalid Form", 'Message.');
    // }
    // else{
      this.spinner.show();
    let varr = {
      "type": this.data.type,
      "description": this.data.description,
      "active": this.data.active,
    }

    this.http.
      put(`${environment.apiUrl}/api/TextileGarments/Update/` + this.userId, varr)
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

