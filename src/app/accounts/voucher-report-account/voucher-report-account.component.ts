import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import { ServiceService } from '../../shared/service.service';
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { Dateformater } from '../../shared/dateformater';
import { NgForm } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GenericFilterForAllComponent } from 'src/app/shared/generic-filter-for-all/generic-filter-for-all.component';

pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-voucher-report-account',
  templateUrl: './voucher-report-account.component.html',
  styleUrls: ['./voucher-report-account.component.css']
})
export class VoucherReportAccountComponent implements OnInit {

  department:any={};
  data3: any = [];
  data4: any = [];
  columns: any = [];
  response: any;
  buyer: any = [];
  agentName:any=[];
  status: boolean = false;
  seller: any = [];
  article: any = [];
totalContract :  any;
totalQuantity :  any;
totalDispatch :  any;
search: any = [];
screenHeight:any;
screenWidth:any;
queryParems: any = {};
reportNameBreadCrums:any;
dateformater: Dateformater = new Dateformater();
  allContractReport :  any = []
  loggedInDepartmentName :  any;
  clearData: any;
  Filter :  any = []
  totalAAT:any;
  balanceAmount:any;
  totalReceivedAmount:any;
@ViewChild(NgForm) filterForm;
@ViewChild('myTable') table: any;
  constructor(   private route: ActivatedRoute,
    private http: HttpClient,
    private modalService: NgbModal,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private service: ServiceService,

    private router: Router,) {
      this.router.routeReuseStrategy.shouldReuseRoute = () => false; 
      let body = document.getElementsByTagName('body')[0];
    }

  ngOnInit(): void {
    this.queryParems = this.route.snapshot.queryParams;
    this.reportNameBreadCrums =this.queryParems.reportName;
    this.loggedInDepartmentName=localStorage.getItem('loggedInDepartmentName');
    this.getAllContractReport();
    this.GetDeparmentDropdown();
  }

