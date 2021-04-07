import { Component } from '@angular/core';
import Swal from 'sweetalert2/dist/sweetalert2.js';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Project';
alert(){
  Swal.fire({
    title: '<strong>Sign-Out Confirmation</strong>',
    html:
      '<br>Hi,<b>Ali</b>!'+ '<br>'+
    '<p style="float: left;">Do you want to logout your session?Kindly confirm</p>',
    showCancelButton: true,
    confirmButtonColor: "grey",
    cancelButtonColor:"#1ab394",
    focusConfirm: false,
    // TextColor:,
    cancelButtonText:
    '<a href="login" style="color:white">Yes Log me out</a>' ,
    confirmButtonText:
    ' <a href="home" style="color:white">I am not sure</a>',
  })
}

// <a routerLink="home" class="nav-link">
//                 <p>I am not sure</p>
//               </a>

}
