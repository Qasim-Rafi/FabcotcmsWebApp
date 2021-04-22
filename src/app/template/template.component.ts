import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-template',
  templateUrl: './template.component.html',
  styleUrls: ['./template.component.css']
})
export class TemplateComponent implements OnInit {
  title = 'Project';
  
  constructor() { }

  ngOnInit(): void {
  }
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
}
