import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ToastrService } from 'ngx-toastr';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EditSellerFormComponent } from './edit-seller-form/edit-seller-form.component';
import { AddSellerFormComponent } from './add-seller-form/add-seller-form.component';
@Component({
  selector: 'app-seller',
  templateUrl: './seller.component.html',
  styleUrls: ['./seller.component.css']
})
export class SellerComponent implements OnInit {
  listCount:number;
  data:any={};
  response: any;
  seller:any[];
  country:any=[];
  countryId:null;
  constructor(private http:HttpClient,
              private toastr: ToastrService,
              private modalService: NgbModal,) { }

  ngOnInit(): void {
    // this.getCountry();
    this.getSellers();
  }

  // getCountry()
  // {
  //   this.http.get(`${environment.apiUrl}/api/Lookups/Countries`)
  //   .subscribe(
  //     res=> { 
  //       this.response = res;
  //       if (this.response.success == true){
  //         this.country =this.response.data;
  //       }
  //       else {
  //         this.toastr.error('Something went Worng', 'Message.');
  //           }

  //     }, err => { 
  //       if (err.status == 400) {
  //         this.toastr.error('Something went Worng', 'Message.');
  //       }
  //     });
  // }

  getSellers()
  {
    this.http.get(`${environment.apiUrl}/api/Sellers/GetSellers`)
    .subscribe(
      res=> { 
  
        this.response = res;
        if (this.response.success == true){
          this.seller =this.response.data;
          this.listCount =this.seller.length;
         
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


 

  deleteSeller(id)
  {
    this.http.delete(`${environment.apiUrl}/api/Sellers/DeleteSeller/`+id.id )
    .subscribe(
      res=> { 
        this.response = res;
        if (this.response.success == true){
         this.toastr.error(this.response.message, 'Message.');
         this.getSellers();
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


  editSellerform(popup){
    const modalRef = this.modalService.open(EditSellerFormComponent, { centered: true });
          modalRef.componentInstance.userId = popup.id;
          modalRef.result.then((data) => {
         // on close
         if(data ==true){
           this.getSellers();
         }
       }, (reason) => {
         // on dismiss
       });
  } 
  

  addSellerform(){
    const modalRef = this.modalService.open(AddSellerFormComponent, { centered: true });
        
          modalRef.result.then((data) => {
         // on close
         if(data ==true){
           this.getSellers();
         }
       }, (reason) => {
         // on dismiss
       });
  } 
  

}
