import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient } from '@angular/common/http';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { ToastrService } from 'ngx-toastr';
import { ServiceService } from 'src/app/shared/service.service';
import { environment } from 'src/environments/environment';
import { GlobalConstants } from '../../Common/global-constants';
import { DateFilterComponent } from '../date-filter/date-filter.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-active-bills',
  templateUrl: './active-bills.component.html',
  styleUrls: ['./active-bills.component.css']
})
export class ActiveBillsComponent implements OnInit {

  rows: any = [  {name : ["1","2","3","4"]  } ];
  columns: any = [];
  url = '/api/BillingPayments/GetAllContractBill'
  constructor(    private service: ServiceService,
    private http: HttpClient,
    private router: Router,
    private toastr: ToastrService,
    private modalService: NgbModal
    ) { }

    navigatePaymentForm(statusCheck ) {
      this.router.navigate(['/billing-and-payment/payment-form'], { queryParams: { statusCheck: statusCheck  }  });
   };
    navigateOpenBill(obj) {
      this.router.navigate(['/billing-and-payment/open-bill'], { queryParams: {id: obj.id} });
    };
 
  ngOnInit(): void {
    this.service.fetch((data)=>{
        //  this.rows = data;
    } , this.url)
  }
 
  dateFilterForm() {
    
    const modalRef = this.modalService.open(DateFilterComponent, { centered: true });
  
   
  }

}
