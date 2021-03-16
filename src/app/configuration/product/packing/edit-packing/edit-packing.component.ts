import { Component, Input, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-edit-packing',
  templateUrl: './edit-packing.component.html',
  styleUrls: ['./edit-packing.component.css']
})
export class EditPackingComponent implements OnInit {
  data: any = {};
  response: any;
  @Input() userId;
  constructor(private http: HttpClient,
    private toastr: ToastrService,
    private _NgbActiveModal: NgbActiveModal) { }

  ngOnInit(): void {
    this.editPacking();
  }

  get activeModal() {
    return this._NgbActiveModal;
  }


  editPacking() {
    this.http.get(`${environment.apiUrl}/api/Products/GetPackingById/` + this.userId)
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



  UpdatePacking() {
    let varr = {
      "name": this.data.name,
      "description": this.data.description,
    }

    this.http.
      put(`${environment.apiUrl}/api/Products/UpdatePacking/` + this.userId, varr)
      .subscribe(
        res => {

          this.response = res;
          if (this.response.success == true) {
            this.toastr.success(this.response.message, 'Message.');
            this.activeModal.close(true);
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



}
