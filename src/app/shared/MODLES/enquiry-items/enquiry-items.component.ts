import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { environment } from 'src/environments/environment';
import { ToastrService } from 'ngx-toastr';
import { ServiceService } from '../../service.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-enquiry-items',
  templateUrl: './enquiry-items.component.html',
  styleUrls: ['./enquiry-items.component.css']
})
export class EnquiryItemsComponent implements OnInit {

  @Input() statusCheck;
  @Input() EnquiryId;
  @Input() EnquiryItemId;
  data: any = [{id:0}];
  response: any;
  uomList: any = [];
  color: any = [];
  loomType: any = [];
  fabricType: any = [];
  values=[];
  description: any=[];
  itemQuantity: any=[];
  itemUOMId: any=[];
  compositionPercentage: any=[];
  compositionFebricTypeId: any=[];
  compositionAdditionalInfo: any=[];
  construction: any=[];
  weight: any=[];
  size: any=[];
  remarks: any=[];
  counter: number = 0


  constructor(
    private _NgbActiveModal: NgbActiveModal,
    private http: HttpClient,
    private toastr: ToastrService,
    private service: ServiceService,

  ) { }

  ngOnInit(): void {
    this.GetUOMDropdown();
    this.GetColorDropdown();
    this.GetLoomDropdown();
    this.GetFabricDropdown();

    if (this.statusCheck == 'EditEnquiryItem') {
      this.editEnquiry(this.EnquiryItemId);
    }
  }

  get activeModal() {
    return this._NgbActiveModal;
  }

  addMore() {
    this.data.push({
      id: this.data.length,
    });
    this.counter++;

  }
  remove() {
    this.data.splice(this.data.i, 1);
    this.counter--;

  }
  GetUOMDropdown() {
    this.service.getUOM().subscribe(res => {
      this.response = res;
      if (this.response.success == true) {
        this.uomList = this.response.data;
      }
      else {
        this.toastr.error(this.response.message, 'Message.');
      }
    })
  }


  GetColorDropdown() {
    this.service.getColor().subscribe(res => {
      this.response = res;
      if (this.response.success == true) {
        this.color = this.response.data;
      }
      else {
        this.toastr.error(this.response.message, 'Message.');
      }
    })
  }


  GetLoomDropdown() {
    this.service.getLoom().subscribe(res => {
      this.response = res;
      if (this.response.success == true) {
        this.loomType = this.response.data;
      }
      else {
        this.toastr.error(this.response.message, 'Message.');
      }
    })
  }

  GetFabricDropdown() {
    this.service.getFabricType().subscribe(res => {
      this.response = res;
      if (this.response.success == true) {
        this.fabricType = this.response.data;
      }
      else {
        this.toastr.error(this.response.message, 'Message.');
      }
    })
  }




  addEnquiryItem( form:NgForm) {
   
    
    for(let i=0; i<this.data.length;i++ )
    {
      this.data[i] = Object.assign(this.data[i], {
        enquiryId: this.EnquiryId,
       
      })
    }

    this.http.
      post(`${environment.apiUrl}/api/Enquiries/AddEnquiryItem`, this.data)
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
        
        },(err: HttpErrorResponse) => {
          const messages = this.service.extractErrorMessagesFromErrorResponse(err);
          this.toastr.error(messages.toString(), 'Message.');
          console.log(messages);
          // if (err.status == 400) {
          //   this.toastr.error(this.response.message, 'Message.');
          // }
        });
  }




  editEnquiry(id) {
    this.http.get(`${environment.apiUrl}/api/Enquiries/GetEnquiryItemById/` + id)
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



  updateEnquiry(form:NgForm) {

  
    this.http.
      put(`${environment.apiUrl}/api/Enquiries/UpdateEnquiryItem/` + this.EnquiryItemId, this.data)
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

        },(err: HttpErrorResponse) => {
          const messages = this.service.extractErrorMessagesFromErrorResponse(err);
          this.toastr.error(messages.toString(), 'Message.');
          console.log(messages);
        });
  }
}

