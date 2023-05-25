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
      }
      else {
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
      "deliverTerms": this.data.deliverTerms,
      "condition": this.data.condition,
      "whtExemption": this.data.whtExemption,
      "remarks": this.data.remarks,
      "otherTerms": this.data.otherTerms,
      "note": this.data.note,
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
            
           
       
            
           
    let docDefinition = {
      pageSize: 'A4',
      pageMargins: [ 5, 5, 5, 10 ],
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
                [{text:'To:  ' + this.printData['to']  , style:'heading'} ,
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
                margin: [105 , 0 , 0 , 0],
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
                      x1: 90, y1: 90,
                      x2:90, y2: 630,
                      lineWidth: 1,
                      
                    }
                ]
             },
             {
              layout:'noBorders',
              margin: [20 , -510 , 0 , 0],
              table:{headerRows: 1 , widths:['20%' , '45%' , '10%' , '10%' , '5%', '10%'  ],
            body: [
              [{text:'Buyer Name:'  , style:'heading'} , {text: this.printData['buyerName'] ,margin:[-30,0,0,0] ,   style:'heading2'} , 
              // {text:this.printData['buyerNTNNumber'] ==''? '' : 'NTN:'  , style:'heading4' ,margin:[0,0,0,0]} , 
              // {text: this.printData['buyerNTNNumber'], style:'heading5' ,margin:[-38,0,0,0] }, 
              // {text:this.printData['buyerGSTNumber'] ==''? '' :'GST:'  , style:'heading4' ,margin:[-15,0,0,0]} , 
              // {text: this.printData['buyerGSTNumber'], style:'heading5' ,margin:[-28,0,0,0] }, 
            
            
            ],] }
            },

            {
              layout:'noBorders',
              margin: [20 , -510 , 0 , 0],
              table:{headerRows: 1 , widths:['20%' , '45%' , '10%' , '10%' , '5%', '10%'  ],
            body: [
              [{text:'Seller Name:'  , style:'heading'} , {text: this.printData['sellerName'] ,margin:[-30,0,0,0] ,   style:'heading2'} , 
              // {text:this.printData['buyerNTNNumber'] ==''? '' : 'NTN:'  , style:'heading4' ,margin:[0,0,0,0]} , 
              // {text: this.printData['buyerNTNNumber'], style:'heading5' ,margin:[-38,0,0,0] }, 
              // {text:this.printData['buyerGSTNumber'] ==''? '' :'GST:'  , style:'heading4' ,margin:[-15,0,0,0]} , 
              // {text: this.printData['buyerGSTNumber'], style:'heading5' ,margin:[-28,0,0,0] }, 
            
            
            ],] }
            },
             
               {
                layout:'noBorders',
                margin: [20 , 2 , 0 , 0],
                table:{headerRows: 1 , widths:['20%' , '40%'],
              body: [
                [{text:'Quality:'  , style:'heading'} , {text: this.printData['articleName'] , margin:[-35,0,0,0],    style:'heading2'}],] }
              },
              {
                layout:'noBorders',
                margin: [20 , 2 , 0 , 0],
                table:{headerRows: 1 , widths:['20%' , '40%'],
              body: [
                [{text:'Quantity:'  , style:'heading'} , {text: this.printData['pickInsertionName'] , margin:[-35,0,0,0] , style:'heading2'}],] }
              },

              {
                layout:'noBorders',
                margin: [20 , 2 , 0 , 0],
                table:{headerRows: 1 , widths:['20%' , '40%'],
              body: [
                [{text:'Rate:'  , style:'heading'} , {text: this.printData['width'] == null ?  " " : this.printData['width'] + " inch" , margin:[-35,0,0,0]  , style:'heading2'}],] }
              },
           
              {
                layout:'noBorders',
                margin: [20 , 2 , 0 , 0],
                table:{headerRows: 1 , widths:['20%' , '40%'],
              body: [
                [{text:'Packing:'  , style:'heading'} , {text: this.printData['weaveName'] ,    margin:[-35,0,0,0] , style:'heading2'}],] }
              },
              {
                layout:'noBorders',
                margin: [20 , 2 , 0 , 0],
                table:{headerRows: 1 , widths:['20%' , '40%'],
              body: [
                [{text:'Terms of Payment:'  , style:'heading'} , {text: this.printData['selvedgeName'] ,  margin:[-35,0,0,0] ,style:'heading2'}],] }
              },
              {
                layout:'noBorders',
                margin: [20 , 2 , 0 , 0],
                table:{headerRows: 1 , widths:['20%' , '7%' , '40%'],
              body: [
                [ {text: "Commission:" , margin:[-35,0,0,0] , style:'heading'} ,  {text: this.printData['blendingRatioWarpName'] , margin:[-40,0,0,0] ,  style:'heading2'}],] }
              },
              {
                layout:'noBorders',
                margin: [20 , 2 , 0 , 0],
                table:{headerRows: 1 , widths:['20%' , '5%' ,'40%'],
              body: [
                [
                 {text: "Delivery:" , margin:[-35,0,0,0] , style:'heading'} ,  {text: this.printData['blendingRatioWeftpName'] , margin:[-30,0,0,0] , style:'heading2'}],] }
              },
        

