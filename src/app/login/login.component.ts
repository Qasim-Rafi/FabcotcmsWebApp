import { Component, OnInit } from '@angular/core';
import {FormGroup, FormBuilder, Validators, NgForm} from '@angular/forms';
import { ServiceService } from '../shared/service.service';
import {Router} from '@angular/router'
import { HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SignUpComponent } from './sign-up/sign-up.component';

import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
loginForm: FormGroup;
invalidLogin: boolean=false;
  message: any;
  isLoginError: boolean=false;
  data:any={};
  departmentId:any=[];
  response:any;
 
  constructor(
    private FormBuilder:FormBuilder,
    private router: Router,
    private toastr: ToastrService,
    private Service: ServiceService,
    private modalService: NgbModal,

    private spinner: NgxSpinnerService,



  ) { }

  ngOnInit() {
    
  this.GetDeparmentDropdown()
  }
  login(){
    this.router.navigate(['/home']);
  }
  signUpForm() {
    this.toastr.error("Please Contact Admin To create the Login !", 'Message.');
    const modalRef = this.modalService.open(SignUpComponent, { centered: true });
    modalRef.result.then((data) => {
      // on close
      if (data == true) {

  

      }
    }, (reason) => {
      // on dismiss
    });
  } 
  GetDeparmentDropdown() {
    this.Service.getDepartment().subscribe(res => {
      this.response = res;
      if (this.response.success == true) {
        this.departmentId = this.response.data;
      }
      else {
        this.toastr.error(this.response.message, 'Message.');
      }
    })
  }

  OnSubmit(form: NgForm){
    this.spinner.show();
    this.Service.userAuthentication(this.data).subscribe((data : any)=>{
      this.response= data;
      if (this.response.success == true) {
        this.router.navigate(['/home']);
        this.router.navigate(['/enquiry']);
        this.reload();
        this.spinner.hide();
    
      }
      else {
        this.toastr.error(this.response.message, 'Message.');
        this.spinner.hide();
      }
   },
   (err : HttpErrorResponse)=>{
     this.isLoginError = true;
     this.spinner.hide();

   });
 }

 reload(){

   this.router.navigate(['home']);
//    this.router.navigate('/', {skipLocationChange: true}).then(()=>
//  this.router.navigate(['home']));

}
openNav1() {
  var element = document.getElementById("mySidenav");
  element.classList.add("sidemessagenavW");
  
  // document.getElementById("mySidenav").style.width = "40%";
}
closeNav() {
var element = document.getElementById("mySidenav");
element.classList.remove("sidemessagenavW");

  // document.getElementById("mySidenav").style.width = "0";
}
}
