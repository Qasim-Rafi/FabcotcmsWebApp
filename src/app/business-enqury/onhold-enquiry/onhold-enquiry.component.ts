import { Component, OnInit } from '@angular/core';
import { ServiceService } from 'src/app/shared/service.service';

@Component({
  selector: 'app-onhold-enquiry',
  templateUrl: './onhold-enquiry.component.html',
  styleUrls: ['./onhold-enquiry.component.css']
})
export class OnholdEnquiryComponent implements OnInit {
  onholdUrl = '/api/Enquiries/GetAllEnquiry/"OnHold"'
  rows: any = [];
  onholdCount: number;
  columns: any = [];
  constructor(
    private service: ServiceService,

  ) { 
    
  }

  ngOnInit(): void {
    this.service.fetch((data) => {
      this.rows = data;
      this.onholdCount = this.rows.length
    }, this.onholdUrl);
  }

}
