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

pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-buyer-seller-ledger',
  templateUrl: './buyer-seller-ledger.component.html',
  styleUrls: ['./buyer-seller-ledger.component.css']
})
export class BuyerSellerLedgerComponent implements OnInit {

  isbuyer:boolean=false;
  isseller:boolean=false;
  data4:any =[];
  buyerName:any;
  sellerName:any;
  bags:any;
  outstanding:any;
  buyerlookup:any =[];
  sellerlookup:any =[];
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
    let footer = document.getElementsByTagName('footer')[0];
    footer.classList.add('d-none'); 
    }

  ngOnInit(): void {
    this.queryParems = this.route.snapshot.queryParams;
    this.reportNameBreadCrums =this.queryParems.reportName;
    this.loggedInDepartmentName=localStorage.getItem('loggedInDepartmentName');
    this.getAllContractReport();
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
    return (d.autoContractNumber.toLowerCase().indexOf(val) !== -1 
    || d.buyerName.toLowerCase().indexOf(val) !==-1   ||
    d.sellerName.toLowerCase().indexOf(val) !==-1   ||
    !val);
  });
  this.allContractReport = temp;
}
clearfunction(){
  this.filterForm.reset();
}


getAllContractReport(){
  this.spinner.show();
  let varr = {
    "buyerId":this.data3.buyerId ==undefined ? 0 :this.data3.buyerId,
    "sellerId":this.data3.sellerId == undefined?0 :this.data3.sellerId,
    "autoContractNumber":this.data3.autoContractNumber == undefined ? '': this.data3.autoContractNumber,
    "startContractDate":this.data3.startContractDate == undefined? '': this.dateformater.toModel(this.data3.startContractDate),
    "endContractDate":this.data3.endContractDate == undefined?'':this.dateformater.toModel(this.data3.endContractDate),
    "status" : "All"

  }
  this.http.
    post(`${environment.apiUrl}/api/Contracts/GetSellerPaymentDetailsSellerWise`, varr)
    .subscribe(
      res => {

        this.response = res;
        if (this.response.success == true  && this.response.data.length != 0) {
          this.toastr.success(this.response.message, 'Message.');
          this.allContractReport = this.response.data.list;


          this.buyerlookup = this.response.data.list;
          this.sellerlookup = this.response.data.list;

          this.sellerlookup = this.removeDuplicates(this.sellerlookup, "sellerName")
          this.buyerlookup = this.removeDuplicates(this.buyerlookup, "buyerName")

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
removeDuplicates(myArray, Prop) {
  return myArray.filter((obj, pos, arr) => {
    return arr.map(mapObj => mapObj[Prop]).indexOf(obj[Prop]) === pos;
  });
}
changeseller(sellerid,name){
  if(sellerid == undefined){
    this.sellerName =null;
    this.allContractReport =this.response.data.list;
  }
  else{
   let name =this.response.data.list.filter(x=>x.sellerId == sellerid);
        this.sellerName =name[0].sellerName;
    this.isseller =true;
      this.allContractReport=this.response.data.list.filter(x=>x.sellerId == sellerid);
      this.allContractReport =   this.allContractReport.filter((v,i) =>  this.allContractReport.findIndex(item => item.buyerId == v.buyerId) === i);
      this.outstanding=this.allContractReport .reduce((n, {saleInvoiceAmount}) => n + parseFloat(saleInvoiceAmount) ,0)
      this.bags=this.allContractReport .reduce((n, {quantity}) => n + quantity, 0)
  }

}
changesbuyer(buyerid,name){
  if(buyerid == undefined){
    this.buyerName =null;
    this.allContractReport =this.response.data.list;

  }
  else{
  this.isbuyer =true;
  let name =this.response.data.list.filter(x=>x.buyerId == buyerid);
  this.buyerName =name[0].buyerName;
  this.allContractReport=this.response.data.list.filter(x=>x.buyerId == buyerid);
  this.allContractReport =   this.allContractReport.filter((v,i) =>  this.allContractReport.findIndex(item => item.sellerId == v.sellerId) === i);

  this.outstanding=this.allContractReport .reduce((n, {saleInvoiceAmount}) => n + parseFloat(saleInvoiceAmount) ,0)
  this.bags=this.allContractReport .reduce((n, {quantity}) => n + quantity, 0)
  }


  if(this.data4.sellerId != undefined){
    this.allContractReport=this.response.data.list.filter(x=>x.buyerId == buyerid && x.sellerId == this.data4.sellerId );

    this.outstanding=this.allContractReport .reduce((n, {saleInvoiceAmount}) => n + parseFloat(saleInvoiceAmount) ,0)
    this.bags=this.allContractReport .reduce((n, {quantity}) => n + quantity, 0)
  }



}
getAllContractReportFilter(filterdata){
  this.spinner.show();
  let varr = {
    "buyerId":this.data3.buyerId ==undefined ? 0 :this.data3.buyerId,
    "sellerId":this.data3.sellerId == undefined?0 :this.data3.sellerId,
    "autoContractNumber":this.data3.autoContractNumber == undefined ? '': this.data3.autoContractNumber,
    "startContractDate":this.data3.startContractDate == undefined? 'null': this.dateformater.toModel(this.data3.startContractDate),
    "endContractDate":this.data3.endContractDate == undefined?'null':this.dateformater.toModel(this.data3.endContractDate),
    "status" : "All"

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
// .......................................................................



allContractExcelFile(){
  const filtered = this.allContractReport.map(row => ({
  ContractNo: row.autoContractNumber,
  Buyer: row.buyerName,
  Seller: row.sellerName ,
  InvoiceDate: row.saleInvoiceDateToDisplay,
  InvoiceNo: row.saleInvoiceNo,
  Bags: row.quantity +' '+ row.uom ,
  Payable: row.saleInvoiceAmount  ,
  Paid: row.receivedAmount,
  Outstanding:(row.saleInvoiceAmount - row.receivedAmount),
  Ageing: row.ageing ,
  }));

  this.service.exportAsExcelFile(filtered, 'Buyer Seller Ledger Report');
}

allContractPdf() {

  let docDefinition = {
    pageSize: 'A4',
    pageOrientation: 'Landscape',
    info: {
      title: 'Buyer Seller Ledger Report'
    },
    content: [
      {
        text: 'Buyer Seller Ledger Report',
        style: 'heading',

      },
      {
        margin: [-30 , 5 , 0 , 0 ],
        table:{
          headerRows : 1,
          widths : [40, 130, 130, 60 , 50 , 60 , 60 , 60 , 60 , 60  
          ],
          body:[
            [
            {text:'Contract#' , style:'tableHeader'} ,
            {text:'Buyer' , style:'tableHeader' }, 
            {text:'Seller' , style:'tableHeader' }, 

            {text:'InvoiceDate'  , style:'tableHeader'} , 
            {text:'Invoice#' , style:'tableHeader'} , 
            {text:'Bags' , style:'tableHeader'},
            
            {text:'Payable'  , style:'tableHeader'} , 
            {text:'Paid' , style:'tableHeader'} , 
            {text:'Outstanding' , style:'tableHeader'},
            {text:'Ageing'  , style:'tableHeader'} , 

          ],
            ...this.allContractReport.map(row => (
              [
                {text: row.autoContractNumber , style:'tableHeader2'} ,
              {text:  row.buyerName , style:'tableHeader2'},
              {text: row.sellerName, style:'tableHeader2'} ,
              {text: row.saleInvoiceDateToDisplay , style:'tableHeader2'} ,
               {text: row.saleInvoiceNo, style:'tableHeader2'} ,
                {text:row.quantity +' '+ row.uom , style:'tableHeader2' }  ,
                {text: row.saleInvoiceAmount , style:'tableHeader2'},
                {text: row.receivedAmount , style:'tableHeader2'},
         
               {text: (row.saleInvoiceAmount - row.receivedAmount), style:'tableHeader2'} ,
                {text:row.ageing  , style:'tableHeader2' }  ,

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
