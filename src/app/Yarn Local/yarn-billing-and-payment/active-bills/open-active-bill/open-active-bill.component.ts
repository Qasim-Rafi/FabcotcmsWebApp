import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ServiceService } from 'src/app/shared/service.service';
import { environment } from 'src/environments/environment';
import { ChangeBankAccountComponent } from './change-bank-account/change-bank-account.component';
import pdfMake from "pdfmake/build/pdfmake";
import { ToWords } from 'to-words';
import {NgxSpinnerModule, NgxSpinnerService} from 'ngx-spinner'
import { NgxNumToWordsService, SUPPORTED_LANGUAGE } from 'ngx-num-to-words';
@Component({
  selector: 'app-open-active-bill',
  templateUrl: './open-active-bill.component.html',
  styleUrls: ['./open-active-bill.component.css']
})
export class OpenActiveBillComponent implements OnInit {
  queryParems: any = {};
  bill_id: any = {};
  response: any;
  data: any = {};
  rows: any = {};
  date: number;
  myDate = Date.now();
  words : string;
  words2 : string = "word";
  totalAmount = 0;
  totalAmount1 : any;
  totalAmount2 : number;
  image : any;
  image2 : any;
  totalQuantity = 0 ;
  selectedids: any ={};

  quantity : any;
  numberInWords!: string;
  nmbr = [];
  printData: any = []
id : any;
lang : SUPPORTED_LANGUAGE = 'en';
  constructor(   private route: ActivatedRoute,
    private modalService: NgbModal,
    private http: HttpClient,
    private service: ServiceService,
    private toastr: ToastrService,
    private spinner:NgxSpinnerService,
    private ngxNumToWordsService: NgxNumToWordsService
    ) { }

  ngOnInit(): void {
    this.http.get('/assets/fabcot.png', { responseType: 'blob' })
    .subscribe(res => {
      const reader = new FileReader();
      reader.onloadend = () => {
        var base64data = reader.result;                
            console.log(base64data);
            this.image2 = base64data;
      }
 
      reader.readAsDataURL(res); 
      console.log(res);
      this.image = res;
     
    });
    this.queryParems = this.route.snapshot.queryParams;
    
    this.bill_id = this.queryParems.id;
this.printBill();
    // this.fetch((data) => {
    //   this.rows = data;
  
    // });
  }
 

// fetch(cb) {
//   this.spinner.show();
//   this.totalAmount = 0
//   this.totalAmount1 = 0
//   this.totalQuantity = 0
//   this.http
//   .get(`${environment.apiUrl}/api/BillingPayments/GetContractBillById/` + this.bill_id)
//   .subscribe(res => {
//     this.response = res;
   
//   if(this.response.success==true)
//   {
//   this.data =this.response.data;

//   this.spinner.hide();

//   this.words = this.ngxNumToWordsService.inWords(this.data['totalCalculation'], this.lang);



//   cb(this.data);
//   this.spinner.hide();
//   }
//   else{
//     this.toastr.error(this.response.message, 'Message.');
//  this.spinner.hide();
//   }
//   }, err => {
//     if ( err.status == 400) {
// this.toastr.error(err.error.message, 'Message.');
// this.spinner.hide();      
// }
//   });
// }

