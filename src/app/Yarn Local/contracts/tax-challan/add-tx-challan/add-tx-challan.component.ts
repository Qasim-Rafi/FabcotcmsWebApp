import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ServiceService } from 'src/app/shared/service.service';
import { environment } from 'src/environments/environment';
import { HttpClient  , HttpErrorResponse} from '@angular/common/http';
import { Dateformater } from 'src/app/shared/dateformater';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { flatten } from '@angular/compiler';

@Component({
  selector: 'app-add-tx-challan',
  templateUrl: './add-tx-challan.component.html',
  styleUrls: ['./add-tx-challan.component.css']
})
export class AddTxChallanComponent implements OnInit {
  dateformater: Dateformater = new Dateformater();
  result:any
  selected = [];
  amountGivenToCalculate:any;
  saleInvoiceIds =[];
  calculatedTax:any;
  isAmountDisabled:boolean =false;
  buyer: any=[];
  seller: any=[];
  currency: any=[];
  data:any = {}
  columns: any
  response: any;
  buyerNameId:any;
  sellerNameId:any;
  @ViewChild(NgForm) enquiryForm;

  rows = [];

  constructor(
    private service: ServiceService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private http: HttpClient,
    private router: Router,

  ) { }

  ngOnInit(): void {
    this.GetCurrencyDropdown();
    this.GetBuyersDropdown();
    this.GetSellerDropdown();
  }

