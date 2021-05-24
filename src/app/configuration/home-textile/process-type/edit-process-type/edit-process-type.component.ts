import { Component, Input, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgForm } from '@angular/forms';


@Component({
  selector: 'app-edit-process-type',
  templateUrl: './edit-process-type.component.html',
  styleUrls: ['./edit-process-type.component.css']
})
export class EditProcessTypeComponent implements OnInit {


  data: any = {};
  response: any;
  @Input() userId;


  constructor(private http: HttpClient,
    private toastr: ToastrService,
    private _NgbActiveModal: NgbActiveModal) { }



  ngOnInit(): void {
    this.editProcessType();
  }


  get activeModal() {
    return this._NgbActiveModal;
  }


  editProcessType() {
    this.http.get(`${environment.apiUrl}/api/TextileGarments/GetProcessTypeById/` + this.userId)
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


  UpdateProcessType(form:NgForm) {
    if (form.status == "INVALID") {

      this.toastr.error("Invalid Form", 'Message.');
    }
    else{
    let varr = {
      "type": this.data.type,
      "description": this.data.description,
      "active": this.data.active,
    }

    this.http.
      put(`${environment.apiUrl}/api/TextileGarments/UpdateProcessType/` + this.userId, varr)
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

        }, err => {
          if (err.status == 400) {
            this.toastr.error(this.response.message, 'Message.');
          }
        });
  }
}

}
