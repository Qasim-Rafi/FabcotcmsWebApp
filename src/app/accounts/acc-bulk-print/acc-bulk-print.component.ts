import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgxNumToWordsService, SUPPORTED_LANGUAGE } from 'ngx-num-to-words';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ServiceService } from 'src/app/shared/service.service';
import { environment } from 'src/environments/environment';
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts.pdfMake.vfs;
@Component({
  selector: 'app-acc-bulk-print',
  templateUrl: './acc-bulk-print.component.html',
  styleUrls: ['./acc-bulk-print.component.css']
})
export class AccBulkPrintComponent implements OnInit {
  rows: any = []
  id : any;
  response: any;
  data : any = {}
  buyerids : any;
amountInWorda:string;
lang : SUPPORTED_LANGUAGE = 'en';
image2: any;
image: any;
billName:any
  constructor( private route: ActivatedRoute,
    private http: HttpClient,
    private spinner:NgxSpinnerService,
    private ngxNumToWordsService: NgxNumToWordsService,
    private toastr: ToastrService,
    private service: ServiceService,

    ) { }

  ngOnInit(): void {
    this.id = localStorage.getItem('bulkPrint');
    this.buyerids = localStorage.getItem('BPbuyerId');
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
    this.bulkPrint();
  }
  bulkPrint() {

   let varr = {
      "ids":this.id,
      "idsBuyer":this.buyerids
    }
    this.spinner.show();
    this.http.
      post(`${environment.apiUrl}/api/BillingPayments/InvoiceBulkPrint`, varr)
      .subscribe(
        res => {
  
          this.response = res;
          if (this.response.success == true) {
    this.data=this.response.data;
    console.log(this.data)
    for(let i=0; i<this.data.length; i++){
      this.data[i].accountName= this.ngxNumToWordsService.inWords(this.data[i].invoiceTotalAmount, this.lang);
     
    }
    console.log(this.data)
  this.print()
            this.toastr.success(this.response.message, 'Message.');
            this.spinner.hide();
   localStorage.removeItem('bulkPrint');
  console.log(this.id);
  setTimeout(() => {
    window.close(); // Close the current tab
  }, 5000); 
          }
          else {
            this.toastr.error(this.response.message, 'Message.');
            this.spinner.hide();
   localStorage.removeItem('bulkPrint');
   localStorage.removeItem('BPbuyerId');

  
          }
  
        }, (err: HttpErrorResponse) => {
          const messages = this.service.extractErrorMessagesFromErrorResponse(err);
          this.toastr.error(messages.toString(), 'Message.');
          console.log(messages);
          this.spinner.hide();
   localStorage.removeItem('bulkPrint');
   localStorage.removeItem('BPbuyerId');
  
        });
  
  }

 
  

  
  print() {
this.billName = "CFbill"
    let docDefinition = {
      pageSize: 'A4',
      pageMargins: [20, 30, 30, 10],
      pageOrientation: 'letter',

      info: {
        title: 'Bill generated'
      },

      content: [
             
  
      ],
     styles:{}



    };

    this.data.forEach((data, index) => {
      const amountInWords = this.ngxNumToWordsService.inWords(data.invoiceTotalAmount, this.lang);
      docDefinition.content.push(
        {
          "image": this.image2,
          fit: [140, 140]

        },
        {

          text: 'FABCOT INTERNATIONAL', style: 'heading', margin: [0, -30, 0, 0]

        },
        {
          margin: [0, 3, 0, 0],
          layout: 'noBorders',
          table: {
            headerRows: 1, widths: ['100%'],
            body: [
              [{ text: '133-Aurangzeb Block New Garden Town Lahore', style: 'headingC' }],]
          }
        },
        {
          margin: [0, 2, 0, 0],
          layout: 'noBorders',
          table: {
            headerRows: 1, widths: ['100%'],
            body: [
              [{ text:"SALES TAX INVOICE'", style: 'headingC' }],]
          }
        },
        {
          margin: [0, 1, 0, 0],
          layout: 'noBorders',
          table: {
            headerRows: 1, widths: ['100%'],
            body: [
              [{ text: 'PNTN No. P-1300724-6', style: 'headingC' }],]
          }
        },
        {
          margin: [0, 1, 0, 20],
          layout: 'noBorders',
          table: {
            headerRows: 1, widths: ['100%'],
            body: [
              [{ text: 'STRN: 3277876195292', style: 'headingC' }],]
          }
        },

        {


          layout: 'noBorders',
          table: {
            headerRows: 1, widths: ['8%', '50%', '8%', '50%'],
            body: [[{ text: 'Seller :', margin: [0, 0, 10, 0], bold: true, style: 'headingF' }, { text: data['sellerName'], margin: [-20, 0, 10, 0], style: 'headingF' },
            { text: 'Buyer :', bold: true, style: 'headingE' }, { text: data['buyerName'],margin:[-60,0,0,0] , style: 'headingF' }

            ]]
          }
        },
        {


          layout: 'noBorders',
          table: {
            headerRows: 1, widths: ['8%', '40%','9.1%', '8%', '40%'],
            body: [[{ text: 'Address :', margin: [0, 0, 0, 0], bold: true, style: 'headingF' }, { text: data['sellerBillingAddress'], margin: [-15, 0, 0, 0], style: 'headingF' },
            { text: '        ', bold: true,   style: 'headingE' },
            { text: 'Address :', bold: true,   style: 'headingE' }, { text: data['buyerBillingAddress'], style: 'headinG' }

            ]]
          }
        },

        {


          layout: 'noBorders',
          table: {
            headerRows: 1, widths: ['20%', '38%', '20%', '50%'],
            body: [[{ text: 'Sales Tax Resgitration No :', bold:true, margin: [0, 0, 0, 0], style: 'headingF' }, { text: data['sellerGST'], margin: [-10, 0, 0, 0], bold: false, style: 'headingF' },
            { text: 'Sales Tax Resgitration No :', bold: true, style: 'headingE' }, { text: data['buyerGST'], margin:[-48,0,0,0]  ,  style: 'headingF' }

            ]]
          }
        },

        {


          layout: 'noBorders',
          table: {
            headerRows: 1, widths: ['8%', '50%', '8%', '50%'],
            body: [[{ text: 'NTN No :', margin: [0, 0, 0, 0], bold: true, style: 'headingF' }, { text: data['sellerNTN'], margin: [-13, 0, 0, 0], bold: false, style: 'headingF' },
            { text: 'NTN No :', bold: true, style: 'headingE' }, { text: data['buyerNTN'], margin:[-50,0,0,0] ,  style: 'headingF' }

            ]]
          }
        },

          {


            layout:'noBorders',
            table:{headerRows:1 ,  widths:['15%' , '60%' ],
          body:[ [{text: 'Supplier Contract# :' , margin: [0 , 0 , 0 , 0] , bold:true , style:'headingF'} , {text: data['supplierContractNumber'] , margin: [-13 , 0 , 0 , 0]  , bold:false , style:'headingF'}

        ]]
          }
          },
        {


          layout: 'noBorders',
          table: {
            headerRows: 1, widths: ['15%', '60%', '30%', '12%'],
            body: [[{ text: 'Fabcot Contract No :', margin: [0, 4, 0, 0], bold: true, style: 'headingF' }, { text: data['contractNumber'], margin: [-10, 4, 0, 0], style: 'headingF' },
            { text:this.billName == "Cbill" || this.billName == "CFbill"? 'Sales Tax Invoice No:':'', margin: [0, 4, 0, 0], bold: true, style: 'headingF' }, { text:this.billName == "Cbill" || this.billName == "CFbill"? data['billInvoiceNumber']:'', margin: [-85, 4, 0, 0], bold: true, style: 'headingF' },




            ]]
          }
        },

        {


          layout: 'noBorders',
          table: {
            headerRows: 1, widths: ['15%', '65%', '33%', '12%'],
            body: [[{ text: 'Contract Date :', margin: [0, 2, 0, 0], bold: true, style: 'headingF' }, { text: data['contractDate'], margin: [-25, 4, 0, 0], style: 'headingF' },
            { text: 'Bill No#:', margin: [15, 2, 0, 0], bold: true, style: 'headingF' }, { text: data['billNumber'], margin: [-125, 4, 0, 0], style: 'headingF' }




            ]]
          }
        },

        {


          layout: 'noBorders',
          table: {
            headerRows: 1, widths: ['90%', '15%'],
            body: [[{ text: 'Invoice Date :', margin: [428, 0, 0, 0], bold: true, style: 'headingF' }, { text: data['billInvoiceDate'], margin: [-13, 0, 0, 0], style: 'headingF' },


            ]]
          }
        },


        {
          margin: [0, 20, 0, 0],
          table: {
            headerRows: 1,
            widths: ['15%', '8.5%', '15%', '8.75%', '9.75%', '11.75%', '11.75%', '9%', '13%'],
            body: [

              [
                { text: 'Description', style: 'tableHeader' },
                { text: 'Sale Invoice#', style: 'tableHeader' }
                , { text: 'Sale Invoice Date', style: 'tableHeader' },
                { text: 'Quantity', style: 'tableHeader' },
                { text: 'Rate' + '(' + data.currencyName + ')', style: 'tableHeader' },

                { text: 'Commission  %age', style: 'tableHeader' },
                { text: 'Amount Excl. Tax', style: 'tableHeader' },
                { text: 'TAX'  + '(' + data.invoiceTaxPercentage + ')', style: 'tableHeader' },

                { text: this.billName == 'Qbill'? 'Amount Excl. Tax' : 'Amount Incl. Tax' , style: 'tableHeader' }],

              ...data['contractSaleInvoices'].map(row => (
                [
                  { text: row.description, style: 'tableHeader2' },

                  { text: row.saleInvoiceNo, style: 'tableHeader2' },
                  { text: row.saleInvoiceDateToDisplay, style: 'tableHeader2' },
                  { text: row.quantity + " " + row.quanityUOM, style: 'tableHeader2' },
                  { text: row.rate, style: 'tableHeader2' },

                  {
                    text: row.commission
                    , style: 'tableHeader2'
                  },
                  { text: row.sellerCommissionAmount, style: 'tableHeader2' },
             
                  { text: Math.round(row.taxAmount), style: 'tableHeader2' },

                  { text: Math.round(row.totalAmount), style: 'tableHeader2' }]
              ))
            ]
          }
        },

        {
          layout: 'noBorders',
          table: {
            headerRows: 1, widths: ['10%', '20%'],
            body: [[
              { text: 'Quantity :', margin: [0, 20, 0, 0], bold: true, style: 'common' },
              { text: data['quantitySum'] + ' ' + data['quanityUOM'], margin: [-10, 20, 0, 0], bold: true, style: 'common' },


            ]]
          }
        },

        {
          layout: 'noBorders',
          table: {
            headerRows: 1, widths: ['20%', '50%', '30%', '10%'],
            body: [[
              { text: 'Amount in Words :', margin: [0, 20, 0, 0], bold: true, style: 'common' },
              { text: amountInWords, margin: [-30, 20, 0, 0], bold: true, decoration: 'underline', style: 'common' },
              { text: 'Sub Total :', margin: [50, 20, 0, 0], bold: true, style: 'common' },
              { text: data['currencyName'] + ' ' + data.billAmount, margin: [-60, 20, 0, 0], decoration: 'underline', style: 'common' }

            ]]
          }
        },
        {
          layout: 'noBorders',
          table: {
            headerRows: 1, widths: ['90%', '10%'],
            body: [[
              { text: 'TAX:', margin: [455, 5, 0, 0], bold: true, style: 'common' },
              { text:
                //  parseFloat(data['invoiceTaxAmountTotal']).toFixed(2) 
                parseFloat(data.invoiceTaxAmountTotal).toFixed(2)
              , margin: [0, 5, 0, 0], decoration: 'underline', style: 'common' },

              
            ]]
          }
        },
        {
          layout: 'noBorders',
          table: {
            headerRows: 1, widths: ['90%', '10%'],
            body: [[
              { text: 'Total:', margin: [455, 5, 0, 0], bold: true, style: 'common' },
              { text: data['currencyName'] + ' ' + data.invoiceTotalAmount, margin: [-10, 5, 0, 0], decoration: 'underline', bold: true, style: 'common' },


            ]]
          }
        },
        {
          layout: 'noBorders',
          table: {
            headerRows: 1, widths: ['100%'],
            body: [[
              { text: 'Your prompt action in this regard would be highly appreciated', margin: [0, -25, 0, 0], style: 'common' },
            ]]
          }
        },
        {
          layout: 'noBorders',
          table: {
            headerRows: 1, widths: ['100%'],
            body: [[
              { text: 'Thanking You', margin: [0, -5, 0, 0], style: 'common' },
            ]]
          }
        },
        {
          layout: 'noBorders',
          table: {
            headerRows: 1, widths: ['20%', '40%', '30%', '10%'],
            body: [[
              { text: 'Checked By:', margin: [0, 10, 0, 0], style: 'common' },
              { text: ' ------------------------------', margin: [-60, 20, 0, 0], style: 'common' },
              { text: 'Aurthorized Signatory:', margin: [60, 10, 0, 0], style: 'common' },
              { text: '  --------------------------', margin: [-15, 20, 0, 0], style: 'common' }

            ]]
          }
        },

      


        index < this.data.length - 1 ? { text: '', pageBreak: 'after' } : null
      );


    });



    docDefinition.styles = {
      heading: {
        fontSize: 18,
        bold: true, alignment: 'center',
      },
      headingC: {
        fontSize: 8,
        alignment: 'center',
      },
      headingF: {
        fontSize: 8,
      },
      headingE: {
        fontSize: 8,
        margin: [-40, 0, 0, 0]
      },
      headinG: {
        fontSize: 8,
        margin: [-50, 0, 0, 0]
      },
      common: { fontSize: 9 },
      heading2: {
        fontSize: 9,
        bold: true, alignment: 'center'
      },
      tableHeader: { fillColor: '#f3f3f4', bold: true, margin: 4, alignment: 'center', fontSize: 8 },
      tableHeader2: { margin: 3, alignment: 'center', fontSize: 8 },
    }


    pdfMake.createPdf(docDefinition).print();

    setTimeout(() => {
      window.close(); // Close the current tab
    }, 5000);
  }
  
  
  





}
