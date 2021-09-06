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
    this.totalAmount = 0
    this.totalAmount1 = 0
    
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

  if(this.words.search("Point") == -1 )
{
  this.words = this.words.replace(this.words , this.words + " Dollars")
}  
else{
    this.words = this.words.replace("Point" , "Dollars Point")
    this.words = this.words.replace(this.words , this.words + " Cents")
}


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
      this.fetch((data) => {
        this.rows = data;
    
      });
 

    }, (reason) => {
      // this.fetch((data) => {
      //   this.rows = data;
    
      // });
      // on dismiss
    });
  }



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
                  {text:'Invoice Amount' +'(' + this.rows.currencyCode+')'  , style:'tableHeader'} , 
                  {text:'Commission' , style:'tableHeader'} , 
                  {text:'Total Amount' +'(' + this.rows.currencyCode+')' , style:'tableHeader'}],
                  
                  ...this.rows['contractSaleInvoices'].map(row => (
                    [{text: row.saleInvoiceNo , style:'tableHeader2'} ,
                    {text:  row.saleInvoiceDateToDisplay , style:'tableHeader2'},
                     {text:  this.rows.currencyCode =='USD'? row.amount + " $" :this.rows.currencyCode =='PKR' ? row.amount + " Rs" :   this.rows.currencyCode =='EUR' ? row.amount + " €" : this.rows.currencyCode =='GBP' ? row.amount + " £" : ''
                      //+ this.rows.currencyCode =='USD'? "$" :''
                         , style:'tableHeader2'} ,
                      {text:row.commission+ '%' , style:'tableHeader2' }  ,
                      {text:
                        this.rows.currencyCode =='USD'? row.totalAmount.toFixed(2) + " $" :this.rows.currencyCode =='PKR' ? row.totalAmount.toFixed(2) + " Rs" :   this.rows.currencyCode =='EUR' ? row.totalAmount.toFixed(2) + " €" : this.rows.currencyCode =='GBP' ? row.totalAmount.toFixed(2) + " £" : ''
                        
                        
                        
                        
                         , style:'tableHeader2'}]
                  ))
                ]
              }
            },
            {
              layout:'noBorders',
              table:{headerRows:1 ,  widths:['90%' , '20%' ],
            body:[ [{text: 'Sub Total :' ,  margin:[620,60,0,0]  , bold:true} ,
             {text:     this.rows.currencyCode =='USD'? this.totalAmount2 + " $" :this.rows.currencyCode =='PKR' ? this.totalAmount2 + " Rs" :   this.rows.currencyCode =='EUR' ? this.totalAmount2 + " €" : this.rows.currencyCode =='GBP' ? this.totalAmount2 + " £" : '', margin:[0,60,0,0] , decoration:'underline'}
          
          ]]
            }
            },
            {
              layout:'noBorders',
              table:{headerRows:1 ,  widths:['90%' , '20%' ],
            body:[ [{text: 'TAX :' ,margin:[647,5,0,0] , bold:true} ,
             {text: 
             
             this.rows.currencyCode =='USD'? this.rows['invoiceTaxAmount']+ " $" :this.rows.currencyCode =='PKR' ? this.rows['invoiceTaxAmount'] + " Rs" :   this.rows.currencyCode =='EUR' ? this.rows['invoiceTaxAmount'] + " €" : this.rows.currencyCode =='GBP' ? this.rows['invoiceTaxAmount'] + " £" : ''
             , margin: [0 , 5 , 0 , 0]  , decoration:'underline'}
          
          ]]
            }
            },
            {
              layout:'noBorders',
              table:{headerRows:1 ,  widths:['90%' , '20%' ],
            body:[ [{text: 'Total :' , margin:[642,5,0,0]  , bold:true} ,
             {text: 
              
              this.rows.currencyCode =='USD'? this.totalAmount.toFixed(2) + " $" :this.rows.currencyCode =='PKR' ? this.totalAmount.toFixed(2)  + " Rs" :   this.rows.currencyCode =='EUR' ? this.totalAmount.toFixed(2)  + " €" : this.rows.currencyCode =='GBP' ? this.totalAmount.toFixed(2)  + " £" : ''
              , margin: [0 , 5 , 0 , 0] , decoration:'underline'}
          
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
