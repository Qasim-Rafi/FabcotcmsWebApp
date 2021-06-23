import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { GlobalConstants } from 'src/app/Common/global-constants';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-yarn-active-contracts',
  templateUrl: './yarn-active-contracts.component.html',
  styleUrls: ['./yarn-active-contracts.component.css']
})
export class YarnActiveContractsComponent implements OnInit {

  response: any;
  data: any = {};
  rows: any = [];
  columns: any = [];
  temp: any[];
  allCount: number;
  openCount:number;
  closedCount: number;
  billAwaitedCount: number;
  billedCount: number;
  receivableCount: number;
  receivedCount: number;
  onHoldCount: number;


  constructor(
    private router: Router,
    private http: HttpClient,
    private toastr: ToastrService,
    private modalService: NgbModal,
 
  ) { }

  ngOnInit(): void {
    this.fetch((data) => {
      this.temp = [...data]; 
      this.rows = data;
    });
  }




  searchFilter(event) {
    const val = event.target.value.toLowerCase();
    // filter our data
    const temp = this.temp.filter(function (d) {
      return (
        d.autoContractNumber.toLowerCase().indexOf(val) !== -1 ||
        d.buyerName.toLowerCase().indexOf(val) !== -1 ||
         !val);
    });
    this.rows = temp;
  }











  navigateEditContract(obj) {
    this.router.navigate(['/FabCot/active-contract-details'], { queryParams: {id: obj.id} });
  };
  
  navigateAddContract() {
    this.router.navigate(['/FabCot/add-new-contract']);
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
        this.data = this.response.data.list;
        this.allCount = this.response.data.allCount;
        this.openCount = this.response.data.openCount;
        this.closedCount = this.response.data.closedCount;
        this.billAwaitedCount = this.response.data.billAwaitedCount;
        this.billedCount = this.response.data.billedCount;
        this.receivableCount = this.response.data.receivableCount;
        this.receivedCount = this.response.data.receivedCount;
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
