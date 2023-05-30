import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Dateformater } from 'src/app/shared/dateformater';
import { ServiceService } from 'src/app/shared/service.service';
import { environment } from 'src/environments/environment';
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";

pdfMake.vfs = pdfFonts.pdfMake.vfs;
@Component({
  selector: 'app-edit-active-block',
  templateUrl: './edit-active-block.component.html',
  styleUrls: ['./edit-active-block.component.css']
})
export class EditActiveBlockComponent implements OnInit {
  data:any={};
  dateformater: Dateformater = new Dateformater();
  loggedInDepartmentCode: string;
  loggedInDepartmentName: string;
  response: any;
  buyer: any = [];
  article: any = [];
  seller: any = [];
  uomList: any = [];
  currency: any = [];
packing: any = [];
queryParems: any = {};
contractId: any ;
Article: any = [];
image2 : any;
image : any;
printData:any={};
  constructor(
    private service: ServiceService,
    private toastr: ToastrService,
    private modalService: NgbModal,
    private spinner: NgxSpinnerService,
    private router: Router,
    private route: ActivatedRoute,
    private http: HttpClient,
    public datepipe: DatePipe,
  ) { }

  ngOnInit(): void {
    this.queryParems = this.route.snapshot.queryParams;
    this.contractId = this.queryParems.id;
    this.GetBuyersDropdown();
    this.GetSellerDropdown();
    this.GetArticleDropdown();
    this.GetCurrencyDropdown();
    this.GetUOMDropdown()
    this.GetpackingDropdown();
this.getbyIdblock()

this.http.get('/assets/kk.png', { responseType: 'blob' })
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

  }
  getbyIdblock(){
    this.spinner.show()
    this.service.getByIdBlock(this.contractId).subscribe(res => {
      this.response = res;
      if (this.response.success == true) {
        this.data = this.response.data;
        this.printData =this.response.data
        this.data.enquiryDate =this.dateformater.fromModel(this.data.createdDateTime);


        this.Article =this.data.blockBookingArticleList
        for (var i = 0; i < this.Article.length; i++) {
          this.Article[i].mode = 2;
          this.Article[i].isHide =false // Add "total": 2 to all objects in array
      }
      this.spinner.hide()
      }
      else {
        this.spinner.hide()
        this.toastr.error(this.response.message, 'Message.');
      }
    })
  }
  editblock(form: NgForm) {
    this.spinner.show()
    let varr = {
      "contractNumber": this.data.contractNumber,
      "to": this.data.to,
      "attention": this.data.attention,
      "sellerId": this.data.sellerId,
      "buyerId": this.data.buyerId,
      "packingId": this.data.packingId,
      "commission": this.data.commission,
      "commisionUOMId": this.data.commisionUOMId,
      "termOfPayment": this.data.termOfPayment,
      "delivery": this.data.delivery,
      "sellerDelivery": this.data.sellerDelivery,
      "deliverTerms": this.data.deliverTerms,
      "sellerDeliverTerms": this.data.sellerDeliverTerms,
      "condition": this.data.condition,
      "whtExemption": this.data.whtExemption,
      "remarks": this.data.remarks,
      "otherTerms": this.data.otherTerms,
      "note": this.data.note,
      "quantity": this.data.quantity,
      "blockBookingArticleList": this.Article,
    }
    this.service.updateBlock(this.contractId,varr).subscribe(res => {
      this.response = res;
      if (this.response.success == true) {
        this.data = this.response.data;
        this.getbyIdblock();
        this.spinner.hide();
      }
      else {
        this.toastr.error(this.response.message, 'Message.');
        this.spinner.hide();
      }
    })

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
  GetSellerDropdown() {
    this.service.GetSellerDropdownbydepartment().subscribe(res => {
      this.response = res;
      if (this.response.success == true) {
        this.seller = this.response.data;
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
  GetCurrencyDropdown() {
    this.service.getCurrencyType().subscribe(res => {
      this.response = res;
      if (this.response.success == true) {
        this.currency = this.response.data;
      }
      else {
        this.toastr.error(this.response.message, 'Message.');
      }
    })
  }
  GetUOMDropdown() {
    this.service.getUOM().subscribe(res => {
      this.response = res;
      if (this.response.success == true) {
        this.uomList = this.response.data;
      }
      else {
        this.toastr.error(this.response.message, 'Message.');
      }
    })
  }
  GetpackingDropdown() {
    this.service.getPackaging().subscribe(res => {
      this.response = res;
      if (this.response.success == true) {
        this.packing = this.response.data;
      }
      else {
        this.toastr.error(this.response.message, 'Message.');
      }
    })
  }
  addArticle() {
    this.Article.push({ id: 0 ,mode:1,isHide:false});

  }
  removeArticle(i: number) {
    if(this.Article[i].id == 0 && this.Article[i].mode == 1){
      this.Article.splice(i, 1);
    }
    else if(this.Article[i].id != 0){
      this.Article[i].mode =3
      this.Article[i].isHide =true

    }
    
  }



  printS(){
            
           
       
     if(this.printData.blockBookingArticleList.length == 1){       
           
    let docDefinition = {
      pageSize: 'A4',
      pageMargins: [ 5, 10, 5, 10 ],
      pageOrientation: 'letter',
        
            info: {
              title: 'Contract Seller'
            },
         
            content: [
           
              {
                "image" : this.image2,
               fit : [130 , 130] , margin:[420,5,0,0]
            
              },
              {
                layout:'noBorders',
                margin: [20 , -50 , 0 , 0],
                table:{headerRows: 1 , widths:['60%' , '40%' ],
              body: [
                [{text:'FABCOT INTERNATIONAL'  , style:'heading10'} ,
                // {text:this.checkR  , style:'heading10'}
              ],] }
              },
              {
                layout:'noBorders',
                margin: [20 , 8 , 0 , 0],
                table:{headerRows: 1 , widths:['100%' ],
              body: [
                [{text:'133 Aurangzeb Block, New Garden Town, Lahore'  , style:'heading'} 
              ],] }
              },
              {
                layout:'noBorders',
                margin: [20 , 8 , 0 , 0],
                table:{headerRows: 1 , widths:['20%' , '50%' ],
              body: [
                [{text:'Tel. +92-42-35846171-4'  , style:'heading'} ,
                {text:'Fax: +92-42-35846175'  , style:'heading'} 
              ],] }
              },
              {
                layout:'noBorders',
                margin: [20 , 8 , 0 , 0],
                table:{headerRows: 1 , widths:['100%' ],
              body: [
                [{text:'www.fabcotonline.com'  , style:'heading'} 
              ],] }
              },
              { 
                margin:[0,-56,0,0],
                canvas: 
                [
                    
                    {
                      type: 'line',
                      x1: 0, y1: 60,
                      x2: 590, y2: 60,
                      lineWidth: 0.5,
                    

                    }
                ]
             },
             { 
              margin:[0,-59.5,0,0],
              canvas: 
              [
                  
                  {
                    type: 'line',
                    x1: 0, y1: 60,
                    x2: 590, y2: 60,
                    lineWidth: 0.5,
                  

                  }
              ]
           },
                 {
                layout:'noBorders',
                margin: [70 , 2 , 0 , 0],
                table:{headerRows: 1 , widths:['50%' , '50%'],
              body: [
                [{text:'To:  ' + this.printData['to']  , style:'heading'} ,
                {text:'Contract No:  ' + this.printData['contractNumber']  , margin:[60, 0,0,0] , style:'heading'}
              ],] }
              },
              {
                layout:'noBorders',
                margin: [70 , 0 , 0 , 0],
                table:{headerRows: 1 , widths:['50%' , '50%'],
              body: [
                [{text:'Attn:  ' + this.printData['attention']  , style:'heading'} ,
                {text:'Contract Date:  ' + this.printData['createdDateTime']  , margin:[60, 0,0,0] , style:'heading'}
              ],] }
              },
              { 
                margin:[0,-49,0,0],
                canvas: 
                [
                    
                    {
                      type: 'line',
                      x1: 0, y1: 60,
                      x2: 590, y2: 60,
                      lineWidth: 0.5,
                    

                    }
                ]
             },
             { 
              margin:[0,-58.5,0,0],
              canvas: 
              [
                  
                  {
                    type: 'line',
                    x1: 0, y1: 60,
                    x2: 590, y2: 60,
                    lineWidth: 0.5,
                   

                  }
              ]
           },
              {
                layout:'noBorders',
                margin: [140 , 10 , 0 , 0],
                table:{headerRows: 1 , widths:['100%'],
              body: [
                [{text:'We are pleased to confirm here the booking as per following terms and conditions. ' , style:'heading'}  ],] }
              },

              { 
                margin:[10,-105,0,0],
                canvas: 
                [
                    
                    {
                      type: 'line',
                      x1: 120, y1: 90,
                      x2:120, y2: 730,
                      lineWidth: 1,
                      
                    }
                ]
             },
            //  {
            //   layout:'noBorders',
            //   margin: [20 , -510 , 0 , 0],
            //   table:{headerRows: 1 , widths:['20%' , '45%'  ],
            // body: [
            //   [{text:'Buyer Name:'  , style:'heading'} , {text: this.printData['buyerName'] ,margin:[-30,0,0,0] ,   style:'heading2'} , 
            
            // ],] }
            // },   

            {
              layout:'noBorders',
              margin: [20 , -600 , 0 , 0],
              table:{headerRows: 1 , widths:['20%' , '45%'  ],
            body: [
              [{text:'Buyer Name:'  , style:'heading'} , {text: this.printData['buyerName'] ,margin:[-5,0,0,0] ,   style:'heading2'} , 
                      
            ],] }
            },

               {
                layout:'noBorders',
                margin: [20 , 2 , 0 , 0],
                table:{headerRows: 1 , widths:['20%' , '45%'],
              body: [
                [{text:'Seller Name:'  , style:'heading'} , {text: this.printData['sellerName'] , margin:[-5,0,0,0],    style:'heading2'}],] }
              },
             
               {
                layout:'noBorders',
                margin: [20 , 2 , 0 , 0],
                table:{headerRows: 1 , widths:['20%' , '40%'],
              body: [
                [{text:'Quality:'  , style:'heading'} , {text: this.printData.blockBookingArticleList[0]['articleName'], margin:[-5,0,0,0],    style:'heading2'}],] }
              },
              {
                layout:'noBorders',
                margin: [20 , 2 , 0 , 0],
                table:{headerRows: 1 , widths:['20%' , '40%'],
              body: [
                [{text:'Quantity:'  , style:'heading'} , {text: this.printData['quantity'] +' '+this.printData.blockBookingArticleList[0]['quantityUOMName'] 
                , margin:[-5,0,0,0] , style:'heading2'}],] }
              },

              {
                layout:'noBorders',
                margin: [20 , 2 , 0 , 0],
                table:{headerRows: 1 , widths:['20%' , '40%'],
              body: [
                [{text:'Rate:'  , style:'heading'} , {text:this.printData.blockBookingArticleList[0]['currencyName'] +' /'+ this.printData.blockBookingArticleList[0]['rate'] +' '+this.printData.blockBookingArticleList[0]['rateUOMName'], margin:[-5,0,0,0]  , style:'heading2'}],] }
              },
           
              {
                layout:'noBorders',
                margin: [20 , 2 , 0 , 0],
                table:{headerRows: 1 , widths:['20%' , '40%'],
              body: [
                [{text:'Packing:'  , style:'heading'} , {text: this.printData['packingName'] ,    margin:[-5,0,0,0] , style:'heading2'}],] }
              },
              {
                layout:'noBorders',
                margin: [20 , 2 , 0 , 0],
                table:{headerRows: 1 , widths:['20%' , '40%'],
              body: [
                [{text:'Terms of Payment:'  , style:'heading'} , {text: this.printData['termOfPayment'] ,  margin:[-5,0,0,0] ,style:'heading2'}],] }
              },

                 {
                layout:'noBorders',
                margin: [20 , 2 , 0 , 0],
                table:{headerRows: 1 , widths:['20%' , '40%'],
              body: [
                [{text:'Buyer Delivery:'  , style:'heading'} , {text: this.printData['delivery'] ,  margin:[-5,0,0,0] ,style:'heading2'}],] }
              },

              {
                layout:'noBorders',
                margin: [20 , 2 , 0 , 0],
                table:{headerRows: 1 , widths:['20%' , '40%'],
              body: [
                [{text:'Seller Delivery:'  , style:'heading'} , {text: this.printData['sellerDelivery'] ,  margin:[-5,0,0,0] ,style:'heading2'}],] }
              },

                 {
                layout:'noBorders',
                margin: [20 , 2 , 0 , 0],
                table:{headerRows: 1 , widths:['20%' , '40%'],
              body: [
                [{text:'Commission:'  , style:'heading'} , {text: this.printData['commission'] ,  margin:[-5,0,0,0] ,style:'heading2'}],] }
              },
        

              {
                layout: 'noBorders',
                margin: [20, 2, 0, 0],
                table: {
                  headerRows: 1, widths: ['20%', '40%'],
                  body: [
                    [
                      { text: 'Buyer Delivery Terms:', style: 'heading' }, { text: this.printData['deliverTerms'], style: 'heading2', margin: [-5, 0, 0, 0] },
                      // {text: "Margin:"  , margin:[-120,0,0,0] , style:'heading'} ,
                    ],
                  ]
                }
              },

              {
                layout: 'noBorders',
                margin: [20, 2, 0, 0],
                table: {
                  headerRows: 1, widths: ['20%', '40%'],
                  body: [
                    [
                      { text: 'Seller Delivery Terms:', style: 'heading' }, { text: this.printData['sellerDeliverTerms'], style: 'heading2', margin: [-5, 0, 0, 0] },
                      // {text: "Margin:"  , margin:[-120,0,0,0] , style:'heading'} ,
                    ],
                  ]
                }
              },
            

             
              {

                layout:'noBorders',
                margin: [20 , 2 , 0 , 0],
                table:{headerRows: 1 , widths:['20%' , '40%'],
              body: [
                [{text:'Condition:'  , style:'heading'} , {text: this.printData['condition'] , margin:[-5,0,0,0] , style:'heading2'}],] }
              },
              {
                layout:'noBorders',
                margin: [20 , 2 , 0 , 0],
                table:{headerRows: 1 , widths:['20%' , '40%'],
              body: [
                [{text:'W.H.T Exemption:'  , style:'heading'} , {text: this.printData['whtExemption'] , margin:[-5,0,0,0] , style:'heading2'}],] }
              },

              {
                layout:'noBorders',
                margin: [20 , 2 , 0 , 0],
                table:{headerRows: 1 , widths:['20%' , '40%'],
              body: [
                [{text:'Other Terms:'  , style:'heading'} , {text: this.printData['otherTerms'] , margin:[-5,0,0,0] , style:'heading2'}],] }
              },

              {
                layout:'noBorders',
                margin: [20 , 2 , 0 , 0],
                table:{headerRows: 1 , widths:['20%' , '40%'],
              body: [
                [{text:'Remarks:'  , style:'heading'} , {text: this.printData['remarks'] , margin:[-5,0,0,0] , style:'heading2'}],] }
              },

  
              { 
                margin:[0,0,0,0],
                canvas: 
                [
                    
                    {
                      type: 'line',
                      x1: 0, y1: 300,
                      x2: 590, y2: 300,
                      lineWidth: 1,

                    }
                ]
             },
  {
                layout:'noBorders',
                margin: [20 , 2 , 0 , 0],
                table:{headerRows: 1 , widths:['20%' , '40%'],
              body: [
                [{text:'Note:'  , style:'heading'} , {text: this.printData['note'] , margin:[-5,0,0,0] , style:'heading2'}],] }
              },

              //  {
              //   layout:'noBorders',
              //   margin: [20 , 80 , 0 , 0],
              //   table:{headerRows: 1 , widths:['100%'],
              // body: [
              //   [{text:'Please get it signed & send back same for our record purpose'  ,  style:'heading'}],] }
              // },
              // {
              //   layout:'noBorders',
              //   margin: [20 , 10 , 0 , 0],
              //   table:{headerRows: 1 , widths:['100%'],
              // body: [
              //   [{text:'For FabCot International'  , style:'heading'}],] }
              // },
           
            ],

            footer:{
              margin: [20, 2,0,0],
              columns: [
                'NOTE: This is a system generated Contract and does not require any signature.',
                { text: '', alignment: 'center' , style:'tableheader'}
              ]
            },
          //   footer: {
          //     columns: [
          //         'Report generated on 8/30/2021 6:02:31PM',
          //         'Developed by XYZ Fitness Software',
          //         {
          //             alignment: 'right',
          //             text: 'Page 1 of 2'
          //         },
          //         {
          //           alignment: 'right',
          //           text: 'www.xyz.com'
          //       },
          //     ],
          //     margin: [60, 10, 60, 10 ]
          // },
            styles:{
              heading:{fontSize: 10,
               bold: true,
              //  font:ti,
               // color: '#4d4b4b'
              },
               heading10:{fontSize: 10,
                 bold: true,
                 // color: '#4d4b4b' 
               },
               heading4:{fontSize: 8,
                bold: true,
               },
               heading5:{fontSize: 8,
               },
               heading2:{fontSize: 9  , 
                 // color:'#4d4b4b'
                 },
                 heading3:{fontSize: 7  , 
                   // color:'#4d4b4b'
                     bold:true
               },
               lineColor:{
                 // color:'#535353'
               },
                 tableheader: {
                   fillColor: '#f3f3f4',
                   fontSize: 9,
                   bold: true,
                   // color: '#4d4b4b',
                  alignment:'center',
                   margin:8
                 
                  }
             },
            
  
    };
    pdfMake.createPdf(docDefinition).print();
  }
  else{
    let docDefinition = {
      pageSize: 'A4',
      pageMargins: [ 5, 10, 5, 10 ],
      pageOrientation: 'letter',
        
            info: {
              title: 'Contract Seller'
            },
         
            content: [
           
              {
                "image" : this.image2,
               fit : [130 , 130] , margin:[420,5,0,0]
            
              },
              {
                layout:'noBorders',
                margin: [20 , -50 , 0 , 0],
                table:{headerRows: 1 , widths:['60%' , '40%' ],
              body: [
                [{text:'FABCOT INTERNATIONAL'  , style:'heading10'} ,
                // {text:this.checkR  , style:'heading10'}
              ],] }
              },
              {
                layout:'noBorders',
                margin: [20 , 8 , 0 , 0],
                table:{headerRows: 1 , widths:['100%' ],
              body: [
                [{text:'133 Aurangzeb Block, New Garden Town, Lahore'  , style:'heading'} 
              ],] }
              },
              {
                layout:'noBorders',
                margin: [20 , 8 , 0 , 0],
                table:{headerRows: 1 , widths:['20%' , '50%' ],
              body: [
                [{text:'Tel. +92-42-35846171-4'  , style:'heading'} ,
                {text:'Fax: +92-42-35846175'  , style:'heading'} 
              ],] }
              },
              {
                layout:'noBorders',
                margin: [20 , 8 , 0 , 0],
                table:{headerRows: 1 , widths:['100%' ],
              body: [
                [{text:'www.fabcotonline.com'  , style:'heading'} 
              ],] }
              },
              { 
                margin:[0,-56,0,0],
                canvas: 
                [
                    
                    {
                      type: 'line',
                      x1: 0, y1: 60,
                      x2: 590, y2: 60,
                      lineWidth: 0.5,
                    

                    }
                ]
             },
             { 
              margin:[0,-59.5,0,0],
              canvas: 
              [
                  
                  {
                    type: 'line',
                    x1: 0, y1: 60,
                    x2: 590, y2: 60,
                    lineWidth: 0.5,
                  

                  }
              ]
           },
                 {
                layout:'noBorders',
                margin: [70 , 2 , 0 , 0],
                table:{headerRows: 1 , widths:['50%' , '50%'],
              body: [
                [{text:'To:  ' + this.printData['to']  , style:'heading'} ,
                {text:'Contract No:  ' + this.printData['contractNumber']  , margin:[60, 0,0,0] , style:'heading'}
              ],] }
              },
              {
                layout:'noBorders',
                margin: [70 , 0 , 0 , 0],
                table:{headerRows: 1 , widths:['50%' , '50%'],
              body: [
                [{text:'Attn:  ' + this.printData['attention']  , style:'heading'} ,
                {text:'Contract Date:  ' + this.printData['createdDateTime']  , margin:[60, 0,0,0] , style:'heading'}
              ],] }
              },
              { 
                margin:[0,-49,0,0],
                canvas: 
                [
                    
                    {
                      type: 'line',
                      x1: 0, y1: 60,
                      x2: 590, y2: 60,
                      lineWidth: 0.5,
                    

                    }
                ]
             },
             { 
              margin:[0,-58.5,0,0],
              canvas: 
              [
                  
                  {
                    type: 'line',
                    x1: 0, y1: 60,
                    x2: 590, y2: 60,
                    lineWidth: 0.5,
                   

                  }
              ]
           },
              {
                layout:'noBorders',
                margin: [140 , 10 , 0 , 0],
                table:{headerRows: 1 , widths:['100%'],
              body: [
                [{text:'We are pleased to confirm here the booking as per following terms and conditions. ' , style:'heading'}  ],] }
              },

              { 
                margin:[10,-105,0,0],
                canvas: 
                [
                    
                    {
                      type: 'line',
                      x1: 120, y1: 90,
                      x2:120, y2: 720,
                      lineWidth: 1,
                      
                    }
                ]
             },
            //  {
            //   layout:'noBorders',
            //   margin: [20 , -510 , 0 , 0],
            //   table:{headerRows: 1 , widths:['20%' , '45%'  ],
            // body: [
            //   [{text:'Buyer Name:'  , style:'heading'} , {text: this.printData['buyerName'] ,margin:[-30,0,0,0] ,   style:'heading2'} , 
            
            // ],] }
            // },   

            {
              layout:'noBorders',
              margin: [20 , -610 , 0 , 0],
              table:{headerRows: 1 , widths:['20%' , '45%'  ],
            body: [
              [{text:'Buyer Name:'  , style:'heading'} , {text: this.printData['buyerName'] ,margin:[-5,0,0,0] ,   style:'heading2'} , 
                      
            ],] }
            },
            {
              layout:'noBorders',
              margin: [20 , 2 , 0 , 0],
              table:{headerRows: 1 , widths:['20%' , '40%'],
            body: [
              [{text:'Quantity:'  , style:'heading'} , {text: this.printData['quantity'] ,    margin:[-5,0,0,0] , style:'heading2'}],] }
            },
               {
                layout:'noBorders',
                margin: [20 , 2 , 0 , 0],
                table:{headerRows: 1 , widths:['20%' , '45%'],
              body: [
                [{text:'Seller Name:'  , style:'heading'} , {text: this.printData['sellerName'] , margin:[-5,0,0,0],    style:'heading2'}],] }
              },
             
              {
                margin: [140 , 10  , 0 , 10],
               
                table:{
                  headerRows:1,
                  widths: [ '35%'  , '15%'  ],
                  body:[
                    [ {text:'Quality' , style: 'tableheader2' , },
                    //  {text:'Quantity' , style: 'tableheader2'},
                    {text:'Rate' , style: 'tableheader2'},

                  ],
            ...this.printData['blockBookingArticleList'].map((row=>
              [
                // row.articleName  , row.contractArticleQuantity, row.contractArticleCommission,
                // row.contractArticleRate 
                     {text: row.articleName, style: 'tableheader3'} , 
                    //  {text: row.quantity +' '+ row.quantityUOMName , style: 'tableheader3'},
                     {text: row.rate +' '+ row.rateUOMName, style: 'tableheader3'}

                ]
              ))
          
                  ]
                }
              },
           
              {
                layout:'noBorders',
                margin: [20 , 2 , 0 , 0],
                table:{headerRows: 1 , widths:['20%' , '40%'],
              body: [
                [{text:'Packing:'  , style:'heading'} , {text: this.printData['packingName'] ,    margin:[-5,0,0,0] , style:'heading2'}],] }
              },
              {
                layout:'noBorders',
                margin: [20 , 2 , 0 , 0],
                table:{headerRows: 1 , widths:['20%' , '40%'],
              body: [
                [{text:'Terms of Payment:'  , style:'heading'} , {text: this.printData['termOfPayment'] ,  margin:[-5,0,0,0] ,style:'heading2'}],] }
              },

                 {
                layout:'noBorders',
                margin: [20 , 2 , 0 , 0],
                table:{headerRows: 1 , widths:['20%' , '40%'],
              body: [
                [{text:'Buyer Delivery:'  , style:'heading'} , {text: this.printData['delivery'] ,  margin:[-5,0,0,0] ,style:'heading2'}],] }
              },

              {
                layout:'noBorders',
                margin: [20 , 2 , 0 , 0],
                table:{headerRows: 1 , widths:['20%' , '40%'],
              body: [
                [{text:'Seller Delivery:'  , style:'heading'} , {text: this.printData['sellerDelivery'] ,  margin:[-5,0,0,0] ,style:'heading2'}],] }
              },

                 {
                layout:'noBorders',
                margin: [20 , 2 , 0 , 0],
                table:{headerRows: 1 , widths:['20%' , '40%'],
              body: [
                [{text:'Commission:'  , style:'heading'} , {text: this.printData['commission'] ,  margin:[-5,0,0,0] ,style:'heading2'}],] }
              },
        

              {
                layout: 'noBorders',
                margin: [20, 2, 0, 0],
                table: {
                  headerRows: 1, widths: ['20%', '40%'],
                  body: [
                    [
                      { text: 'Buyer Delivery Terms:', style: 'heading' }, { text: this.printData['deliverTerms'], style: 'heading2', margin: [-5, 0, 0, 0] },
                      // {text: "Margin:"  , margin:[-120,0,0,0] , style:'heading'} ,
                    ],
                  ]
                }
              },
            
              {
                layout: 'noBorders',
                margin: [20, 2, 0, 0],
                table: {
                  headerRows: 1, widths: ['20%', '40%'],
                  body: [
                    [
                      { text: 'Seller Delivery Terms:', style: 'heading' }, { text: this.printData['sellerDeliverTerms'], style: 'heading2', margin: [-5, 0, 0, 0] },
                      // {text: "Margin:"  , margin:[-120,0,0,0] , style:'heading'} ,
                    ],
                  ]
                }
              },
             
              {

                layout:'noBorders',
                margin: [20 , 2 , 0 , 0],
                table:{headerRows: 1 , widths:['20%' , '40%'],
              body: [
                [{text:'Condition:'  , style:'heading'} , {text: this.printData['condition'] , margin:[-5,0,0,0] , style:'heading2'}],] }
              },
              {
                layout:'noBorders',
                margin: [20 , 2 , 0 , 0],
                table:{headerRows: 1 , widths:['20%' , '40%'],
              body: [
                [{text:'W.H.T Exemption:'  , style:'heading'} , {text: this.printData['whtExemption'] , margin:[-5,0,0,0] , style:'heading2'}],] }
              },

              {
                layout:'noBorders',
                margin: [20 , 2 , 0 , 0],
                table:{headerRows: 1 , widths:['20%' , '40%'],
              body: [
                [{text:'Other Terms:'  , style:'heading'} , {text: this.printData['otherTerms'] , margin:[-5,0,0,0] , style:'heading2'}],] }
              },

              {
                layout:'noBorders',
                margin: [20 , 2 , 0 , 0],
                table:{headerRows: 1 , widths:['20%' , '40%'],
              body: [
                [{text:'Remarks:'  , style:'heading'} , {text: this.printData['remarks'] , margin:[-5,0,0,0] , style:'heading2'}],] }
              },

  
              { 
                margin:[0,0,0,0],
                canvas: 
                [
                    
                    {
                      type: 'line',
                      x1: 0, y1: 270,
                      x2: 590, y2: 270,
                      lineWidth: 1,

                    }
                ]
             },
  {
                layout:'noBorders',
                margin: [20 , 2 , 0 , 0],
                table:{headerRows: 1 , widths:['20%' , '40%'],
              body: [
                [{text:'Note:'  , style:'heading'} , {text: this.printData['note'] , margin:[-5,0,0,0] , style:'heading2'}],] }
              },

              //  {
              //   layout:'noBorders',
              //   margin: [20 , 80 , 0 , 0],
              //   table:{headerRows: 1 , widths:['100%'],
              // body: [
              //   [{text:'Please get it signed & send back same for our record purpose'  ,  style:'heading'}],] }
              // },
              // {
              //   layout:'noBorders',
              //   margin: [20 , 10 , 0 , 0],
              //   table:{headerRows: 1 , widths:['100%'],
              // body: [
              //   [{text:'For FabCot International'  , style:'heading'}],] }
              // },
           
            ],

            footer:{
              margin: [20, 2,0,0],
              columns: [
                'NOTE: This is a system generated Contract and does not require any signature.',
                { text: '', alignment: 'center' , style:'tableheader'}
              ]
            },
          //   footer: {
          //     columns: [
          //         'Report generated on 8/30/2021 6:02:31PM',
          //         'Developed by XYZ Fitness Software',
          //         {
          //             alignment: 'right',
          //             text: 'Page 1 of 2'
          //         },
          //         {
          //           alignment: 'right',
          //           text: 'www.xyz.com'
          //       },
          //     ],
          //     margin: [60, 10, 60, 10 ]
          // },
            styles:{
              heading:{fontSize: 10,
               bold: true,
              //  font:ti,
               // color: '#4d4b4b'
              },
               heading10:{fontSize: 10,
                 bold: true,
                 // color: '#4d4b4b' 
               },
               heading4:{fontSize: 8,
                bold: true,
               },
               heading5:{fontSize: 8,
               },
               heading2:{fontSize: 9  , 
                 // color:'#4d4b4b'
                 },
                 heading3:{fontSize: 7  , 
                   // color:'#4d4b4b'
                     bold:true
               },
               lineColor:{
                 // color:'#535353'
               },
                 tableheader: {
                   fillColor: '#f3f3f4',
                   fontSize: 9,
                   bold: true,
                   // color: '#4d4b4b',
                  alignment:'center',
                   margin:8
                 
                  },
                  tableheader3: {
                            
                    fontSize: 8,
                   
                    color: '#4d4b4b',
                   alignment:'center',
                    margin:5
                  
                   },
                   tableheader2: {
                    // fillColor: '#f3f3f4',
                    fontSize: 10,
                    bold: true,
                    color: '#4d4b4b',
                   alignment:'center',
                    margin:5
                  
                   },
             },
            
  
    };
    pdfMake.createPdf(docDefinition).print();
  }

   
  
  }

}
