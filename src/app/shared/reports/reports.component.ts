import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {  NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import { Dateformater } from '../dateformater';
import { ServiceService } from '../service.service';
import { FilterPopUpComponent } from './filter-pop-up/filter-pop-up.component';
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts.pdfMake.vfs;
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
  columns: any = [];
  openContractReport: any = [];
  agentBookingStatus: any = [];
  billingReportInvoiceWise: any = [];
  billingReportContractWise: any = [];
  commissionReport: any = [];
  kickbackReport: any = [];
  paymentReport: any = [];
  contractWise : any = []
  buyer : any = []
  seller : any = []
  article : any = []
  invBill: any = [];
  contractBill: any = [];
  cancelContract:any =[];
  rows:any =[];
  data3:any=[];
  data7:any=[];
data8 : any=[]
  DbCrData:any=[];
dbCount : any;
data4: any = [];
data5: any = [];
data6: any = [];
dispatchReport : any =[]
lCReport : any = []
externalAgent: any = []
taxChallanReport: any = []
agents :  any = []
totalContract  = 0;
totalQuantity =0;
totalDispatch =0;
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

if(this.menuName.menuName == 'CancleContarctReport'){

  this.cancelContractReport();
}
else if ( this.menuName.menuName == 'BillingReportInvoiceWise'){
  this.fetch();
}
else if(this.menuName.menuName =='OpenContractReport'){
  this.getOpenContractReport2();
}
else if(this.menuName.menuName =='PaymentReport'){
  this.PaymentReport();
}
else if(this.menuName.menuName =='KickbackReport'){
 this.kickbackContractReport();
}
else if(this.menuName.menuName =='AgentBookingStatus'){
  this.agentBooking();
 }


else if (this.menuName.menuName == 'DbcrNoteSummary'){
  this.GetDbCrReport();
}
else if (this.menuName.menuName == 'BillingReportContractWise'){
  this.fetchContractInvise();
}

    this.GetBuyersDropdown();
    this.GetSellersDropdown();
    this.GetArticleDropdown();
    this.GetAgentDropdown();
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
  GetAgentDropdown() {
    this.service.getAgents().subscribe(res => {
      this.response = res;
      if (this.response.success == true && this.response.data != null) {
        this.agents = this.response.data;
      }
      else if(this.response.success == false) {
         
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

    const temp = this.temp.filter(function (d) {
      return (
        d.autoContractNumber.toLowerCase().indexOf(val) !== -1 ||
        d.buyerName.toLowerCase().indexOf(val) !== -1 ||
        !val);
    });
  }
  filterPopUform(menu) {
    const modalRef = this.modalService.open(FilterPopUpComponent, { centered: true });
    modalRef.componentInstance.menu = menu;
    modalRef.result.then((p) => {
      if (p != null) {
  this.commisionReport(p)

      }
    }, (reason) => {
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

  // GetCancelContract() {


  //   this.spinner.show();
  //   this.http
  //   .get(`${environment.apiUrl}/api/Reports/GetAllCancelContractReport` )
  //   .subscribe(res => {
  //     this.response = res;

  //   if(this.response.success==true)
  //   {
  //   this.cancelContract=this.response.data;
    
  //   this.spinner.hide();

  //   }
  //   else{
  //     this.toastr.error(this.response.message, 'Message.');
  //     this.spinner.hide();

  //   }

  //   }, err => {
  //     if ( err.status == 400) {
  // this.toastr.error(err.error.message, 'Message.');
  // this.spinner.hide();

  //     }
  //   });
  // }

  GetDbCrReport() {


    this.spinner.show();
    this.http
    .get(`${environment.apiUrl}/api/Reports/GetDebitCreditReport` )
    .subscribe(res => {
      this.response = res;

    if(this.response.success==true)
    {
    this.DbCrData=this.response.data;
 
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

  getOpenContractReport(){
    this.rows = [];
    let varr = {
      "buyerId":this.data3.buyerId ==undefined ? 0 :this.data3.buyerId,
      "sellerId":this.data3.sellerId == undefined?0 :this.data3.sellerId,
      "autoContractNumber":this.data3.autoContractNumber == undefined ? 'string': this.data3.autoContractNumber,
      "startContractDate":this.data3.startContractDate == undefined? '':this.dateformater.toModel(this.data3.startContractDate),
      "endContractDate":this.data3.endContractDate == undefined?'':this.dateformater.toModel(this.data3.endContractDate),
      "status" : "Open"
    }
    this.spinner.show();
    this.http.
      post(`${environment.apiUrl}/api/Reports/ContractReport`, varr)
      .subscribe(
        res => {

          this.response = res;
          if (this.response.success == true  && this.response.data.obj.length != 0) {
            this.toastr.success(this.response.message, 'Message.');
            this.rows = this.response.data;


         this.spinner.hide();
          }
          else if(this.response.data.obj.length == 0) {
            this.toastr.error("No such Contract Exist", 'Message.');
         this.spinner.hide();
          }
          else {
            this.toastr.error(this.response.message, 'Message.');
         this.spinner.hide();
          }

        }, (err: HttpErrorResponse) => {
          const messages = this.service.extractErrorMessagesFromErrorResponse(err);
          this.toastr.error(messages.toString(),'Message.');
          this.spinner.hide();

        });
  }
  getOpenContractReport2(){

    let varr = {
      "buyerId":this.data3.buyerId ==undefined ? 0 :this.data3.buyerId,
      "sellerId":this.data3.sellerId == undefined?0 :this.data3.sellerId,
      "autoContractNumber":this.data3.autoContractNumber == undefined ? '': this.data3.autoContractNumber,
      "startContractDate":this.data3.startContractDate == undefined? '': this.dateformater.toModel(this.data3.startContractDate),
      "endContractDate":this.data3.endContractDate == undefined?'':this.dateformater.toModel(this.data3.endContractDate),
      "status" : "Open"
    }
    this.spinner.show();
    this.http.
      post(`${environment.apiUrl}/api/Reports/ContractReport`, varr)
      .subscribe(
        res => {

          this.response = res;
          if (this.response.success == true  && this.response.data.obj.length != 0) {
            this.toastr.success(this.response.message, 'Message.');
            this.rows = this.response.data.obj;
            this.totalContract = this.response.data.totalContract 
            this.totalDispatch = this.response.data.totalDispatchAmount
            this.totalQuantity = this.response.data.totalQuantity


         this.spinner.hide();
          }
          else if(this.response.data.obj.length == 0) {
            this.toastr.error("No such Contract Exist", 'Message.');
         this.spinner.hide();
          }
          else {
            this.toastr.error(this.response.message, 'Message.');
         this.spinner.hide();
          }

        }, (err: HttpErrorResponse) => {
          const messages = this.service.extractErrorMessagesFromErrorResponse(err);
          this.toastr.error(messages.toString(),'Message.');
          this.spinner.hide();

        });
  }
  externalAgentReport(){

    let varr = {
      "agentId":this.data8.agentId ==undefined ? "" :this.data8.agentId.toString(),
      "sellerId":this.data8.sellerId == undefined?0 :this.data8.sellerId,
      "contractNo":this.data8.autoContractNumber == undefined ? '': this.data8.autoContractNumber,

    }
    this.spinner.show();
    this.http.
      post(`${environment.apiUrl}/api/Reports/External_Agent_Report`, varr)
      .subscribe(
        res => {

          this.response = res;
          if (this.response.success == true  && this.response.data.length != 0) {
            this.toastr.success(this.response.message, 'Message.');
            this.externalAgent = this.response.data;


         this.spinner.hide();
          }
          else if(this.response.data.length == 0) {
            this.toastr.error("No such Contract Exist", 'Message.');
         this.spinner.hide();
          }
          else {
            this.toastr.error(this.response.message, 'Message.');
         this.spinner.hide();
          }

        }, (err: HttpErrorResponse) => {
          const messages = this.service.extractErrorMessagesFromErrorResponse(err);
          this.toastr.error(messages.toString(),'Message.');
          this.spinner.hide();

        });
  }

  cancelContractReport(){

    let varr = {
      "buyerId":this.data7.buyerId ==undefined ? 0 :this.data7.buyerId,
      "sellerId":this.data7.sellerId == undefined?0 :this.data7.sellerId,
      "autoContractNumber":this.data7.autoContractNumber == undefined ? '': this.data7.autoContractNumber,
      "startContractDate":this.data7.startContractDate == undefined? '': this.dateformater.toModel(this.data7.startContractDate),
      "endContractDate":this.data7.endContractDate == undefined?'':this.dateformater.toModel(this.data7.endContractDate),
      "status" : "Cancel"
    }
    this.spinner.show();
    this.http.
      post(`${environment.apiUrl}/api/Reports/ContractReport`, varr)
      .subscribe(
        res => {

          this.response = res;
          if (this.response.success == true  && this.response.data.obj.length != 0) {
            this.toastr.success(this.response.message, 'Message.');
            this.cancelContract = this.response.data.obj;
            this.totalContract = this.response.data.totalContract 
            this.totalDispatch = this.response.data.totalDispatchAmount
            this.totalQuantity = this.response.data.totalQuantity

         this.spinner.hide();
          }
          else if(this.response.data.obj.length == 0) {
            this.toastr.error("No such Contract Exist", 'Message.');
         this.spinner.hide();
          }
          else {
            this.toastr.error(this.response.message, 'Message.');
         this.spinner.hide();
          }

        }, (err: HttpErrorResponse) => {
          const messages = this.service.extractErrorMessagesFromErrorResponse(err);
          this.toastr.error(messages.toString(),'Message.');
          this.spinner.hide();

        });
  }


 agentBooking(){

    this.spinner.show();
    this.http.
      post(`${environment.apiUrl}/api/Reports/AgentBookingReport`, {})
      .subscribe(
        res => {

          this.response = res;
          if (this.response.success == true  && this.response.data.length != 0) {
            this.toastr.success(this.response.message, 'Message.');
            this.agentBookingStatus = this.response.data;


         this.spinner.hide();
          }
          else if(this.agentBookingStatus.length == 0) {
            this.toastr.error("No such Contract Exist", 'Message.');
         this.spinner.hide();
          }
          else {
            this.toastr.error(this.response.message, 'Message.');
         this.spinner.hide();
          }

        }, (err: HttpErrorResponse) => {
          const messages = this.service.extractErrorMessagesFromErrorResponse(err);
          this.toastr.error(messages.toString(),'Message.');
          this.spinner.hide();

        });
  }



PaymentReport(){
  let varr = {
    "buyerId":this.data4.buyerId ==undefined ? 0 :this.data4.buyerId,
    "sellerId":this.data4.sellerId == undefined?0 :this.data4.sellerId,
    "startContractDate":this.data4.startContractDate == undefined? '': this.dateformater.toModel(this.data4.startContractDate),
    "endContractDate":this.data4.endContractDate == undefined?'':this.dateformater.toModel(this.data4.endContractDate)
  }
  this.spinner.show();
  this.http.
    post(`${environment.apiUrl}/api/Reports/Payment_Report`, varr)
    .subscribe(
      res => {

        this.response = res;
        if (this.response.success == true  && this.response.data.length != 0) {
          this.toastr.success(this.response.message, 'Message.');
          this.paymentReport = this.response.data;


       this.spinner.hide();
        }
        else if(this.paymentReport.length == 0) {
          this.toastr.error("No such Contract Exist", 'Message.');
       this.spinner.hide();
        }
        else {
          this.toastr.error(this.response.message, 'Message.');
       this.spinner.hide();
        }

      }, (err: HttpErrorResponse) => {
        const messages = this.service.extractErrorMessagesFromErrorResponse(err);
        this.toastr.error(messages.toString(),'Message.');
        this.spinner.hide();

      });
}
kickbackContractReport(){
  let varr = {
    "buyerId":this.data5.buyerId ==undefined ? 0 :this.data5.buyerId,
    "sellerId":this.data5.sellerId == undefined?0 :this.data5.sellerId,
    "autoContractNumber":this.data5.autoContractNumber == undefined ? '': this.data5.autoContractNumber,
    "startContractDate":this.data5.startContractDate == undefined? '': this.dateformater.toModel(this.data5.startContractDate),
    "endContractDate":this.data5.endContractDate == undefined?'':this.dateformater.toModel(this.data5.endContractDate)
  }
  this.spinner.show();
  this.http.
    post(`${environment.apiUrl}/api/Reports/KickbackContractReport`, varr)
    .subscribe(
      res => {

        this.response = res;
        if (this.response.success == true  && this.response.data.length != 0) {
          this.toastr.success(this.response.message, 'Message.');
          this.kickbackReport = this.response.data;


       this.spinner.hide();
        }
        else if(this.kickbackReport.length == 0) {
          this.toastr.error("No such Contract Exist", 'Message.');
       this.spinner.hide();
        }
        else {
          this.toastr.error(this.response.message, 'Message.');
       this.spinner.hide();
        }

      }, (err: HttpErrorResponse) => {
        const messages = this.service.extractErrorMessagesFromErrorResponse(err);
        this.toastr.error(messages.toString(),'Message.');
        this.spinner.hide();

      });
}
kickbackContractReport2(){
  this.kickbackReport = [];
  let varr = {
    "buyerId":this.data5.buyerId ==undefined ? 0 :this.data5.buyerId,
    "sellerId":this.data5.sellerId == undefined?0 :this.data5.sellerId,
    "autoContractNumber":this.data5.autoContractNumber == undefined ? '': this.data5.autoContractNumber,
    "startContractDate":this.data5.startContractDate == undefined? '': this.dateformater.toModel(this.data5.startContractDate),
    "endContractDate":this.data5.endContractDate == undefined?'':this.dateformater.toModel(this.data5.endContractDate)
  }
  this.spinner.show();
  this.http.
    post(`${environment.apiUrl}/api/Reports/KickbackContractReport`, varr)
    .subscribe(
      res => {

        this.response = res;
        if (this.response.success == true  && this.response.data.length != 0) {
          this.toastr.success(this.response.message, 'Message.');
          this.kickbackReport = this.response.data;


       this.spinner.hide();
        }
        else if(this.kickbackReport.length == 0) {
          this.toastr.error("No such Contract Exist", 'Message.');
       this.spinner.hide();
        }
        else {
          this.toastr.error(this.response.message, 'Message.');
       this.spinner.hide();
        }

      }, (err: HttpErrorResponse) => {
        const messages = this.service.extractErrorMessagesFromErrorResponse(err);
        this.toastr.error(messages.toString(),'Message.');
        this.spinner.hide();

      });
}
commisionReport(varr){

  this.spinner.show();
  this.http.
    post(`${environment.apiUrl}/api/Reports/Commission_Report`, varr)
    .subscribe(
      res => {

        this.response = res;
        if (this.response.success == true  && this.response.data.length != 0) {
          this.toastr.success(this.response.message, 'Message.');
          this.commissionReport = this.response.data;


       this.spinner.hide();
        }
        else if(this.kickbackReport.length == 0) {
          this.toastr.error("No such Contract Exist", 'Message.');
       this.spinner.hide();
        }
        else {
          this.toastr.error(this.response.message, 'Message.');
       this.spinner.hide();
        }

      }, (err: HttpErrorResponse) => {
        const messages = this.service.extractErrorMessagesFromErrorResponse(err);
        this.toastr.error(messages.toString(),'Message.');
        this.spinner.hide();

      });
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
  openContractExcelFile(){
    const filtered = this.rows.map(row => ({
    Age:row.age,
    ContractNo: row.contractNo,
    Buyer: row.buyerName,
    Seller: row.sellerName ,
    Date: row.date,
    PONumber: row.poNumber,
    Article: row.articleName ,
    Rate: row.rate,
      RateUOM: row.rateUOMName ,
  
      Quantity: row.balanceQty,
      QtyUOM:row.uomName,
      Booking: row.booking ,
      
      Dispatch: row.dispatch ,
      Balance: row.balanceQty ,

    }));

    this.service.exportAsExcelFile(filtered, 'Open Contract Report');

  }
  cancleContractExcelFile(){
    const filtered = this.cancelContract.map(row => ({
    Age:row.age,
    ContractNo: row.contractNo,
    Buyer: row.buyerName,
    Seller: row.sellerName ,
    Date: row.date,
    PONumber: row.poNumber,
    Article: row.articleName ,
    Rate: row.rate,
      RateUOM: row.rateUOMName ,
  Container : row.containerName,
      Quantity: row.balanceQty,
      QtyUOM:row.uomName,
      Booking: row.booking ,
      Cost:row.cost,
      Dispatch: row.dispatch ,
      Balance: row.balanceQty ,
      SellerComm : row.sellerCommission,
      BuyerComm : row.buyerCommission, 
      Status:row.status

    }));

    this.service.exportAsExcelFile(filtered, 'Cancle Contract Report');

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
  paymentExcelFile(){
    const filtered = this.paymentReport.map(row => ({
      ContractNo: row.autoContractNo,
      InvNo: row.saleInvoiceNo,
      InvDate: row.saleInvoiceDateToDisplay ,
      Buyer: row.buyerName,
      Seller: row.sellerName,
      Quantity: row.quantity ,
      InvoiceAmount: row.amount,
      Received: row.received ,
    
      Balance: row.balance,
      Aging:row.age,
    
    }));

    this.service.exportAsExcelFile(filtered, 'PaymentReport');

  }
  dbCrExcelFile(){
    const filtered = this.DbCrData.map(row => ({
      ContractNo: row.autoContractNumber,
      InvNo: row.saleInvoiceNo,
      InvDate: row.saleInvoiceDateToDisplay ,
      Buyer: row.buyerName,
      Seller: row.sellerName,
      Date:row.date,
      Note:row.dC_Note,
      Article: row.article ,
      
      Quantity: row.quantity ,
      Amount: row.amount,
      Remarks: row.remarks,
    
    }));

    this.service.exportAsExcelFile(filtered, 'DebitCreditExcelFile');

  }
  kickbackExcelFile(){
    const filtered = this.kickbackReport.map(row => ({
    Age:row.age,
    ContractNo: row.contractNo,
    Buyer: row.buyerName,
    Seller: row.sellerName ,
    Date: row.date,
    PONumber: row.poNumber,
    Article: row.articleName ,
    Rate: row.rate,
  Container : row.containerName,
   
      QtyUnit:row.uomName,
      Booking: row.booking ,
      Cost:row.cost,
      Dispatch: row.dispatch ,
      Balance: row.balanceQty ,
      SellerComm : row.sellerCommission,
      BuyerComm : row.buyerCommission, 
      Agent:row.agent,
      Status:row.status

    }));

    this.service.exportAsExcelFile(filtered, 'Contract Kickback Report');

  }

  openContractPdf() {

    let docDefinition = {
      pageSize: 'A4',
      info: {
        title: 'Open Contract List'
      },
      content: [
        {
          text: 'Open Contract List',
          style: 'heading',

        },
        {
          margin: [-20 , 5 , 0 , 0 ],
          table:{
            headerRows : 1,
            widths : [30, 40, 60, 60 , 30 , 23 , 40 , 25 , 30 , 35 , 37 , 35
            ],
            body:[
              [
                {text:'Age' , style:'tableHeader' }
              ,{text:'Contract#' , style:'tableHeader'} ,
              {text:'Buyer' , style:'tableHeader' }, 
              {text:'Seller' , style:'tableHeader' }, 

              {text:'Date'  , style:'tableHeader'} , 
              {text:'PO#' , style:'tableHeader'} , 
              {text:'Article' , style:'tableHeader'},
              
              {text:'Rate'  , style:'tableHeader'} , 
              {text:'Qty Unit' , style:'tableHeader'} , 
              {text:'Booking' , style:'tableHeader'},
              {text:'Dispatch'  , style:'tableHeader'} , 
              {text:'Balance' , style:'tableHeader'} , 
            ],
              ...this.rows.map(row => (
                [
                  {text: row.age , style:'tableHeader2'} ,
                {text:  row.contractNo , style:'tableHeader2'},
                {text: row.buyerName, style:'tableHeader2'} ,
                {text: row.sellerName , style:'tableHeader2'} ,
                 {text: row.date, style:'tableHeader2'} ,
                  {text:row.poNumber  , style:'tableHeader2' }  ,
                  {text: row.articleName , style:'tableHeader2'},
           
                 {text: row.rate + " " + row.rateUOMName, style:'tableHeader2'} ,
                  {text:row.uomName  , style:'tableHeader2' }  ,
                  {text: row.booking , style:'tableHeader2'},
              
                   {text:row.dispatch  , style:'tableHeader2' }  ,
                   {text:row.balanceQty  , style:'tableHeader2' }  ,
                ]
              ))
            ]
          }
        },
      ],
      styles: {
        heading: {
          fontSize: 13,
          alignment: 'center',
          margin: [0, 15, 0, 30]
        },
        tableHeader:{ fillColor: '#f3f3f4' , bold:true , margin:4 , alignment: 'center' ,fontSize: 7},
        tableHeader2:{   margin:3 , alignment: 'center' , fontSize: 6},
      }

    };
    pdfMake.createPdf(docDefinition).print();
  }

  agentBookingPdf() {

    let docDefinition = {
      pageSize: 'A4',
      info: {
        title: 'Agent Booking List'
      },
      content: [
        {
          text: 'Agent Booking List',
          style: 'heading',

        },
        {
          margin: [40 , 5 , 0 , 0 ],
          table:{
            headerRows : 1,
            widths : [70, 120, 120, 90 
            ],
            body:[
              [
                {text:'Agent' , style:'tableHeader' }
              ,{text:'Contracts' , style:'tableHeader'} ,
              {text:'Commission' , style:'tableHeader' }, 
              {text:'Quantity' , style:'tableHeader' }
            ],
              ...this.agentBookingStatus.map(row => (
                [
                  {text: row.agentName , style:'tableHeader2'} ,
                {text:  row.contracts , style:'tableHeader2'},
                {text: row.commission, style:'tableHeader2'} ,
                 {text: row.quantity, style:'tableHeader2'} ,
             
                ]
              ))
            ]
          }
        },
      ],
      styles: {
        heading: {
          fontSize: 13,
          alignment: 'center',
          margin: [0, 15, 0, 30]
        },
        tableHeader:{ fillColor: '#f3f3f4' , bold:true , margin:4 , alignment: 'center' ,fontSize: 8},
        tableHeader2:{   margin:3 , alignment: 'center' , fontSize: 7},
      }

    };
    pdfMake.createPdf(docDefinition).print();
  }
  // cancelContractPdf() {

  //   let docDefinition = {
  //     pageSize: 'A4',
  //     info: {
  //       title: 'Cancel Contract List'
  //     },
  //     content: [
  //       {
  //         text: 'Cancel Contract List',
  //         style: 'heading',

  //       },
  //       {
  //         margin: [-20 , 5 , 0 , 0 ],
  //         table:{
  //           headerRows : 1,
  //           widths : [30, 40, 60, 60 , 30 , 23 , 40 , 25, 30 , 30 , 35 , 37 , 35 , 30
  //           ],
  //           body:[
  //             [
  //               {text:'Age' , style:'tableHeader' }
  //             ,{text:'Contract#' , style:'tableHeader'} ,
  //             {text:'Buyer' , style:'tableHeader' }, 
  //             {text:'Seller' , style:'tableHeader' }, 

  //             {text:'Date'  , style:'tableHeader'} , 
  //             {text:'PO#' , style:'tableHeader'} , 
  //             {text:'Article' , style:'tableHeader'},
              
  //             {text:'Rate'  , style:'tableHeader'} , 
  //             {text:'Container'  , style:'tableHeader'} , 
  //             {text:'Qty Unit' , style:'tableHeader'} , 
  //             {text:'Booking' , style:'tableHeader'},
  //             {text:'Dispatch'  , style:'tableHeader'} , 
  //             {text:'Balance' , style:'tableHeader'} , 
  //             {text:'Cost' , style:'tableHeader'} , 
  //           ],
  //             ...this.rows.map(row => (
  //               [
  //                 {text: row.age , style:'tableHeader2'} ,
  //               {text:  row.contractNo , style:'tableHeader2'},
  //               {text: row.buyerName, style:'tableHeader2'} ,
  //               {text: row.sellerName , style:'tableHeader2'} ,
  //                {text: row.date, style:'tableHeader2'} ,
  //                 {text:row.poNumber  , style:'tableHeader2' }  ,
  //                 {text: row.articleName , style:'tableHeader2'},
           
  //                {text: row.rate + " " + row.rateUOMName, style:'tableHeader2'} ,
  //                {text:row.containerName  , style:'tableHeader'} ,
  //                 {text:row.uomName  , style:'tableHeader2' }  ,
  //                 {text: row.booking , style:'tableHeader2'},
              
  //                  {text:row.dispatch  , style:'tableHeader2' }  ,
  //                  {text:row.balanceQty  , style:'tableHeader2' }  ,
  //               ]
  //             ))
  //           ]
  //         }
  //       },
  //     ],
  //     styles: {
  //       heading: {
  //         fontSize: 13,
  //         alignment: 'center',
  //         margin: [0, 15, 0, 30]
  //       },
  //       tableHeader:{ fillColor: '#f3f3f4' , bold:true , margin:4 , alignment: 'center' ,fontSize: 7},
  //       tableHeader2:{   margin:3 , alignment: 'center' , fontSize: 6},
  //     }

  //   };
  //   pdfMake.createPdf(docDefinition).print();
  // }
  clickEvent(){
    this.status = !this.status;
}

}
