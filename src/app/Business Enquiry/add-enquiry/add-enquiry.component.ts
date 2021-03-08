import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddmodalComponent } from '../addbuyermodal/addmodal.component';
import { ArtienquirymodalComponent } from '../artienquirymodal/artienquirymodal.component';

@Component({
  selector: 'app-add-enquiry',
  templateUrl: './add-enquiry.component.html',
  styleUrls: ['./add-enquiry.component.css']
})
export class AddEnquiryComponent implements OnInit {
  listCount:number;
    myDate=Date.now();
    response: any;
    data:any={};
    country:any=[];
    buyer:any[];
    rows:any=[];
    temp: any[];
    countryId:null;
    @ViewChild(NgForm) buyerForm;
    date: number;
    
    constructor(private http:HttpClient,
              private toastr: ToastrService,  
              private modalService: NgbModal,
  
                )
               { }

             
              
  ngOnInit(){
    this.fetch((data) => {
      this.temp = [...data];
      this.rows = data;
      this.listCount = this.rows.length;
  });

    this.getenquiryCountry();
    this.getenquiryBuyers();
  }
  fetch(arg0: (data: any) => void) {
    throw new Error('Method not implemented.');
  }


  




  getenquiryCountry()
  {
    this.http.get(`${environment.apiUrl}/api/Lookups/Countries`)
    .subscribe(
      res=> { 
        this.response = res;
        if (this.response.success == true){
          this.country =this.response.data;
        }
        else {
          this.toastr.error('Something went Worng', 'Message.');
            }

      }, err => {
        if (err.status == 400) {
          this.toastr.error('Something went Worng', 'Message.');
        }
      });
  }



  

 
    getenquiryBuyers()
    {
      this.http.get(`${environment.apiUrl}/api/Buyers/GetBuyers`)
      .subscribe(
        res=> { 
    
          this.response = res;
          if (this.response.success == true){
            this.buyer =this.response.data;
            this.listCount =this.buyer.length;
           
          }
          else {
            this.toastr.error('Something went Worng', 'Message.');
              }
  
        }, err => {
          if (err.status == 400) {
            this.toastr.error('Something went Worng', 'Message.');
          }
        });
    }

 

 addenquiryBuyerForm(){
  const modalRef = this.modalService.open(AddmodalComponent, { centered: true });
        modalRef.result.then((data) => {
       // on close
        if(data ==true){
         this.date = this.myDate;
         this.getenquiryBuyers();

       }
     }, (reason) => {
       // on dismiss
     });
} 
addenquiryArticleForm(){
  const modalRef = this.modalService.open(ArtienquirymodalComponent, { centered: true });
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


}
