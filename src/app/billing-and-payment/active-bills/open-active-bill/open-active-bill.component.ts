import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ServiceService } from 'src/app/shared/service.service';
import { environment } from 'src/environments/environment';
import { ChangeBankAccountComponent } from './change-bank-account/change-bank-account.component';
import pdfMake from "pdfmake/build/pdfmake";
import { ToWords } from 'to-words';
import {NgxSpinnerService} from 'ngx-spinner'
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
  totalAmount = 0;
  totalAmount1 : any;
  totalAmount2 : number;



  myDate = Date.now();
  words : string;
  words2 : string = "word";
 
  constructor(   private route: ActivatedRoute,
    private modalService: NgbModal,
    private http: HttpClient,
    private service: ServiceService,
    public spinner: NgxSpinnerService,
    private toastr: ToastrService,
    ) { }

  ngOnInit(): void {
    this.queryParems = this.route.snapshot.queryParams;
    this.bill_id = this.queryParems.id;
    this.fetch((data) => {
      this.rows = data;
  
    });
  

  }
  
  fetch(cb) {
    // this.spinner.show();
    // this.totalAmount = 0
    this.http
    .get(`${environment.apiUrl}/api/BillingPayments/GetContractBillById/` + this.bill_id)
    .subscribe(res => {
      this.response = res;
     
    if(this.response.success==true)
    {
    this.data =this.response.data;
    for(let i = 0 ; i<this.response.data.contractSaleInvoices.length ; i++){
      this.response.data.contractSaleInvoices[i].totalAmount = this.data.contractSaleInvoices[i].amount * this.data.contractSaleInvoices[i].commission
      this.data.contractSaleInvoices[i].totalAmount = this.data.contractSaleInvoices[i].totalAmount/100
      
    }
  
    for(let j=0;j<this.response.data.contractSaleInvoices.length;j++){   
      this.totalAmount=this.totalAmount + this.response.data.contractSaleInvoices[j].totalAmount 
 } 
 this.totalAmount1 =this.totalAmount.toFixed(2)
 this.totalAmount2 = parseFloat(this.totalAmount1)
    const toWords = new ToWords();
    this.words = toWords.convert(this.totalAmount2);


    cb(this.data);
    // this.spinner.hide();
    }
    else{
      this.toastr.error(this.response.message, 'Message.');
  //  this.spinner.hide();
    }
      // this.spinner.hide();
    }, err => {
      if ( err.status == 400) {
 this.toastr.error(err.error.message, 'Message.');
// this.spinner.hide();      
}
    //  this.spinner.hide();
    });
  }

  ChangeBankForm(rows) {
    const modalRef = this.modalService.open(ChangeBankAccountComponent , { centered: true });
    modalRef.componentInstance.bill_id = rows.billPaymentId;

    modalRef.result.then((data) => {
      // on close
 

    }, (reason) => {
      this.fetch((data) => {
        this.rows = data;
    
      });
      // on dismiss
    });
  }


  // print() {
  //   let docDefinition = {
  //     pageSize: 'A4',     
  //     info: {
  //       title: 'Active Bills List'
  //     },
  //     content: [
  //       {
  //         text: 'Fabcot International FZE ',
  //         style: 'heading',

  //       },
  //       {
  //   text: 'Flexi Office ,RAKEZ Business ZONE F-Z RAK , United Arab Emirates.',
  //   style: 'heading2'
       
  // },
  //      {text: 'Seller:'  },
  //      { text: this.rows['sellerName'], style:'text1'},
  //     {  text:'Bill No.:' , style:'text2'},
  //     { text: this.rows['billNumber'], style:'text3'},
  //     {  text:'Bill Date:' , style:'text4' },
  //     { text: this.rows['billDate'], style:'text5'},
  //      {  text: 'Buyer:'  , style:'text6'},
  //      { text: this.rows['buyerName'], style:'text1'},
  //     {  text: 'Fabcot Contract Number :' , style:'text9' },
  //     { text: this.rows['contractNumber'], style:'text10'},
  //     {text: 'Contract Date :' , style:'text11'},
  //     { text: this.rows['contractDate'], style:'text12'},
  //     {text: 'Article :' , },
  //     { text: this.rows['contractArticleName'], style:'text13'},
  //     {
  //       margin: [0 , 10 , 0 , 0],

  //       table:{

  //         headerRows:1,
  //         widths: [75, 90, 130, 70, 120],

  //         body:[
  //           ['SaleInvoice #', 'SaleInvoice Date', 'Invoice Amount(PKR)', 'Commission', 'Total Amount(PKR)'],
  //       // ...this.rows['contractSaleInvoices'].map((row=>
  //       //   [row.saleInvoiceNo]
  //       //   ))
  //         ]
  //       }
  //     },
  //     {  text: 'Sub Total :' , style:'text14' },
  //     { text: this.rows['invoiceSubTotalAmount'], style:'text15'},
  //     {text: 'Tax :' , style:'text16'},
  //     { text: this.rows['invoiceTaxAmount'], style:'text15'},
  //     {text: 'Total:' , style:'text18' },
  //     { text: this.rows['invoiceTotalAmount'], style:'text15'},
  //        ],
  //     styles: {
  //       heading: {
  //         fontSize: 18,
  //         alignment: 'center',
  //         margin: [0, 0, 0, 0]
  //       },
        
  //         heading2:{
  //               fontSize: 10,
  //               alignment: 'center',
  //               // [ left , up , right  , down]
  //               margin: [0 , -3 , 0 , 25]

  //         },
  //         text1 : {
  //           margin:[38 ,-15, 0 ,0 ]
  //         },
  //         text2 : {margin:[380 ,0, 0 ,0 ]},
  //         text3 : {margin:[425 ,-15, 0 ,0 ]},
  //         text4 : {margin:[380 ,0, 0 ,0 ]},
  //         text5 : {margin:[430 , -15, 0 ,0 ]},
  //         text6 : {margin:[0 , -25, 0 ,0 ]},
  //         text10 : {margin:[140 , -15, 0 ,0 ]},
  //         text12 : {margin:[90 , -15, 0 ,0 ]},
  //         text13 : {margin:[50 , -15, 0 ,0 ]},
  //         text14 : {margin:[380 , 20, 0 ,0 ]},
  //         text15 : {margin:[440 , -13, 0 ,0 ]},
  //         text16 : {margin:[400 , 0, 0 ,0 ]},
  //         text18 : {margin:[400 , 0, 0 ,0 ]},        
  //     }
  //   };

  //   // const win = window.open('', "tempWinForPdf");
  //   pdfMake.createPdf(docDefinition).print();

  // }

