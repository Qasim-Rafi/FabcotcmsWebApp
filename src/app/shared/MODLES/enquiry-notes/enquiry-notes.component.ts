import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
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

  public arrayColors: any = {
    color1: '#000000',
    color2: '#a0a0a0',
    color3: '#1ab394',
    color4: '#ed5565',
    color5: '#1c84c6',
    color6: '#f8ac59',
    color7: '#23c6c8',
  };
   selectedColor = this.data.color;

  constructor(
    private _NgbActiveModal: NgbActiveModal,
    private http: HttpClient,
    private toastr: ToastrService,

  ) { }

  ngOnInit(): void {


    console.log(this.selectedColor);

    this.EditEnquiryNote(this.NoteId);
  }


  get activeModal() {
    return this._NgbActiveModal;
  }


  AddEnquiryNote() {
    this.data.color = this.selectedColor;
    let varr =
    {
      "enquiryId": this.EnquiryId,
      "isPublic": this.data.isPublic,
      "title": this.data.title,
      "description": this.data.description,
      "color": this.data.color,
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




  EditEnquiryNote(id) {
    this.http.get(`${environment.apiUrl}/api/Enquiries/GetEnquiryNoteById/` + id)
      .subscribe(
        res => {
          this.response = res;
          if (this.response.success == true) {
            this.data = this.response.data;
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
    let varr = {
      "enquiryId": this.EnquiryId,
      "isPublic": this.data.isPublic,
      "title": this.data.title,
      "description": this.data.description,
      "color": this.data.color,
    }

    this.http.
      put(`${environment.apiUrl}/api/Enquiries/UpdateEnquiryNote/` + this.NoteId, varr)
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

        }, err => {
          if (err.status == 400) {
            this.toastr.error(this.response.message, 'Message.');
          }
        });
  }




}
