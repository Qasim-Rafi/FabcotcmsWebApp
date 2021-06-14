import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
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
  @Input() contractId;
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
  saleinvoiceFilter: any = {};
  saleinvoicecount: number;
  queryParems: any = {};
  // contractId: any = {};
  constructor(
    private router: Router,
    private spinner: NgxSpinnerService,
    private route: ActivatedRoute,
    private http: HttpClient,
    private toastr: ToastrService,
    private modalService: NgbModal,
 
  ) { }

  ngOnInit(): void  {
    this.queryParems = this.route.snapshot.queryParams;
    this.contractId = this.queryParems.id;
    this.fetch((data) => {
      this.saleinvoiceFilter = [...data];

      this.rows = data;
      this.saleinvoicecount = this.rows.length;
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



addinvoiceForm(check){
  const modalRef = this.modalService.open(AddNewInvComponent, { centered: true });
  modalRef.componentInstance.statusCheck = check;
  modalRef.componentInstance.contractId = this.contractId ;

        modalRef.result.then((data) => {
       // on close
        if(data ==true){
        //  this.date = this.myDate;
         this.fetch((data) => {
          this.rows = data;
    this.saleinvoiceFilter = [...this.rows];
      
        });
       
      }
     }, (reason) => {
       // on dismiss
     });
}

fetch(cb) {
    this.spinner.show();
  this.http
  .get(`${environment.apiUrl}/api/Contracts/GetAllContractSaleInvoice/`+26 )
  .subscribe(res => {
    this.response = res;
   
  if(this.response.success==true)
  {
  this.saleInvoice =this.response.data;

  cb(this.saleInvoice);
 this.spinner.hide(); }
  else{
    this.toastr.error(this.response.message, 'Message.');
  this.spinner.hide();
  }
    // this.spinner.hide();
  }, err => {
    if ( err.status == 400) {
this.toastr.error(err.error.message, 'Message.');
    }
   this.spinner.hide();
  });
}

editinvoice(row) {
  const modalRef = this.modalService.open(AddNewInvComponent, { centered: true });
  modalRef.componentInstance.invoiceId = row.id;
  modalRef.result.then((data) => {
    // on close
    if (data == true) {
     this.data = data;

    }
  }, (reason) => {
    // on dismiss
  });
}



deleteinvoice(row) {
  Swal.fire({
    title: GlobalConstants.deleteTitle, //'Are you sure?',
    text: GlobalConstants.deleteMessage + ' ' + '"' + row.autoContractNumber + '"',
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

      this.http.delete(`${environment.apiUrl}/api/YarnContracts/DeleteContractSaleInvoice/` + row.id)
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
