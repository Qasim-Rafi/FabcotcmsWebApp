import { Component, ElementRef, Inject, Input, OnInit, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-add-edit-trend-form',
  templateUrl: './add-edit-trend-form.component.html',
  styleUrls: ['./add-edit-trend-form.component.css']
})
export class AddEditTrendFormComponent implements OnInit {

  @Input() FormData;
  response: any;
  data: any = {};
  company:any=[];
  years =[
    { id: 1,name: '2022' },
    { id: 2, name: '2023' },
    { id: 3,name: '2024' },
    { id: 4,name: '2025' },
    { id: 5, name: '2026' },
    { id: 6, name: '2027' },
    { id: 7, name: '2028' },
    { id: 8, name: '2029' },
    { id: 9, name: '2030'  },

  ];
  months = [
    { id: 1,name: 'Jan' },
    { id: 2, name: 'Feb' },
    { id: 3,name: 'Mar' },
    { id: 4,name: 'Apr' },
    { id: 5, name: 'May' },
    { id: 6, name: 'Jun' },
    { id: 7, name: 'Jul' },
    { id: 8, name: 'Aug' },
    { id: 9, name: 'Sep'  },
    { id: 10,name: 'Oct' },
    { id: 11, name: 'Nov' },
    { id: 12, name: 'Dec' },
];
  @Input() statusCheck;
  @ViewChild(NgForm) CityForm;
  constructor(
    private http: HttpClient,
    private toastr: ToastrService,
    private _NgbActiveModal: NgbActiveModal,

  ) { }

  ngOnInit(): void {
    this.getLookUpCompany();
    //this.getYear()
    if(this.statusCheck == 'Edit'){

      this.getById();
    }
  }
  getLookUpCompany() {
    this.http
      .get(`${environment.apiUrl}/api/Lookups/FabcotTrendsCompanyLookup`)
      .subscribe(res => {
        this.response = res;
        if (this.response.success == true) {
          this.company = this.response.data;
        }
        else {
          this.toastr.error(this.response.message, 'Message.');
        }

      }, err => {
        if (err.status == 400) {
          this.toastr.error(err.error.message, 'Message.');
        }
      });
  }

  getById() {
    this.http
      .get(`${environment.apiUrl}/api/BillingPayments/GetFabcotTrendsDataAllById/`+ this.FormData.id)
      .subscribe(res => {
        this.response = res;
        if (this.response.success == true) {
          this.data = this.response.data;
         let y= this.years.filter(x=>x.name ==this.data.year);
         this.data.year =y[0].id
         let m= this.months.filter(x=>x.name ==this.data.month);
         this.data.month =m[0].id
        }
        else {
          this.toastr.error(this.response.message, 'Message.');
        }

      }, err => {
        if (err.status == 400) {
          this.toastr.error(err.error.message, 'Message.');
        }
      });
  }
  add(form:NgForm) {
    if (form.status == "INVALID") {

      this.toastr.error("Invalid Form", 'Message.');
    }

    else{

      let y= this.years.filter(x=>x.id ==this.data.year);
      this.data.year =y[0].name
      let m= this.months.filter(x=>x.id ==this.data.month);
      this.data.month =m[0].name

  let varr = {
    "fabcotCompanyId": this.data.fabcotCompanyId,
    "month": this.data.month,
    "year": this.data.year,
    "averageValue": this.data.averageValue,
    "mixValue": this.data.mixValue,
    "minValue": this.data.minValue,
    "isForecast": true,

  }
//this.spinner.show();
  this.http.
    post(`${environment.apiUrl}/api/BillingPayments/AddFabcotTrendsData`, varr)
    .subscribe(
      res => {
        this.response = res;
        if (this.response.success == true) {
          this.toastr.success(this.response.message, 'Message.');
          this.activeModal.close(true);
          // // this.buyerForm.reset();
          // this.activeModal.close(this.obj);
          // this.spinner.hide();
        }
        else {
          this.toastr.error(this.response.message, 'Message.');

        }

      }, (err: HttpErrorResponse) => {
        this.toastr.error(this.response.message, 'Message.');
       
      });
}
  }
  Update(form:NgForm) {
    
    let y= this.years.filter(x=>x.id ==this.data.year);
      this.data.year =y[0].name
      let m= this.months.filter(x=>x.id ==this.data.month);
      this.data.month =m[0].name

  let varr = {
    "fabcotCompanyId": this.data.fabcotCompanyId,
    "month": this.data.month,
    "year": this.data.year,
    "averageValue": this.data.averageValue,
    "mixValue": this.data.mixValue,
    "minValue": this.data.minValue,
    "isForecast": true,

  }

    this.http.
      put(`${environment.apiUrl}/api/BillingPayments/UpdateGetFabcotTrendsData/` + this.FormData.id, varr)
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
          
         
         
        });
  
}

// getYear(){
//   var year = new Date().getFullYear();
//     var range = [];
//     range.push(year);
//     for (var i = 1; i < 7; i++) {
//         range.push(year + i);
//     }
//     this.years = range;
// }


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
