import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-add-tx-challan',
  templateUrl: './add-tx-challan.component.html',
  styleUrls: ['./add-tx-challan.component.css']
})
export class AddTxChallanComponent implements OnInit {

  buyer: any=[];
  seller: any=[];
  currency: any=[];
  data:any = {}
  columns: any
  rows = []

  constructor() { }

  ngOnInit(): void {
  }










}