print(){
  let docDefinition = {
    pageSize: 'A3',
      
          info: {
            title: 'Bill generated'
          },
          content: [
            {
              table:{headerRows: 1 , widths:['100%'],
            body: [
              [{text:'Fabcot International FZE' , style:'heading'}],] }
            },
            {
              margin: [0 , 10 , 0 , 0],
              layout:'noBorders',
              table:{headerRows: 1 , widths:['100%'],
            body: [
              [{text:'Aurangzeb Block Office, 133 New Garden Town, Lahore, Pakistan.' , style:'heading2'}],] }
            },
            {
              layout:'noBorders',
             
              table:{headerRows:1 ,  widths:['14%' , '67%' , '5%' , '12%'],
            body:[ [
              {text: 'Seller :' , margin: [63 , 40 , 0 , 0] , bold:true } , {text: this.rows['sellerName'] ,  margin: [0 , 40 , 0 , 0]},
            {text:'Bill # :' , margin: [0 , 40 , 0 , 0] , bold:true} ,{text:this.rows['billNumber'] , margin: [0 , 40 , 0 , 0]}
          
          ]]
            }
            },
            {
              
              layout:'noBorders',
              table:{headerRows:1 ,  widths:['14%' , '65%' , '7%' , '15%'],
            body:[ [{text: 'Buyer :' , margin: [63 , 7 , 0 , 0] , bold:true} , {text: this.rows['buyerName'] , margin: [0 , 7 , 0 , 0]},
            {text:'Bill Date :' , margin: [0 , 7 , 0 , 0] , bold:true} ,{text:this.rows['billDate'] , margin: [0 , 7 , 0 , 0] }
          
          ]]
            }
            },
            {
             

              layout:'noBorders',
              table:{headerRows:1 ,  widths:['15%' , '90%' ],
            body:[ [{text: 'Fabcot Contract# :' , margin: [0 , 7 , 0 , 0] , bold:true} , {text: this.rows['contractNumber'] , margin: [-9 , 7 , 0 , 0] }
          
          ]]
            }
            },
            {
            

              layout:'noBorders',
              table:{headerRows:1 ,  widths:['15%' , '85%' ],
            body:[ [{text: 'Contract Date :' , margin: [19 , 7 , 0 , 0] , bold:true} , {text: this.rows['contractDate'] , margin: [-9 , 7 , 0 , 0] }
          
          ]]
            }
            },
            {
             

              layout:'noBorders',
              table:{headerRows:1 ,  widths:['14%' , '86%' ],
            body:[ [{text: 'Article :' , margin: [57 , 7 , 0 , 0] , bold:true} , {text: this.rows['contractArticleName'] , margin: [0 , 7 , 0 , 0] }
          
          ]]
            }
            },
            {
              margin: [0 , 50 , 0 , 0 ],
              table:{
                headerRows : 1,
                widths : ['20%' , '20%' , '20%' , '20%' , '20%'],
                body:[
                  [{text:'Sale Invoice#' , style:'tableHeader' }
                  ,{text:'Invoice Date' , style:'tableHeader'}  , 
                  {text:'Invoice Amount' , style:'tableHeader'} , 
                  {text:'Commission' , style:'tableHeader'} , 
                  {text:'Total Amount' , style:'tableHeader'}],
                  
                  ...this.rows['contractSaleInvoices'].map(row => (
                    [{text: row.saleInvoiceNo , style:'tableHeader2'} ,
                    {text:  row.saleInvoiceDateToDisplay , style:'tableHeader2'},
                     {text:row.amount , style:'tableHeader2'} ,
                      {text:row.commission+ '%' , style:'tableHeader2' }  ,
                      {text: row.totalAmount.toFixed(2) , style:'tableHeader2'}]
                  ))
                ]
              }
            },
            {
              layout:'noBorders',
              table:{headerRows:1 ,  widths:['90%' , '20%' ],
            body:[ [{text: 'Sub Total :' ,  margin:[620,60,0,0]  , bold:true} ,
             {text: this.totalAmount2 , margin:[0,60,0,0] , decoration:'underline'}
          
          ]]
            }
            },
            {
              layout:'noBorders',
              table:{headerRows:1 ,  widths:['90%' , '20%' ],
            body:[ [{text: 'TAX :' ,margin:[647,5,0,0] , bold:true} ,
             {text: this.rows['invoiceTaxAmount'] , margin: [0 , 5 , 0 , 0]  , decoration:'underline'}
          
          ]]
            }
            },
            {
              layout:'noBorders',
              table:{headerRows:1 ,  widths:['90%' , '20%' ],
            body:[ [{text: 'Total :' , margin:[642,5,0,0]  , bold:true} ,
             {text: this.totalAmount.toFixed(2) , margin: [0 , 5 , 0 , 0] , decoration:'underline'}
          
          ]]
            }
            },
            {
              layout:'noBorders',
              table:{headerRows:1 ,  widths:['15%' , '100%' ],
            body:[ [{text: 'Amount in Words :' , margin:[0 , -70,0,0] , bold:true } ,
             {text: this.words ,margin:[-10 , -70,0,0] , decoration:'underline' }
          
          ]]
            }
            },
            {
              layout:'noBorders',
              table:{headerRows:1 ,  widths:['15%' , '100%' ],
            body:[ [{text: 'Title of Account: ' , margin:[0 , -50,0,0] , bold:true  } ,
             {text: this.rows['accountName'] , margin:[0 , -50,0,0]  }
          
          ]]
            }
            },
            {
              layout:'noBorders',
              table:{headerRows:1 ,  widths:['15%' , '100%' ],
            body:[ [{text: 'Address :' ,  margin:[25 , -30,0,0] } ,
             {text: this.rows['bankAddress']  ,  margin:[0 , -30,0,0] }
          
          ]]
            }
            },
            {
              layout:'noBorders',
              table:{headerRows:1 ,  widths:['15%' , '100%' ],
            body:[ [{text: ' Bank Name :' , margin:[9 , -13,0,0] } ,
             {text: this.rows['bankName'] , margin:[0 , -13,0,0] }
          
          ]]
            }
            },
            {
              layout:'noBorders',
              table:{headerRows:1 ,  widths:['15%' , '100%' ],
            body:[ [{text: 'Bank Account#:' , margin:[-7 , 7,0,0] } ,
             {text: this.rows['accountNumber'] , margin:[0 , 7,0,0]  }
          
          ]]
            }
            },
            {
              layout:'noBorders',
              table:{headerRows:1 ,  widths:['15%' , '100%' ],
            body:[ [{text: 'IBAN Number:' , margin:[0 , 7,0,0]  } ,
             {text: this.rows['iban']  , margin:[0 , 7,0,0] }
          
          ]]
            }
            },
            {
              layout:'noBorders',
              table:{headerRows:1 ,  widths:['15%' , '100%' ],
            body:[ [{text: 'Swift Code:' , margin:[13 , 7,0,0]  } ,
             {text: this.rows['swiftCode'] , margin:[0 , 7,0,0]   }
          
          ]]
            }
            },
            {
              layout:'noBorders',
              table:{headerRows:1 ,  widths:['15%' , '100%' ],
            body:[ [{text: 'Bank Branch:' , margin:[2 , 7,0,0]  } ,
             {text: this.rows['branchName'] , margin:[0 , 7,0,0]   }
          
          ]]
            }
            },
            {
              layout:'noBorders',
              table:{headerRows:1 ,  widths:['15%' , '100%' ],
            body:[ [{text: 'Account Type:' , margin:[2 , 7,0,0]  } , {text: this.rows['type'] , margin:[0 , 7,0,0]  }
          ]]
            }
            },
            {
              layout:'noBorders', table:{headerRows:1 ,  widths:['15%' , '100%' ],
            body:[ [{text: 'Bank Address:' , margin:[2 , 7,0,0]  } ,{text: this.rows['bankAddress'] , margin:[0 , 7,0,0]   }
          ]]
            }
            }],
          styles:{
           heading:{fillColor: '#f3f3f4',fontSize: 20,
            bold: true,color: '#4d4b4b', alignment: 'center',margin : 4 },
            heading2:{fontSize: 10,
            bold: true,color: '#4d4b4b', alignment: 'center' },
            tableHeader:{ fillColor: '#f3f3f4' , margin:4 , alignment: 'center'},
            tableHeader2:{   margin:3 , alignment: 'center'},
          // left:{  margin:[620,10,0,0]},
          //  left2:{ margin:[0,10,0,0]},
          //  left3:{margin:[630,0,0,0]},
        // down:{margin:[0,15,0,0]},
        // up:{ margin:[0 , -10,0,0]},
        // down2:{margin:[0,3,0,0] }
          },

  };
  pdfMake.createPdf(docDefinition).print();

}


}