{
                layout:'noBorders',
                margin: [20 , 2 , 0 , 0],
                table:{headerRows: 1 , widths:['20.5%' , '35%' , '10%' , '20%'],
              body: [
                [
                  {text:'Delivery Terms:'  , style:'heading'} , {text: this.printData['quantity'] ,  style:'heading2' , margin:[-35,0,0,0]}, {text: "Margin:"  , margin:[-120,0,0,0] , style:'heading'} ,
                   ],
                ] }
              },
            
//               {
//                 layout:'noBorders',
//                 margin: [22 , 2 , 0 , 0],
//                 table:{headerRows: 1 , widths:['21%' , '20%' , '10%' , '20%' , '10%' , '10%','5%','5%'],
//               body: [
//                 [
//                   {text:'Rate:'  , style:'heading'} , {text: this.contractCostingData['rateUOMName'] == "Meters" ?  
//                   this.contractCostingData['rateCurrencyName'] == 'PKR' ? "Rs " + this.contractCostingData['rate']  + " /  Meter"  :  this.contractCostingData['rateCurrencyName'] == 'USD' ? " $ " + this.contractCostingData['rate'] +  " /  Meter" : " €" + this.contractCostingData['rateCurrencyName'] == 'EUR' ? this.contractCostingData['rate'] +  " /  Meter" : " £ " +  this.contractCostingData['rateCurrencyName'] == 'GBP' ? this.contractCostingData['rate'] + " /  Meter" : ''
//                   : 
//                   this.contractCostingData['rateCurrencyName'] == 'PKR' ? " Rs " + this.contractCostingData['rate'] +  " / Yard" : " $ " +  this.contractCostingData['rateCurrencyName'] == 'USD' ? this.contractCostingData['rate'] +  " /  Yard" : this.contractCostingData['rateCurrencyName'] == 'EUR' ? " € " + this.contractCostingData['rate'] +  " /  Yard" :  this.contractCostingData['rateCurrencyName'] == 'GBP' ? "£ " + this.contractCostingData['rate'] +  " /  Yard" : '' 
                  
//                    ,
                  
//                    style:'heading2' , margin:[-35,0,0,0]},
//                     {text: "GST:"  , margin:[-25,0,0,0] , style:'heading'} , {text: this.printData['gst'] != null ? this.contractCostingData['gst'] + "%" : " "  , margin:[-60,0,0,0] , style:'heading2'} ,
//                     {text: "AI.Tax:" , margin:[-120,0,0,0] , style:'heading'} , {text: this.contractCostingData['adIncomeTaxFL'] != null ? this.contractCostingData['adIncomeTaxFL'] + "%" : "0"  , margin:[-140,0,0,0] , style:'heading2'} ,
//                      {text: "W.Tax:"  , margin:[-140,0,0,0] , style:'heading'} , {text: "As applicable by Government Law"  , margin:[-140,0,0,0] , style:'heading2'}],
//                 ] }
//               },
//               {
//                 layout:'noBorders',
//                 margin: [20 , 2 , 0 , 0],
//                 table:{headerRows: 1 , widths:['20.5%' , '39%' , '20%' , '20%'],
//               body: [
//                 [{text:'Total Amount:'  , style:'heading'} , {text:    
//                 this.contractCostingData['rateCurrencyName'] + " "+ this.contractCostingData['contractCost'] ,  margin:[-35,0,0,0] ,style:'heading2'} , {text: "Amount Incl GST:"  , margin:[-160,0,0,0] , style:'heading'} , {text: 
                
//                   this.contractCostingData['rateCurrencyName'] + " " + this.contractCostingData['totalCostGSt']   , margin:[-200,0,0,0] , style:'heading2'}],] }
//               },
             
              {

                layout:'noBorders',
                margin: [20 , 2 , 0 , 0],
                table:{headerRows: 1 , widths:['20%' , '40%'],
              body: [
                [{text:'Condition:'  , style:'heading'} , {text: this.printData['packingName'] , margin:[-35,0,0,0] , style:'heading2'}],] }
              },
              {
                layout:'noBorders',
                margin: [20 , 2 , 0 , 0],
                table:{headerRows: 1 , widths:['20%' , '40%'],
              body: [
                [{text:'W.H.T Exemption:'  , style:'heading'} , {text: this.printData['sellerPieceLengthName'] , margin:[-35,0,0,0] , style:'heading2'}],] }
              },

              {
                layout:'noBorders',
                margin: [20 , 2 , 0 , 0],
                table:{headerRows: 1 , widths:['20%' , '40%'],
              body: [
                [{text:'Other Terms:'  , style:'heading'} , {text: this.printData['sellerPieceLengthName'] , margin:[-35,0,0,0] , style:'heading2'}],] }
              },
           
