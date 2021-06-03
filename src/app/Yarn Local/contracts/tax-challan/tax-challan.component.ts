import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tax-challan',
  templateUrl: './tax-challan.component.html',
  styleUrls: ['./tax-challan.component.css']
})
export class TaxChallanComponent implements OnInit {
  buyer: any=[];
  seller: any=[];
  currency: any=[];
  data:any = {}
  columns: any
  rows = []
  constructor(private router: Router,) { }

  ngOnInit(): void {
  }

  navigateForm() {
    this.router.navigate(['/yarn-local/add-tax']);
 };





 
}