  ChangeBankForm(rows) {
    const modalRef = this.modalService.open(ChangeBankAccountComponent , { centered: true });
    modalRef.componentInstance.bill_id = rows.billPaymentId;

    modalRef.result.then((data) => {
      // on close
    
      
      if (data == true) {
        this.date = this.myDate;
        // this.getBuyers();

      }
    }, (reason) => {
      // on dismiss
    });
  }

printBill(){
  let varr = {
    "ids":this.bill_id
  }
this.spinner.show();
  
  this.http.
    post(`${environment.apiUrl}/api/BillingPayments/BulkPrint`, varr)
    .subscribe(
      res => {

        this.response = res;
        if (this.response.success == true) {
  this.printData=this.response.data[0];
    this.printData.accountName = this.ngxNumToWordsService.inWords(this.printData.totalCalculation, this.lang);
    this.toastr.success(this.response.message, 'Message.');
    
    this.spinner.hide();

        }
        else {
          this.toastr.error(this.response.message, 'Message.');
          this.spinner.hide();

        }

      }, (err: HttpErrorResponse) => {
        const messages = this.service.extractErrorMessagesFromErrorResponse(err);
        this.toastr.error(messages.toString(), 'Message.');
        console.log(messages);
        this.spinner.hide();

      });
}

print(rows){

  let docDefinition = {
    pageSize: 'A4',
    pageMargins: [ 20, 30, 30, 10 ],
    pageOrientation: 'letter',
      
          info: {
            title: 'Bill generated'
          },
          content: [
            {
              "image" : this.image2,
             fit : [140 , 140]
          
            },
            {
           
              text:'FABCOT INTERNATIONAL' , style:'heading' , margin: [0,-30,0,0]
           
            },
            {
              margin: [0 , 10 , 0 , 0],
              layout:'noBorders',
              table:{headerRows: 1 , widths:['100%'],
            body: [
              [{text:'Commission Bill' , style:'headingC'}],] }
            },
            {
              layout:'noBorders',
             
              table:{headerRows:1 ,  widths:['18%' , '67%' , '5%' , '12%'],
            body:[ [
              {text: 'Seller :' , margin: [20 , 30 , 0 , 0] , bold:true , style:'common' } , {text: this.printData['sellerName'] ,  margin: [-43 , 30 , 0 , 0] , style:'common'},
            {text:'Bill # :' , margin: [0 , 30 , 0 , 0] , bold:true , style:'common'} ,{text:this.printData['billNumber'] , margin: [0 , 30 , 0 , 0] , style:'common'}
          
          ]]
            }
            },
            {
              
              layout:'noBorders',
              table:{headerRows:1 ,  widths:['18%' , '65%' , '10%' , '15%'],
            body:[ [{text: 'Buyer :' , margin: [20 , 4 , 0 , 0] , bold:true , style:'common'} , {text: this.printData['buyerName'] , margin: [-43 , 4 , 0 , 0] , bold:true  , style:'common'},
            {text:'Bill Date :' , margin: [0 , 4 , 0 , 0] , bold:true , style:'common'} ,{text:this.printData['billDate'] , margin: [-20 , 4 , 0 , 0] , bold:true  , style:'common' }
          
          ]]
            }
            },
            {
             

              layout:'noBorders',
              table:{headerRows:1 ,  widths:['20%' , '80%' ],
            body:[ [{text: 'Fabcot Contract# :' , margin: [20 , 4 , 0 , 0] , bold:true , style:'common'} , {text: this.printData['contractNumber'] , margin: [-12 , 4 , 0 , 0]  , bold:true  , decoration:'underline' , style:'common'}
          
          ]]
            }
            },
            {
             

              layout:'noBorders',
              table:{headerRows:1 ,  widths:['20%' , '80%' ],
            body:[ [{text: 'Supplier Contract# :' , margin: [20 , 4 , 0 , 0] , bold:true , style:'common'} , {text: this.printData['supplierContractNumber'] , margin: [-10 , 4 , 0 , 0]  , bold:true  , decoration:'underline' , style:'common'}
          
          ]]
            }
            },
            {
            

              layout:'noBorders',
              table:{headerRows:1 ,  widths:['20%' , '80%' ],
            body:[ [{text: 'Contract Date :' , margin: [20 , 4 , 0 , 0] , bold:true  , style:'common'} , {text: this.printData['contractDate'] , margin: [-25 , 4 , 0 , 0] , bold:true , decoration:'underline' , style:'common' }
          
          ]]
            }
            },

            {
            

              layout:'noBorders',
              table:{headerRows:1 ,  widths:['20%' , '80%' ],
            body:[ [{text: 'Article :' , margin: [20 , 4 , 0 , 0] , bold:true  , style:'common'} , {text: this.printData['contractArticleName'] , margin: [-55 , 4 , 0 , 0] , bold:true , decoration:'underline' , style:'common' }
          
          ]]
            }
            },
            {
             

              layout:'noBorders',
              table:{headerRows:1 ,  widths:['80%' ],
            body:[ [{text: 'This refers to our contract for Weaving dispatches. Please make commission cheque in favour of M/S FABCOT INTERNATIONAL and oblige.' , margin: [20 , 10 , 0 , 0]  , style:'common'} 
          
          ]]
            }
            },
            {
             

              layout:'noBorders',
              table:{headerRows:1 ,  widths:['100%' ],
            body:[ [{text: 'Detail as under' , margin: [20 , 0 , 0 , 0]  , style:'common'} 
          
          ]]
            }
            },

            {
              margin: [0 , 20 , 0 , 0 ],
              table:{
                headerRows : 1,
                widths : [ '15%' , '15%' , '20%' , '10%' , '15%'  , '12%' , '18%'],
                body:[

                  [
                    // {text:'Description' , style:'tableHeader' },
                    {text:'Sale Invoice#' , style:'tableHeader' }
                  ,{text:'Sale Invoice Date' , style:'tableHeader'} ,
                  {text:'Quantity' , style:'tableHeader' }, 
                  {text:'Rate'  +'(' + this.printData.currencyName+')' , style:'tableHeader' }, 

                  {text:'Inv Amount' +'(' + this.printData.currencyName+')'  , style:'tableHeader'} , 
                  {text:'Commission' , style:'tableHeader'} , 
                  // {text:'TAX' , style:'tableHeader' }, 

                  {text:'Amount' +'(' + this.rows.currencyName+')' , style:'tableHeader'}],
                  
                  ...this.printData['contractSaleInvoices'].map(row => (
                    [
                      // {text: row.description , style:'tableHeader2'} ,

                      {text: row.saleInvoiceNo , style:'tableHeader2'} ,
                    {text:  row.saleInvoiceDateToDisplay , style:'tableHeader2'},
                    {text:  row.quantity + " " + row.quanityUOM  , style:'tableHeader2'} ,
                    {text: row.rate , style:'tableHeader2'} ,
                    
                     {text: row.amount
                         , style:'tableHeader2'} ,
                      {text:row.commission+ ' ' + row.commissionUnit  , style:'tableHeader2' }  ,
                    // {text: row.taxAmount , style:'tableHeader2'} ,

                      {text: row.billAmount , style:'tableHeader2'}]
                  ))
                ]
              }
            },

          {
            layout:'noBorders',
            table:{headerRows:1 ,  widths:['10%' , '20%' ,  '25%' , '25%' ],
          body:[ [
            {text: 'Quantity :' , margin:[0 , 30,0,0] , bold:true , style:'common' } ,
           {text: this.printData['quantitySum']  ,margin:[-10 , 30,0,0] , bold:true , style:'common' },
            {text: 'Invoice Amount' + ' (' + this.printData['currencyName'] +   '):'  , margin:[0,30,0,0]  , bold:true , style:'common' } ,
           {text:  this.printData['amountsum']  , margin:[-35,30,0,0] ,  bold:true , style:'common'}
        
        ]]
          }
          },

            {
              layout:'noBorders',
              table:{headerRows:1 ,  widths:['20%' , '50%' ,  '30%' , '10%' ],
            body:[ [
              {text: 'Amount in Words :' , margin:[0 , 20,0,0] , bold:true , style:'common' } ,
             {text: this.printData['accountName'] ,margin:[-30 , 20,0,0] , bold:true , decoration:'underline' , style:'common' },
              {text: 'Sub Total :' , margin:[50,20,0,0]  , bold:true , style:'common' } ,
             {text:   this.printData['currencyName']+ ' ' + this.printData['totalCalculation']  , margin:[-60,20,0,0] , decoration:'underline'  , style:'common'}
          
          ]]
            }
            },
            {
              layout:'noBorders',
              table:{headerRows:1 ,  widths:['90%' , '10%'  ],
            body:[ [
              {text: 'TAX:' , margin:[455 , 5,0,0] , bold:true , style:'common' } ,
             {text: "0.00" ,margin:[0 , 5,0,0] , decoration:'underline' , style:'common' },
         
          
          ]]
            }
            },
            {
              layout:'noBorders',
              table:{headerRows:1 ,  widths:['90%' , '10%'  ],
            body:[ [
              {text: 'Total:' , margin:[455 , 5,0,0] , bold:true , style:'common' } ,
             {text: this.printData['currencyName']+ ' '+  this.printData['totalCalculation'],margin:[-10 , 5,0,0]  , decoration:'underline' , bold:true , style:'common' },
         
          
          ]]
            }
            },
            {
              layout:'noBorders',
              table:{headerRows:1 ,  widths:['100%'   ],
            body:[ [
              {text: 'Your prompt action in this regard would be highly appreciated' , margin:[0 , 50,0,0]  , style:'common' } ,
          ]]
            }
            },
            {
              layout:'noBorders',
              table:{headerRows:1 ,  widths:['100%'   ],
            body:[ [
              {text: 'Thanking You' , margin:[0 , 5,0,0]  , style:'common' } ,
          ]]
            }
            },
            {
              layout:'noBorders',
              table:{headerRows:1 ,  widths:['20%' , '40%' ,  '30%' , '10%' ],
            body:[ [
              {text: 'Checked By:' , margin:[0 , 20,0,0] , style:'common' } ,
             {text: ' ------------------------------' ,margin:[-60 , 20,0,0]  , style:'common' },
              {text: 'Aurthorized Signatory:' , margin:[60,20,0,0]  , style:'common' } ,
             {text:   '  --------------------------'  , margin:[-15,20,0,0]  , style:'common'}
          
          ]]
            }
            },

          ],
          styles:{
           heading:{fontSize: 18 ,
            bold: true, alignment: 'center',   },
            headingC:{fontSize: 12 ,
              alignment: 'center',   },
            common:{fontSize:9},
            heading2:{fontSize: 9,
            bold: true, alignment: 'center' },
            tableHeader:{ fillColor: '#f3f3f4' , bold:true , margin:4 , alignment: 'center' ,fontSize: 8},
            tableHeader2:{   margin:3 , alignment: 'center' , fontSize: 8},

          },

  };
  pdfMake.createPdf(docDefinition).print();
}


}
