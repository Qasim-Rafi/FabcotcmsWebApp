import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import * as $ from 'jquery';
import * as AdminLte from 'admin-lte';
@Component({
  selector: 'app-template',
  templateUrl: './template.component.html',
  styleUrls: ['./template.component.css']
})
export class TemplateComponent implements OnInit {
  title = 'Project';
  userName:string;
  loggedInDepartmentId: string;
  loggedInDepartmentName: string;
  isYarnLocal:boolean;
  isHomeTextileandGarments:boolean;
  isFabricLocal:boolean;
  userrole:string;
  constructor( private router: Router,) { }

  ngOnInit(): void {
    this.userrole=localStorage.getItem('role');
    this.loggedInDepartmentId=localStorage.getItem('loggedInDepartmentId');
    this.userName=localStorage.getItem('loggedInUserName');
    this.loggedInDepartmentName=localStorage.getItem('loggedInDepartmentName');
    
    if(this.loggedInDepartmentId == '1'){
      this.isYarnLocal = true;
      this.isHomeTextileandGarments= false;
 this.isFabricLocal=false;
    } 
    else if(this.loggedInDepartmentId == '2'){
      this.isYarnLocal = true;
      this.isHomeTextileandGarments= false;
 this.isFabricLocal=false;
    } 
    else if(this.loggedInDepartmentId == '3'){
      this.isYarnLocal = true;
      this.isHomeTextileandGarments= false;
     this.isFabricLocal=false;
  }
  else if(this.loggedInDepartmentId == '4'){
    this.isYarnLocal = true;
    this.isHomeTextileandGarments= false;
this.isFabricLocal=false;
  }   else if(this.loggedInDepartmentId == '5'){
    this.isYarnLocal = false;
    this.isHomeTextileandGarments= false;
this.isFabricLocal=true;
  }
  else if(this.loggedInDepartmentId == '6'){
    this.isYarnLocal = false;
    this.isHomeTextileandGarments= true;
this.isFabricLocal=false;
  } 
    else if(this.loggedInDepartmentId == '7'){
      this.isYarnLocal = true;
      this.isHomeTextileandGarments= false;
 this.isFabricLocal=false;
    } 
    else if(this.loggedInDepartmentId == '8'){
      this.isYarnLocal = true;
      this.isHomeTextileandGarments= false;
 this.isFabricLocal=false;
    } 
   
  //   $('li.dropdown.mega-dropdown a').on('click', function (event) {
  //     $(this).parent().toggleClass("sidebar-collapse");
  // });
  
  // $('body').on('click', function (e) {
  //     if (!$('li.dropdown.mega-dropdown').is(e.target) && $('li.dropdown.mega-dropdown').has(e.target).length === 0 && $('.open').has(e.target).length === 0) {
  //         $('li.dropdown.mega-dropdown').removeClass('open');
  //     }
  // });
  }
  alert(){
    // Swal.fire({
    //   title: '<strong>Sign-Out Confirmation</strong>',
    //   html:
    //     '<br>Hi,<b>Ali</b>!'+ '<br>'+
    //   '<p style="float: left;">Do you want to logout your session?Kindly confirm</p>',
    //   showCancelButton: true,
    //   confirmButtonColor: "grey",
    //   cancelButtonColor:"#1ab394",
    //   focusConfirm: false,
    //   // TextColor:,
    //   cancelButtonText:
    //   '<a href="login" (click)="logout()" style="color:white">Yes Log me out</a>' ,
    //   confirmButtonText:
    //   ' <a href="home" style="color:white">I am not sure</a>',
    // })
// this.name =localStorage.getItem()

     
Swal.fire({
  title: 'Do you want to logout your session?Kindly confirm',

  showCancelButton: true,
  confirmButtonText: `Yes Log me out`,
 
}).then((result) => {
  /* Read more about isConfirmed, isDenied below */
  if (result.isConfirmed) {
 localStorage.clear();
 localStorage.removeItem('token');
 this.router.navigate(['']);
//  location.reload();
  } else if (result.isDenied) {
    
  }
})
  }
  ngAfterViewInit() {
    $('[data-widget="treeview"]').each(function() {
        AdminLte.Treeview._jQueryInterface.call($(this), 'init');
    });
  }

}
