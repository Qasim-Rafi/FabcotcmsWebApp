import { DatePipe } from '@angular/common';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ServiceService } from 'src/app/shared/service.service';
import { Dateformater } from 'src/app/shared/dateformater';
import { environment } from 'src/environments/environment';
import {NgxSpinnerService, Spinner} from 'ngx-spinner'

@Component({
  selector: 'app-external-agent-form',
  templateUrl: './external-agent-form.component.html',
  styleUrls: ['./external-agent-form.component.css']
})
export class ExternalAgentFormComponent implements OnInit {

  dateformater: Dateformater = new Dateformater();
  response: any;
  blncamount:any;
  Oblanc:any=[];
  Pblanc:any=[];
  invoicenoselected:any;
  selected = [];
  saleInvoiceIds =[];
  paymentAdddata: any = {};
commData : any = [];
extCommData : any = {};
amountGivenToCalculate:any;
  statusCheck:any={};
  rows: any = [];
  rowsFilter: any = [];
  columns: any = [];
  seller: any = [];
  paymentMode : any = []
  currency : any = []
  bankAcc : any = []
  agent : any = []
  buyer: any = [];
  sellerNameId:any;
  editing = {};
  decimalSize:any;
  decimalcount:any;
  result:any;
  Paidamount:any;
  constructor(

    private route: ActivatedRoute,
    private modalService: NgbModal,
    private http: HttpClient,
    private service: ServiceService,
    private toastr: ToastrService,
    public datepipe: DatePipe,
    private router: Router,
    private spinner:NgxSpinnerService

  ) { }

  ngOnInit(): void {
    this.statusCheck = this.route.snapshot.queryParams;
    this.getbyidgernalsettings();
    this.GetBankAccDropdown();
     this.GetCurrencyDropdown();
     this.GetPaymentModeDropdown();
     //this.GetSellerDropdown();
     this.GetAgentDropdown();
     this.GetBuyersDropdown();
    //  this.rows = [
    //   { sno: '1', invNum: '1122', contract: '555222', date: '2021-25-10', amount: '55002', rec: '0.00', blnc: '55002',action:true,paid:'0' },
    //   { name: 'Dany', gender: 'Male', company: 'KFC' },
    //   { name: 'Molly', gender: 'Female', company: 'Burger King' },
    // ];
  }
  // updateValue(event, cell, rowIndex) {
  //   console.log('inline editing rowIndex', rowIndex)
  //   this.editing[rowIndex + '-' + cell] = false;
  //   this.rows[rowIndex][cell] = event.target.value;
  //   this.rows = [...this.rows];
  //   console.log('UPDATED!', this.rows[rowIndex][cell]);
  // }
  
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
  // GetSellerDropdown() {
  //   this.service.getcommisionpaynentSellerLookup().subscribe(res => {
  //     this.response = res;
  //     if (this.response.success == true) {

  //       this.seller = this.response.data;
  //     }
  //     else {
  //       this.toastr.error(this.response.message, 'Message.');
  //     }
  //   })
  // }
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
  GetCurrencyDropdown() {
    this.http.get(`${environment.apiUrl}/api/Lookups/CurrencyTypes`).
    subscribe(res => {
      this.response = res;
      if (this.response.success == true) {
        this.currency = this.response.data;
      }
      else {
        this.toastr.error(this.response.message, 'Message.');
      }
    })
  }
  GetBankAccDropdown() {
    this.http.get(`${environment.apiUrl}/api/Lookups/BankAccounts`).
    subscribe(res => {
      this.response = res;
      if (this.response.success == true) {
        this.bankAcc = this.response.data;
  
      }
      else {
        this.toastr.error(this.response.message, 'Message.');
      }
    })
  }
  GetAgentDropdown() {
    this.http.get(`${environment.apiUrl}/api/Lookups/ExternalAgents`).
    subscribe(res => {
      this.response = res;
      if (this.response.success == true) {
        this.agent = this.response.data;
  
      }
      else {
        this.toastr.error(this.response.message, 'Message.');
      }
    })
  }

