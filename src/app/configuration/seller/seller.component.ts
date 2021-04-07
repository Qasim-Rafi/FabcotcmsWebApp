import { Component, Input, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ToastrService } from 'ngx-toastr';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EditSellerFormComponent } from './edit-seller-form/edit-seller-form.component';
import { AddSellerFormComponent } from './add-seller-form/add-seller-form.component';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { GlobalConstants } from 'src/app/Common/global-constants';
import { SellerPocComponent } from './seller-poc/seller-poc.component';
import { EditCertificateComponent } from '../home-textile/certificate/edit-certificate/edit-certificate.component';
@Component({
  selector: 'app-seller',
  templateUrl: './seller.component.html',
  styleUrls: ['./seller.component.css']
})
export class SellerComponent implements OnInit {
  sellerCount: number;

  data: any = {};
  response: any;
  seller: any[];
  country: any = [];
  countryId: null;
  rows: any = [];
  sellerFilter: any[];
  active = true;
  @Input() Id;
  sellerCertificate: any = [];
  TotalPOC: number;




  constructor(private http: HttpClient,
    private toastr: ToastrService,
    private modalService: NgbModal,
  ) { }

  ngOnInit(): void {
    // this.getCountry();
    // this.statusCheck = this.statusCheck;
    // if(this.statusCheck == 'Add'){
    //   this.addCertificate();
    // }

    this.getSellers();
    this.getAllCertificates();
    this.getSellersCertificates();

  }


  //---------------------------- Search Function-----------------------//
  updateFilter(event) {
    const val = event.target.value.toLowerCase();

    const temp = this.sellerFilter.filter(function (d) {
      return (d.sellerCode.toLowerCase().indexOf(val) !== -1 ||

        d.sellerName.toLowerCase().indexOf(val) !== -1 || !val);
    });
    this.seller = temp;

  }



  // ---------------------------------------Get All Seller POC LENGHT----------------------------


  getTotalPOCs() {
    this.http.get(`${environment.apiUrl}/api/Sellers/GetAllPOC`)
      .subscribe(
        res => {

          this.response = res;
          if (this.response.success == true) {
            this.TotalPOC = this.response.data.length;




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








  // ---------------------------------------Get All Seller Certificates----------------------------


  getSellersCertificates() {
    this.http.get(`${environment.apiUrl}/api/Sellers/GetAllCertificate`)
      .subscribe(
        res => {

          this.response = res;
          if (this.response.success == true) {
            this.sellerCertificate = this.response.data;



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





  // ---------------------------------------Delete Seller Certificates----------------------------

  deleteSellerCertificate(obj) {
    Swal.fire({
      title: GlobalConstants.deleteTitle, //'Are you sure?',
      text: GlobalConstants.deleteMessage + ' ' + '"' + obj.sellerCertificateName + '"',
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

        this.http.delete(`${environment.apiUrl}/api/Sellers/DeleteCertificate/` + obj.sellerCertificateId)
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



  //--------------------------------Get Certificates by Seller Id---------------------//


  // getSellersCertificatesById() {
  //   this.http.get(`${environment.apiUrl}/api/Sellers/GetAllCertificateBySellerId/` + ???)
  //     .subscribe(
  //       res => {

  //         this.response = res;
  //         if (this.response.success == true) {
  //           this.data = this.response.data;

  //         }
  //         else {
  //           this.toastr.error('Something went Worng', 'Message.');
  //         }

  //       }, err => {
  //         if (err.status == 400) {
  //           this.toastr.error('Something went Worng', 'Message.');
  //         }
  //       });
  // }






  // addCertificate() {
  //   let varr = {
  //     "name": this.data.name,
  //     "description": this.data.description,
  //     "active": this.active,
  //   }

  //   this.http.
  //     post(`${environment.apiUrl}/api/TextileGarments/AddCertificate`, varr)
  //     .subscribe(
  //       res => {

  //         this.response = res;
  //         if (this.response.success == true) {
  //           this.toastr.success(this.response.message, 'Message.');

  //           // this.buyerForm.reset();
  //           // this.activeModal.close(true);
  //         }
  //         else {
  //           this.toastr.error(this.response.message, 'Message.');
  //         }

  //       }, err => {
  //         if (err.status == 400) {
  //           this.toastr.error(this.response.message, 'Message.');
  //         }
  //       });
  // }




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
            this.sellerFilter = [...this.seller];
            this.sellerCount = this.response.data.length;
            this.getTotalPOCs();


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







  deleteSeller(obj) {
    Swal.fire({
      title: GlobalConstants.deleteTitle, //'Are you sure?',
      text: GlobalConstants.deleteMessage + ' ' + '"' + obj.sellerName + '"',
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

        this.http.delete(`${environment.apiUrl}/api/Sellers/DeleteSeller/` + obj.id)
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



  addPocform(popup, check) {
    const modalRef = this.modalService.open(SellerPocComponent, { centered: true });
    modalRef.componentInstance.parentSellerId = popup.id;
    modalRef.componentInstance.statusCheck = check;
    modalRef.result.then((data) => {
      // on close
      if (data == true) {
        this.getSellers();
      }
    }, (reason) => {
      // on dismiss
    });
  }

  editPocform(popup, check, pocId) {
    const modalRef = this.modalService.open(SellerPocComponent, { centered: true });
    modalRef.componentInstance.parentSellerId = popup.id;
    modalRef.componentInstance.statusCheck = check;
    modalRef.componentInstance.sellerPOCid = pocId.selllerPOCId;
    modalRef.result.then((data) => {
      // on close
      if (data == true) {
        this.getSellers();

      }
    }, (reason) => {
      // on dismiss
    });
  }




  // -----------------------delete Seller POC------------------------//
  deleteSellerPOC(id) {
    Swal.fire({
      title: GlobalConstants.deleteTitle, //'Are you sure?',
      text: GlobalConstants.deleteMessage + ' ' + '"' + id.name + '"',
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

        this.http.delete(`${environment.apiUrl}/api/Sellers/DeletePOC/` + id.selllerPOCId)
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



  editSellerform(obj) {
    const modalRef = this.modalService.open(EditSellerFormComponent, { centered: true });
    modalRef.componentInstance.Id = obj.id;
    modalRef.result.then((data) => {
      // on close
      if (data == true) {
        this.getSellers();
      }
    }, (reason) => {
      // on dismiss
    });
  }


  // Certificate for DropDown
  getAllCertificates() {

    this.http.get(`${environment.apiUrl}/api/TextileGarments/GetAllCertificate`)
      .subscribe(
        res => {
          this.response = res;
          if (this.response.success == true) {
            this.data = this.response.data;

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


  // add certificate form
  addCertificateForm(check, seller) {
    const modalRef = this.modalService.open(EditCertificateComponent, { centered: true });
    modalRef.componentInstance.statusCheck = check;
    modalRef.componentInstance.parentSellerId = seller.id;
    modalRef.result.then((data) => {
      // on close
      if (data == true) {
        this.getSellers();
        this.getAllCertificates();
      }
    }, (reason) => {
      // on dismiss
    });
  }


  editCertificateForm(check, seller, certificateId) {
    const modalRef = this.modalService.open(EditCertificateComponent, { centered: true });
    modalRef.componentInstance.statusCheck = check;
    modalRef.componentInstance.certificateID = certificateId.sellerCertificateId;
    modalRef.componentInstance.parentSellerId = seller.id;


    modalRef.result.then((data) => {
      // on close
      if (data == true) {
        this.getSellers();

        this.getAllCertificates();
      }
    }, (reason) => {
      // on dismiss
    });
  }




}
