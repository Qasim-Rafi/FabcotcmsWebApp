import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-active-bills',
  templateUrl: './active-bills.component.html',
  styleUrls: ['./active-bills.component.css']
})
export class ActiveBillsComponent implements OnInit {

  rows: any = [  {name : ["1","2","3","4"]  } ];
  columns: any = [];

  constructor() { }

  ngOnInit(): void {
  }
 

}
