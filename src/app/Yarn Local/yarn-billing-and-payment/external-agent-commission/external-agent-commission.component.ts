import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ClipboardService } from 'ngx-clipboard';
import { ToastrService } from 'ngx-toastr';
import { GlobalConstants } from 'src/app/Common/global-constants';
import { ServiceService } from 'src/app/shared/service.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import pdfMake from "pdfmake/build/pdfmake";
import {NgxSpinnerService} from 'ngx-spinner'
@Component({
  selector: 'app-external-agent-commission',
  templateUrl: './external-agent-commission.component.html',
  styleUrls: ['./external-agent-commission.component.css']
})
export class ExternalAgentCommissionComponent implements OnInit {
  rows: any = [];
  columns: any = [];
  response: any = {};
  data: any = [];
  paymentFilter : any = [];
  count : any;
  constructor(    private service: ServiceService,
    private http: HttpClient,
    private _clipboardService: ClipboardService,
    private router: Router,
    private toastr: ToastrService,
    private modalService: NgbModal,
    private spinner: NgxSpinnerService
    ) { }

    ngOnInit(): void {
      this.fetch((data=>{
        this.paymentFilter = [...data]
        this.rows = data;
        this.count  = this.rows.length;
      }))
    }
    addNewCommsion2(statusCheck ) {
      this.router.navigate(['/yarn-billing-and-payment/new-commission'], { queryParams: { statusCheck: statusCheck  }  });
   };
   search(event) {
    const val = event.target.value.toLowerCase();
    const temp = this.paymentFilter.filter(function (d) {
      return (d.sellerName.toLowerCase().indexOf(val) !== -1 ||  
      d.payNo.toLowerCase().indexOf(val) !== -1 ||  
      d.agentName.toLowerCase().indexOf(val) !== -1 ||  
      !val);
    });
    this.rows = temp;
  }
   fetch(cb) {
    
    this.http
    .get(`${environment.apiUrl}/api/BillingPayments/GetAllBillingExternalAgentCommission`)
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
  deletePayment(row) {
    Swal.fire({
      title: GlobalConstants.deleteTitle, //'Are you sure?',
      text: GlobalConstants.deleteMessage ,
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
  this.spinner.show();
        this.http.delete(`${environment.apiUrl}/api/BillingPayments/DeleteBillingExternalAgentCommission/` + row.id )
          .subscribe(
            res => {
              this.response = res;
              if (this.response.success == true) {
                this.toastr.error(this.response.message, 'Message.');
                this.fetch((data=>{
                  this.rows = data;
  this.spinner.hide();

                }))
  
              }
              else {
                this.toastr.error(this.response.message, 'Message.');
  this.spinner.hide();
             
              }
  
            }, err => {
              if (err.status == 400) {
                this.toastr.error(this.response.message, 'Message.');
  this.spinner.hide();

              }
            });
  
      }
    })
  
  }

}
