import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import { ServiceService } from '../../service.service';

@Component({
  selector: 'app-enquiry-notes',
  templateUrl: './enquiry-notes.component.html',
  styleUrls: ['./enquiry-notes.component.css']
})
export class EnquiryNotesComponent implements OnInit {

  @Input() EnquiryId;
  @Input() NoteId;
  @Input() statusCheck;
  data: any = {};
  response: any;
  isPublic = "False" 
  
  


  //  selectedColor = this.data.color;

  constructor(
    private _NgbActiveModal: NgbActiveModal,
    private service: ServiceService,
    private http: HttpClient,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,

  ) { }

  ngOnInit(): void {
    this.EditEnquiryNote(this.NoteId);
  }


  get activeModal() {
    return this._NgbActiveModal;
  }


  AddEnquiryNote() {
    // this.data.color = this.selectedColor;
    this.spinner.show();
    let varr =
    {
      "enquiryId": this.EnquiryId,
      "isPublic": this.isPublic,
      "title": this.data.title,
      "description": this.data.description,
      "color": this.data.color,
      "flag": this.data.flag,
    }

    this.http.
      post(`${environment.apiUrl}/api/Enquiries/AddEnquiryNote`, varr)
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

        },(err: HttpErrorResponse) => {
          const messages = this.service.extractErrorMessagesFromErrorResponse(err);
          this.toastr.error(messages.toString(), 'Message.');
          console.log(messages);
          this.spinner.hide();
        });
  }




  EditEnquiryNote(id) {
    this.http.get(`${environment.apiUrl}/api/Enquiries/GetEnquiryNoteById/` + id)
      .subscribe(
        res => {
          this.response = res;
          if (this.response.success == true) {
            this.data = this.response.data;
            this.isPublic=this.data.isPublic;

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




  UpdateEnquiryNote() {
    this.spinner.show();
    let varr = {
      "enquiryId": this.EnquiryId,
      "isPublic": this.isPublic,
      "title": this.data.title,
      "description": this.data.description,
      "color": this.data.color,
      "flag": this.data.flag,
    }

    this.http.
      put(`${environment.apiUrl}/api/Enquiries/UpdateEnquiryNote/` + this.NoteId, varr)
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