  navigateEditContract(obj) {
    this.router.navigate(['/FabCot/active-contract-details'], { queryParams: {id: obj.contractId} });
  };
  onSelect(event,row) {
      // this.blncamount=row.balanceAmount;
       this.invoicenoselected=this.rows.findIndex(x=>x.contractId ==row.contractId)
       if(event.currentTarget.checked == true){
        row.invoiceChecked = true;
        let countrow=this.rows.filter(x=>x.invoiceChecked ==true)
        countrow -1;
        this.invoicenoselected =countrow.length
       this.saleInvoiceIds.push(row.saleInvoiceId);
       let newrow =this.rows.filter(r=>r.saleInvoiceId ==row.saleInvoiceId)
       this.selected = newrow;  

       if(this.selected[0].receivedAmount != "0."+this.decimalSize){

         if(parseInt(this.result) == parseInt(row.receivedAmount)){
          this.selected[0].paid = this.result;
          this.selected[0].receivedAmount = this.selected[0].paid;
          this.result = this.selected[0].paid - this.result;
          if(this.result == ""){
            this.result='0.'+this.decimalSize;
          }
          this.selected[0].balanceAmount = "0.00";
          for(let i=0; i<this.rows.length; i++ )
          {     
         
            //this.Oblanc.push(parseFloat(this.rows[i].commissionSaleInvoiceAmount));
            this.Pblanc.push(parseFloat(this.rows[i].paid));
            
          }
          //const Osum = this.Oblanc.reduce((partial_sum, a) => partial_sum + a, 0);
          const Psum = this.Pblanc.reduce((partial_sum, a) => partial_sum + a, 0);
            //this.blncamount =Osum;
            this.Paidamount =Psum;
         }
         else if(parseInt(this.result) > parseInt(row.receivedAmount)){
          let remainingamount =  row.commissionSaleInvoiceAmount -row.receivedAmount;
          this.selected[0].paid =parseFloat(row.receivedAmount) + parseFloat(remainingamount.toFixed(2));
          this.selected[0].paid =this.selected[0].paid.toFixed(2);
          this.selected[0].balanceAmount = "0.00";
         this.result= parseFloat(this.result) - parseFloat(remainingamount.toFixed(2));
         //this.result =this.result+'.'+this.decimalSize;
         for(let i=0; i<this.rows.length; i++ )
         {     
        
           //this.Oblanc.push(parseFloat(this.rows[i].commissionSaleInvoiceAmount));
           this.Pblanc.push(parseFloat(this.rows[i].paid));
           
         }
         //const Osum = this.Oblanc.reduce((partial_sum, a) => partial_sum + a, 0);
         const Psum = this.Pblanc.reduce((partial_sum, a) => partial_sum + a, 0);
           //this.blncamount =Osum;
           this.Paidamount =Psum;
         }

       }
       else if(this.selected[0].receivedAmount == "0."+this.decimalSize){

        if(parseFloat(this.result) == parseFloat(row.commissionSaleInvoiceAmount)){
          this.blncamount = parseFloat(this.blncamount) - parseFloat(this.result)
            this.selected[0].paid = this.result;
            this.selected[0].receivedAmount = this.selected[0].paid;
            this.result = this.selected[0].paid - this.result;
            if(this.result == 0){
              this.result='0.'+this.decimalSize;
            }
            // '0.'+this.decimalSize;
            this.selected[0].balanceAmount = "0.00";
            this.Paidamount = parseFloat(this.selected[0].paid) +  parseFloat(this.Paidamount);

        }
        else if(parseFloat(this.result) < parseFloat(row.commissionSaleInvoiceAmount)){
          if(this.result== "0."+this.decimalSize){
            this.toastr.error('Not Enough Amount', 'Message.');
          }
          else{
            //this.result =this.result+this.decimalSize;
            this.blncamount = parseFloat(this.blncamount) - parseFloat(this.selected[0].paid)
          this.selected[0].paid = this.result;
          this.selected[0].receivedAmount = this.selected[0].paid;
          this.selected[0].balanceAmount = this.selected[0].balanceAmount - this.result;
          this.toastr.error('Partial Commission', 'Message.');
          this.result = this.selected[0].receivedAmount -this.result;
          this.Paidamount = parseFloat(this.selected[0].paid) +  parseFloat(this.Paidamount);
          }
          
        }
        else if(parseFloat(this.result) > parseFloat(row.commissionSaleInvoiceAmount)){
          this.blncamount = parseFloat(this.blncamount) - parseFloat(this.selected[0].paid)
          this.selected[0].paid = row.commissionSaleInvoiceAmount;
          this.selected[0].receivedAmount = this.selected[0].paid;
          this.result = this.result-this.selected[0].paid ;
          this.result =this.result.toFixed(2)
          this.selected[0].balanceAmount = "0.00";
          this.Paidamount = parseFloat(this.selected[0].paid) +  parseFloat(this.Paidamount);
        }
        //this.commData.amount=this.result
        this.result =parseFloat(this.result).toFixed(this.decimalcount);
      this.selected.push(...this.selected);
      this.rows = [...this.rows]
        }
      else if(event.currentTarget.checked == false){
        let newrow =this.rows.filter(r=>r.saleInvoiceId ==row.saleInvoiceId)
        let filterdata =this.rowsFilter.filter(x=>x.saleInvoiceId ==row.saleInvoiceId)
        this.selected = newrow; 
        this.result=parseInt(this.result)+parseInt(this.selected[0].receivedAmount);
        this.result =this.result+'.'+this.decimalSize;
        this.selected[0].paid= '0.'+this.decimalSize;
        this.selected[0].receivedAmount='0.'+this.decimalSize
        this.selected[0].balanceAmount =   filterdata[0].balanceAmount;
        this.selected.push(...this.selected);
        this.rows = [...this.rows]
        this.saleInvoiceIds.forEach((element,index)=>{
          if(element==row.saleInvoiceId) this.saleInvoiceIds.splice(index,1);
         
       });
      }
    }
    else if(event.currentTarget.checked == false){
      let newrow =this.rows.filter(r=>r.saleInvoiceId ==row.saleInvoiceId)
      let filterdata =this.rowsFilter.filter(x=>x.saleInvoiceId ==row.saleInvoiceId)
      this.selected = newrow; 
      this.selected[0].paid = filterdata[0].paid;
      if(this.result =="0."+this.decimalSize){
        row.invoiceChecked = false;
        let countrow=this.rows.filter(x=>x.invoiceChecked ==true)
        countrow -1;
        this.invoicenoselected =countrow.length
        this.blncamount = parseFloat(this.blncamount) + parseFloat(row.paid)
        this.result =parseFloat(this.result)+ parseFloat(row.commissionSaleInvoiceAmount);
        this.Paidamount =  parseFloat(this.Paidamount) -parseFloat(this.selected[0].paid) ;
        this.Paidamount =this.Paidamount.toFixed(this.decimalcount);
        this.selected[0].paid=  "0."+this.decimalSize;
        this.selected[0].balanceAmount = filterdata[0].paid;
        this.selected[0].receivedAmount='0.'+this.decimalSize
      }
      else{
      let remainingamount =  row.commissionSaleInvoiceAmount -row.receivedAmount;
      if(this.result != 0){
        row.invoiceChecked = false;
        let countrow=this.rows.filter(x=>x.invoiceChecked ==true)
        countrow -1;
        this.invoicenoselected =countrow.length
        this.blncamount = parseFloat(this.blncamount) + parseFloat(row.commissionSaleInvoiceAmount)
        this.result =parseFloat(this.result)+ parseFloat(row.commissionSaleInvoiceAmount);
        this.result =this.result.toFixed(this.decimalcount);
        this.Paidamount =  parseFloat(this.Paidamount) - parseFloat(this.selected[0].paid);
        this.Paidamount =this.Paidamount.toFixed(this.decimalcount);
        this.selected[0].paid=  "0."+this.decimalSize;
        this.selected[0].balanceAmount = filterdata[0].paid;
        this.selected[0].receivedAmount='0.'+this.decimalSize
      }
      // this.result =this.result+remainingamount;
      // this.result =this.result+'.'+this.decimalSize;
      // this.selected[0].balanceAmount = filterdata[0].paid;
      
      }

    }
    //this.blncamount=this.result
  }

