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
  @Input() statusCheck;
  data: any = {};
  response: any;


  constructor(
    private _NgbActiveModal: NgbActiveModal,
    private http: HttpClient,
    private toastr: ToastrService,

  ) { }

  ngOnInit(): void {
  }


  get activeModal() {
    return this._NgbActiveModal;
  }


  addEnquiryItem() {
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



}