  GetDeparmentDropdown() {
    this.service.getDepartment().subscribe(res => {
      this.response = res;
      if (this.response.success == true) {
        // this.response.data.splice(1, 1);
        // this.response.data.splice(9, 1);
        this.department = this.response.data;
        this.data3.departmentId = 3
      }
      else {
        this.toastr.error(this.response.message, 'Message.');
      }
    })
  }
  updateFilter(event) {
    const val = event.target.value.toLowerCase();
    const temp = this.Filter.filter(function (d) {
      return d.autoContractNumber.toLowerCase().indexOf(val) !== -1 ||
      d.billNumber.toLowerCase().indexOf(val) !== -1 ||
      d.voucherNumber.toLowerCase().indexOf(val) !== -1 || !val;
    });
    this.allContractReport = temp;
  }
  breadcrumbMethod(name){
    if(name =="Main Menu"){
      this.router.navigate(['/home'] );
    }
    else if(name =="Reports Menu"){
      this.router.navigate(['/reports-menu'] );
    }
  }
  clickEvent(){
    this.status = !this.status;
}
resetfilter(){
  this.getAllContractReport();
}
// adfilter(){
//   const modalRef = this.modalService.open(FilterSellerwisepaymentreportComponent, { centered: true ,size:'sm'});
//   // modalRef.componentInstance.statusCheck = check;
//         modalRef.result.then((data) => {
//        // on close
//         if(data !=null){
//           this.getAllContractReportFilter(data);
//       }
//      }, (reason) => {
//        // on dismiss
//      });
//  }
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

getagentname(id){
  this.service.getAgentName(id).subscribe(res => {
    this.response = res;
    if (this.response.success == true) {
      this.agentName = this.response.data;
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
Search(event) {
  const val = event.target.value.toLowerCase();
  const temp = this.search.filter(function (d) {
    return (d.autoContractNumber.toLowerCase().indexOf(val) !== -1 ||
    d.billNumber.toString().indexOf(val) !== -1 ||
    d.voucherNumber.toLowerCase().indexOf(val) !== -1 ||
    d.contractOwner.toLowerCase().indexOf(val) !==-1   ||
    !val);
  });
  this.allContractReport = temp;
}
clearfunction(){
  this.filterForm.reset();
}

filterPopUformGenericAll(menu) {
  const modalRef = this.modalService.open(GenericFilterForAllComponent, { centered: true,size:"lg" });
  modalRef.componentInstance.menu = menu;
  modalRef.componentInstance.departId = this.data3.departmentId;
  modalRef.result.then((p) => {
    if (p != null) {
  this.getAllContractReport234Filter(p)

    }
  }, (reason) => {
  });
}
departchange(){
  this.getAllContractReport()
}
getAllContractReport(){
  this.spinner.show();
  let year = new Date().getFullYear()
  let varr = {
    "buyerId":this.data3.buyerId ==undefined ? 0 :this.data3.buyerId,
    "sellerId":this.data3.sellerId == undefined?0 :this.data3.sellerId,
    "autoContractNumber":this.data3.autoContractNumber == undefined ? '': this.data3.autoContractNumber,
    "startDate":this.data3.startContractDate == undefined? 'null': this.dateformater.toModel(this.data3.startContractDate),
    "endDate":this.data3.endContractDate == undefined?'':this.dateformater.toModel(this.data3.endContractDate),
    "status" : "All",
    "billNumber" : 0,
    "voucherNumber" : '',
    "year" : year.toString(),
    "departmentId" : this.data3.departmentId != undefined ?this.data3.departmentId:3,
    // "agentId" : 3,
  }
  this.http.
    post(`${environment.apiUrl}/api/Reports/GetContractVoucherReport`, varr)
    .subscribe(
      res => {

        this.response = res;
        if (this.response.success == true  && this.response.data.length != 0) {
          this.toastr.success(this.response.message, 'Message.');
          this.allContractReport = this.response.data.objContractVoucher;

              this.totalReceivedAmount=Math.round(this.response.data.totalCommission);
              this.totalAAT =this.response.data.objContractVoucher.length;
              this.balanceAmount =this.response.data.balanceAmount;
     
          
          // this.totalContract = this.response.data.totalContract 
          // this.totalDispatch = this.response.data.totalDispatchAmount
          // this.totalQuantity = this.response.data.totalQuantity
          this.search = [...this.allContractReport]
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

getAllContractReport234Filter(p){
  this.spinner.show();
  // let varr = {
  //   "buyerId":this.data3.buyerId ==undefined ? 0 :this.data3.buyerId,
  //   "sellerId":this.data3.sellerId == undefined?0 :this.data3.sellerId,
  //   "autoContractNumber":this.data3.autoContractNumber == undefined ? 'null': this.data3.autoContractNumber,
  //   "startDate":this.data3.startContractDate == undefined? 'null': this.dateformater.toModel(this.data3.startContractDate),
  //   "endDate":this.data3.endContractDate == undefined?'':this.dateformater.toModel(this.data3.endContractDate),
  //   "status" : "All",
  //   "billNumber" : 0,
  //   "voucherNumber" : 'null',
  //   "year" : this.data4.year.toString(),
  //   "departmentId" : this.data4.departmentId,
  //   "agentId" : this.data4.agentName,
  // }
  this.http.
    post(`${environment.apiUrl}/api/Reports/GetContractVoucherReport`, p)
    .subscribe(
      res => {

        this.response = res;
        if (this.response.success == true  && this.response.data.length != 0) {
          this.toastr.success(this.response.message, 'Message.');
          this.allContractReport = this.response.data.objContractVoucher;

              this.totalReceivedAmount=Math.round(this.response.data.totalCommission);
              this.totalAAT =this.response.data.objContractVoucher.length;
              this.balanceAmount =this.response.data.balanceAmount;
     
          
          // this.totalContract = this.response.data.totalContract 
          // this.totalDispatch = this.response.data.totalDispatchAmount
          // this.totalQuantity = this.response.data.totalQuantity
          this.search = [...this.allContractReport]
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



getAllContractReport234(){
  this.spinner.show();
  let varr = {
    "buyerId":this.data3.buyerId ==undefined ? 0 :this.data3.buyerId,
    "sellerId":this.data3.sellerId == undefined?0 :this.data3.sellerId,
    "autoContractNumber":this.data3.autoContractNumber == undefined ? 'null': this.data3.autoContractNumber,
    "startDate":this.data3.startContractDate == undefined? 'null': this.dateformater.toModel(this.data3.startContractDate),
    "endDate":this.data3.endContractDate == undefined?'':this.dateformater.toModel(this.data3.endContractDate),
    "status" : "All",
     "billNumber" : 0,
    "voucherNumber" : '',
    "year" : this.data4.year.toString(),
    "departmentId" : this.data4.departmentId,
    "agentId" : this.data4.agentName,
  }
  this.http.
    post(`${environment.apiUrl}/api/Reports/GetContractVoucherReport`, varr)
    .subscribe(
      res => {

        this.response = res;
        if (this.response.success == true  && this.response.data.length != 0) {
          this.toastr.success(this.response.message, 'Message.');
          this.allContractReport = this.response.data.objContractVoucher;

              this.totalReceivedAmount=Math.round(this.response.data.totalCommission);
              this.totalAAT =this.response.data.objContractVoucher.length;
              this.balanceAmount =this.response.data.balanceAmount;
     
          
          // this.totalContract = this.response.data.totalContract 
          // this.totalDispatch = this.response.data.totalDispatchAmount
          // this.totalQuantity = this.response.data.totalQuantity
          this.search = [...this.allContractReport]
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
getAllContractReportFilter(filterdata){
  this.spinner.show();
  let varr = {
    "buyerId":filterdata.buyerId ,
    "sellerId":filterdata.sellerId,
    "autoContractNumber":filterdata.autoContractNumber,
    "startDate":filterdata.startContractDate,
    "endDate":filterdata.endContractDate,
    "status" : "All"

  }
  this.http.
    post(`${environment.apiUrl}/api/Reports/GetContractVoucherReport`, varr)
    .subscribe(
      res => {

        this.response = res;
        if (this.response.success == true  && this.response.data.length != 0) {
          this.toastr.success(this.response.message, 'Message.');
          this.allContractReport = this.response.data;

              this.totalReceivedAmount=Math.round(this.response.data.totalCommission);
              this.totalAAT =this.response.data.totalSaleInvoiceAmountAfterTax;
              this.balanceAmount =this.response.data.balanceAmount;
     
          
          // this.totalContract = this.response.data.totalContract 
          // this.totalDispatch = this.response.data.totalDispatchAmount
          // this.totalQuantity = this.response.data.totalQuantity
          this.search = [...this.allContractReport]
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

toggleExpandGroup(group) {
  console.log('Toggled Expand Group!', group);
  this.table.groupHeader.toggleExpandGroup(group);
} 
onDetailToggle(event) {
  console.log('Detail Toggled', event);
}
// .......................................................................



allContractExcelFile(){
  const filtered = this.allContractReport.map(row => ({
    ContractNo: row.autoContractNumber,

    BillNo: row.billNumber,
    BillDate: row.createdDate,
    VoucherNumber: row.voucherNumber ,
    ContractOwner: row.contractOwner ,
   
      Status :row.status,
    

  }));

  this.service.exportAsExcelFile(filtered, 'Contract Voucher Report');

}


allContractPdf() {

  let docDefinition = {
    pageSize: 'A4',
    pageOrientation: 'Landscape',
    info: {
      title: 'All Contract List'
    },
    content: [
      {
        text: 'All Contract List',
        style: 'heading',

      },
      {
        margin: [-30 , 5 , 0 , 0 ],
        table:{
          headerRows : 1,
          widths : [23, 35, 45, 45 , 30 , 23 , 40 , 25 , 30 , 35 , 37 , 35 , 30, 35 , 40 , 40 , 40, 40 
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
            {text:'Cost' , style:'tableHeader'},
            {text:'Seller Comm'  , style:'tableHeader'} , 
            {text:'Seller Comm Amount'  , style:'tableHeader'} , 
          
            {text:'Payment Term S|B'  , style:'tableHeader'} , 
            {text:'Status'  , style:'tableHeader'} , 
            {text:'Agent' , style:'tableHeader'} , 

          ],
            ...this.allContractReport.map(row => (
              [
                {text: row.age , style:'tableHeader2'} ,
              {text:  row.contractNo , style:'tableHeader2'},
              {text: row.buyerName, style:'tableHeader2'} ,
              {text: row.sellerName , style:'tableHeader2'} ,
               {text: row.date, style:'tableHeader2'} ,
                {text:row.poNumber  , style:'tableHeader2' }  ,
                {text: row.articleName , style:'tableHeader2'},
         
               {text: row.rate + "/" + row.rateUOMName, style:'tableHeader2'} ,
                {text:row.quantityUOMName  , style:'tableHeader2' }  ,
                {text: row.booking + " " + row.quantityUOMName , style:'tableHeader2'},
            
                 {text:row.dispatch + " " + row.quantityUOMName   , style:'tableHeader2' }  ,
                 {text:row.balanceQty + " " + row.quantityUOMName   , style:'tableHeader2' }  ,
                 {text: row.rateCurrencyName == 'PKR' ? "Rs." + row.cost : row.rateCurrencyName == 'USD' ? "$ " + row.cost : row.rateCurrencyName == 'EUR' ? "€ " + row.cost : row.rateCurrencyName == 'GBP' ? "GBP " + row.cost : row.cost, style:'tableHeader2'} ,
                 {text:row.sellerCommission != "" ? row.sellerCommission + "%" : ""   , style:'tableHeader2' }  ,
                 {text:   row.sellerCommissionAmount != '' ?   row.rateCurrencyName == 'PKR' ? "Rs." + "[" + row.sellerCommissionAmount + "]" : row.rateCurrencyName == 'USD' ? "$ " + "[" + row.sellerCommissionAmount + "]" : row.rateCurrencyName == 'EUR' ? "€ " + "[" + row.sellerCommissionAmount + "]" : row.rateCurrencyName == 'GBP' ? "GBP " + "[" + row.sellerCommissionAmount + "]" :  row.sellerCommissionAmount  : row.sellerCommissionAmount , style:'tableHeader2'} ,

                 //{text:row.buyerCommission != "" ? row.buyerCommission + "%" : ""   , style:'tableHeader2' }  ,
                 //{text: row.buyerCommissionAmount != '' ?  row.rateCurrencyName == 'PKR' ? "Rs." + "[" + row.buyerCommissionAmount + "]" : row.rateCurrencyName == 'USD' ? "$ " + "[" + row.buyerCommissionAmount + "]" : row.rateCurrencyName == 'EUR' ? "€ " + "[" + row.buyerCommissionAmount + "]" : row.rateCurrencyName == 'GBP' ? "GBP " + "[" + row.buyerCommissionAmount + "]" :  row.buyerCommissionAmount  :  row.buyerCommissionAmount  , style:'tableHeader2'} ,

                //  {text:   row.sellerCommission != "" ? row.sellerCommission + "%" +    row.rateCurrencyName == 'PKR' ? "Rs." + "["  + row.sellerCommissionAmount + "]" : row.rateCurrencyName == 'USD' ? "$ " + "["  + row.sellerCommissionAmount + "]" : row.rateCurrencyName == 'EUR' ? "€ " + "["  + row.sellerCommissionAmount + "]" : row.rateCurrencyName == 'GBP' ? "GBP "+ "["  + row.sellerCommissionAmount + "]": row.cost : row.sellerCommission , style:'tableHeader2' }  ,
                //  {text:   row.buyerCommission != "" ? row.buyerCommission + "%" +    row.rateCurrencyName == 'PKR' ? "Rs." + "["  + row.buyerCommissionAmount + "]" : row.rateCurrencyName == 'USD' ? "$ " + "["  + row.buyerCommissionAmount + "]" : row.rateCurrencyName == 'EUR' ? "€ " + "["  + row.buyerCommissionAmount + "]" : row.rateCurrencyName == 'GBP' ? "GBP "+ "["  + row.buyerCommissionAmount + "]": row.cost : row.buyerCommission , style:'tableHeader2' } 
                 
                 
                 {text: row.paymentTerm , style:'tableHeader2'},
                 {text: row.status , style:'tableHeader2'},
                 {text: row.agent , style:'tableHeader2'},


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
}
