import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { GlobalConstants } from 'src/app/Common/global-constants';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-tax-challan',
  templateUrl: './tax-challan.component.html',
  styleUrls: ['./tax-challan.component.css']
})
export class TaxChallanComponent implements OnInit {
  buyer: any=[];
  seller: any=[];
  currency: any=[];
  data:any = {}
  
  columns: any
  response: any

  rows = []
  constructor(
    private router: Router,
    private http: HttpClient,
    private toastr: ToastrService,
    private modalService: NgbModal,
 
  ) { }

  ngOnInit(): void {
    this.fetch((data) => {
      this.rows = data;
    });

  }

  navigateForm() {
    this.router.navigate(['/yarn-local/add-tax']);
 };



 fetch(cb) {
    
  this.http
  .get(`${environment.apiUrl}/api/YarnContracts/GetAllTaxChallan` )
  .subscribe(res => {
    this.response = res;
   
  if(this.response.success==true)
  {
  this.data =this.response.data;

  cb(this.data);
  }
  else{
    this.toastr.error(this.response.message, 'Message.');
  }
    // this.spinner.hide();
  }, err => {
    if ( err.status == 400) {
this.toastr.error(err.error.message, 'Message.');
    }
  //  this.spinner.hide();
  });
}


deleteChalan(row) {
  Swal.fire({
    title: GlobalConstants.deleteTitle, //'Are you sure?',
    text: GlobalConstants.deleteMessage + 'Payment Receipt# ' + '"'  + '"',
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

      this.http.delete(`${environment.apiUrl}​/api​/YarnContracts​/DeleteTaxChallan​/` + row.id )
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
 
}
