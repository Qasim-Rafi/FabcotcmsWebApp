import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import { AddTimeActionComponent } from './add-time-action/add-time-action.component';
import { EditTimeActionComponent } from './edit-time-action/edit-time-action.component';
import Swal from 'sweetalert2/dist/sweetalert2.js';

@Component({
  selector: 'app-time-action-items',
  templateUrl: './time-action-items.component.html',
  styleUrls: ['./time-action-items.component.css']
})
export class TimeActionItemsComponent implements OnInit {

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
                .get(`${environment.apiUrl}/api/TextileGarments/GetAllTnaAction`)
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
            
            
           
            


              deleteAction(id){
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
                
                    this.http.delete(`${environment.apiUrl}/api/TextileGarments/DeleteTnaAction/`+id.id )
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
            
            














            
              addActionForm(){
                const modalRef = this.modalService.open(AddTimeActionComponent, { centered: true });
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
              
            
              editActionForm(row){
                const modalRef = this.modalService.open(EditTimeActionComponent, { centered: true });
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
            
            