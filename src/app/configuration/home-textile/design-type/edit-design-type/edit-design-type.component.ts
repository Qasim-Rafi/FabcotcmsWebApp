import { Component, Input, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-edit-design-type',
  templateUrl: './edit-design-type.component.html',
  styleUrls: ['./edit-design-type.component.css']
})
export class EditDesignTypeComponent implements OnInit {

  data: any = {};
  response: any;
  @Input() userId;

  constructor(private http: HttpClient,
    private toastr: ToastrService,
    private _NgbActiveModal: NgbActiveModal) { }

  ngOnInit(): void {
    this.editDesign();
  }

  get activeModal() {
    return this._NgbActiveModal;
  }



  editDesign() {
    // this.
    // http.
    // get(`${environment.apiUrl}​/api​/TextileGarments​/GetDesignTypeById​/`+this.userId )
    // .subscribe(
    //   res=> { 
    //     this.response = res;
    //     if (this.response.success == true){
    //       this.data =this.response.data; 
    //     }
    //     else {
    //       this.toastr.error('Something went Worng', 'Message.');
    //         }

    //   }, err => {
    //     if (err.status == 400) {
    //       this.toastr.error('Something went Worng', 'Message.');
    //     }
    //   });
    this.http.get(`${environment.apiUrl}/api/TextileGarments/GetDesignTypeById/` + this.userId)
      .subscribe(
        res => {
          this.response = res;
          if (this.response.success == true) {
            this.data = this.response.data;
          }
          else {
            this.toastr.error('Something went Worng', 'Message.');
          }

        }, err => {
          if (err.status == 400) {
            this.toastr.error('Something went Worng', 'Message.');
          }
        });
  }



  UpdateDesign() {
    let varr = {
      "type": this.data.type,
      "description": this.data.description
    }

    this.http.
      put(`${environment.apiUrl}/api/TextileGarments/UpdateDesignType/` + this.userId, varr)
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