  GetBuyersDropdown() {
    this.service.getBuyers().subscribe(res => {
      this.response = res;
      if (this.response.success == true) {

        this.buyer = this.response.data;
        // this.newBuyer = this.response.data.lastId



        // if(type == "other")
        // {
        //   this.buyer.id = this.newBuyer;
        //   this.data.buyerId = this.buyer.id
        // }
       
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
        // this.newSeller = this.response.data



        // if(type == "other")
        // {
        //   this.seller.id = this.newSeller;
        //   this.data.sellerId = this.seller.id
        // }
       
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


  addChallan() {
    let item=[]
    this.rows.forEach(childObj=> {
      this.saleInvoiceIds.forEach(childObj2=> {
        if(childObj2 ==childObj.saleInvoiceId){
      let varr = {
        "saleInvoiceId": childObj.saleInvoiceId,
        "taxChallan": childObj.challanTaxChallan,
        // "receivedAmount": childObj.receivedAmount,
        // "saleInvoiceAmountAfterTax": childObj.saleInvoiceAmountAfterTax,
      }

      item.push(varr)
    }
    });
});
      let varr = {
        "buyerId": this.data.buyerId,
        "sellerId": this.data.sellerId,
        "challanDate": this.dateformater.toModel(this.data.chalanDate),
        "amount": this.data.amount,
        "currencyId": this.data.currencyId,
        "cprNumber": this.data.cprNumber,
        "remarks": this.data.remarks,
        "objTaxChallanPayment": item,
        "saleInvoiceIds": this.saleInvoiceIds,
      
   
      }
this.spinner.show();    
this.http.post(`${environment.apiUrl}/api/YarnContracts/AddTaxChallan`, varr)
.subscribe(
        res => {

          this.response = res;
          if (this.response.success == true) {
            // this.data = this.response.data;
            this.enquiryForm.reset();
            this.router.navigate(['/FabCot/tax']);

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

  amountCall(event){
    
    this.amountGivenToCalculate=event.target.value;
    this.amountGivenToCalculate = this.amountGivenToCalculate +'.000';
    this.data.taxChalan = 0;
  this.result=this.data.amount
}
onBlurMethod(event){
if(event != undefined){
  setTimeout(()=>{                           
    this.isAmountDisabled =false;
}, 3000);
  

}
else{
this.isAmountDisabled =false;

}
}
  buyerNameChange(event){
    this.buyerNameId=event;
  }
  sellerNameChange(event){
    this.sellerNameId=event;



    this.http.get(`${environment.apiUrl}/api/Contracts/GetContractByBuyerSellerId/`+this.buyerNameId +'/'+ this.sellerNameId +'/'+ true).
    subscribe(res => {
      this.response = res;
      if (this.response.success == true) {
        this.rows = this.response.data;
        this.rows.forEach(childObj2=> {
          childObj2.taxreceivedAmount="0.00";
          childObj2.challanTaxChallan2=childObj2.challanTaxChallan
          // childObj2.taxreceivedAmount="0.00";
        });
      }
      else {
        this.toastr.error(this.response.message, 'Message.');
      }
    })
         
  }
  onSelect(event,row) {
    let newrow =this.rows.filter(r=>r.saleInvoiceId ==row.saleInvoiceId)
     this.selected = newrow;  
 
    if(event.currentTarget.checked == true){
      this.saleInvoiceIds.push(row.saleInvoiceId);
      if(row !=null){
         if(this.selected[0].taxChallanPaid  == false && this.selected[0].taxChallan == this.result){
         
         this.selected[0].taxreceivedAmount = this.result;
         this.selected[0].challanTaxChallan += this.result;
         this.result=(this.result - this.result);
         this.selected[0].balanceAmount = this.result;
         this.toastr.error("Partial  Value For this Invoice", 'Message.');
   }
   else if(this.selected[0].taxChallanPaid ==true && this.result > this.selected[0].taxChallan){
    
    this.selected[0].taxreceivedAmount += this.selected[0].balanceAmount;
    this.selected[0].challanTaxChallan += this.selected[0].balanceAmount;
    this.result=(this.result - this.selected[0].balanceAmount);
    this.selected[0].balanceAmount= "0.00";
   }
   else if(this.selected[0].taxChallanPaid == false && this.result > this.selected[0].taxChallan){
   this.selected[0].taxreceivedAmount = this.selected[0].taxChallan
   this.selected[0].challanTaxChallan = this.selected[0].taxChallan
   this.result=(this.result - parseFloat(this.selected[0].taxChallan));
   this.result=this.result.toFixed(2)
  //  if(this.selected[0].taxChallan == this.selected[0].challanTaxChallan){}
   this.toastr.error("Partial  Value For this Invoice", 'Message.');}
        // if( this.result != null){
        //   if(this.result <  this.selected[0].saleInvoiceAmount){
          
        //     this.selected[0].paidAmount =this.result;
        //     this.result= this.result -this.selected[0].saleInvoiceAmount;
        //   }
        
        //   if(this.result <0 ){
        //     this.toastr.error("Partial  Value", 'Message.');
           
        //   }
        // }
        // else{
        //   if(parseInt(this.amountGivenToCalculate) >  parseInt(this.selected[0].saleInvoiceAmount)){
        //     this.selected[0].paidAmount=this.selected[0].saleInvoiceAmount
        //     this.result= this.amountGivenToCalculate-this.selected[0].paidAmount
        //     this.result =this.result;
        //   }
        //   else if(parseInt(this.amountGivenToCalculate) <  parseInt(this.selected[0].saleInvoiceAmount)){
        //     this.selected[0].paidAmount =this.amountGivenToCalculate;
        //     this.result =this.amountGivenToCalculate -this.amountGivenToCalculate;
        //     this.toastr.error("Partial  Value", 'Message.');
        //      this.result =this.result.replace('.000','');
        //   }
        //   else{
        //     this.result =this.amountGivenToCalculate -  this.selected[0].saleInvoiceAmount;
        //     this.selected[0].paidAmount= this.selected[0].saleInvoiceAmount;

        //   }
        // }
        // this.result =this.result +'.000';
        // this.selected[0].paidAmount= this.selected[0].saleInvoiceAmount;
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
      if( this.result != "0.000"){
        let newrow =this.rows.filter(r=>r.saleInvoiceId ==row.saleInvoiceId)
        this.selected = newrow; 
        this.result = parseFloat(this.result) + parseFloat(this.selected[0].challanTaxChallan)
        this.result=this.result.toFixed(2)
        if(this.selected[0].challanTaxChallan2 != null){
          this.selected[0].challanTaxChallan =this.selected[0].challanTaxChallan2
        }
        else{
          this.selected[0].challanTaxChallan= "0.00"
        }
        

        this.selected.push(...this.selected);
          this.rows = [...this.rows]
      }
      else if(this.result == "0.000"){
        this.selected[0].taxreceivedAmount -= this.selected[0].challanTaxChallan
        let valam=this.selected[0].challanTaxChallan
        this.result=(valam +parseFloat(this.result)).toString();
        if(this.selected[0].challanTaxChallan2 == null){
          this.selected[0].challanTaxChallan ="0.00"
        }
        else{
          this.selected[0].challanTaxChallan -= this.selected[0].challanTaxChallan2
        }
        // this.selected[0].challanTaxChallan -= this.selected[0].challanTaxChallan2
        // this.selected[0].balanceAmount -= this.selected[0].challanTaxChallan
      }
    }
  //  let paid = Boolean
  
 
   }


}
