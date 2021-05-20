import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { GlobalConstants } from 'src/app/Common/global-constants';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-active-contracts',
  templateUrl: './active-contracts.component.html',
  styleUrls: ['./active-contracts.component.css']
})
export class ActiveContractsComponent implements OnInit {


  
  response: any;
  data: any = {};
  rows: any = [];
  columns: any = [];
  temp: any[];



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


  navigateEditContract(obj) {
    this.router.navigate(['/contract/active-contract-details'], { queryParams: {id: obj.id} });
  };


activeContract(){
  console.log("Active Contracts");
  // document.getElementById('all').style. = 'background-color: red; color: white;';
}

openContract(){
  console.log("open Contracts");
  // document.getElementById('open').style.cssText = 'background-color: red; color: white;';
}


bill_awaitedContract(){
  console.log("bill_awaited Contracts")
}

billedContract(){
  console.log("billed Contracts")
}

receivableContract(){
  console.log("receivable Contracts")
}

receivedContract(){
  console.log("received Contracts")
}

on_HandContract(){
  console.log("on_Hand Contracts")
}





fetch(cb) {

  this.http
    .get(`${environment.apiUrl}/api/Contracts/GetAllContract`)
    .subscribe(res => {
      this.response = res;

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
