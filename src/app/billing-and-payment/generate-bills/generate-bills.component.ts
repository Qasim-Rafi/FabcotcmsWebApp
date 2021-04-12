import { Component, OnInit } from '@angular/core';
import { DatatableComponent } from '@swimlane/ngx-datatable';
@Component({
  selector: 'app-generate-bills',
  templateUrl: './generate-bills.component.html',
  styleUrls: ['./generate-bills.component.css']
})
export class GenerateBillsComponent implements OnInit {

  constructor() { }

  rows: any = [];
  columns: any = [];

  ngOnInit(): void {
  }

}
