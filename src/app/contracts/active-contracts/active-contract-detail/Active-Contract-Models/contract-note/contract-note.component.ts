import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
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
  data: any = {};
  response: any;


  //  selectedColor = this.data.color;

  constructor(
    private _NgbActiveModal: NgbActiveModal,
    private http: HttpClient,
    private toastr: ToastrService,

  ) { }

  ngOnInit(): void {
    // this.EditEnquiryNote(this.NoteId);
    this.statusCheck = this.statusCheck;
    if (this.statusCheck == 'contractEditNote') {
      this.EditContractNote();
    }
  }


  get activeModal() {
    return this._NgbActiveModal;
  }


  AddContractNote() {
    // this.data.color = this.selectedColor;
    let varr =
    {
      "enquiryId": this.data.EnquiryId,
      "contractId":this.data.contactId,
      "isPublic": this.data.isPublic,
      "title": this.data.title,
      "description": this.data.description,
      "color": this.data.color,
      "flag": this.data.flag,
      "active":this.data.active
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




  EditContractNote() {
    this.http.get(`${environment.apiUrl}/api/Contracts/GetContractNoteById/` + this.NoteId)
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




  UpdateContractNote() {
    let varr = {
      "enquiryId": this.data.EnquiryId,
      "contractId":this.data.contactId,
      "isPublic": this.data.isPublic,
      "title": this.data.title,
      "description": this.data.description,
      "color": this.data.color,
      "flag": this.data.flag,
      "active":this.data.active
    }

    this.http.
      put(`${environment.apiUrl}/api/Contracts/UpdateContractNote/` + this.NoteId, varr)
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
