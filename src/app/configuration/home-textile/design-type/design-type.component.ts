import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddDesignTypeComponent } from './add-design-type/add-design-type.component';
import { EditDesignTypeComponent } from './edit-design-type/edit-design-type.component';
import Swal from 'sweetalert2/dist/sweetalert2.js';


@Component({
  selector: 'app-design-type',
  templateUrl: './design-type.component.html',
  styleUrls: ['./design-type.component.css']
})
export class DesignTypeComponent implements OnInit {
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
    .get(`${environment.apiUrl}/api/TextileGarments/GetAllDesignType`)
    .subscribe(res => {
      this.response = res;
      this.listCount = this.rows.length;
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





  deleteDesignType(id){
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
    
        this.http.delete(`${environment.apiUrl}/api/TextileGarments/DeleteDesignType/`+id.id )
        .subscribe(
          res=> { 
            this.response = res;
            if (this.response.success == true){
             this.toastr.error(this.response.message, 'Message.');
             this.fetch((data) => {
              this.rows = data;
              this.listCount = this.rows.length;
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















  addDesignTypeForm(){
    const modalRef = this.modalService.open(AddDesignTypeComponent, { centered: true });
          modalRef.result.then((data) => {
         // on close
          if(data ==true){
          //  this.date = this.myDate;
           this.fetch((data) => {
            this.rows = data;
            this.listCount = this.rows.length;
          });
           
  
         }
       }, (reason) => {
         // on dismiss
       });
  } 
  

  editDesignTypeForm(row){
    const modalRef = this.modalService.open(EditDesignTypeComponent, { centered: true });
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

