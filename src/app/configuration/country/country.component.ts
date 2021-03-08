import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EditCountryComponent } from './edit-country/edit-country.component';
import { AddCountryComponent } from './add-country/add-country.component';

@Component({
  selector: 'app-country',
  templateUrl: './country.component.html',
  styleUrls: ['./country.component.css']
})
export class CountryComponent implements OnInit {
  listCount: number;
  response:any;
  rows:any=[];
  columns:any=[];
  data:any={};
  myDate=Date.now();



  constructor(private http:HttpClient,
    private toastr: ToastrService,
    private modalService: NgbModal,) { }

  ngOnInit(): void {
    this.fetch((data) => {
      this.rows = data;
      this.listCount= this.rows.length;
    });
  
  }


  
  fetch(cb) {
    let that = this;
    that.http
    .get(`${environment.apiUrl}/api/Configs/GetAllCountry`)
    .subscribe(res => {
      this.response = res;
      // this.listCount = this.fetch.length;
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


  deleteCountry(id)
  {
    this.http.delete(`${environment.apiUrl}/api/Configs/DeleteCountry/`+id.id )
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
  
  addCountryForm(){
    const modalRef = this.modalService.open(AddCountryComponent, { centered: true });
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
  

  editCountryForm(row){
    const modalRef = this.modalService.open(EditCountryComponent, { centered: true });
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
