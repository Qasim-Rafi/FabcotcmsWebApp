import { Component, ElementRef, Inject, Input, OnInit, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { GlobalConstants } from 'src/app/Common/global-constants'
import { NgForm } from '@angular/forms';
import { ServiceService } from 'src/app/shared/service.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { DOCUMENT } from '@angular/common';


@Component({
  selector: 'app-add-piece-length',
  templateUrl: './add-piece-length.component.html',
  styleUrls: ['./add-piece-length.component.css']
})
export class AddPieceLengthComponent implements OnInit {

  response: any;
  data: any = {};
  obj : any ={};
  active = true;
  @Input() piecelengthId;
  @Input() statusCheck;
  @Input() FormName;
  @ViewChild(NgForm) piecelengthForm;

  constructor(private http: HttpClient,
    private service: ServiceService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private _NgbActiveModal: NgbActiveModal,
    @Inject(DOCUMENT) private _document: Document
    ) { }

  ngOnInit(): void {
    this.statusCheck = this.statusCheck;
    this.FormName = this.FormName;
    if (this.statusCheck == 'edit') {
      this.editPieceLength();
    }
  }
 
  get activeModal() {
    return this._NgbActiveModal;
  }
  refreshPage() {
    this._document.defaultView.location.reload();
  }
  editPieceLength() {
    this.spinner.show();
    this.http.get(`${environment.apiUrl}/api/YarnConfig/GetPieceLengthById/` + this.piecelengthId)
      .subscribe(
        res => {
          this.response = res;
          if (this.response.success == true) {
            this.data = this.response.data;
            this.active = this.data.active;
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

  UpdatePieceLength(form:NgForm) {

    let varr = {
      "pieceLengthName": this.data.pieceLengthName,
      "description": this.data.description,
      "active": this.active
    }
this.spinner.show();
    this.http.
      put(`${environment.apiUrl}/api/YarnConfig/UpdatePieceLength/` + this.piecelengthId, varr)
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

  // -------------------------------------ADD PIECELENGTH FROM ---------------------------

  addPieceLength(form:NgForm) {

  

    let varr = {
      "pieceLengthName": this.data.pieceLengthName,
      "description": this.data.description,
      "active": this.active
    }
this.spinner.show();
    this.http.
      post(`${environment.apiUrl}/api/YarnConfig/AddPieceLength`, varr)
      .subscribe(
        res => {
          this.obj.parent = this.active;
          this.obj.status = true;
          this.response = res;
          if (this.response.success == true) {
            this.toastr.success(this.response.message, 'Message.');
            this.piecelengthForm.reset();
            this.obj.id = this.response.data;
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


onSubmit(buttonType): void {
  if (buttonType === "addPieceLength"){

    this.addPieceLength(this.piecelengthForm); 
  }

  if (buttonType === "UpdatePieceLength"){

    this.UpdatePieceLength(this.piecelengthForm); 

  }

}


}
