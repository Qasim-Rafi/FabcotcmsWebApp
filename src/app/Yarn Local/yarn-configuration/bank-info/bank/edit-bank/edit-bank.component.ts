import { Component, Inject, Input, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgForm } from '@angular/forms';
import { ServiceService } from 'src/app/shared/service.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-edit-bank',
  templateUrl: './edit-bank.component.html',
  styleUrls: ['./edit-bank.component.css']
})
export class EditBankComponent implements OnInit {
  data:any={};
  response: any;
  @Input() userId;
  
  constructor(private http:HttpClient,
    private service: ServiceService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private _NgbActiveModal: NgbActiveModal,
    @Inject(DOCUMENT) private _document: Document
    ) { }

  ngOnInit(): void {
    this.editBank();
  }

  
  get activeModal() {
    return this._NgbActiveModal;
  }
  refreshPage() {
    this._document.defaultView.location.reload();
  }

  editBank()
  {
    this.spinner.show();
    this.http.get(`${environment.apiUrl}/api/Configs/GetBankById/`+this.userId )
    .subscribe(
      res=> { 
        this.response = res;
        if (this.response.success == true){
          this.data =this.response.data; 
          this.spinner.hide();
        }
        else {
          this.toastr.error(this.response.message, 'Message.');
        this.spinner.hide();   
        }

      }, err => {
        if (err.status == 400) {
          this.toastr.success(this.response.message, 'Message.');
      this.spinner.hide();
        }
      });
  }


  
  UpdateBank(form:NgForm)
  {
    
    let varr=  {
      "name": this.data.name,
      "branchCode":this.data.branchCode,
      "branchName":this.data.branchName ,
      "location":this.data.location,
      "address":this.data.address,
      "details":this.data.details
    }
this.spinner.show();
    this.http.
    put(`${environment.apiUrl}/api/Configs/UpdateBank/`+this.userId,varr)
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
      });
  }
}


