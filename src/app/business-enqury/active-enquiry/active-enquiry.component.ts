import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { GlobalConstants } from 'src/app/Common/global-constants';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';


@Component({
  selector: 'app-active-enquiry',
  templateUrl: './active-enquiry.component.html',
  styleUrls: ['./active-enquiry.component.css']
})
export class ActiveEnquiryComponent implements OnInit {
  response: any;
  rows: any = [];
  columns: any = [];
  data: any = {};
  listCount: number;
  myDate = Date.now();
  temp: any = [];


  constructor(private http: HttpClient,
    private toastr: ToastrService,
    private router: Router,

    // private service: ServiceService,
    // private modalService: NgbModal,
  ) { }

  navigateAddEnquiry() {
    this.router.navigateByUrl('/enquiries');
  };


  navigateEditEnquiry() {
    this.router.navigateByUrl('/edit-active-enquiries');
  };

  ngOnInit(): void {
    this.fetch((data) => {
      this.rows = data;
    });
  }




  updateFilter(event) {
    const val = event.target.value.toLowerCase();
    // filter our data
    const temp = this.temp.filter(function (d) {
      return (d.code.toLowerCase().indexOf(val) !== -1 ||
        d.name.toLowerCase().indexOf(val) !== -1 || !val);
    });
    this.rows = temp;
  }



  fetch(cb) {

    this.http
      .get(`${environment.apiUrl}/api/Enquiries/GetAllEnquiry`)
      .subscribe(res => {
        this.response = res;
        this.listCount = this.response.data.length;

        if (this.response.success == true) {
          this.data = this.response.data;
          this.temp = [this.data];
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




  deleteArticle(obj) {
    Swal.fire({
      title: GlobalConstants.deleteTitle, //'Are you sure?',
      text: GlobalConstants.deleteMessage + ' ' + '"' + obj.enquiryNumber + '"',
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

        this.http.delete(`${environment.apiUrl}​/api​/Enquiries​/DeleteEnquiry​/` + obj.id)
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

}
