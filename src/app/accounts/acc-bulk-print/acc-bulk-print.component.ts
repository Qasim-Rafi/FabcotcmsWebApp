import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-acc-bulk-print',
  templateUrl: './acc-bulk-print.component.html',
  styleUrls: ['./acc-bulk-print.component.css']
})
export class AccBulkPrintComponent implements OnInit {
  rows: any = []
  constructor() { }

  ngOnInit(): void {
  }

}
