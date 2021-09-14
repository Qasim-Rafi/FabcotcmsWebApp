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
import {NgxSpinnerModule, NgxSpinnerService} from 'ngx-spinner'
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
  quantity : any;
  constructor(   private route: ActivatedRoute,
    private modalService: NgbModal,
    private http: HttpClient,
    private service: ServiceService,
    private toastr: ToastrService,
    private spinner:NgxSpinnerService
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
    this.fetch((data) => {
      this.rows = data;
  
    });

  }
  
//   fetch(cb) {
    
//     this.http
//     .get(`${environment.apiUrl}/api/BillingPayments/GetContractBillById/` + this.bill_id)
//     .subscribe(res => {
//       this.response = res;
     
//     if(this.response.success==true)
//     {
//     this.data =this.response.data;
//     const toWords = new ToWords();
//     this.words = toWords.convert(this.data.invoiceTotalAmount);

//     cb(this.data);
//     }
//     else{
//       this.toastr.error(this.response.message, 'Message.');
//     }
//       // this.spinner.hide();
//     }, err => {
//       if ( err.status == 400) {
//  this.toastr.error(err.error.message, 'Message.');
//       }
//     //  this.spinner.hide();
//     });
//   }

fetch(cb) {
  this.spinner.show();
  this.totalAmount = 0
  this.totalAmount1 = 0
  this.totalQuantity = 0
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
  this.spinner.hide();

  for(let j=0;j<this.response.data.contractSaleInvoices.length;j++){   
    this.totalAmount=this.totalAmount + this.response.data.contractSaleInvoices[j].totalAmount ;

   
} 
this.totalAmount1 =this.totalAmount.toFixed(2)
this.totalAmount2 = parseFloat(this.totalAmount1)
  const toWords = new ToWords();
  this.words = toWords.convert(this.totalAmount2);




  cb(this.data);
  this.spinner.hide();
  }
  else{
    this.toastr.error(this.response.message, 'Message.');
 this.spinner.hide();
  }
    // this.spinner.hide();
  }, err => {
    if ( err.status == 400) {
this.toastr.error(err.error.message, 'Message.');
this.spinner.hide();      
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



// print(){
//   let docDefinition = {
//     pageSize: 'A4',
//     pageMargins: [ 30, 40, 40, 20 ],
//     pageOrientation: 'landscape',
      
//           info: {
//             title: 'Bill generated'
//           },
//           content: [
//             {
//               table:{headerRows: 1 , widths:['100%'],
//             body: [
//               [{text:'Fabcot International FZE' , style:'heading'}],] }
//             },
//             {
//               layout:'noBorders',
//               margin: [0 , 50 , 0 , 0],
//               table:{headerRows:1 ,  widths:['5%' , '77%' , '7%' , '12%'],
//             body:[ [
//               {text: 'Seller :'} , {text: this.rows['sellerName'] , style:'leftAlign'},
//             {text:'Bill # :'} ,{text:this.rows['billNumber']}
          
//           ]]
//             }
//             },
//             {
//               layout:'noBorders',
//               table:{headerRows:1 ,  widths:['5%' , '75%' , '7%' , '15%'],
//             body:[ [{text: 'Buyer :'} , {text: this.rows['buyerName'] , style:'leftAlign'},
//             {text:'Bill Date :'} ,{text:this.rows['billDate']}
          
//           ]]
//             }
//             },
//             {
//               layout:'noBorders',
//               table:{headerRows:1 ,  widths:['20%' , '80%' ],
//             body:[ [{text: 'Fabcot Contract Number :'} , {text: this.rows['contractNumber'] , style:'leftAlign'}
          
//           ]]
//             }
//             },
//             {
//               layout:'noBorders',
//               table:{headerRows:1 ,  widths:['15%' , '90%' ],
//             body:[ [{text: 'Contract Date :'} , {text: this.rows['contractDate'] , style:'down2'}
          
//           ]]
//             }
//             },
//             {
//               layout:'noBorders',
//               table:{headerRows:1 ,  widths:['7%' , '93%' ],
//             body:[ [{text: 'Article :'} , {text: this.rows['contractArticleName'] , style:'leftAlign'}
          
//           ]]
//             }
//             },
//             {
//               margin: [0 , 20 , 0 , 0 ],
//               table:{
//                 headerRows : 1,
//                 widths : ['20%' , '20%' , '20%' , '20%' , '20%'],
//                 body:[
//                   ['Sale Invoice#' , 'Invoice Date' , 'Invoice Amount' , 'Commission' , 'Total Amount'],
                  
//                   ...this.rows['contractSaleInvoices'].map(row => (
//                     [row.saleInvoiceNo , row.saleInvoiceDate , row.amount , row.commission , row.totalAmount]
//                   ))
//                 ]
//               }
//             },
//             {
//               layout:'noBorders',
//               table:{headerRows:1 ,  widths:['90%' , '20%' ],
//             body:[ [{text: 'Sub Total :' , style:'left'} ,
//              {text: this.rows['invoiceSubTotalAmount'] , style:'left2'}
          
//           ]]
//             }
//             },
//             {
//               layout:'noBorders',
//               table:{headerRows:1 ,  widths:['90%' , '20%' ],
//             body:[ [{text: 'TAX :' , style:'left3'} ,
//              {text: this.rows['invoiceTaxAmount'] , style:'left4'}
          
//           ]]
//             }
//             },
//             {
//               layout:'noBorders',
//               table:{headerRows:1 ,  widths:['90%' , '20%' ],
//             body:[ [{text: 'Total :' , style:'left3'} ,
//              {text: this.rows['invoiceTotalAmount'] , style:'left4'}
          
//           ]]
//             }
//             },
//             {
//               layout:'noBorders',
//               table:{headerRows:1 ,  widths:['15%' , '100%' ],
//             body:[ [{text: 'Amount in Words :' , style:'up' } ,
//              {text: this.words , style:'up' }
          
//           ]]
//             }
//             },
//             {
//               layout:'noBorders',
//               table:{headerRows:1 ,  widths:['15%' , '100%' ],
//             body:[ [{text: 'Title of Account: '  } ,
//              {text: this.rows['accountName'] }
          
//           ]]
//             }
//             },
//             {
//               layout:'noBorders',
//               table:{headerRows:1 ,  widths:['15%' , '100%' ],
//             body:[ [{text: 'Address :  :' , } ,
//              {text: this.rows['bankAddress']  }
          
//           ]]
//             }
//             },
//             {
//               layout:'noBorders',
//               table:{headerRows:1 ,  widths:['15%' , '100%' ],
//             body:[ [{text: ' Bank Name :' , } ,
//              {text: this.rows['bankName']  }
          
//           ]]
//             }
//             },
//             {
//               layout:'noBorders',
//               table:{headerRows:1 ,  widths:['15%' , '100%' ],
//             body:[ [{text: 'Bank Account Number:' , } ,
//              {text: this.rows['accountNumber']  }
          
//           ]]
//             }
//             },
//             {
//               layout:'noBorders',
//               table:{headerRows:1 ,  widths:['15%' , '100%' ],
//             body:[ [{text: 'IBAN Number:' , } ,
//              {text: this.rows['iban']  }
          
//           ]]
//             }
//             },
//             {
//               layout:'noBorders',
//               table:{headerRows:1 ,  widths:['15%' , '100%' ],
//             body:[ [{text: 'Swift Code:' , } ,
//              {text: this.rows['swiftCode']  }
          
//           ]]
//             }
//             },
//             {
//               layout:'noBorders',
//               table:{headerRows:1 ,  widths:['15%' , '100%' ],
//             body:[ [{text: 'Bank Branch:' , } ,
//              {text: this.rows['branchName']  }
          
//           ]]
//             }
//             },
//             {
//               layout:'noBorders',
//               table:{headerRows:1 ,  widths:['15%' , '100%' ],
//             body:[ [{text: 'Account Type:' , } , {text: this.rows['type']  }
//           ]]
//             }
//             },
//             {
//               layout:'noBorders', table:{headerRows:1 ,  widths:['15%' , '100%' ],
//             body:[ [{text: 'Bank Address:' , } ,{text: this.rows['bankAddress']  }
//           ]]
//             }
//             }],
//           styles:{
//            heading:{fillColor: '#f3f3f4',fontSize: 20,
//             bold: true,color: '#4d4b4b', alignment: 'center',margin : 4 },
//           left:{  margin:[620,10,0,0]},
//            left2:{ margin:[0,10,0,0]},
//            left3:{margin:[630,0,0,0]},
//         down:{margin:[0,15,0,0]},
//         up:{ margin:[0 , -10,0,0]},
//         down2:{margin:[0,3,0,0] }
//           },

//   };
//   pdfMake.createPdf(docDefinition).print();

// }


print(){
  let docDefinition = {
    pageSize: 'A4',
    pageMargins: [ 20, 10, 30, 10 ],
    pageOrientation: 'letter',
      
          info: {
            title: 'Bill generated'
          },
          content: [
            {
              "image" : this.image2,
             fit : [100 , 100]
          
            },
            {
           
              text:'Fabcot International FZE' , style:'heading' , margin: [0,-30,0,0]
           
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
             
              table:{headerRows:1 ,  widths:['18%' , '67%' , '5%' , '12%'],
            body:[ [
              {text: 'Seller :' , margin: [63 , 25 , 0 , 0] , bold:true , style:'common' } , {text: this.rows['sellerName'] ,  margin: [0 , 25 , 0 , 0] , style:'common'},
            {text:'Bill # :' , margin: [0 , 25 , 0 , 0] , bold:true , style:'common'} ,{text:this.rows['billNumber'] , margin: [0 , 25 , 0 , 0] , style:'common'}
          
          ]]
            }
            },
            {
              
              layout:'noBorders',
              table:{headerRows:1 ,  widths:['18%' , '65%' , '10%' , '15%'],
            body:[ [{text: 'Buyer :' , margin: [63 , 4 , 0 , 0] , bold:true , style:'common'} , {text: this.rows['buyerName'] , margin: [0 , 4 , 0 , 0] , style:'common'},
            {text:'Bill Date :' , margin: [0 , 4 , 0 , 0] , bold:true , style:'common'} ,{text:this.rows['billDate'] , margin: [-20 , 4 , 0 , 0] , style:'common' }
          
          ]]
            }
            },
            {
             

              layout:'noBorders',
              table:{headerRows:1 ,  widths:['20%' , '80%' ],
            body:[ [{text: 'Fabcot Contract# :' , margin: [15 , 4 , 0 , 0] , bold:true , style:'common'} , {text: this.rows['contractNumber'] , margin: [-12 , 4 , 0 , 0]  , style:'common'}
          
          ]]
            }
            },
            {
            

              layout:'noBorders',
              table:{headerRows:1 ,  widths:['20%' , '80%' ],
            body:[ [{text: 'Contract Date :' , margin: [30 , 4 , 0 , 0] , bold:true  , style:'common'} , {text: this.rows['contractDate'] , margin: [-12 , 4 , 0 , 0] , style:'common' }
          
          ]]
            }
            },
            {
             

              layout:'noBorders',
              table:{headerRows:1 ,  widths:['18%' , '86%' ],
            body:[ [{text: 'Article :' , margin: [57 , 4 , 0 , 0] , bold:true , style:'common'} , {text: this.rows['contractArticleName'] , margin: [0 , 4 , 0 , 0] , style:'common' }
          
          ]]
            }
            },
            {
              margin: [0 , 20 , 0 , 0 ],
              table:{
                headerRows : 1,
                widths : ['17%' , '10%' , '15%' , '10%' , '10%' , '10%' , '10%' , '10%' , '10%'],
                body:[

                  [
                    {text:'Description' , style:'tableHeader' },
                    {text:'Sale Invoice#' , style:'tableHeader' }
                  ,{text:'Sale Invoice Date' , style:'tableHeader'} ,
                  {text:'Quantity' , style:'tableHeader' }, 
                  {text:'Rate' , style:'tableHeader' }, 

                  {text:'SI Amount' +'(' + this.rows.currencyCode+')'  , style:'tableHeader'} , 
                  {text:'Commission' , style:'tableHeader'} , 
                  {text:'TAX' , style:'tableHeader' }, 

                  {text:'Amount' +'(' + this.rows.currencyCode+')' , style:'tableHeader'}],
                  
                  ...this.rows['contractSaleInvoices'].map(row => (
                    [
                      {text: row.description , style:'tableHeader2'} ,

                      {text: row.saleInvoiceNo , style:'tableHeader2'} ,
                    {text:  row.saleInvoiceDateToDisplay , style:'tableHeader2'},
                    {text: row.quantity , style:'tableHeader2'} ,
                    {text: row.rate , style:'tableHeader2'} ,
                    
                     {text: row.amount
                         , style:'tableHeader2'} ,
                      {text:row.commission+ '%' , style:'tableHeader2' }  ,
                    {text: row.taxAmount , style:'tableHeader2'} ,

                      {text: row.totalAmount.toFixed(2) , style:'tableHeader2'}]
                  ))
                ]
              }
            },
          //   {
          //     layout:'noBorders',
          //     table:{headerRows:1 ,  widths:['90%' , '20%' ],
          //   body:[ [{text: 'Sub Total :'  , bold:true} ,
          //    {text:   this.totalQuantity , margin:[0,60,0,0] , decoration:'underline'}
          
          // ]]
          //   }
          //   },

          {
            layout:'noBorders',
            table:{headerRows:1 ,  widths:['10%' , '20%' ,  '20%' , '20%' ],
          body:[ [
            {text: 'Quantity :' , margin:[0 , 30,0,0] , bold:true , style:'common' } ,
           {text: ' ' ,margin:[-15 , 30,0,0] , decoration:'underline' , style:'common' },
            {text: 'SI Amount:'  , margin:[0,30,0,0]  , bold:true , style:'common' } ,
           {text:  ' '  , margin:[-40,30,0,0] , decoration:'underline' , style:'common'}
        
        ]]
          }
          },

            {
              layout:'noBorders',
              table:{headerRows:1 ,  widths:['20%' , '50%' ,  '30%' , '10%' ],
            body:[ [
              {text: 'Amount in Words :' , margin:[0 , 20,0,0] , bold:true , style:'common' } ,
             {text: this.words ,margin:[-30 , 20,0,0] , decoration:'underline' , style:'common' },
              {text: 'Sub Total :' , margin:[50,20,0,0]  , bold:true , style:'common' } ,
             {text:   this.totalAmount2  , margin:[-60,20,0,0] , decoration:'underline' , style:'common'}
          
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
             {text: this.totalAmount2 ,margin:[0 , 5,0,0]  , decoration:'underline' , style:'common' },
         
          
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
             {text: '' ,margin:[-30 , 20,0,0] , decoration:'underline' , style:'common' },
              {text: 'Aurthorized Signatory:' , margin:[60,20,0,0]  , style:'common' } ,
             {text:   ''  , margin:[-20,20,0,0] , decoration:'underline' , style:'common'}
          
          ]]
            }
            },

          //   {
          //     layout:'noBorders',
          //     table:{headerRows:1 ,  widths:['100%'   ],
          //   body:[ [
          //     {text: 'For FABCOT INTERNATIONAL' , margin:[0 , 10,0,0] , bold:true , style:'common' } ,
          // ]]
          //   }
          //   },
          //   {
          //     layout:'noBorders',
          //     table:{headerRows:1 ,  widths:['90%' , '20%' ],
          //   body:[ [{text: 'Total :' , margin:[642,5,0,0]  , bold:true} ,
          //    {text: 
              
          //     this.rows.currencyCode =='USD'? this.totalAmount.toFixed(2) + " $" :this.rows.currencyCode =='PKR' ? this.totalAmount.toFixed(2)  + " Rs" :   this.rows.currencyCode =='EUR' ? this.totalAmount.toFixed(2)  + " €" : this.rows.currencyCode =='GBP' ? this.totalAmount.toFixed(2)  + " £" : ''
          //     , margin: [0 , 5 , 0 , 0] , decoration:'underline'}
          
          // ]]
          //   }
          //   },
          //   {
          //     layout:'noBorders',
          //     table:{headerRows:1 ,  widths:['15%' , '100%' ],
          //   body:[ [{text: 'Amount in Words :' , margin:[0 , -70,0,0] , bold:true } ,
          //    {text: this.words ,margin:[-10 , -70,0,0] , decoration:'underline' }
          
          // ]]
          //   }
          //   },
          //   {
          //     layout:'noBorders',
          //     table:{headerRows:1 ,  widths:['15%' , '100%' ],
          //   body:[ [{text: 'Title of Account: ' , margin:[0 , -50,0,0] , bold:true  } ,
          //    {text: this.rows['accountName'] , margin:[0 , -50,0,0]  }
          
          // ]]
          //   }
          //   },
          //   {
          //     layout:'noBorders',
          //     table:{headerRows:1 ,  widths:['15%' , '100%' ],
          //   body:[ [{text: 'Address :' ,  margin:[25 , -30,0,0] } ,
          //    {text: this.rows['bankAddress']  ,  margin:[0 , -30,0,0] }
          
          // ]]
          //   }
          //   },
          //   {
          //     layout:'noBorders',
          //     table:{headerRows:1 ,  widths:['15%' , '100%' ],
          //   body:[ [{text: ' Bank Name :' , margin:[9 , -13,0,0] } ,
          //    {text: this.rows['bankName'] , margin:[0 , -13,0,0] }
          
          // ]]
          //   }
          //   },
          //   {
          //     layout:'noBorders',
          //     table:{headerRows:1 ,  widths:['15%' , '100%' ],
          //   body:[ [{text: 'Bank Account#:' , margin:[-7 , 7,0,0] } ,
          //    {text: this.rows['accountNumber'] , margin:[0 , 7,0,0]  }
          
          // ]]
          //   }
          //   },
          //   {
          //     layout:'noBorders',
          //     table:{headerRows:1 ,  widths:['15%' , '100%' ],
          //   body:[ [{text: 'IBAN Number:' , margin:[0 , 7,0,0]  } ,
          //    {text: this.rows['iban']  , margin:[0 , 7,0,0] }
          
          // ]]
          //   }
          //   },
          //   {
          //     layout:'noBorders',
          //     table:{headerRows:1 ,  widths:['15%' , '100%' ],
          //   body:[ [{text: 'Swift Code:' , margin:[13 , 7,0,0]  } ,
          //    {text: this.rows['swiftCode'] , margin:[0 , 7,0,0]   }
          
          // ]]
          //   }
          //   },
          //   {
          //     layout:'noBorders',
          //     table:{headerRows:1 ,  widths:['15%' , '100%' ],
          //   body:[ [{text: 'Bank Branch:' , margin:[2 , 7,0,0]  } ,
          //    {text: this.rows['branchName'] , margin:[0 , 7,0,0]   }
          
          // ]]
          //   }
          //   },
          //   {
          //     layout:'noBorders',
          //     table:{headerRows:1 ,  widths:['15%' , '100%' ],
          //   body:[ [{text: 'Account Type:' , margin:[2 , 7,0,0]  } , {text: this.rows['type'] , margin:[0 , 7,0,0]  }
          // ]]
          //   }
          //   },
          //   {
          //     layout:'noBorders', table:{headerRows:1 ,  widths:['15%' , '100%' ],
          //   body:[ [{text: 'Bank Address:' , margin:[2 , 7,0,0]  } ,{text: this.rows['bankAddress'] , margin:[0 , 7,0,0]   }
          // ]]
          //   }
            // }
          ],
          styles:{
           heading:{fontSize: 12,
            bold: true, alignment: 'center',   },
            common:{fontSize:9},
            heading2:{fontSize: 9,
            bold: true, alignment: 'center' },
            tableHeader:{ fillColor: '#f3f3f4' , margin:4 , alignment: 'center' ,fontSize: 8},
            tableHeader2:{   margin:3 , alignment: 'center' , fontSize: 8},
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
