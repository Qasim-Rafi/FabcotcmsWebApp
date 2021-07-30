import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ServiceService } from 'src/app/shared/service.service';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { GlobalConstants } from 'src/app/Common/global-constants';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-onhold-contracts',
  templateUrl: './onhold-contracts.component.html',
  styleUrls: ['./onhold-contracts.component.css']
})
export class OnholdContractsComponent implements OnInit {
  response: any;
  rows: any = [];
  columns: any = [];
  temp: any = [];
  onHoldCount: number;
  data: any = {};
  listCount: number;
  constructor(
    private service: ServiceService,
    private router: Router,
    private toastr: ToastrService,
    private http: HttpClient,
  ) { 
    
  }

  ngOnInit(): void {
    this.fetch((data) => {
      this.temp = [...data]; 
      this.rows = data;
    });
  }
  fetch(cb) {
    this.http
      .get(`${environment.apiUrl}/api/Contracts/GetAllContract/OnHold`)
      .subscribe(res => {
        this.response = res;

        if (this.response.success == true) {
          
          this.data = this.response.data.list;
        this.onHoldCount = this.response.data.onHoldCount;
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
  searchFilter(event) {
    const val = event.target.value.toLowerCase();
    // filter our data
    const temp = this.temp.filter(function (d) {
      return (d.autoContractNumber.toLowerCase().indexOf(val) !== -1 || !val);
    });
    this.rows = temp;
  }

  navigateEditContract(obj) {
    this.router.navigate(['/contract/active-contract-details'], { queryParams: {id: obj.id} });
  };
  deleteContract(obj) {
    Swal.fire({
      title: GlobalConstants.deleteTitle, //'Are you sure?',
      text: GlobalConstants.deleteMessage + ' ' + '"' + obj.autoContractNumber + '"',
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
  
        this.http.delete(`${environment.apiUrl}/api/Contracts/DeleteContract/` + obj.id)
          .subscribe(
            res => {
              this.response = res;
              if (this.response.success == true) {
                this.toastr.error(this.response.message, 'Message.');
                // this.getAllEnquiryItems();
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
