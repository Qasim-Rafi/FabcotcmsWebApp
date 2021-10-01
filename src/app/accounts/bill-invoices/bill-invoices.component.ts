import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ColumnMode, SelectionType } from '@swimlane/ngx-datatable';

@Component({
  selector: 'app-bill-invoices',
  templateUrl: './bill-invoices.component.html',
  styleUrls: ['./bill-invoices.component.css']
})
export class BillInvoicesComponent implements OnInit {
rows: any = [ {nmbr:1}];
columns: any=[];
SelectionType = SelectionType;
selected: any = [];

    
    constructor(private router: Router,) { }

  ngOnInit(): void {
  }
  onSelect(selecterow) {
    this.selected =selecterow;
  }
  navigate(){
    this.router.navigate(['/saleBill']);
  }
  print(){
    this.router.navigate(['/accBulk']);

  }

}
