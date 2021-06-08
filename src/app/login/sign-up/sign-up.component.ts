import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgForm } from '@angular/forms';
import { ServiceService } from 'src/app/shared/service.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {
  @Input() new;
  data:any={};
  response: any;
  departmentId:any=[];
  userTypeId:any=[];
  userType:any=[];
  active = true;
  @ViewChild(NgForm) signUpForm;


  constructor(private http:HttpClient,
    private service: ServiceService,
    private toastr: ToastrService,
    private _NgbActiveModal: NgbActiveModal) { }

  ngOnInit(): void {
  this.GetDeparmentDropdown();
  this.GetUserTypeDropdown()


  }

  GetDeparmentDropdown() {
    this.service.getDepartment().subscribe(res => {
      this.response = res;
      if (this.response.success == true) {
        this.departmentId = this.response.data;
      }
      else {
        this.toastr.error(this.response.message, 'Message.');
      }
    })
  }

  GetUserTypeDropdown() {
    this.service.getUserType().subscribe(res => {
      this.response = res;
      if (this.response.success == true) {
        this.userType = this.response.data;
      }
      else {
        this.toastr.error(this.response.message, 'Message.');
      }
    })
  }



  get activeModal() {
    return this._NgbActiveModal;
  }





  addUser()
  {


    this.http.
    post(`${environment.apiUrl}/api/Auth/Register`,this.data)
    .subscribe(
      res=> { 
  
        this.response = res;
        if (this.response.success == true){
          this.toastr.success(this.response.message, 'Message.');
          this.signUpForm.reset();
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
}


