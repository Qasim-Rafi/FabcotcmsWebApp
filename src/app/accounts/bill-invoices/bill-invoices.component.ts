import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ColumnMode, SelectionType } from '@swimlane/ngx-datatable';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Dateformater } from 'src/app/shared/dateformater';
import { ServiceService } from 'src/app/shared/service.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-bill-invoices',
  templateUrl: './bill-invoices.component.html',
  styleUrls: ['./bill-invoices.component.css']
})
export class BillInvoicesComponent implements OnInit {
rows: any = [];
columns: any=[];
SelectionType = SelectionType;
selected: any = [];
data:any=[];
data2:any=[];
response:any=[];
dateformater: Dateformater = new Dateformater();  
dashboardAmnt : any [];
    
constructor(    private service: ServiceService,
  private http: HttpClient,
  private router: Router,
  private toastr: ToastrService,
  private spinner: NgxSpinnerService,
 

  ) { }

  ngOnInit(): void {
    this.fetch();
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
  fetch() {
    this.data2.toDate = this.dateformater.toModel(this.data2.toDate)
    this.data2.FromDate = this.dateformater.toModel(this.data2.FromDate)
    this.spinner.show();
    this.http
    .get(`${environment.apiUrl}/api/BillingPayments/GetAllContractBillForInvoices/`+ this.data2.toDate + '/' + this.data2.FromDate)
    .subscribe(res => {
      this.response = res;
     
    if(this.response.success==true)
    {
    this.data=this.response.data;
    this.dashboardAmnt = this.data
    this.rows = this.data.objList;


    // cb(this.data);
    this.spinner.hide();

    }
    else{
      this.toastr.error(this.response.message, 'Message.');
      this.spinner.hide();
    
    }

    }, err => {
      if ( err.status == 400) {
  this.toastr.error(err.error.message, 'Message.');
  this.spinner.hide();

      }
    });
  }
}
