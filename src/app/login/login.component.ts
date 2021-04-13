import { Component, OnInit } from '@angular/core';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import { ServiceService } from '../shared/service.service';
import {Router} from '@angular/router'
import { HttpErrorResponse } from '@angular/common/http';
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
  constructor(
    private FormBuilder:FormBuilder,
    private router: Router,
    private Service: ServiceService
  ) { }

  ngOnInit() {
    // this.loginForm= this.FormBuilder.group({
    //   username:['', Validators.compose([Validators.required])],
    //   password:['',Validators.required]
    // });
  }

  OnSubmit(username,password){
    this.Service.userAuthentication(username,password).subscribe((data : any)=>{
     localStorage.setItem('userToken',data.access_token);
     this.router.navigate(['/home']);
   },
   (err : HttpErrorResponse)=>{
     this.isLoginError = true;
   });
 }
}
