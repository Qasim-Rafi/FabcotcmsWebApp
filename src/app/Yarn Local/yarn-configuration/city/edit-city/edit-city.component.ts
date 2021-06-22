import { Component, ElementRef, Inject, Input, OnInit, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ServiceService } from 'src/app/shared/service.service';
import { NgForm } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { DOCUMENT } from '@angular/common';
@Component({
  selector: 'app-edit-city',
  templateUrl: './edit-city.component.html',
  styleUrls: ['./edit-city.component.css']
})
export class EditCityComponent implements OnInit {
  country: any = [];
  response: any;
  data: any = {};
  obj: any = {};
  active = true;
  FormName: any;
  @Input() cityId;
  @Input() statusCheck;
  @ViewChild(NgForm) CityForm;

  constructor(private http: HttpClient,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private _NgbActiveModal: NgbActiveModal,
    private service: ServiceService,
    @Inject(DOCUMENT) private _document: Document) { }

  ngOnInit(): void {

    {
      this.service.getCountry().subscribe(res => {
        this.response = res;
        if (this.response.success == true) {
          this.country = this.response.data;
        }
        else {
          this.toastr.error(this.response.message, 'Message.');
        }
      })
    }
    this.statusCheck = this.statusCheck;
    if (this.statusCheck == 'CityEdit') {
      this.editCity();
    }
    // this.editCity();
  }

  get activeModal() {
    return this._NgbActiveModal;
  }
  refreshPage() {
    this._document.defaultView.location.reload();
  }
  //EDIT CITIES

  editCity() {
    this.spinner.show();
    this.http.get(`${environment.apiUrl}/api/Configs/GetCityById/` + this.cityId)
      .subscribe(
        res => {
          this.response = res;
          if (this.response.success == true) {

            this.data = this.response.data;
            this.spinner.hide();
          }
          else {
            this.toastr.error(this.response.message, 'Message.');
         this.spinner.hide();
          }

        }, err => {
          if (err.status == 400) {
            this.toastr.error(this.response.message, 'Message.');
          this.spinner.hide();
          }
        });
  }

  //ADD CITIES

  addCity(form:NgForm) {
      // if (form.status == "INVALID") {

      //   this.toastr.error("Invalid Form", 'Message.');
      // }

      // else{
    let varr = {
      "name": this.data.name,
      "details": this.data.details,
      "countryId": this.data.countryId,
      "active": this.active

    }
this.spinner.show();
    this.http.
      post(`${environment.apiUrl}/api/Configs/AddCity`, varr)
      .subscribe(
        res => {
          this.obj.parent = this.active;
          this.obj.status = true;

          this.response = res;
          if (this.response.success == true) {
            this.toastr.success(this.response.message, 'Message.');

            // this.buyerForm.reset();
            this.activeModal.close(this.obj);
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
// }

  //GET CITY
  getCity() {
    this.http.get(`${environment.apiUrl}/api/Configs/GetAllCity`)
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



  //UPDATE CITIES

  UpdateCity(form:NgForm) {
    
    let varr = {
      "name": this.data.name,
      "details": this.data.details,
      "countryId": this.data.countryId,
      "active": this.data.active
    }
this.spinner.show();
    this.http.
      put(`${environment.apiUrl}/api/Configs/UpdateCity/` + this.cityId, varr)
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

  onSubmit(buttonType): void {
    if (buttonType === "addCity") {

      this.addCity(this.CityForm); 
    }

    if (buttonType === "UpdateCity") {

      this.UpdateCity(this.CityForm); 

    }

  }

  

}

