import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
// import { ToastrService } from 'ngx-toastr';
// import { HttpClient } from '@angular/common/http';
// import { environment } from 'src/environments/environment';
// import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-new-commission-payment',
  templateUrl: './new-commission-payment.component.html',
  styleUrls: ['./new-commission-payment.component.css']
})
export class NewCommissionPaymentComponent implements OnInit {

  
  rows: any = [];
  columns: any = [];
  constructor() { }

  ngOnInit(): void {
  }

}
