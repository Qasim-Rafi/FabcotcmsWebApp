import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddArticleComponent } from './add-article/add-article.component';
import { EditArticleComponent } from './edit-article/edit-article.component';
import { GlobalConstants } from '../../Common/global-constants';
import Swal from 'sweetalert2/dist/sweetalert2.js'; 

@Component({
  selector: 'app-articles',
  templateUrl: './articles.component.html',
  styleUrls: ['./articles.component.css']
})
export class ArticlesComponent implements OnInit {
  response:any;
  rows:any=[];
  columns:any=[];
  data:any={};
  listCount: number;
  myDate=Date.now();
  temp: any=[];

  constructor(private http:HttpClient,
    private toastr: ToastrService,
    private modalService: NgbModal,) { }

  ngOnInit(): void {
    this.fetch((data) => {
      this.temp = [...data];
      this.rows = data;
  });

  }

  updateFilter(event) {
    const val = event.target.value.toLowerCase();

    // filter our data
    const temp = this.temp.filter(function (d) {
      return d.code.toLowerCase().indexOf(val) !== -1  || !val;
    });
 
    // update the rows
    this.rows = temp;
    // Whenever the filter changes, always go back to the first page
    // this.table.offset = 0;
  }


  fetch(cb) {
    let that = this;
    that.http
    .get(`${environment.apiUrl}/api/Configs/GetAllArticle`)
    .subscribe(res => {
      this.response = res;
      this.listCount = this.response.data.length;
      
     
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



  deleteArticle(id){

    Swal.fire({
      title: GlobalConstants.deleteTitle, //'Are you sure?',
      text: GlobalConstants.deleteMessage+' '+'"'+ id.name +'"',
      icon: 'error',
      showCancelButton: true,
      confirmButtonColor: '#ed5565',
      cancelButtonColor: '#dae0e5',
      cancelButtonText: 'No',
      confirmButtonText: 'Yes',
      reverseButtons: true,
      position: 'top',
    }).then((result) => {
      if (result.isConfirmed) {
    
        this.http.delete(`${environment.apiUrl}/api/Configs/DeleteArticle/`+id.id )
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























  addArticleForm(){
    const modalRef = this.modalService.open(AddArticleComponent, { centered: true });
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
  

  editArticleForm(row){
    const modalRef = this.modalService.open(EditArticleComponent, { centered: true });
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
