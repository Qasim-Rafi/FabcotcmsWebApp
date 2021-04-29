import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-template',
  templateUrl: './template.component.html',
  styleUrls: ['./template.component.css']
})
export class TemplateComponent implements OnInit {
  title = 'Project';
  
  constructor( private router: Router,) { }

  ngOnInit(): void {
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


}
