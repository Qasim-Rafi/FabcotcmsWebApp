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
  Oblanc:any=[];
  Pblanc:any=[];
  SelectionType = SelectionType;
  data: any ={};
  decimalSize:any;
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
  Paidamount:any;
  blncamount:any;
  invoicenoselected:any;
  taxpercentage:any;
  buyerPaymentUrl = '/api/Configs/GetAllArticle'
  constructor(
    private service: ServiceService,
    private spinner: NgxSpinnerService,
    private router: Router,
    private toastr: ToastrService,
    private http: HttpClient,
  ) { }

  ngOnInit(): void {
    this.data.currencyId=1;
    this.getbyid();
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
let item=[]
    this.rows.forEach(childObj=> {
      this.saleInvoiceIds.forEach(childObj2=> {
        if(childObj2 ==childObj.saleInvoiceId){
      let varr = {
        "saleInvoiceId": childObj.saleInvoiceId,
        "taxChallan": childObj.taxChallan,
        "receivedAmount": childObj.receivedAmount,
        "saleInvoiceAmountAfterTax": childObj.saleInvoiceAmountAfterTax,
      }

      item.push(varr)
    }
    });
});

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
        "saleInvoiceIds": this.saleInvoiceIds,
        "saleInvoicePaymentDetails":item
      
   
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
  getbyid() {

    this.http.get(`${environment.apiUrl}/api/Configs/GetGeneralSettingById/` + 0)
      .subscribe(
        res => {
          this.response = res;
          if (this.response.success == true) {
            if( this.response.data !=null){
              this.decimalSize = this.response.data.amountDecimalPoints;
              this.decimalSize=String().padStart(this.response.data.amountDecimalPoints, '0'); 

            }
          }
          else {
            this.toastr.error(this.response.message, 'Message.');
          }

        }, err => {
          if (err.status == 400) {
            this.toastr.error(err.error.message, 'Message.');
          }
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


        for(let i=0; i<this.rows.length; i++ )
        {     
          this.rows[i].saleInvoiceAmountAfterTax=parseFloat(this.rows[i].saleInvoiceAmountAfterTax)
          this.rows[i].saleInvoiceAmountAfterTax = Math.round(this.rows[i].saleInvoiceAmountAfterTax)
          this.rows[i].saleInvoiceAmountAfterTax =  this.rows[i].saleInvoiceAmountAfterTax +'.'+this.decimalSize
          this.rows[i].saleInvoiceAmountAfterTax = this.rows[i].saleInvoiceAmountAfterTax.toString();
          this.rows[i].receivedAmount2 = this.rows[i].receivedAmount;
          this.rows[i].taxChallan2 = this.rows[i].taxChallan;
          this.rows[i]['invoiceChecked']=false;
          this.Oblanc.push(parseFloat(this.rows[i].saleInvoiceAmountAfterTax));
          this.Pblanc.push(parseFloat(this.rows[i].paid));
          
        }
        const Osum = this.Oblanc.reduce((partial_sum, a) => partial_sum + a, 0);
        const Psum = this.Pblanc.reduce((partial_sum, a) => partial_sum + a, 0);
          this.blncamount =Osum;
          this.Paidamount =Psum;
          this.blncamount= this.blncamount.toFixed(3)
    
      }
      else {
        this.toastr.error(this.response.message, 'Message.');
      }
    })
         
  }
  
  amountCall(event){
 let deptName =localStorage.getItem('loggedInDepartmentName');
 if(deptName == 'Yarn Local' || deptName == 'Fabric Local'){

  this.amountGivenToCalculate=this.data.amount;
        this.result = this.data.amount.toString() +'.'+this.decimalSize;
        this.data.taxChalan = 0;
        for(let i=0;i<=this.rows.length; i++){

          if( this.rows[i].receivedAmount !="" &&  this.rows[i].receivedAmount != "0.00"){
            this.rows[i].receivedAmount =this.rows[i].receivedAmount;
            this.rows[i].taxChallan =this.rows[i].taxChallan;
          }
          else{
            this.rows[i].receivedAmount ='0.00';
          this.rows[i].taxChallan ='0.00';
          }
          
        }
 }

 else{
        this.amountGivenToCalculate=this.data.amount;
        this.result = this.data.amount.toString() +'.'+this.decimalSize;
        this.data.taxChalan = 0;
        for(let i=0;i<=this.rows.length; i++){
          this.rows[i].receivedAmount ='0.00';
          this.rows[i].taxChallan ='0.00';
        }
      }
  }

  // texchalancalculation(value){
  //   let taxcal  = this.amountGivenToCalculate * (event.target.value / (100- event.target.value));
  //   this.calculatedTax= taxcal.toFixed(2);
  // }
  onBlurMethod(event){
    if(this.result ==event.target.value){

      this.result =null;
      this.result=event.target.value;
    
    }
    for(let i=0;i<=this.rows.length; i++){
      this.rows[i].receivedAmount ='0.00';
      this.rows[i].taxChallan ='0.00';
    }
  //   if(event != undefined){
  //     setTimeout(()=>{                           
  //       this.isAmountDisabled =true;
  //  }, 3000);
      

  //   }
  //   else{
  //   this.isAmountDisabled =false;

  //   }
  }
  taxCalculated(event){
    let deptName =localStorage.getItem('loggedInDepartmentName');
 if(deptName == 'Yarn Local' || deptName == 'Fabric Local'){
    this.taxpercentage=this.data.taxChalan;
   //this.amountGivenToCalculate= this.amountGivenToCalculate * 1/100 99
  //  let ab=(this.amountGivenToCalculate * 1) / 100
  //       let am = this.amountGivenToCalculate + ab
    let taxcal  = this.amountGivenToCalculate * (this.data.taxChalan / 99);
    // (100- this.data.taxChalan)
    if(taxcal != 0){
      this.amountGivenToCalculate = parseFloat(this.amountGivenToCalculate + taxcal)
       this.amountGivenToCalculate =parseFloat(this.amountGivenToCalculate)
       this.result =Math.round(this.amountGivenToCalculate).toString() +'.'+this.decimalSize;
    }
    else if(taxcal == 0){
           this.result =this.data.amount.toString() +'.'+this.decimalSize;
    }
    this.calculatedTax= taxcal.toFixed(2);
 }
 else{
  this.taxpercentage=this.data.taxChalan;
  let taxcal  = this.amountGivenToCalculate * (this.data.taxChalan / 100);
  // (100- this.data.taxChalan)
  this.calculatedTax= taxcal.toFixed(2);
 }
  }
  onSelect(event,row) {
    let newrow =this.rows.filter(r=>r.saleInvoiceId ==row.saleInvoiceId)
     this.selected = newrow;  
 
    if(event.currentTarget.checked == true){
      
      this.saleInvoiceIds.push(row.saleInvoiceId);
      if(row !=null){
        // saleInvoiceAmountAfterTax
        // saleInvoiceAmount

          if(parseInt(this.result) >  parseInt(this.selected[0].saleInvoiceAmountAfterTax)){
            this.selected[0].receivedAmount=this.selected[0].saleInvoiceAmountAfterTax;
            
            if(this.calculatedTax !=null){
              let taxis =this.selected[0].receivedAmount * (this.taxpercentage/100);
              this.selected[0].taxChallan =taxis.toFixed(2); 
              this.selected[0].receivedAmount=this.selected[0].receivedAmount - this.selected[0].taxChallan;
              this.selected[0].receivedAmount=this.selected[0].receivedAmount;
              this.result= this.result-this.selected[0].saleInvoiceAmountAfterTax;
              this.result =this.result.toFixed(2);
              this.Pblanc.push(parseFloat(this.selected[0].receivedAmount)+ parseFloat(this.selected[0].taxChallan));
            }
            else{
            this.result= this.result-this.selected[0].receivedAmount;
            this.result =this.result.toFixed(2);
            this.Pblanc.push(parseFloat(this.selected[0].receivedAmount)+ parseFloat(this.selected[0].taxChallan));
            }
            const Psum = this.Pblanc.reduce((partial_sum, a) => partial_sum + a, 0);
      //this.blncamount =Osum;
      this.Paidamount =Psum;
          }
          else if(parseInt(this.result) ==  parseInt(this.selected[0].saleInvoiceAmountAfterTax)){
            this.selected[0].receivedAmount=this.selected[0].saleInvoiceAmountAfterTax;
            if(this.calculatedTax !=undefined){
              let taxis =this.result * (this.taxpercentage/100);
              this.selected[0].taxChallan =taxis.toFixed(2); 
              this.selected[0].receivedAmount= this.selected[0].receivedAmount -this.selected[0].taxChallan;
              this.selected[0].receivedAmount=this.selected[0].receivedAmount;
              this.result=  '0.' + this.decimalSize;
              // this.result =this.result.toFixed(2);
              this.Pblanc.push(parseFloat(this.selected[0].receivedAmount)+ parseFloat(this.selected[0].taxChallan));
            }
            else{
              this.result= this.result-this.selected[0].receivedAmount;
              this.result =this.result.toFixed(2);
              this.Pblanc.push(parseFloat(this.selected[0].receivedAmount)+ parseFloat(this.selected[0].taxChallan));
            }
            const Psum = this.Pblanc.reduce((partial_sum, a) => partial_sum + a, 0);
            //this.blncamount =Osum;
            this.Paidamount =Psum;
          }
          else if(parseInt(this.result) <  parseInt(this.selected[0].saleInvoiceAmountAfterTax)){
             if( this.result =='0.' + this.decimalSize){
              this.toastr.error("Not Enough Amount", 'Message.');
             
            }
             else{

               this.selected[0].receivedAmount =this.selected[0].receivedAmount !="0.00"? (parseInt(this.selected[0].receivedAmount) +parseInt(this.result)).toString():this.result;
               let taxis = this.selected[0].receivedAmount * (this.data.taxChalan/100);
               this.selected[0].taxChallan =taxis.toFixed(2); 
              this.result =this.result - (this.selected[0].receivedAmount2 !="0.00"?(this.selected[0].receivedAmount -this.selected[0].receivedAmount2):this.selected[0].receivedAmount);
              let value1 =parseInt(this.selected[0].receivedAmount) + parseInt(this.selected[0].taxChallan)
              if(parseInt(this.selected[0].saleInvoiceAmountAfterTax) == value1){

              }
              else{

                this.toastr.error("Partial  Value", 'Message.');
              }
               this.result =this.result;

               this.Pblanc.push(parseFloat(this.selected[0].receivedAmount) + parseFloat(this.selected[0].taxChallan));
               const Psum = this.Pblanc.reduce((partial_sum, a) => partial_sum + a, 0);
               //this.blncamount =Osum;
               this.Paidamount =Psum;
              }
         
          }
          // else if(parseInt(this.result) <  parseInt(this.selected[0].saleInvoiceAmount)){
          //   this.selected[0].receivedAmount =this.result;
          //   this.result= this.result -this.selected[0].saleInvoiceAmount;
          //   if(this.result <0 ){
          //     this.toastr.error("Partial  Value", 'Message.');
             
          //   }
          // }













//        if(parseInt(this.selected[0].receivedAmount) > 0){
//         this.result=parseInt(this.selected[0].receivedAmount) +  parseInt(this.amountGivenToCalculate);
//         this.selected[0].receivedAmount =this.result +'.'+this.decimalSize; 
//         //  let taxis =this.result * (this.taxpercentage/(100-this.taxpercentage));
//         //  this.selected[0].taxChallan =taxis+'.'+this.decimalSize; 
//        }

// else{

//         if( this.result != null){
//           if(this.result <  this.selected[0].saleInvoiceAmount){
          
//             this.selected[0].receivedAmount =this.result;
//             this.result= this.result -this.selected[0].saleInvoiceAmount;
//           }
        
//           if(this.result <0 ){
//             this.toastr.error("Partial  Value", 'Message.');
           
//           }
//         }
//         else{
//           if(parseInt(this.amountGivenToCalculate) >  parseInt(this.selected[0].saleInvoiceAmount)){
//             this.selected[0].receivedAmount=this.selected[0].saleInvoiceAmount;
//         //     let taxis =this.selected[0].saleInvoiceAmount * (this.taxpercentage/(100-this.taxpercentage));
//         //  this.selected[0].taxChallan =taxis.toFixed(2); 
//             this.result= this.amountGivenToCalculate-this.selected[0].receivedAmount
//             this.result =this.result;
//           }
//           else if(parseInt(this.amountGivenToCalculate) <  parseInt(this.selected[0].saleInvoiceAmount)){
//             this.selected[0].receivedAmount =this.amountGivenToCalculate;
//             // let taxis =this.selected[0].saleInvoiceAmount * (this.taxpercentage/(100-this.taxpercentage));
//             // this.selected[0].taxChallan =taxis.toFixed(2);
//             this.result =this.amountGivenToCalculate -this.amountGivenToCalculate;
//             this.toastr.error("Partial  Value", 'Message.');
//              this.result =this.result;
//           }
//           else{
//             this.result =this.amountGivenToCalculate -  this.selected[0].saleInvoiceAmount;
//             this.selected[0].receivedAmount= this.selected[0].saleInvoiceAmount;
//             // let taxis =this.selected[0].saleInvoiceAmount * (this.taxpercentage/(100-this.taxpercentage));
//             // this.selected[0].taxChallan =taxis.toFixed(2);

//           }
//         }
//       }
        if (this.result == Math.floor(this.result)) {
          // not an decimal
          this.result = this.result
        }
        else {
          this.result = this.result + '.' + this.decimalSize;

        }
        // this.selected[0].receivedAmount= this.selected[0].saleInvoiceAmount;
           this.selected.push(...this.selected);
          this.rows = [...this.rows]
      }
      else{
        this.result ='0.' + this.decimalSize;
      }
    }
    else if(event.currentTarget.checked == false){

     
      if( this.saleInvoiceIds.length > 1){
        let newrow =this.rows.filter(r=>r.saleInvoiceId ==row.saleInvoiceId)
        this.selected = newrow; 
        this.result=parseFloat(this.result) +parseFloat(this.selected[0].receivedAmount);
        if(this.selected[0].taxChallan != "" && this.selected[0].taxChallan != null){
          this.result = this.result +parseFloat(this.selected[0].taxChallan)

        }
        this.result =this.result+'.'+this.decimalSize;
        this.Paidamount =  parseFloat(this.Paidamount) -parseFloat(this.selected[0].receivedAmount) ;
        this.Paidamount =this.Paidamount.toFixed(3);
        // this.result=row.receivedAmount 
        this.selected[0].receivedAmount= '0.'+this.decimalSize;
        this.selected[0].taxChallan= '0.'+this.decimalSize;
        // parseInt(this.result) + parseInt(row.receivedAmount);

        
      }
      else if(this.saleInvoiceIds.length = 1){
        let newrow =this.rows.filter(r=>r.saleInvoiceId ==row.saleInvoiceId)
        if(newrow[0].receivedAmount2 != "0.00")
        {
          this.selected = newrow; 
          this.selected[0].receivedAmount=this.selected[0].receivedAmount2
        this.result=parseFloat(this.result) +this.data.amount;
        if(this.selected[0].taxChallan != "" && this.selected[0].taxChallan2 != null){
          this.result = this.result +parseFloat(this.selected[0].taxChallan2)
        }
        this.result =this.result+'.'+this.decimalSize;
        // this.result=row.receivedAmount 
        this.Paidamount =  parseFloat(this.Paidamount) -parseFloat(this.selected[0].receivedAmount2) ;
        this.Paidamount =this.Paidamount.toFixed(3);
        this.selected[0].receivedAmount= this.selected[0].receivedAmount2+this.decimalSize;
        this.selected[0].taxChallan= this.selected[0].taxChallan2+this.decimalSize;
        }else{
          this.selected = newrow; 
          this.result=parseFloat(this.result) +parseFloat(this.selected[0].receivedAmount);
          if(this.selected[0].taxChallan != "" && this.selected[0].taxChallan != null){
            this.result = this.result +parseFloat(this.selected[0].taxChallan)
          }
          this.result =this.result+'.'+this.decimalSize;
          // this.result=row.receivedAmount 
          this.Paidamount =  parseFloat(this.Paidamount) -parseFloat(this.selected[0].receivedAmount) ;
          this.Paidamount =this.Paidamount.toFixed(3);
          this.selected[0].receivedAmount= '0.'+this.decimalSize;
          this.selected[0].taxChallan= '0.'+this.decimalSize;
        }
     
      }
      this.selected.push(...this.selected);
          this.rows = [...this.rows]
      this.saleInvoiceIds.forEach((element,index)=>{
        if(element==row.saleInvoiceId) this.saleInvoiceIds.splice(index,1);
     });
    }
   
  
  }
 
}
