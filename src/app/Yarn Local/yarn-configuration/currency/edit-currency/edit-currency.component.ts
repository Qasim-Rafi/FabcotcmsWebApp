import { Component, Inject, Input, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgForm } from '@angular/forms';
import { ServiceService } from 'src/app/shared/service.service';
import { Dateformater } from 'src/app/shared/dateformater';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { DOCUMENT } from '@angular/common';

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
  active = true;
  
  constructor(private http:HttpClient,
    private service: ServiceService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private _NgbActiveModal: NgbActiveModal,
    @Inject(DOCUMENT) private _document: Document
     ) { }

  ngOnInit(): void {
    this.editCurrency();
  }
  get activeModal() {
    return this._NgbActiveModal;
  }

  refreshPage() {
    this._document.defaultView.location.reload();
  }

  editCurrency()
  {
    this.spinner.show();
    this.http.get(`${environment.apiUrl}/api/Configs/GetCurrencyRateById/`+this.userId )
    .subscribe(
      res=> { 
        this.response = res;
        if (this.response.success == true){
          this.data =this.response.data; 
          this.active = this.data.active;

    this.data.validFrom = this.dateformater.fromModel(this.data.validFrom);
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
        // if (err.status == 400) {
        //   this.toastr.error(this.response.message, 'Message.');
        // }
      });
  }


  UpdateCurrency(form:NgForm)
  {
    
    let varr=  {
      "validFrom": this.data.validFrom,
      "currencyCode":  this.data.currencyCode,
      "rate": this.data.rate,
      "details": this.data.details,
      "active": this.active

    }
this.spinner.show();
    this.http.
    put(`${environment.apiUrl}/api/Configs/UpdateCurrencyRate/`+this.userId,varr)
    .subscribe(
      res=> { 
  
        this.response = res;
        if (this.response.success == true){
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
        // if (err.status == 400) {
        //   this.toastr.error(this.response.message, 'Message.');
        // }
      });
  }
}
