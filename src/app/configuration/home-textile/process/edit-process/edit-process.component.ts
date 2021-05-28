import { Component, Input, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgForm } from '@angular/forms';
import { ServiceService } from 'src/app/shared/service.service';

@Component({
  selector: 'app-edit-process',
  templateUrl: './edit-process.component.html',
  styleUrls: ['./edit-process.component.css']
})
export class EditProcessComponent implements OnInit {

  data: any = {};
  response: any;
  @Input() userId;


  constructor(private http: HttpClient,
    private service: ServiceService,
    private toastr: ToastrService,
    private _NgbActiveModal: NgbActiveModal) { }


  ngOnInit(): void {
    this.editProcess();
  }

  get activeModal() {
    return this._NgbActiveModal;
  }



  editProcess() {
    this.http.get(`${environment.apiUrl}/api/TextileGarments/GetProcessById/` + this.userId)
      .subscribe(
        res => {
          this.response = res;
          if (this.response.success == true) {
            this.data = this.response.data;
          }
          else {
            this.toastr.error('Something went Worng', 'Message.');
          }

        }, err => {
          if (err.status == 400) {
            this.toastr.error('Something went Worng', 'Message.');
          }
        });
  }


  UpdateProcess(form:NgForm) {

    let varr = {
      "name": this.data.name,
      "description": this.data.description,
      "active": this.data.active,
    }

    this.http.
      put(`${environment.apiUrl}/api/TextileGarments/UpdateProcess/` + this.userId, varr)
      .subscribe(
        res => {

          this.response = res;
          if (this.response.success == true) {
            this.toastr.success(this.response.message, 'Message.');
            this.activeModal.close(true);
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

}
