import { Component, OnInit , Input } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { GlobalConstants } from 'src/app/Common/global-constants';
import { ServiceService } from 'src/app/shared/service.service';
import { environment } from 'src/environments/environment';
import {NgxSpinnerService} from 'ngx-spinner'
@Component({
  selector: 'app-sale-invoice-form',
  templateUrl: './sale-invoice-form.component.html',
  styleUrls: ['./sale-invoice-form.component.css']
})
export class SaleInvoiceFormComponent implements OnInit {
  columns: any = [];
  rows: any = [];
  data: any = [];
  saleInvoiedata: any = [];
  @Input() contractId;
response:any;

  constructor(

    private route: ActivatedRoute,
    private modalService: NgbModal,
    private http: HttpClient,
    private service: ServiceService,
    private toastr: ToastrService,
    private router: Router,
    private _NgbActiveModal: NgbActiveModal,
    private spinner : NgxSpinnerService
  
  ) { }
  


  ngOnInit(): void {
this.fetch((data=>
  {
this.rows = data}
  ))
    
  }
  
  fetch(cb) {
    this.spinner.show();
    this.http
    .get(`${environment.apiUrl}/api/BillingPayments/GetAllContractSaleInvoiceInBill/` + this.contractId)
    .subscribe(res => {
      this.response = res;
     
    if(this.response.success==true)
    {
    this.saleInvoiedata =this.response.data;
    cb(this.saleInvoiedata);
    this.spinner.hide();
    
    }
    else{
      this.toastr.error(this.response.message, 'Message.');
    this.spinner.hide();

    }
      // this.spinner.hide();
    }, err => {
      if ( err.status == 400) {
 this.toastr.error(err.error.message, 'Message.');
 this.spinner.hide();

      }
    //  this.spinner.hide();
    });
  }

  get activeModal() {
    return this._NgbActiveModal;
  }
}
