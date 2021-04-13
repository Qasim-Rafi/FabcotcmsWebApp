import { Component, OnInit, ViewChild } from '@angular/core';
import { DatatableComponent, id } from '@swimlane/ngx-datatable';
import { RouterModule, Routes } from '@angular/router';
const appRoutes: Routes = []
@Component({
  selector: 'app-doc-list',
  templateUrl: './doc-list.component.html',
  styleUrls: ['./doc-list.component.css']
})

export class DocListComponent implements OnInit {
  @ViewChild('myTable') table: DatatableComponent;
  rows: any = [];
  columns: any = [];
  constructor() { }

  ngOnInit(): void {
  }

}
