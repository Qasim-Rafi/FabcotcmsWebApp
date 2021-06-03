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

  constructor(   private route: ActivatedRoute,
    private modalService: NgbModal,
    private http: HttpClient,
    private service: ServiceService,
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
    
    this.http
    .get(`${environment.apiUrl}` + this.bill_id)
    .subscribe(res => {
      this.response = res;
     
    if(this.response.success==true)
    {
    this.data =this.response.data;
    const toWords = new ToWords();
    this.words = toWords.convert(this.data.invoiceTotalAmount);

    cb(this.data);
    }
    else{
      this.toastr.error(this.response.message, 'Message.');
    }
      // this.spinner.hide();
    }, err => {
      if ( err.status == 400) {
 this.toastr.error(err.error.message, 'Message.');
      }
    //  this.spinner.hide();
    });
  }

  ChangeBankForm(rows) {
    const modalRef = this.modalService.open(ChangeBankAccountComponent , { centered: true });
    modalRef.componentInstance.bill_id = rows.billPaymentId;

    modalRef.result.then((data) => {
      // on close
      this.fetch((data) => {
        this.rows = data;
    
      });
      
      if (data == true) {
        this.date = this.myDate;
        // this.getBuyers();

      }
    }, (reason) => {
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
              layout:'noBorders',
              margin: [0 , 50 , 0 , 0],
              table:{headerRows:1 ,  widths:['5%' , '77%' , '7%' , '12%'],
            body:[ [
              {text: 'Seller :'} , {text: this.rows['sellerName'] , style:'leftAlign'},
            {text:'Bill # :'} ,{text:this.rows['billNumber']}
          
          ]]
            }
            },
            {
              layout:'noBorders',
              table:{headerRows:1 ,  widths:['5%' , '75%' , '7%' , '15%'],
            body:[ [{text: 'Buyer :'} , {text: this.rows['buyerName'] , style:'leftAlign'},
            {text:'Bill Date :'} ,{text:this.rows['billDate']}
          
          ]]
            }
            },
            {
              layout:'noBorders',
              table:{headerRows:1 ,  widths:['20%' , '80%' ],
            body:[ [{text: 'Fabcot Contract Number :'} , {text: this.rows['contractNumber'] , style:'leftAlign'}
          
          ]]
            }
            },
            {
              layout:'noBorders',
              table:{headerRows:1 ,  widths:['15%' , '90%' ],
            body:[ [{text: 'Contract Date :'} , {text: this.rows['contractDate'] , style:'down2'}
          
          ]]
            }
            },
            {
              layout:'noBorders',
              table:{headerRows:1 ,  widths:['7%' , '93%' ],
            body:[ [{text: 'Article :'} , {text: this.rows['contractArticleName'] , style:'leftAlign'}
          
          ]]
            }
            },
            {
              margin: [0 , 20 , 0 , 0 ],
              table:{
                headerRows : 1,
                widths : ['20%' , '20%' , '20%' , '20%' , '20%'],
                body:[
                  ['Sale Invoice#' , 'Invoice Date' , 'Invoice Amount' , 'Commission' , 'Total Amount'],
                  
                  ...this.rows['contractSaleInvoices'].map(row => (
                    [row.saleInvoiceNo , row.saleInvoiceDate , row.amount , row.commission , row.totalAmount]
                  ))
                ]
              }
            },
            {
              layout:'noBorders',
              table:{headerRows:1 ,  widths:['90%' , '20%' ],
            body:[ [{text: 'Sub Total :' , style:'left'} ,
             {text: this.rows['invoiceSubTotalAmount'] , style:'left2'}
          
          ]]
            }
            },
            {
              layout:'noBorders',
              table:{headerRows:1 ,  widths:['90%' , '20%' ],
            body:[ [{text: 'TAX :' , style:'left3'} ,
             {text: this.rows['invoiceTaxAmount'] , style:'left4'}
          
          ]]
            }
            },
            {
              layout:'noBorders',
              table:{headerRows:1 ,  widths:['90%' , '20%' ],
            body:[ [{text: 'Total :' , style:'left3'} ,
             {text: this.rows['invoiceTotalAmount'] , style:'left4'}
          
          ]]
            }
            },
            {
              layout:'noBorders',
              table:{headerRows:1 ,  widths:['15%' , '100%' ],
            body:[ [{text: 'Amount in Words :' , style:'up' } ,
             {text: this.words , style:'up' }
          
          ]]
            }
            },
            {
              layout:'noBorders',
              table:{headerRows:1 ,  widths:['15%' , '100%' ],
            body:[ [{text: 'Title of Account: '  } ,
             {text: this.rows['accountName'] }
          
          ]]
            }
            },
            {
              layout:'noBorders',
              table:{headerRows:1 ,  widths:['15%' , '100%' ],
            body:[ [{text: 'Address :  :' , } ,
             {text: this.rows['bankAddress']  }
          
          ]]
            }
            },
            {
              layout:'noBorders',
              table:{headerRows:1 ,  widths:['15%' , '100%' ],
            body:[ [{text: ' Bank Name :' , } ,
             {text: this.rows['bankName']  }
          
          ]]
            }
            },
            {
              layout:'noBorders',
              table:{headerRows:1 ,  widths:['15%' , '100%' ],
            body:[ [{text: 'Bank Account Number:' , } ,
             {text: this.rows['accountNumber']  }
          
          ]]
            }
            },
            {
              layout:'noBorders',
              table:{headerRows:1 ,  widths:['15%' , '100%' ],
            body:[ [{text: 'IBAN Number:' , } ,
             {text: this.rows['iban']  }
          
          ]]
            }
            },
            {
              layout:'noBorders',
              table:{headerRows:1 ,  widths:['15%' , '100%' ],
            body:[ [{text: 'Swift Code:' , } ,
             {text: this.rows['swiftCode']  }
          
          ]]
            }
            },
            {
              layout:'noBorders',
              table:{headerRows:1 ,  widths:['15%' , '100%' ],
            body:[ [{text: 'Bank Branch:' , } ,
             {text: this.rows['branchName']  }
          
          ]]
            }
            },
            {
              layout:'noBorders',
              table:{headerRows:1 ,  widths:['15%' , '100%' ],
            body:[ [{text: 'Account Type:' , } , {text: this.rows['type']  }
          ]]
            }
            },
            {
              layout:'noBorders', table:{headerRows:1 ,  widths:['15%' , '100%' ],
            body:[ [{text: 'Bank Address:' , } ,{text: this.rows['bankAddress']  }
          ]]
            }
            }],
          styles:{
           heading:{fillColor: '#f3f3f4',fontSize: 20,
            bold: true,color: '#4d4b4b', alignment: 'center',margin : 4 },
          left:{  margin:[620,10,0,0]},
           left2:{ margin:[0,10,0,0]},
           left3:{margin:[630,0,0,0]},
        down:{margin:[0,15,0,0]},
        up:{ margin:[0 , -10,0,0]},
        down2:{margin:[0,3,0,0] }
          },

  };
  pdfMake.createPdf(docDefinition).print();

}


}