  amountCall(event){
    let deptName =localStorage.getItem('loggedInDepartmentName');
    if(deptName == 'Yarn Local'){
   
     this.amountGivenToCalculate=this.commData.amount;
           this.result = this.commData.amount.toString() +'.'+this.decimalSize;
          //  this.extCommData.taxChalan = 0;
          //  for(let i=0;i<=this.rows.length; i++){
          //    this.rows[i].receivedAmount ='0.'+this.decimalSize;

          //  }
    }
   
    else{
           this.amountGivenToCalculate=this.commData.amount;
           this.result = this.commData.amount.toString();
          //  this.extCommData.taxChalan = 0;
          //  for(let i=0;i<=this.rows.length; i++){
          //    this.rows[i].receivedAmount ='0.'+this.decimalSize;

          //  }
         }
     }
  onBlurMethod(event){
    if(this.result ==event){

      this.result =null;
      this.result=event;
    
    }
    // for(let i=0;i<=this.rows.length; i++){
    //   this.rows[i].receivedAmount ='0.'+this.decimalSize;

    // }
  //   if(event != undefined){
  //     setTimeout(()=>{                           
  //       this.isAmountDisabled =true;
  //  }, 3000);
      

  //   }
  //   else{
  //   this.isAmountDisabled =false;

  //   }
  }

