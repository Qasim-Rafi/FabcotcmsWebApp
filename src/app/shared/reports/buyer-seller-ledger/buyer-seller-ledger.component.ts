import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
// import { ServiceService } from '../shared/service.service';
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
// import { Dateformater } from '../shared/dateformater';
import { NgForm } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ServiceService } from '../../service.service';
import { Dateformater } from '../../dateformater';
// import { parse } from 'path';

pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-buyer-seller-ledger',
  templateUrl: './buyer-seller-ledger.component.html',
  styleUrls: ['./buyer-seller-ledger.component.css']
})
export class BuyerSellerLedgerComponent implements OnInit {
  clearData: any;
  departName:any;
sellerdrop:any=[]
datafiltercontractpopover:any={};
  data3: any = [];
  columns: any = [];
  response: any;
  buyer: any = [];
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
  department:any=[]
  Filter :  any = []
  loggedInDepartmentName :  any;

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
      let body = document.getElementsByTagName('body')[0];
      body.classList.add('sidebar-collapse'); 
    }

  ngOnInit(): void {
    // this.GetDeapartmentDropdown();
    this.queryParems = this.route.snapshot.queryParams;
    this.reportNameBreadCrums =this.queryParems.reportName;
    this.loggedInDepartmentName=localStorage.getItem('loggedInDepartmentName');
    this.getsellerslookup();
    this.getAllContractReport();
    let departmentIdFromAdmin=localStorage.getItem('loggedInDepartmentId');
    let named=localStorage.getItem('departName');

     this.departName =named;
  }
  GetDeapartmentDropdown() {
    this.service.getDepartments().subscribe(res => {
      this.response = res;
      if (this.response.success == true) {
        this.department = this.response.data;
      }
      else {
        this.toastr.error(this.response.message, 'Message.');
      }
    })
  }
  getfilterdata(){

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
updateFilter(event) {
  const val = event.target.value.toLowerCase();
  const temp = this.Filter.filter(function (d) {
    return d.restaurnatDishName.toLowerCase().indexOf(val) !== -1 || !val;
  });
  this.allContractReport = temp;
}
adfilter(){
  // const modalRef = this.modalService.open(FilterSellerwisepaymentreportComponent, { centered: true ,size:'sm'});
  // // modalRef.componentInstance.statusCheck = check;
  //       modalRef.result.then((data) => {
  //      // on close
  //       if(data !=null){
  //         this.getAllContractReportFilter(data);
  //     }
  //    }, (reason) => {
  //      // on dismiss
  //    });
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
Search(event) {
  const val = event.target.value.toLowerCase();
  const temp = this.search.filter(function (d) {
    return (d.contractNo.toLowerCase().indexOf(val) !== -1 
    || d.manualContractNumber.toLowerCase().indexOf(val) !==-1   ||
    d.status.toLowerCase().indexOf(val) !==-1   ||
    !val);
  });
  this.allContractReport = temp;
}
clearfunction(){
  this.filterForm.reset();
}
getsellerslookup(){
  let departmentIdFromAdmin=localStorage.getItem('loggedInDepartmentId');
  this.http.
    get(`${environment.apiUrl}/api/Lookups/Sellers/`+departmentIdFromAdmin)
    .subscribe(
      res => {

        this.response = res;
        if (this.response.success == true  && this.response.data.length != 0) {
          this.sellerdrop = this.response.data;

        }
        else if(this.response.data.obj.length == 0) {
          this.toastr.error("No such sellers Exist", 'Message.');
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
loaddataforpopover(row){
  row
  let data= this.allContractReport.filter(x=>x.contractId == row.contractId);
  if(data[0].totalReceived == null || data[0].totalReceived ==""){
    data[0].balanceAmount = data[0].totalAmount - data[0].totalReceived;
  this.datafiltercontractpopover =data[0]
}
else{
  data[0].balanceAmount = data[0].totalAmount - data[0].totalReceived;
  let paid  = data[0].totalAmount * (1 / 99);
  let taxcal  = data[0].totalAmount - paid;
  data[0].totalReceived=paid
  data[0].texchalan=taxcal
  this.datafiltercontractpopover =data[0]
}
}
getAllContractReport(){
  this.spinner.show();
  let departmentIdFromAdmin=localStorage.getItem('loggedInDepartmentId');
  let named=localStorage.getItem('departName');

  this.departName =named;
     
  let varr = {
    "buyerId":this.data3.buyerId ==undefined ? 0 :this.data3.buyerId,
    "sellerId":this.data3.sellerId == undefined?0 :this.data3.sellerId,
    "autoContractNumber":this.data3.autoContractNumber == undefined ? '': this.data3.autoContractNumber,
    "startContractDate":this.data3.startContractDate == undefined? '': this.dateformater.toModel(this.data3.startContractDate),
    "endContractDate":this.data3.endContractDate == undefined?'':this.dateformater.toModel(this.data3.endContractDate),
    "status" : "All",
    "departmentId" : departmentIdFromAdmin,
    "paid":this.data3.paid == undefined ? false : this.data3.paid 
    
  }
  this.http.
    post(`${environment.apiUrl}/api/Contracts/GetSellerPaymentDetailsSellerWise`, varr)
    .subscribe(
      res => {

        this.response = res;
        if (this.response.success == true  && this.response.data.length != 0) {
          this.toastr.success(this.response.message, 'Message.');
          this.allContractReport = this.response.data.list;
          this.Filter = this.response.data.list;
                  //this.sellerdrop=this.response.data.list;      
          //         this.sellerdrop = this.sellerdrop.filter((el, i, a) => i === a.indexOf(el))  
          // this.sellerdrop = this.sellerdrop.filter((test, index, array) =>
          //   index === array.findIndex((findTest) =>
          //     findTest.sellerName === test.sellerName
          //   )
          // ); 
              this.totalReceivedAmount=this.response.data.totalReceivedAmount;
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

getAllContractReportFilter(filterdata){
  this.spinner.show();
  let departmentIdFromAdmin=localStorage.getItem('loggedInDepartmentId');
  let d= this.department.filter(x=>x.id == departmentIdFromAdmin);
    this.departName =d[0].name;
  let varr = {
    "buyerId":this.data3.buyerId ==undefined ? 0 :this.data3.buyerId,
    "sellerId":this.data3.sellerId == undefined?0 :this.data3.sellerId,
    "autoContractNumber":this.data3.autoContractNumber == undefined ? '': this.data3.autoContractNumber,
    "startContractDate":this.data3.startContractDate == undefined? '': this.dateformater.toModel(this.data3.startContractDate),
    "endContractDate":this.data3.endContractDate == undefined?'':this.dateformater.toModel(this.data3.endContractDate),
    "status" : "All",
    "departmentId" : departmentIdFromAdmin
  }
  this.http.
    post(`${environment.apiUrl}/api/Contracts/GetSellerPaymentDetailsSellerWise`, filterdata)
    .subscribe(
      res => {

        this.response = res;
        if (this.response.success == true  && this.response.data.length != 0) {
          this.toastr.success(this.response.message, 'Message.');
          this.allContractReport = this.response.data.list;

              this.totalReceivedAmount=this.response.data.totalReceivedAmount;
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


trackTotal(sumdata){
  let total = 0
    for (let i = 0; i < sumdata.value.length; i++) {
      if(sumdata.value[i].saleInvoiceAmount != "" && sumdata.value[i].saleInvoiceAmount != null){
        total += parseFloat(sumdata.value[i].saleInvoiceAmount) - parseFloat(sumdata.value[i].receivedAmount);
      }
      }
    return total ==0? "":total

}
contractDetails(row) {
  // const modalRef = this.modalService.open(SellerWisePaymentReportDetailsComponent, {
  //   centered: true,
  //   // size: 'lg',
  // });
  // modalRef.componentInstance.rowData = row;
  // modalRef.result.then(
  //   (data) => {
  //     // on close
  //     if (data == true) {
  //     }
  //   },
  //   (reason) => {
  //     // on dismiss
  //   }
  // );
}
// .......................................................................



allContractExcelFile(){
  const filtered = this.allContractReport.map(row => ({
  Age:row.age,
  ContractNo: row.contractNo,
  Buyer: row.buyerName,
  Seller: row.sellerName ,
  Date: row.date,
  PONumber: row.poNumber,
  Article: row.articleName ,
  Rate: row.rate + row.rateUOMName ,
   

    Quantity: row.balanceQty,
    QtyUOM:row.uomName,
    Booking: row.booking ,
    
    Dispatch: row.dispatch ,
    Balance: row.balanceQty ,
    Cost: row.cost ,
    SellerComm: row.sellerCommission ,
    SellerCommAmount: row.sellerCommissionAmount ,
    BuyerComm: row.buyerCommission ,
    BuyerCommAmount: row.buyerCommissionAmount ,
    PaymentTermSellerBuyer : row.paymentTerm ,
    Status :row.status,
    Agent : row.agent ,

    

  }));

  this.service.exportAsExcelFile(filtered, 'All Contract Report');

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
