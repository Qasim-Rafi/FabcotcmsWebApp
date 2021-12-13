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
// import { ToastrService } from 'ngx-toastr';
// import { HttpClient } from '@angular/common/http';
// import { environment } from 'src/environments/environment';
// import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-new-commission-payment',
  templateUrl: './new-commission-payment.component.html',
  styleUrls: ['./new-commission-payment.component.css']
})
export class NewCommissionPaymentComponent implements OnInit {
  dateformater: Dateformater = new Dateformater();
  response: any;
  blncamount:any;
  invoicenoselected:any;
  selected = [];
  saleInvoiceIds =[];
  paymentAdddata: any = {};
commData : any = [];
extCommData : any = {};
amountGivenToCalculate:any;
  statusCheck:any={};
  rows: any = [];
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
  result:any;
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
     this.GetSellerDropdown();
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
  GetSellerDropdown() {
    this.service.getcommisionpaynentSellerLookup().subscribe(res => {
      this.response = res;
      if (this.response.success == true) {

        this.seller = this.response.data;
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
  onSelect(event,row) {
       this.blncamount=row.balanceAmount;
       this.invoicenoselected=this.rows.findIndex(x=>x.contractId ==row.contractId)
       if(event.currentTarget.checked == true){
       this.saleInvoiceIds.push(row.saleInvoiceId);
       let newrow =this.rows.filter(r=>r.saleInvoiceId ==row.saleInvoiceId)
       this.selected = newrow;  

        if(this.result == row.saleInvoiceAmount){
            this.selected[0].paid = this.result;
            this.selected[0].receivedAmount = this.selected[0].paid;
            this.result = this.selected[0].paid - this.result;
            if(this.result == ""){
              this.result='0.'+this.decimalSize;
            }
            // '0.'+this.decimalSize;
            this.selected[0].balanceAmount = "0.00";

        }
        else if(this.result < row.saleInvoiceAmount){
          if(this.result== "0."+this.decimalSize){
            this.toastr.error('Not Enuf Amount', 'Message.');
          }
          else{
            //this.result =this.result+this.decimalSize;
          this.selected[0].paid = this.result;
          this.selected[0].receivedAmount = this.selected[0].paid;
          this.selected[0].balanceAmount = this.selected[0].balanceAmount - this.result;
          this.toastr.error('Partial Commission', 'Message.');
          this.result = this.selected[0].receivedAmount -this.result;
          }
        }
        else if(this.result > row.saleInvoiceAmount){
          this.selected[0].paid = row.saleInvoiceAmount;
          this.selected[0].receivedAmount = this.selected[0].paid;
          this.result = this.result-this.selected[0].paid ;
          this.result =this.result.toFixed(2)
          this.selected[0].balanceAmount = "0.00";
        }
        this.result =this.result.toFixed(2);
      this.selected.push(...this.selected);
      this.rows = [...this.rows]
        }
      else if(event.currentTarget.checked == false){
        let newrow =this.rows.filter(r=>r.saleInvoiceId ==row.saleInvoiceId)
        this.selected = newrow; 
        this.result=parseInt(this.result)+parseInt(this.selected[0].receivedAmount);
        this.result =this.result+'.'+this.decimalSize;
        this.selected[0].paid= '0.'+this.decimalSize;
        this.selected[0].receivedAmount='0.'+this.decimalSize
        this.selected[0].balanceAmount =   this.selected[0].balanceAmount;
        this.selected.push(...this.selected);
        this.rows = [...this.rows]
        this.saleInvoiceIds.forEach((element,index)=>{
          if(element==row.saleInvoiceId) this.saleInvoiceIds.splice(index,1);
         
       });
      }

  }

  amountCall(event){
    let deptName =localStorage.getItem('loggedInDepartmentName');
    if(deptName == 'Yarn Local'){
   
     this.amountGivenToCalculate=this.commData.amount;
           this.result = this.commData.amount.toString() +'.'+this.decimalSize;
           this.extCommData.taxChalan = 0;
           for(let i=0;i<=this.rows.length; i++){
             this.rows[i].receivedAmount ='0.00';
             this.rows[i].taxChallan ='0.00';
           }
    }
   
    else{
           this.amountGivenToCalculate=this.commData.amount;
           this.result = this.commData.amount.toString();
           this.extCommData.taxChalan = 0;
           for(let i=0;i<=this.rows.length; i++){
             this.rows[i].receivedAmount ='0.00';
             this.rows[i].taxChallan ='0.00';
           }
         }
     }
  onBlurMethod(event){
    if(this.result ==event){

      this.result =null;
      this.result=event;
    
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

  getbyidgernalsettings() {

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

  sellerNameChange(event){
    this.sellerNameId=event;



    this.http.get(`${environment.apiUrl}/api/Contracts/GetContractByBuyerSellerId/0/`+ this.sellerNameId).
    subscribe(res => {
      this.response = res;
      if (this.response.success == true) {
        this.rows = this.response.data;
        for(let i=0;i<=this.rows.length; i++){
          this.rows[i].paid ='0.'+this.decimalSize;
          this.rows[i].balanceAmount =this.rows[i].saleInvoiceAmount;

        }
      }
      else {
        this.toastr.error(this.response.message, 'Message.');
      }
    })
         
  }


  addCommissionPayment() {
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
        "saleInvoiceIds": this.saleInvoiceIds
      }
this.spinner.show();
    this.http.
      post(`${environment.apiUrl}/api/YarnContracts/AddBuyerToSellerPayment`, varr)
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
