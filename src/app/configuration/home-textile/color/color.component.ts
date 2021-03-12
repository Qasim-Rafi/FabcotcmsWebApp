import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import { AddColorComponent } from './add-color/add-color.component';
import { EditColorComponent } from './edit-color/edit-color.component';
import Swal from 'sweetalert2/dist/sweetalert2.js';

@Component({
  selector: 'app-color',
  templateUrl: './color.component.html',
  styleUrls: ['./color.component.css']
})
export class ColorComponent implements OnInit {
  response:any;
  rows:any=[];
  columns:any=[];
  data:any={};
  listCount: number;
  myDate=Date.now();

  constructor(private http:HttpClient,
              private toastr: ToastrService,
              private modalService: NgbModal) { }

  ngOnInit(): void {
    this.fetch((data) => {
      this.rows = data;
    });
  }

  

  fetch(cb) {
    let that = this;
    that.http
    .get(`${environment.apiUrl}/api/TextileGarments/GetAllColor`)
    .subscribe(res => {
      this.response = res;
      this.listCount = this.fetch.length;
    if(this.response.success==true)
    {
    that.data =this.response.data;
    cb(this.data);
    }
    else{
      this.toastr.error(this.response.message, 'Message.');
    }
      // this.spinner.hide();
    }, err => {
      if ( err.status == 400) {
 this.toastr.error(err.error.message, 'Message.');;
      }
    //  this.spinner.hide();
    });
  }






  deleteColor(id){
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
    
        this.http.delete(`${environment.apiUrl}/api/TextileGarments/DeleteColor/`+id.id )
        .subscribe(
          res=> { 
            this.response = res;
            if (this.response.success == true){
             this.toastr.error(this.response.message, 'Message.');
             this.fetch((data) => {
              this.rows = data;
            });
              
            }
            else {
              this.toastr.error('Something went Worng', 'Message.');
                }
     
          }, err => {
            if (err.status == 400) {
              this.toastr.error(this.response.message, 'Message.');
            }
          });
    
        // Swal.fire(
        //   'Record',
        //   'Deleted Successfully.',
        //   'success'
        // )
      }
    })
    
    }




















  addColorForm(){
    const modalRef = this.modalService.open(AddColorComponent, { centered: true });
          modalRef.result.then((data) => {
         // on close
          if(data ==true){
          //  this.date = this.myDate;
           this.fetch((data) => {
            this.rows = data;
          });
           
  
         }
       }, (reason) => {
         // on dismiss
       });
  } 
  

  editColorForm(row){
    const modalRef = this.modalService.open(EditColorComponent, { centered: true });
    modalRef.componentInstance.userId =row.id;
          modalRef.result.then((data) => {
         // on close
          if(data ==true){
          //  this.date = this.myDate;
           this.fetch((data) => {
            this.rows = data;
          });
           
         }
       }, (reason) => {
         // on dismiss
       });
  } 
  


}