  getbyidgernalsettings() {
   let deptId=localStorage.getItem('loggedInDepartmentId')
    this.http.get(`${environment.apiUrl}/api/Configs/GetGeneralSettingById/` + deptId)
      .subscribe(
        res => {
          this.response = res;
          if (this.response.success == true) {
            if( this.response.data !=null){
              this.decimalcount = this.response.data.amountDecimalPoints;
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
  getseller(event){

    this.http.get(`${environment.apiUrl}/api/Contracts/GetExternalAgentSuppllierByAgentId/` + event)
    .subscribe(
      res => {
        this.response = res;
        if (this.response.success == true) {
          if( this.response.data !=null){
            this.seller = this.response.data;

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
  sellerNameChange(event){
    this.sellerNameId=event;


 
    this.http.get(`${environment.apiUrl}/api/Contracts/GetExternalAgentPaymentById/`+ this.commData.agentId  +'/'+ this.sellerNameId).
    subscribe(res => {
      this.response = res;
      if (this.response.success == true) {
        this.rows = this.response.data;
        this.rowsFilter =this.response.data;
        //  for(let i=0;i<=this.rows.length; i++){
        //    if(this.rows[i].paidCheck ==true){

        //     let am = this.rows[i].paid ;
        //      let pp =this.Paidamount.push(am) 
        //      this.Paidamount +=pp
        //    }
        // //   //this.rows[i].balanceAmount =this.rows[i].saleInvoiceAmount;

        //  }
        for(let i=0; i<this.rows.length; i++ )
        {     
         
          this.Oblanc.push(parseFloat(this.rows[i].commissionSaleInvoiceAmount));
          this.Pblanc.push(parseFloat(this.rows[i].paid));
          
        }
        const Osum = this.Oblanc.reduce((partial_sum, a) => partial_sum + a, 0);
        const Psum = this.Pblanc.reduce((partial_sum, a) => partial_sum + a, 0);
          this.blncamount =Osum;
          this.Paidamount =Psum;
      }
      else {
        this.toastr.error(this.response.message, 'Message.');
      }
    })
         
  }


  addCommissionPayment(dataamount) {
    if(dataamount != null){
    let ids=[]
    ids=this.saleInvoiceIds;
    this.saleInvoiceIds = [] ;
    for(let i = 0 ; i < ids.length ; i++){
    
      let found= this.rows.filter(x=>x.saleInvoiceId ==ids[i])
      this.saleInvoiceIds.push({"saleInvoiceId": found[0].saleInvoiceId, "invoiceAmount": found[0].paid}) 
    }
      let varr = {
        "buyerId": null,
        "sellerId": this.commData.sellerId,
        "isBuyerCommission": this.commData.isBuyerCommission,
        "paymentDate": this.dateformater.toModel(this.commData.paymentDate),
        "payNo": this.commData.payNo,
        "amount":this.commData.amount,
        "currencyId": this.commData.currencyId,
        "paymentMode": this.commData.paymentMode,
        "additionalDetail":this.commData.additionalDetail,
        "fromBankAccountId": this.commData.fromBankAccountId,
        "toBankId": this.commData.toBankAccountId,
        "depositInBank":this.commData.depositInBank,
        "depositDate": this.dateformater.toModel(this.commData.depositDate),
        "paymentRemarks":this.commData.paymentRemarks,
        "active": true,
        "SaleInvoicePaymentDetails": this.saleInvoiceIds
      }
this.spinner.show();
    this.http.
      post(`${environment.apiUrl}/api/YarnContracts/AddBuyerToSellerPaymentCommision`, varr)
      .subscribe(
        res => {

          this.response = res;
          if (this.response.success == true) {
            this.toastr.success(this.response.message, 'Message.');
            // this.paymentForm.reset();
            this.router.navigate(['yarn-billing-and-payment/commission-payment']);
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
      else{
        this.toastr.error("Enter the Amount !", 'Message.');
      }
  }
  addExtCommissionPayment() {
    let varr = {
      "agentId": this.extCommData.agentId,
  "sellerId": this.extCommData.sellerId,
  "paymentDate": this.dateformater.toModel(this.extCommData.paymentDate),
  "payNo": this.extCommData.payNo,
  "amount": this.extCommData.amount,
  "currencyId" : this.extCommData.currencyId,
  "paymentMode": this.extCommData.paymentMode,
  "additionalDetail": this.extCommData.additionalDetail,
  "recieveDate": this.dateformater.toModel(this.extCommData.recieveDate),
  "paymentRemarks": this.extCommData.paymentRemarks,
  "active": true
    }
    this.spinner.show();

  this.http.
    post(`${environment.apiUrl}/api/BillingPayments/AddBillingExternalAgentCommission`, varr)
    .subscribe(
      res => {

        this.response = res;
        if (this.response.success == true) {
          this.toastr.success(this.response.message, 'Message.');
          // this.paymentForm.reset();
          this.router.navigate(['yarn-billing-and-payment/external-agent']);
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

}
