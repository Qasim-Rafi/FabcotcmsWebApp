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
import { GlobalConstants } from 'src/app/Common/global-constants';
import { Select2OptionData } from 'ng2-select2';
@Component({
  selector: 'app-buyer',
  templateUrl: './buyer.component.html',
  styleUrls: ['./buyer.component.css']
})
export class BuyerComponent implements OnInit {
  listCount: number;
  myDate = Date.now();
  response: any;
  data: any = {};
  country: any = [];
  buyer: any[];
  rows: any = [];
  temp: any[];
  countryId: null;
  @ViewChild(NgForm) buyerForm;
  date: number;


  public exampleData: Array<Select2OptionData>;



  constructor(private http: HttpClient,
    private toastr: ToastrService,
    private modalService: NgbModal,
    private service: ServiceService
  ) { }



  ngOnInit() {

    this.getBuyers();
    // return this.service.getCountry();

    this.exampleData = [
      {
        id: 'basic1',
        text: 'Basic 1'
      },
      {
        id: 'basic2',
        disabled: true,
        text: 'Basic 2'
      },
      {
        id: 'basic3',
        text: 'Basic 3'
      },
      {
        id: 'basic4',
        text: 'Basic 4'
      }
    ];



  }

















  

  getBuyers() {
    this.http.get(`${environment.apiUrl}/api/Buyers/GetBuyers`)
      .subscribe(
        res => {

          this.response = res;
          if (this.response.success == true) {
            this.buyer = this.response.data;
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



  editBuyer(popup) {
    const modalRef = this.modalService.open(EditBuyerComponent, { centered: true });
    modalRef.componentInstance.userId = popup.id;
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




  deleteBuyer(id) {
    Swal.fire({
      title: GlobalConstants.deleteTitle, //'Are you sure?',
      text: GlobalConstants.deleteMessage+' '+'"'+ id.buyerName +'"',
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
