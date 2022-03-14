import { Component, ElementRef, Inject, Input, OnInit, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-add-edit-forecast',
  templateUrl: './add-edit-forecast.component.html',
  styleUrls: ['./add-edit-forecast.component.css']
})
export class AddEditForecastComponent implements OnInit {

  @Input() cityId;
  response: any;
  data: any = {};
  @Input() statusCheck;
  @ViewChild(NgForm) CityForm;
  constructor(
    private http: HttpClient,
    private toastr: ToastrService,
    private _NgbActiveModal: NgbActiveModal,

  ) { }

  ngOnInit(): void {
  }
  add(form:NgForm) {
    let varr = {
      "name": this.data.name,

    }

  this.http.
    post(`${environment.apiUrl}/api/BillingPayments/AddFabcotTrendsCompanyData`, varr)
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
        this.toastr.error(this.response.message, 'Message.');

      });
}
  Update(form:NgForm) {
    
    // let varr = {
    //   "name": this.data.name,
    //   "details": this.data.details,
    //   "countryId": this.data.countryId,
    //   "active": this.data.active
    // }

    // this.http.
    //   put(`${environment.apiUrl}/api/Configs/UpdateCity/` + this.cityId, varr)
    //   .subscribe(
    //     res => {

    //       this.response = res;
    //       if (this.response.success == true) {
    //         this.toastr.success(this.response.message, 'Message.');
    //         this.activeModal.close(true);
           
    //       }
    //       else {
    //         this.toastr.error(this.response.message, 'Message.');
        
    //       }

    //     }, (err: HttpErrorResponse) => {
          
         
         
    //     });
  
}




  get activeModal() {
    return this._NgbActiveModal;
  }

  onSubmit(buttonType): void {
    if (buttonType === "add") {

      this.add(this.CityForm); 
    }

    if (buttonType === "Update") {

      this.Update(this.CityForm); 

    }

  }


}
