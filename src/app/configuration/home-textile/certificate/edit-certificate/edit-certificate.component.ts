import { Component, Input, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-edit-certificate',
  templateUrl: './edit-certificate.component.html',
  styleUrls: ['./edit-certificate.component.css']
})
export class EditCertificateComponent implements OnInit {
  data:any={};
  response: any;
  @Input() userId;

  constructor(private http:HttpClient,
    private toastr: ToastrService,
    private _NgbActiveModal: NgbActiveModal) { }

  ngOnInit(): void {
    this.editCertificate();
  }

  get activeModal() {
    return this._NgbActiveModal;
  }


 
  editCertificate()
  {
    this.http.get(`${environment.apiUrl}/api/TextileGarments/GetCertificateById/`+this.userId )
    .subscribe(
      res=> { 
        this.response = res;
        if (this.response.success == true){
          this.data =this.response.data; 
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


  UpdateCertificate()
  {
    let varr = {
      "name": this.data.name,
      "description": this.data.description,
      "active": this.data.active,
    }

    this.http.
    put(`${environment.apiUrl}/api/TextileGarments/UpdateCertificate/`+this.userId,varr)
    .subscribe(
      res=> { 
  
        this.response = res;
        if (this.response.success == true){
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
