import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EditBuyerComponent } from './edit-buyer/edit-buyer.component';
import { AddBuyerComponent } from './add-buyer/add-buyer.component';
import { ServiceService } from 'src/app/shared/service.service';
import Swal from 'sweetalert2/dist/sweetalert2.js'; 
@Component({
  selector: 'app-buyer',
  templateUrl: './buyer.component.html',
  styleUrls: ['./buyer.component.css']
})
export class BuyerComponent implements OnInit {
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
              private service: ServiceService
                )
               { }

             
              
  ngOnInit(){
    this.getBuyers();
    return this.service.getCountry();
   
  } 

 
    getBuyers()
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



 editBuyer(popup){
   const modalRef = this.modalService.open(EditBuyerComponent, { centered: true });
         modalRef.componentInstance.userId = popup.id;
         modalRef.result.then((data) => {
        // on close
        if(data ==true){
          this.date = this.myDate;
          this.getBuyers();

        }
      }, (reason) => {
        // on dismiss
      });
 } 
 

 addBuyerForm(){
  const modalRef = this.modalService.open(AddBuyerComponent, { centered: true });
        modalRef.result.then((data) => {
       // on close
        if(data ==true){
         this.date = this.myDate;
         this.getBuyers();

       }
     }, (reason) => {
       // on dismiss
     });
} 




deleteBuyer(id){
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

    this.http.delete(`${environment.apiUrl}/api/Buyers/DeleteBuyer/`+id.id )
    .subscribe(
      res=> { 
        this.response = res;
        if (this.response.success == true){
         this.toastr.error(this.response.message, 'Message.');
         this.getBuyers();
        }
        else {
          this.toastr.error('Something went Worng', 'Message.');
            }
 
      }, err => {
        if (err.status == 400) {
          this.toastr.error('Something went Worng', 'Message.');
        }
      });


    // Swal.fire(
    //   'Record',
    //   'Deleted Successfully.',
    //   'failed',
    // )
  }
})

}
}
