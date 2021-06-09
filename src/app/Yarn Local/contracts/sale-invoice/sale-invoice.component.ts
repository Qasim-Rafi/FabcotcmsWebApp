import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { GlobalConstants } from 'src/app/Common/global-constants';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { AddNewInvComponent } from './add-new-inv/add-new-inv.component';

@Component({
  selector: 'app-sale-invoice',
  templateUrl: './sale-invoice.component.html',
  styleUrls: ['./sale-invoice.component.css']
})
export class SaleInvoiceComponent implements OnInit {

  response: any;
  data: any = {};
  saleInvoice: any = {};

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
  currencyFilter: any = [];


  constructor(
    private router: Router,
    private http: HttpClient,
    private toastr: ToastrService,
    private modalService: NgbModal,
 
  ) { }

  ngOnInit(): void {

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



addinvoiceForm(check){
  const modalRef = this.modalService.open(AddNewInvComponent, { centered: true });
  modalRef.componentInstance.statusCheck = check;

        modalRef.result.then((data) => {
       // on close
        if(data ==true){
        //  this.date = this.myDate;
         this.fetch((data) => {
          this.rows = data;
    this.currencyFilter = [...this.rows];
      
        });
       
      }
     }, (reason) => {
       // on dismiss
     });
}

fetch(cb) {
    
  this.http
  .get(`${environment.apiUrl}/api/YarnContracts/GetAllBuyerToSellerPayment` )
  .subscribe(res => {
    this.response = res;
   
  if(this.response.success==true)
  {
  this.saleInvoice =this.response.data;

  cb(this.saleInvoice);
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





// deleteContract(obj) {
//   Swal.fire({
//     title: GlobalConstants.deleteTitle, //'Are you sure?',
//     text: GlobalConstants.deleteMessage + ' ' + '"' + obj.autoContractNumber + '"',
//     icon: 'error',
//     showCancelButton: true,
//     confirmButtonColor: '#ed5565',
//     cancelButtonColor: '#dae0e5',
//     cancelButtonText: 'No',
//     confirmButtonText: 'Yes',
//     reverseButtons: true,
//     position: 'top',
//   }).then((result) => {
//     if (result.isConfirmed) {

//       this.http.delete(`${environment.apiUrl}/api/Contracts/DeleteContract/` + obj.id)
//         .subscribe(
//           res => {
//             this.response = res;
//             if (this.response.success == true) {
//               this.toastr.error(this.response.message, 'Message.');
//               // this.getAllEnquiryItems();
//               this.fetch((data) => {
//                 this.rows = data;
//               });
              

//             }
//             else {
//               this.toastr.error(this.response.message, 'Message.');
//             }

//           }, err => {
//             if (err.status == 400) {
//               this.toastr.error(this.response.message, 'Message.');
//             }
//           });

//     }
//   })

// }


}
