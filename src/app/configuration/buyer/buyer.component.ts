import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EditBuyerComponent } from './edit-buyer/edit-buyer.component';
import { AddBuyerComponent } from './add-buyer/add-buyer.component';
import { ServiceService } from 'src/app/shared/service.service';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { GlobalConstants } from 'src/app/Common/global-constants';
import { SellerPocComponent } from '../seller/seller-poc/seller-poc.component';




@Component({
  selector: 'app-buyer',
  templateUrl: './buyer.component.html',
  styleUrls: ['./buyer.component.css']
})
export class BuyerComponent implements OnInit {
  listCount: number;
  TotalPOC: number;
  myDate = Date.now();
  response: any;
  data: any = {};
  country: any = [];
  buyer: any[];
  rows: any = [];
  temp: any[];
  countryId: null;
  // @ViewChild(NgForm) buyerForm;
  date: number;


  constructor(private http: HttpClient,
    private toastr: ToastrService,
    private modalService: NgbModal,
    private service: ServiceService
  ) { }



  ngOnInit() {
    // this.getBuyerById();
    this.getBuyers();
    return this.service.getCountry();


  }


  //---------------------------- Search Function-----------------------//
  updateFilter(event) {
    const val = event.target.value.toLowerCase();

    const temp = this.temp.filter(function (d) {
      return (
        d.buyerCode.toLowerCase().indexOf(val) !== -1 ||
        d.buyerName.toLowerCase().indexOf(val) !== -1 || !val);
    });
    this.buyer = temp;

  }


  // ---------------------------------------Get All Seller POC LENGHT----------------------------


  getTotalPOCs() {
    this.http.get(`${environment.apiUrl}/api/Buyers/GetAllPOC`)
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



  // --------------------------------Get Buyer-------------------//

  getBuyers() {
    this.http.get(`${environment.apiUrl}/api/Buyers/GetBuyers`)
      .subscribe(
        res => {

          this.response = res;
          if (this.response.success == true) {
            this.buyer = this.response.data;
            console.log(this.buyer)
            this.temp = [...this.buyer];
            this.listCount = this.response.data.length;
            this.getTotalPOCs();
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


  // --------------------------------Add Buyer Form-------------------//


  addBuyerForm() {
    const modalRef = this.modalService.open(AddBuyerComponent, { centered: true });
    modalRef.result.then((data) => {
      // on close
      if (data == true) {
        this.date = this.myDate;
        this.getBuyers();

      }
    }, (reason) => {
      // on dismiss
    });
  }

  // --------------------------------Edit Buyer Form-------------------//

  editBuyer(popup) {
    const modalRef = this.modalService.open(EditBuyerComponent, { centered: true });
    modalRef.componentInstance.buyerId = popup.id;
    modalRef.result.then((data) => {
      // on close
      if (data == true) {
        this.date = this.myDate;
        this.getBuyers();

      }
    }, (reason) => {
      // on dismiss
    });
  }



  // --------------------------------Delete Buyer-------------------//

  deleteBuyer(id) {
    Swal.fire({
      title: GlobalConstants.deleteTitle, //'Are you sure?',
      text: GlobalConstants.deleteMessage + ' ' + '"' + id.buyerName + '"',
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

        this.http.delete(`${environment.apiUrl}/api/Buyers/DeleteBuyer/` + id.id)
          .subscribe(
            res => {
              this.response = res;
              if (this.response.success == true) {
                this.toastr.error(this.response.message, 'Message.');
                this.getBuyers();
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
    })

  }



  // --------------------------------Add Buyer POC Form-------------------//

  addPocform(popup, check) {
    const modalRef = this.modalService.open(SellerPocComponent, { centered: true });
    modalRef.componentInstance.parentBuyerId = popup.id;
    modalRef.componentInstance.statusCheck = check;
    modalRef.result.then((data) => {
      // on close
      if (data == true) {
        this.getBuyers();
      }
    }, (reason) => {
      // on dismiss
    });
  }


  // --------------------------------Edit Buyer POC Form-------------------//

  editPocform(popup, check, pocId) {
    const modalRef = this.modalService.open(SellerPocComponent, { centered: true });
    modalRef.componentInstance.parentBuyerId = popup.id;
    modalRef.componentInstance.statusCheck = check;
    modalRef.componentInstance.buyerPOCid = pocId.buyerPOCId;
    modalRef.result.then((data) => {
      // on close
      if (data == true) {
        this.getBuyers();

      }
    }, (reason) => {
      // on dismiss
    });
  }




  // --------------------------------Delete Buyer POC Form-------------------//


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

        this.http.delete(`${environment.apiUrl}/api/Buyers/DeletePOC/` + id.buyerPOCId)
          .subscribe(
            res => {
              this.response = res;
              if (this.response.success == true) {
                this.toastr.error(this.response.message, 'Message.');
                this.getBuyers();
              }
              else {
                this.toastr.error(this.response.message, 'Message.');
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


  // --------------------------Buyer POC Count-------------------------------//


  // getBuyerById() {
  //   this.http.get(`${environment.apiUrl}/api/Buyers/GetBuyer/` +)
  //     .subscribe(
  //       res => {
  //         this.response = res;
  //         if (this.response.success == true) {
  //           this.CountPOC = this.response.data.buyerPOCList.lenght;


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






}
