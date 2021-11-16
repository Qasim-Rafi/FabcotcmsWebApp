import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import { ServiceService } from '../../service.service';
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts.pdfMake.vfs;
@Component({
  selector: 'app-all-contract-report',
  templateUrl: './all-contract-report.component.html',
  styleUrls: ['./all-contract-report.component.css']
})
export class AllContractReportComponent implements OnInit {
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

  allContractReport :  any = []
  constructor(   private route: ActivatedRoute,
    private http: HttpClient,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private service: ServiceService,

    private router: Router,) { }

  ngOnInit(): void {
    this.getAllContractReport();
    this.GetBuyersDropdown();
    this.GetSellersDropdown();
    this.GetArticleDropdown();
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


  getAllContractReport(){
    this.spinner.show();
    let varr = {
      "buyerId":this.data3.buyerId ==undefined ? 0 :this.data3.buyerId,
      "sellerId":this.data3.sellerId == undefined?0 :this.data3.sellerId,
      "autoContractNumber":this.data3.autoContractNumber == undefined ? '': this.data3.autoContractNumber,
      "startContractDate":this.data3.startContractDate == undefined? '': this.data3.startContractDate,
      "endContractDate":this.data3.endContractDate == undefined?'':this.data3.endContractDate,
      "status" : "All"
    }
    this.http.
      post(`${environment.apiUrl}/api/Reports/ContractReport`, varr)
      .subscribe(
        res => {

          this.response = res;
          if (this.response.success == true  && this.response.data.obj.length != 0) {
            this.toastr.success(this.response.message, 'Message.');
            this.allContractReport = this.response.data.obj;
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
      

    }));

    this.service.exportAsExcelFile(filtered, 'All Contract Report');

  }

  allContractPdf() {

    let docDefinition = {
      pageSize: 'A4',
      info: {
        title: 'All Contract List'
      },
      content: [
        {
          text: 'All Contract List',
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
              ...this.allContractReport.map(row => (
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

  clickEvent(){
    this.status = !this.status;
}
}