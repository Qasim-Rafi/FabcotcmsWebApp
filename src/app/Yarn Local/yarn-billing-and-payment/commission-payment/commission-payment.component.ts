import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {EditCommissionComponent} from '../edit-commission/edit-commission.component'
// import { DateFilterComponent } from '../date-filter/date-filter.component';


@Component({
  selector: 'app-commission-payment',
  templateUrl: './commission-payment.component.html',
  styleUrls: ['./commission-payment.component.css']
})
export class CommissionPaymentComponent implements OnInit {
  rows: any = [{rowNmbr:1}];
  columns: any = [];
// statusCheck:any;
  constructor(  private router: Router, private modalService: NgbModal) { }

  ngOnInit(): void {
  }
  addNewCommsion(statusCheck ) {
    // this.statusCheck = check;
    // this.router.navigateByUrl('/new-commission');
    this.router.navigate(['/yarn-billing-and-payment/new-commission'], { queryParams: { statusCheck: statusCheck  }  });

  };
  // dateFilterForm() {
    
  //   const modalRef = this.modalService.open(DateFilterComponent, { centered: true });
  // }
  navigateEditForm(rows) {
    const modalRef = this.modalService.open(EditCommissionComponent , { centered: true });
    modalRef.componentInstance.Editid = rows.id;

    modalRef.result.then((data) => {
      // on close
      // this.fetch((data) => {
      //   this.rows = data;
    
      // });
      
      if (data == true) {
        // this.getBuyers();

      }
    }, (reason) => {
      // on dismiss
    });
  }
}
