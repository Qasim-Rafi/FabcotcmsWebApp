import { Component, Input, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgForm } from '@angular/forms';

@Component({

  selector: 'app-edit-currency',
  templateUrl: './edit-currency.component.html',
  styleUrls: ['./edit-currency.component.css']

})
export class EditCurrencyComponent implements OnInit {

  data:any={};
  response: any;
  @Input() userId;
  
  constructor(private http:HttpClient,
    private toastr: ToastrService,
    private _NgbActiveModal: NgbActiveModal ) { }

  ngOnInit(): void {
    this.editCurrency();
  }
  get activeModal() {
    return this._NgbActiveModal;
  }



  editCurrency()
  {
    this.http.get(`${environment.apiUrl}/api/Configs/GetCurrencyRateById/`+this.userId )
    .subscribe(
      res=> { 
        this.response = res;
        if (this.response.success == true){
          this.data =this.response.data; 
        }
        else {
          this.toastr.error('Something went Worng', 'Message.');
            }

      }, err => {
        if (err.status == 400) {
          this.toastr.error(this.response.message, 'Message.');
        }
      });
  }


  UpdateCurrency(form:NgForm)
  {
    if (form.status == "INVALID") {

      this.toastr.error("Invalid Form", 'Message.');
    }
    else{
    let varr=  {
      "validFrom": this.data.validFrom,
      "currencyCode":  this.data.currencyCode,
      "rate": this.data.rate,
      "details": this.data.details
    }

    this.http.
    put(`${environment.apiUrl}/api/Configs/UpdateCurrencyRate/`+this.userId,varr)
    .subscribe(
      res=> { 
  
        this.response = res;
        if (this.response.success == true){
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
}