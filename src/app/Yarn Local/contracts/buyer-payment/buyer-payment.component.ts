import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ClipboardService } from 'ngx-clipboard';
import { ToastrService } from 'ngx-toastr';
import { ServiceService } from 'src/app/shared/service.service';
import { EditBuyerPaymentComponent } from '../Modals/edit-buyer-payment/edit-buyer-payment.component';



@Component({
  selector: 'app-buyer-payment',
  templateUrl: './buyer-payment.component.html',
  styleUrls: ['./buyer-payment.component.css']
})
export class BuyerPaymentComponent implements OnInit {

  response: any;
  rows: any = [];
  columns: any = [];
  data: any = {};


  constructor(private http: HttpClient,
    private toastr: ToastrService,
    private router: Router,
    private service: ServiceService,
    private modalService: NgbModal,) { }

  ngOnInit(): void {
  }
 

  navigateBuyerPaymentForm() {
    this.router.navigate(['/yarn-local/buyer-payment-form']);
 };



  editPayment() {
    const modalRef = this.modalService.open(EditBuyerPaymentComponent, { centered: true });
    modalRef.result.then((data) => {
      // on close
      if (data == true) {
       

      }
    }, (reason) => {
      // on dismiss
    });
  }






}
