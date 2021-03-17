import { Component, Input, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ServiceService } from 'src/app/shared/service.service';
@Component({
  selector: 'app-edit-city',
  templateUrl: './edit-city.component.html',
  styleUrls: ['./edit-city.component.css']
})
export class EditCityComponent implements OnInit {
  country: any = [];
  countryId: null;
  response: any;
  data: any = {};
  @Input() userId;


  constructor(private http: HttpClient,
    private toastr: ToastrService,
    private _NgbActiveModal: NgbActiveModal,
    private service: ServiceService) { }

  ngOnInit(): void {
    {
      this.service.getCountry().subscribe(res => {
        this.response = res;
        if (this.response.success == true) {
          this.country = this.response.data;
        }
        else {
          this.toastr.error('Something went Worng', 'Message.');
        }
      })
    }
    this.editCity();
  }


  get activeModal() {
    return this._NgbActiveModal;
  }

  editCity() {
    this.http.get(`${environment.apiUrl}/api/Configs/GetCityById/` + this.userId)
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
            this.toastr.error('Something went Worng', 'Message.');
          }
        });
  }


  UpdateCity() {
    let varr = {
      "name": this.data.name,
      "details": this.data.details,
      "countryId": this.data.countryId,
      "active": this.data.active
    }

    this.http.
      put(`${environment.apiUrl}/api/Configs/UpdateCity/` + this.userId, varr)
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
            this.toastr.error('Something went Worng', 'Message.');
          }
        });
  }


}

