import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {  NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import { Dateformater } from '../dateformater';
import { ServiceService } from '../service.service';
import { FilterPopUpComponent } from './filter-pop-up/filter-pop-up.component';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit {
  status: boolean = false;
  dateformater: Dateformater = new Dateformater();  
  data:any={};
  menuName: any = {};
  response: any;
  temp: any[];
  rows: any = [];
  columns: any = [];
  openContractReport: any = [];
  agentBookingStatus: any = [];
  cancleContarctReport: any = [];
  billingReportInvoiceWise: any = [];
  dispatchReport: any = [];
  billingReportContractWise: any = [];
  taxChallanReport: any = [];
  commissionReport: any = [];
  dbcrNoteSummary: any = [];
  externalAgentReport: any = [];
  kickbackReport: any = [];
  allContractReport: any = [];
  paymentReport: any = [];
  lCReport: any = [];
  url: any;
  contractWise : any = []
  buyer : any = []
  seller : any = []
  article : any = []
  invBill: any = [];
  contractBill: any = [];

  constructor(

    private route: ActivatedRoute,
    private modalService: NgbModal,
    private http: HttpClient,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private service: ServiceService,

    private router: Router,


  ) { this.router.routeReuseStrategy.shouldReuseRoute = () => false; }

  ngOnInit(): void {
    this.menuName = this.route.snapshot.queryParams;
    this.billingReportInvoiceWise.startDate = this.dateformater.toModel(this.billingReportInvoiceWise.startDate)
    this.billingReportInvoiceWise.endDate = this.dateformater.toModel(this.billingReportInvoiceWise.endDate)

    this.fetch();
    this.GetBuyersDropdown();
    this.GetSellersDropdown();
    this.GetArticleDropdown();
this.fetchContractInvise();
  }
  GetBuyersDropdown() {
    this.service.getBuyers().subscribe(res => {
      this.response = res;
      if (this.response.success == true) {
        this.buyer = this.response.data;
      }
      else {
        this.toastr.error(this.response.message, 'Message.');
      }
    })
  }
  GetArticleDropdown() {
    this.service.getArticles().subscribe(res => {
      this.response = res;
      if (this.response.success == true) {
        this.article = this.response.data;
      }
      else {
        this.toastr.error(this.response.message, 'Message.');
      }
    })
  }
  GetSellersDropdown() {
    this.service.getSellers().subscribe(res => {
      this.response = res;
      if (this.response.success == true) {
        this.seller = this.response.data;
      }
      else {
        this.toastr.error(this.response.message, 'Message.');
      }
    })
  }
  searchFilter(event) {
    const val = event.target.value.toLowerCase();
    // filter our data
    const temp = this.temp.filter(function (d) {
      return (
        d.autoContractNumber.toLowerCase().indexOf(val) !== -1 ||
        d.buyerName.toLowerCase().indexOf(val) !== -1 ||
        !val);
    });
    this.rows = temp;
  }
  filterPopUform() {
    const modalRef = this.modalService.open(FilterPopUpComponent, { centered: true });
   
    modalRef.result.then((data) => {
      // on close
      if (data == true) {


      }
    }, (reason) => {
      // on dismiss
    });
  }

  billInvSearch(event) {
    const val = event.target.value.toLowerCase();
    const temp = this.invBill.filter(function (d) {
      return (d.contractNo.toLowerCase().indexOf(val) !== -1 || d.billNo.toLowerCase().indexOf(val) !==-1   || !val);
    });
    this.billingReportInvoiceWise = temp;
  }

  billContractSearch(event) {
    const val = event.target.value.toLowerCase();
    const temp = this.contractBill.filter(function (d) {
      return (d.contractNo.toLowerCase().indexOf(val) !== -1 || d.billNo.toLowerCase().indexOf(val) !==-1   || !val);
    });
    this.contractWise = temp;
  }


  fetch() {
    this.billingReportInvoiceWise.startDate = this.dateformater.toModel(this.billingReportInvoiceWise.startDate)
    this.billingReportInvoiceWise.endDate = this.dateformater.toModel(this.billingReportInvoiceWise.endDate)

    this.spinner.show();
    this.http
    .get(`${environment.apiUrl}/api/Reports/AllBillingReportInvoiceWise/`+   this.billingReportInvoiceWise.startDate + '/' +this.billingReportInvoiceWise.endDate      )
    .subscribe(res => {
      this.response = res;
     
    if(this.response.success==true)
    {
    this.billingReportInvoiceWise=this.response.data;
    this.invBill = [...this.billingReportInvoiceWise]
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
  invoiceExcelFile(){
    const filtered = this.billingReportInvoiceWise.map(row => ({
      BillFor: row.billFor,
      Article: row.articleName,
      ContractNumber: row.contractNo,
      CotractDate: row.contractDate ,
      BillDate: row.billDate,
      BillNumber: row.billNo,
      Buyer: row.buyerName ,
      Seller: row.sellerName,
      InvoiceNumber:row.invoiceNo,
      Rate: row.rate,
      CommPer: row.fabcotCommission + '%' ,
      Quantity: row.quantity,
      QtyUOM:row.quantityUOMName,

      CommAmount: row.commissionAmount ,
    }));

    this.service.exportAsExcelFile(filtered, 'Bill Report(Invoice Wise)');

  }
  fetchContractInvise() {
    this.contractWise.startDate = this.dateformater.toModel(this.contractWise.startDate)
    this.contractWise.endDate = this.dateformater.toModel(this.contractWise.endDate)
    this.spinner.show();
    this.http
    .get(`${environment.apiUrl}/api/Reports/AllBillingReportContractWise/`+   this.contractWise.startDate + '/' +this.contractWise.endDate)
    .subscribe(res => {
      this.response = res;
     
    if(this.response.success==true)
    {
    this.contractWise=this.response.data;
   this.contractBill = [...this.contractWise]

    // cb(this.billingReportInvoiceWise);
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
  contractExcelFile(){
    const filtered = this.contractWise.map(row => ({
      BillFor: row.billFor,
      Article: row.articleName,
      ContractNumber: row.contractNo,
      CotractDate: row.contractDate ,
      BillDate: row.billDate,
      BillNumber: row.billNo,
      Buyer: row.buyerName ,
      Seller: row.sellerName,
      Rate: row.rate,
      CommPer: row.fabcotCommission + '%' ,
      Quantity: row.quantity,
      QtyUOM:row.quantityUOMName,
      CommAmount: row.commissionAmount ,
    }));

    this.service.exportAsExcelFile(filtered, 'Bill Report(Contract Wise)');

  }

  allContractReports() {
    this.contractWise.startDate = this.dateformater.toModel(this.contractWise.startDate)
    this.contractWise.endDate = this.dateformater.toModel(this.contractWise.endDate)
    this.spinner.show();
    this.http
    .get(`${environment.apiUrl}`)
    .subscribe(res => {
      this.response = res;
     
    if(this.response.success==true)
    {
    this.allContractReport=this.response.data;
 

    // cb(this.billingReportInvoiceWise);
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
  allcontractExcelFile(){
    const filtered = this.contractWise.map(row => ({
      BillFor: row.billFor,
      Article: row.articleName,
      ContractNumber: row.contractNo,
      CotractDate: row.contractDate ,
      BillDate: row.billDate,
      BillNumber: row.billNo,
      Buyer: row.buyerName ,
      Seller: row.sellerName,
      Rate: row.rate,
      CommPer: row.fabcotCommission + '%' ,
      Quantity: row.quantity,
      QtyUOM:row.quantityUOMName,
      CommAmount: row.commissionAmount ,
    }));

    this.service.exportAsExcelFile(filtered, 'Bill Report(Contract Wise)');

  }


  openContractReports() {
    this.contractWise.startDate = this.dateformater.toModel(this.contractWise.startDate)
    this.contractWise.endDate = this.dateformater.toModel(this.contractWise.endDate)
    this.spinner.show();
    this.http
    .get(`${environment.apiUrl}`)
    .subscribe(res => {
      this.response = res;
     
    if(this.response.success==true)
    {
    this.openContractReport=this.response.data;
 

    // cb(this.billingReportInvoiceWise);
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
  openContractExcelFile(){
    const filtered = this.contractWise.map(row => ({
      BillFor: row.billFor,
      Article: row.articleName,
      ContractNumber: row.contractNo,
      CotractDate: row.contractDate ,
      BillDate: row.billDate,
      BillNumber: row.billNo,
      Buyer: row.buyerName ,
      Seller: row.sellerName,
      Rate: row.rate,
      CommPer: row.fabcotCommission + '%' ,
      Quantity: row.quantity,
      QtyUOM:row.quantityUOMName,
      CommAmount: row.commissionAmount ,
    }));

    this.service.exportAsExcelFile(filtered, 'Bill Report(Contract Wise)');

  }



  clickEvent(){
    this.status = !this.status;       
}

}
