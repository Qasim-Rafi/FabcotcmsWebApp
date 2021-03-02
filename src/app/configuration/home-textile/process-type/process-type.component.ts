import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import { AddProcessTypeComponent } from './add-process-type/add-process-type.component';
import { EditProcessTypeComponent } from './edit-process-type/edit-process-type.component';

@Component({
  selector: 'app-process-type',
  templateUrl: './process-type.component.html',
  styleUrls: ['./process-type.component.css']
})
export class ProcessTypeComponent implements OnInit {

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
                .get(`${environment.apiUrl}/api/TextileGarments/GetAllProcessType`)
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
            
            
            
              deleteProcess(id)
              {
                this.http.delete(`${environment.apiUrl}/api/TextileGarments/DeleteProcessType/`+id.id )
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
              }
            
            
            
              addProcessTypeForm(){
                const modalRef = this.modalService.open(AddProcessTypeComponent, { centered: true });
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
              
            
              editProcessTypeForm(row){
                const modalRef = this.modalService.open(EditProcessTypeComponent, { centered: true });
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
            
                     