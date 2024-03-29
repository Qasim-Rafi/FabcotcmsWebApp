import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ServiceService } from 'src/app/shared/service.service';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-contract-note',
  templateUrl: './contract-note.component.html',
  styleUrls: ['./contract-note.component.css']
})
export class ContractNoteComponent implements OnInit {

  @Input() EnquiryId;
  @Input() NoteId;
  @Input() statusCheck;
  @Input() contractId;
  data: any = {};
  response: any;
  isPublic = "False"



  //  selectedColor = this.data.color;

  constructor(
    private _NgbActiveModal: NgbActiveModal,
    private http: HttpClient,
private spinner: NgxSpinnerService,
private toastr: ToastrService,
    private service: ServiceService
  ) { }

  ngOnInit(): void {
    // this.EditEnquiryNote(this.NoteId);
    this.statusCheck = this.statusCheck;
    if (this.statusCheck == 'Edit') {
      this.EditContractNote();
    }
  }


  get activeModal() {
    return this._NgbActiveModal;
  }


  AddContractNote() {
    // this.data.color = this.selectedColor;


    this.spinner.show();
    let varr =
    {
      "contractId": this.contractId,
      "isPublic": this.isPublic,
      "title": this.data.title,
      "description": this.data.description,
      "color": this.data.color,
      "flag": this.data.flag,
      "active": this.data.active
    }

    this.http.
      post(`${environment.apiUrl}/api/Contracts/AddContractNote`, varr)
      .subscribe(
        res => {
          this.response = res;
          if (this.response.success == true) {
            this.toastr.success(this.response.message, 'Message.');
            // this.buyerForm.reset();
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




  EditContractNote() {
    this.http.get(`${environment.apiUrl}/api/Contracts/GetContractNoteById/` + this.NoteId)
      .subscribe(
        res => {
          this.response = res;
          if (this.response.success == true && this.response.data != null) {
            this.data = this.response.data;
            this.isPublic = this.data.isPublic;
          }
          else if(this.response.success == false) {
         
            this.toastr.error(this.response.message, 'Message.');
          }
        }, err => {
          if (err.status == 400) {
            this.toastr.error(this.response.message, 'Message.');
          }
        });
  }




  UpdateContractNote() {
    this.spinner.show();
    let varr = {
      "contractId": this.contractId,
      "isPublic": this.isPublic,
      "title": this.data.title,
      "description": this.data.description,
      "color": this.data.color,
      "flag": this.data.flag,
      "active": this.data.active
    }

    this.http.
      put(`${environment.apiUrl}/api/Contracts/UpdateContractNote/` + this.NoteId, varr)
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




}


