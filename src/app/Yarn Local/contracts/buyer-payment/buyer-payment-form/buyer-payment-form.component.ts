import { Component, Input, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ServiceService } from 'src/app/shared/service.service';
import { environment } from 'src/environments/environment';
import { HttpClient  , HttpErrorResponse} from '@angular/common/http';
import { Dateformater } from 'src/app/shared/dateformater';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { SelectionType } from '@swimlane/ngx-datatable';
@Component({
  selector: 'app-buyer-payment-form',
  templateUrl: './buyer-payment-form.component.html',
  styleUrls: ['./buyer-payment-form.component.css']
})
export class BuyerPaymentFormComponent implements OnInit {
  dateformater: Dateformater = new Dateformater();
  result:any
  selected = [];
  SelectionType = SelectionType;
  data: any ={};
  rows = [];
  row =[];
  columns: any = [];
  response: any;
  buyer: any= [];
  seller: any= [];
  article: any= [];
  uomList: any= [];
  currency: any= [];
  paymentMode: any= [];
  buyerNameId:any;
  sellerNameId:any;
  newBuyer: number;
  amountGivenToCalculate:any;
  calculatedTax:any;
  isAmountDisabled:boolean =false;
  saleInvoiceIds =[];
  buyerPaymentUrl = '/api/Configs/GetAllArticle'
  constructor(
    private service: ServiceService,
    private spinner: NgxSpinnerService,
    private router: Router,
    private toastr: ToastrService,
    private http: HttpClient,
  ) { }

  ngOnInit(): void {
    this.GetBuyersDropdown();
    this.GetSellerDropdown();
    this.GetCurrencyDropdown();
    this.GetPaymentModeDropdown();
  }
 


  navigateBuyerPaymentForm() {
    this.router.navigate(['/FabCot/buyer-payment']);
 };

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
    this.service.getSellerLookup().subscribe(res => {
      this.response = res;
      if (this.response.success == true) {

        this.seller = this.response.data;
        
       
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

  GetPaymentModeDropdown() {
    this.http.get(`${environment.apiUrl}/api/Lookups/PaymentModes`).
    subscribe(res => {
      this.response = res;
      if (this.response.success == true) {
        this.paymentMode = this.response.data;
    
      }
      else {
        this.toastr.error(this.response.message, 'Message.');
      }
    })
  }


  addPayment() {
    // this.paymentAdddata.paymentDate = this.dateformater.toModel(this.paymentAdddata.paymentDate);
    // this.paymentAdddata.depositeDate = this.dateformater.toModel(this.paymentAdddata.depositeDate);
      let varr = {
        "buyerId": this.data.buyerId,
        "sellerId": this.data.sellerId,
        "paymentDate": this.dateformater.toModel(this.data.paymentDate),
        "amount": this.data.amount,
        "currencyId": this.data.currencyId,
        "paymentMode": this.data.paymentMode,
        "additionalDetails": this.data.additionalDetails,
        "depositDate": this.dateformater.toModel(this.data.depositeDate),
        "taxChalan": this.data.taxChalan,
        "remarks": this.data.remarks,
        "saleInvoiceIds": this.saleInvoiceIds
      
   
      }
this.spinner.show();
    this.http.
      post(`${environment.apiUrl}/api/YarnContracts/AddBuyerToSellerPayment`, varr)
      .subscribe(
        res => {

          this.response = res;
          if (this.response.success == true) {
            // this.data = this.response.data;
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
  buyerNameChange(event){
    this.buyerNameId=event;
  }
  sellerNameChange(event){
    this.sellerNameId=event;



    this.http.get(`${environment.apiUrl}/api/Contracts/GetContractByBuyerSellerId/`+this.buyerNameId +'/'+ this.sellerNameId).
    subscribe(res => {
      this.response = res;
      if (this.response.success == true) {
        this.rows = this.response.data;
    
      }
      else {
        this.toastr.error(this.response.message, 'Message.');
      }
    })
         
  }
  amountCall(event){

      
        this.amountGivenToCalculate=event.target.value;
        this.amountGivenToCalculate = this.amountGivenToCalculate +'.000';
        this.data.taxChalan = 0;
       
   
     
     
  }
  onBlurMethod(event){
    if(event != undefined){
      setTimeout(()=>{                           
        this.isAmountDisabled =true;
   }, 3000);
      

    }
    else{
    this.isAmountDisabled =false;

    }
  }
  taxCalculated(event){
    event.target.value;
    this.calculatedTax  = this.amountGivenToCalculate * (event.target.value / 100);
  }
  onSelect(event,row) {
    let newrow =this.rows.filter(r=>r.saleInvoiceId ==row.saleInvoiceId)
     this.selected = newrow;  
 
    if(event.currentTarget.checked == true){
      this.saleInvoiceIds.push(row.saleInvoiceId);
      if(row !=null){
       if(this.selected[0].receivedAmount != '0.000'){
        this.result=parseInt(this.selected[0].receivedAmount) +  parseInt(this.amountGivenToCalculate);
        this.selected[0].receivedAmount =this.result +'.000'; 
       }

else{

        if( this.result != null){
          if(this.result <  this.selected[0].saleInvoiceAmount){
          
            this.selected[0].receivedAmount =this.result;
            this.result= this.result -this.selected[0].saleInvoiceAmount;
          }
        
          if(this.result <0 ){
            this.toastr.error("Partial  Value", 'Message.');
           
          }
        }
        else{
          if(parseInt(this.amountGivenToCalculate) >  parseInt(this.selected[0].saleInvoiceAmount)){
            this.selected[0].receivedAmount=this.selected[0].saleInvoiceAmount
            this.result= this.amountGivenToCalculate-this.selected[0].receivedAmount
            this.result =this.result;
          }
          else if(parseInt(this.amountGivenToCalculate) <  parseInt(this.selected[0].saleInvoiceAmount)){
            this.selected[0].receivedAmount =this.amountGivenToCalculate;
            this.result =this.amountGivenToCalculate -this.amountGivenToCalculate;
            this.toastr.error("Partial  Value", 'Message.');
             this.result =this.result.replace('.000','');
          }
          else{
            this.result =this.amountGivenToCalculate -  this.selected[0].saleInvoiceAmount;
            this.selected[0].receivedAmount= this.selected[0].saleInvoiceAmount;

          }
        }
      }
        this.result =this.result +'.000';
        // this.selected[0].receivedAmount= this.selected[0].saleInvoiceAmount;
           this.selected.push(...this.selected);
          this.rows = [...this.rows]
      }
      else{
        this.result =null;
      }
    }
    else if(event.currentTarget.checked == false){

      this.saleInvoiceIds.forEach((element,index)=>{
        if(element==row.saleInvoiceId) this.saleInvoiceIds.splice(index,1);
     });
      if( this.result != null){
        let newrow =this.rows.filter(r=>r.saleInvoiceId ==row.saleInvoiceId)
        this.selected = newrow; 
        this.result=0
        this.result=row.receivedAmount 
        this.selected[0].receivedAmount= 0;
        
        // parseInt(this.result) + parseInt(row.receivedAmount);

        this.selected.push(...this.selected);
          this.rows = [...this.rows]
      }
    }
   
  
  }
 
}
