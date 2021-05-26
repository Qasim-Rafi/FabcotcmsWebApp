import { Component, Input, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgForm } from '@angular/forms';
import { ServiceService } from 'src/app/shared/service.service';
import { Dateformater } from 'src/app/shared/dateformater';

@Component({

  selector: 'app-edit-currency',
  templateUrl: './edit-currency.component.html',
  styleUrls: ['./edit-currency.component.css']

})
export class EditCurrencyComponent implements OnInit {
  dateformater: Dateformater = new Dateformater();
  data:any={};
  response: any;
  @Input() userId;
  
  constructor(private http:HttpClient,
    private service: ServiceService,
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
    this.data.validFrom = this.dateformater.fromModel(this.data.validFrom);

        }
        else {
          this.toastr.error('Something went Worng', 'Message.');
            }

      }, (err: HttpErrorResponse) => {
        const messages = this.service.extractErrorMessagesFromErrorResponse(err);
        this.toastr.error(messages.toString(), 'Message.');
        console.log(messages);
        // if (err.status == 400) {
        //   this.toastr.error(this.response.message, 'Message.');
        // }
      });
  }


  UpdateCurrency(form:NgForm)
  {
    this.data.validFrom = this.dateformater.toModel(this.data.validFrom);
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

      }, (err: HttpErrorResponse) => {
        const messages = this.service.extractErrorMessagesFromErrorResponse(err);
        this.toastr.error(messages.toString(), 'Message.');
        console.log(messages);
        // if (err.status == 400) {
        //   this.toastr.error(this.response.message, 'Message.');
        // }
      });
  }
}
}