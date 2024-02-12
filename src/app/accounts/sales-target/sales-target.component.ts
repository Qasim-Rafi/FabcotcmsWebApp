import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ServiceService } from 'src/app/shared/service.service';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
@Component({
  selector: 'app-sales-target',
  templateUrl: './sales-target.component.html',
  styleUrls: ['./sales-target.component.css']
})
export class SalesTargetComponent implements OnInit {
  data:any={};
  currency:any=[]
  uom:any=[]
  response:any;
  departments: any = [];
  month:number
  year:number
  constructor(  private service: ServiceService,
    private toastr: ToastrService,   private http: HttpClient,) { }

  ngOnInit(): void {
    this.get()
    this.GetCurrencyDropdown()
    this.GetUOMDropdown()
    //this.getdepartments()
  }
  GetUOMDropdown() {
    this.service.getUOM().subscribe(res => {
      this.response = res;
      if (this.response.success == true) {
        this.uom = this.response.data;
      }
      else {
        this.toastr.error(this.response.message, 'Message.');
      }
    })
  }
getdepartments(){
  this.service.getDepartments().subscribe(res => {
    this.response = res;
    if (this.response.success == true) {
      this.departments = this.response.data;
    }
    else {
      this.toastr.error(this.response.message, 'Message.');
    }
  })
}

GetCurrencyDropdown() {
  this.service.getCurrencyType().subscribe(res => {
    this.response = res;
    if (this.response.success == true) {
      this.currency = this.response.data;
    }
    else {
      this.toastr.error(this.response.message, 'Message.');
    }
  })
}
get(){
  // let varr = {
  //   "blockId": this.data.blockId,
  //   "quantity": this.data.quantity,
  // }
  const currentDate = new Date();
  this.month =currentDate.getMonth() + 1;
  this.year= currentDate.getFullYear();
    this.http
    .get(`${environment.apiUrl}/api/MonthTraget/GetAllMonthTraget/`+this.month+'/'+this.year)
    .subscribe(res => {
      this.response = res;

      if (this.response.success == true) {
        console.log(this.response)
  
        this.departments = this.response.data;
        this.departments.forEach((object) => {
         if(object.currencyTypeID ==0){
          object.currencyTypeID =null
         }
         if(object.quantityUOM ==0){
          object.quantityUOM =null
         }
        })
      }
      else {
        this.toastr.error(this.response.message, 'Message.');
      }
      // this.spinner.hide();
    }, err => {
      if (err.status == 400) {
        this.toastr.error(err.error.message, 'Message.');;
      }
      //  this.spinner.hide();
    });
  }
}

