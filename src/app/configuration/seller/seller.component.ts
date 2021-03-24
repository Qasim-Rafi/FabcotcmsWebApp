import { Component, Input, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ToastrService } from 'ngx-toastr';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EditSellerFormComponent } from './edit-seller-form/edit-seller-form.component';
import { AddSellerFormComponent } from './add-seller-form/add-seller-form.component';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { AddCertificateComponent } from '../home-textile/certificate/add-certificate/add-certificate.component';
import { GlobalConstants } from 'src/app/Common/global-constants';
import { SellerPocComponent } from './seller-poc/seller-poc.component';
import { EditCertificateComponent } from '../home-textile/certificate/edit-certificate/edit-certificate.component';
@Component({
  selector: 'app-seller',
  templateUrl: './seller.component.html',
  styleUrls: ['./seller.component.css']
})
export class SellerComponent implements OnInit {
  listCount: number;
  data: any = {};
  response: any;
  seller: any[];
  country: any = [];
  countryId: null;
  rows: any = [];
  temp: any[];
  active = true;
  isCollapse: boolean = false;
  @Input() userId;
  @Input() statusCheck;
  constructor(private http: HttpClient,
    private toastr: ToastrService,
    private modalService: NgbModal,
   ) { }

  ngOnInit(): void {
    // this.getCountry();
    this.statusCheck=this.statusCheck;
    if(this.statusCheck == 'Add'){
      this.addCertificate();
    }
    this.getSellers();
    this.fetch((data) => {
      this.temp = [...data];
      this.rows = data;

    });
  }

 
collapse()
{
  this.isCollapse = !this.isCollapse;
}






addCertificate()
{
  let varr=  {
    "name": this.data.name,
    "description": this.data.description,
    "active": this.active,
  }

  this.http.
  post(`${environment.apiUrl}/api/TextileGarments/AddCertificate`,varr)
  .subscribe(
    res=> { 

      this.response = res;
      if (this.response.success == true){
        this.toastr.success(this.response.message, 'Message.');
    
        // this.buyerForm.reset();
        // this.activeModal.close(true);
      }
      else {
        this.toastr.error(this.response.message, 'Message.');
          }

    }, err => {
      if (err.status == 400) {
        this.toastr.error(this.response.message, 'Message.');
      }
    });
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








  getSellers() {
    this.http.get(`${environment.apiUrl}/api/Sellers/GetSellers`)
      .subscribe(
        res => {

          this.response = res;
          if (this.response.success == true) {
            this.seller = this.response.data;
            this.temp = [...this.seller];
            this.listCount = this.response.data.length;
           
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



  updateFilter(event) {
    const val = event.target.value.toLowerCase();

    const temp = this.temp.filter(function (d) {
      return (d.sellerCode.toLowerCase().indexOf(val) !== -1 ||
      
        d.sellerName.toLowerCase().indexOf(val) !== -1 || !val);
    });
    this.seller = temp;
    
  }







  deleteSeller(id) {
    Swal.fire({
      title: GlobalConstants.deleteTitle, //'Are you sure?',
      text: GlobalConstants.deleteMessage+' '+'"'+ id.sellerName +'"',
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

        this.http.delete(`${environment.apiUrl}/api/Sellers/DeleteSeller/` + id.id)
          .subscribe(
            res => {
              this.response = res;
              if (this.response.success == true) {
                this.toastr.error(this.response.message, 'Message.');
                this.getSellers();
              }
              else {
                this.toastr.error(this.response.message, 'Message.');
              }

            }, err => {
              if (err.status == 400) {
                this.toastr.error('Something went Worng', 'Message.');
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


  
  addPocform(popup) {
    const modalRef = this.modalService.open(SellerPocComponent, { centered: true });
    modalRef.componentInstance.userId = popup.id;
    modalRef.result.then((data) => {
      // on close
      if (data == true) {
        this.getSellers();
      }
    }, (reason) => {
      // on dismiss
    });
  }





  editSellerform(popup) {
    const modalRef = this.modalService.open(EditSellerFormComponent, { centered: true });
    modalRef.componentInstance.userId = popup.id;
    modalRef.result.then((data) => {
      // on close
      if (data == true) {
        this.getSellers();
      }
    }, (reason) => {
      // on dismiss
    });
  }


  addSellerform() {
    const modalRef = this.modalService.open(AddSellerFormComponent, { centered: true });

    modalRef.result.then((data) => {
      // on close
      if (data == true) {
        this.getSellers();
      }
    }, (reason) => {
      // on dismiss
    });
  }




  // add certificate
  fetch(cb) {
    let that = this;
    that.http
      .get(`${environment.apiUrl}/api/TextileGarments/GetAllCertificate`)
      .subscribe(res => {
        this.response = res;
        this.listCount = this.fetch.length;
        if (this.response.success == true) {
          that.data = this.response.data;
          cb(this.data);
        }
        else {
          this.toastr.error(this.response.message, 'Message.');
        }
        // this.spinner.hide();
      }, err => {
        if (err.status == 400) {
          this.toastr.error(err.error.message, 'Message.');;
        }
        //  this.spinner.hide();
      });
  }


  // add certificate form
  addCertificateForm(check){
    const modalRef = this.modalService.open(EditCertificateComponent, { centered: true });
    modalRef.componentInstance.statusCheck = check;

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
  

  editCertificateForm(check,data){
    const modalRef = this.modalService.open(EditCertificateComponent, { centered: true });
    modalRef.componentInstance.statusCheck = check;
    modalRef.componentInstance.formdataSellerEdit = data;


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
