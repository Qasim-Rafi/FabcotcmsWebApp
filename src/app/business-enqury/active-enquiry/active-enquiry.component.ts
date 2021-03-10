import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-active-enquiry',
  templateUrl: './active-enquiry.component.html',
  styleUrls: ['./active-enquiry.component.css']
})
export class ActiveEnquiryComponent implements OnInit {
  rows:any=[];
  columns:any=[];
  constructor() { }

  ngOnInit(): void {
  }

}
