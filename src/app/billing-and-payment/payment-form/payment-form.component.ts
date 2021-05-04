import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-payment-form',
  templateUrl: './payment-form.component.html',
  styleUrls: ['./payment-form.component.css']
})
export class PaymentFormComponent implements OnInit {
  statusCheck:any={};

constructor(private route: ActivatedRoute,) { }


  ngOnInit(): void {
    this.statusCheck = this.route.snapshot.queryParams;

  }

}
