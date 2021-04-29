import { Component, OnInit } from '@angular/core';
import {FormGroup, FormBuilder, Validators, NgForm} from '@angular/forms';
import { ServiceService } from '../shared/service.service';
import {Router} from '@angular/router'
import { HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
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
  response:any;
  constructor(
    private FormBuilder:FormBuilder,
    private router: Router,
    private toastr: ToastrService,
    private Service: ServiceService
  ) { }

  ngOnInit() {
    
    // this.loginForm= this.FormBuilder.group({
    //   username:['', Validators.compose([Validators.required])],
    //   password:['',Validators.required]
    // });
  }
  login(){
    this.router.navigate(['/home']);
  }

  OnSubmit(form: NgForm){
    this.Service.userAuthentication(this.data).subscribe((data : any)=>{
      this.response= data;
      if (this.response.success == true) {
        this.router.navigate(['/home']);
        this.reload();
    
      }
      else {
        this.toastr.error(this.response.message, 'Message.');
      }
   },
   (err : HttpErrorResponse)=>{
     this.isLoginError = true;
   });
 }

 reload(){
  // this.router.navigate(['home']);
 this.router.routeReuseStrategy.shouldReuseRoute = () => false;
 this.router.onSameUrlNavigation = 'reload';
 this.router.navigate(['home']);

}
}
