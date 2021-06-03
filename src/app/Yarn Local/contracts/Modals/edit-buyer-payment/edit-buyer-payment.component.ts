import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ServiceService } from 'src/app/shared/service.service';

@Component({
  selector: 'app-edit-buyer-payment',
  templateUrl: './edit-buyer-payment.component.html',
  styleUrls: ['./edit-buyer-payment.component.css']
})
export class EditBuyerPaymentComponent implements OnInit {

  currency: any = [];
  payment: any = [];
  response: any;
  data: any = {};
 


  constructor(private http: HttpClient,
    private toastr: ToastrService,
    private _NgbActiveModal: NgbActiveModal,
    private service: ServiceService,
    private router: Router,) { }

  ngOnInit(): void {
    this.GetCurrencyDropdown();
  }

  get activeModal() {
    return this._NgbActiveModal;
  }



  GetCurrencyDropdown() {
    this.service.getCurrencyType().subscribe(res => {
      this.response = res;
      if (this.response.success == true) {
        this.currency = this.response.data;
      }
      else {
        this.toastr.error(this.response.message, 'Message.');
      }
    })
  }



  GetPaymentDropdown() {
    this.service.getPaymentMode().subscribe(res => {
      this.response = res;
      if (this.response.success == true) {
        this.payment = this.response.data;
      }
      else {
        this.toastr.error(this.response.message, 'Message.');
      }
    })
  }





}
