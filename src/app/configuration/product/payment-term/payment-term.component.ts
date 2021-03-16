import { Component, OnInit, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddPaymentComponent } from './add-payment/add-payment.component';
import { EditPaymentComponent } from './edit-payment/edit-payment.component';
import Swal from 'sweetalert2/dist/sweetalert2.js';
@Component({
  selector: 'app-payment-term',
  templateUrl: './payment-term.component.html',
  styleUrls: ['./payment-term.component.css']
})
export class PaymentTermComponent implements OnInit {
  response: any;
  rows: any = [];
  data: any = {};
  columns: any = [];
  listCount: number;
  myDate = Date.now();

  constructor(private http: HttpClient,
    private toastr: ToastrService,
    private modalService: NgbModal,) { }


  ngOnInit(): void {
    this.fetch((data) => {
      this.rows = data;
    });
  }



  fetch(cb) {
    let that = this;
    that.http
      .get(`${environment.apiUrl}/api/Products/GetAllPaymentTerm`)
      .subscribe(res => {
        this.response = res;
        if (this.response.success == true) {
          that.data = this.response.data;
          this.listCount = this.response.data.length;
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





  deletePayment(id) {
    Swal.fire({
      title: 'Confirm Delete',
      text: "Are you sure to delete this record",
      icon: 'error',
      showCancelButton: true,
      confirmButtonColor: '#ed5565',
      cancelButtonColor: '#fff',
      cancelButtonText: 'No',
      confirmButtonText: 'Yes',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {

        this.http.delete(`${environment.apiUrl}/api/Products/DeletePaymentTerm/` + id.id)
          .subscribe(
            res => {
              this.response = res;
              if (this.response.success == true) {
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

        // Swal.fire(
        //   'Record',
        //   'Deleted Successfully.',
        //   'success'
        // )
      }
    })

  }









  addPaymentForm() {
    const modalRef = this.modalService.open(AddPaymentComponent, { centered: true });
    modalRef.result.then((data) => {
      // on close
      if (data == true) {
        //  this.date = this.myDate;
        this.fetch((data) => {
          this.rows = data;
        });


      }
    }, (reason) => {
      // on dismiss
    });
  }


  editPaymentForm(row) {
    const modalRef = this.modalService.open(EditPaymentComponent, { centered: true });
    modalRef.componentInstance.userId = row.id;
    modalRef.result.then((data) => {
      // on close
      if (data == true) {
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