//               {
//                 layout:'noBorders',
//                 margin: [20 , 2 , 0 , 0],
//                 table:{headerRows: 1 , widths:['20%' , '40%'],
//               body: [
//                 [{text:'Payment Terms:'  , style:'heading'} , {text: this.contractPaymentData['sellerPaymentTermDays'] == '' ? this.contractPaymentData['sellerPaymentTermName'] + 
//                 this.contractPaymentData['sellerPaymentTermInfo']  :this.contractPaymentData['sellerPaymentTermName'] + this.contractPaymentData['sellerPaymentTermDays']+ " Days " + this.contractPaymentData['sellerPaymentTermInfo']  , margin:[-35,0,0,0] , style:'heading2'}],] }
//               },
//               {
//                 layout:'noBorders',
//                 margin: [20 , 2 , 0 , 0],
//                 table:{headerRows: 1 , widths:['20%' , '40%'],
//               body: [
//                 [{text:'Mode of Payment:'  , style:'heading'} , {text: this.contractPaymentData['paymentMode'] , margin:[-35,0,0,0] , style:'heading2'}],] }
//               },
//               {
//                 layout:'noBorders',
//                 margin: [20 , 2 , 0 , 0],
//                 table:{headerRows: 1 , widths:['20%' , '40%'],
//               body: [
//                 [{text:'Delivery Term:'  , style:'heading'} , {text: this.contractPaymentData['priceTermName'] + " " + this.contractPaymentData['destinationName']  , margin:[-35,0,0,0] , style:'heading2'}],] }
//               },
//               {
//                 layout:'noBorders',
//                 margin: [20 , 2 , 0 , 0],
//                 table:{headerRows: 1 , widths:['20%' , '40%'],
//               body: [
//                 [{text:'Deliveries Date:'  , style:'heading'} , {text: this.deliveryData.map((row=>row.buyerDateDay)) , margin:[-35,0,0,0] , style:'heading2'}],] }
              
//               },
//               {
//                 layout:'noBorders',
//                 margin: [20 , 2 , 0 , 0],
//                 table:{headerRows: 1 , widths:['20%' , '40%'],
//               body: [
//                 [{text:'Commission:'  , style:'heading'} , {text: this.contractCommissionData['fabCotCommision'] + "%" , margin:[-35,0,0,0] , style:'heading2'}],] }
              
//               },
//               {
//                 layout:'noBorders',
//                 margin: [20 , 2 , 0 , 0],
//                 table:{headerRows: 1 , widths:['20%' , '40%'],
//               body: [
//                 [{text:'Delivery Address:'  , style:'heading'} , {text: this.printData['deliveryAddress'] , margin:[-35,0,0,0] , style:'heading2'}],] }
//               },
//               {
//                 layout:'noBorders',
//                 margin: [20 , 2 , 0 , 0],
//                 table:{headerRows: 1 , widths:['20%' , '40%'],
//               body: [
//                 [{text:'Invoice Address:'  , style:'heading'} , {text: this.printData['invoiceAddress'] , margin:[-35,0,0,0] , style:'heading2'}],] }
//               },
//               {
//                 layout:'noBorders',
//                 margin: [20 , 2 , 0 , 0],
//                 table:{headerRows: 1 , widths:['20%' , '40%'],
//               body: [
//                 [{text:'GST#:'  , style:'heading'} , {text: this.printData['buyerGSTNumber'] , margin:[-35,0,0,0] ,style:'heading2'}],] }
//               },
//               {
//                 layout:'noBorders',
//                 margin: [20 , 2 , 0 , 0],
//                 table:{headerRows: 1 , widths:['20%' , '80%'],
//               body: [
//                 [{text:'Remarks:' , style:'heading'} , {text: this.contractRemarksData['contractRemarks'] , margin:[-35,0,0,0] , style:'heading2'}],] }
//               },

//               {
//                 layout:'noBorders',
//                 margin: [20 , 2 , 0 , 0],
//                 table:{headerRows: 1 , widths:['20%' , '80%'],
//               body: [
//                 [{text:'Other Conditions:' , style:'heading'} , {text: this.contractRemarksData['otherConditionRemarks'] , margin:[-35,0,0,0] , style:'heading2'}],] }
//               },
           
  
              { 
                margin:[0,0,0,0],
                canvas: 
                [
                    
                    {
                      type: 'line',
                      x1: 0, y1: 60,
                      x2: 590, y2: 60,
                      lineWidth: 1,

                    }
                ]
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

            // footer:{
            //   margin: [20, 0],
            //   columns: [
            //     'NOTE: This is a system generated Contract and does not require any signature.',
            //     { text: '', alignment: 'center' , style:'tableheader'}
            //   ]
            // },
            footer: {
              columns: [
                  'Report generated on 8/30/2021 6:02:31PM',
                  'Developed by XYZ Fitness Software',
                  {
                      alignment: 'right',
                      text: 'Page 1 of 2'
                  },
                  {
                    alignment: 'right',
                    text: 'www.xyz.com'
                },
              ],
              margin: [60, 10, 60, 10 ]
          },
            styles:{
              heading:{fontSize: 9,
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

}
