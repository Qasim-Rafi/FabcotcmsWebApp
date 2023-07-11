import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Dateformater } from 'src/app/shared/dateformater';
import { ServiceService } from 'src/app/shared/service.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-quantity-and-costing',
  templateUrl: './quantity-and-costing.component.html',
  styleUrls: ['./quantity-and-costing.component.css']
})
export class QuantityAndCostingComponent implements OnInit {

  dateformater: Dateformater = new Dateformater();  
  @Input() contractId;
  @Input() autoContractNumber;
  @Input() blockId;

  data:any ={};
  response: any;
  currency: any={};
  uomList: any={};
  loggedInDepartmentName: any={};
  constructor(
    private _NgbActiveModal: NgbActiveModal,
    private http: HttpClient,
    private service: ServiceService,
    private spinner: NgxSpinnerService,

    private toastr: ToastrService,
  ) { }

  ngOnInit(): void {

    this.loggedInDepartmentName=localStorage.getItem('loggedInDepartmentName');

    this.GetUOMDropdown();
    this.GetCurrencyDropdown();
    this.getContractCostingData();
  }
  get activeModal() {
    return this._NgbActiveModal;
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
    this.http.get(`${environment.apiUrl}/api/Lookups/UOMs`).
    subscribe(res => {
      this.response = res;
      if (this.response.success == true) {
        this.uomList = this.response.data;
      }
      else {
        this.toastr.error(this.response.message, 'Message.');
      }
    })
  }

  getContractCostingData() {
    this.http.get(`${environment.apiUrl}/api/Contracts/GetContractCostingById/` + this.contractId)
      .subscribe(
        res => {
          this.response = res;
          if (this.response.success == true && this.response.data != null) {
            this.data = this.response.data;
            if( this.data.rateUOMId == null && this.data.quantityUOMId == null ||
              this.data.quantityUOMId == null &&  this.data.rateCurrencyId){
              this.toastr.error("Quantity or Rate UMOs Are Missing", 'Message.');
            }
            
          }
          else if(this.response.success == false) {
         
            this.toastr.error(this.response.message, 'Message.');
          }
 
        },(err: HttpErrorResponse) => {
          const messages = this.service.extractErrorMessagesFromErrorResponse(err);
          this.toastr.error(messages.toString(), 'Message.');
          console.log(messages);
        });
  }
  addContractCosting() {

    if( this.data.rateUOMId != null && this.data.quantityUOMId != null){
      if(this.data.quantity == undefined){
        this.data.quantity ="0"
      }
    let varr = {
      "contractId": this.contractId,
      "quantity":  this.data.quantity.replace("," , "") ,
      "quantityUOMId": this.data.quantityUOMId,

      "quantityToleranceValue": this.data.quantityToleranceValue,
      "rate": this.data.rate ==""?null:this.data.rate,
      "rateCurrencyId": this.data.rateCurrencyId,
      
      "rateUOMId": this.data.rateUOMId,
      "contractCost":this.data.contractCost == "" ? 0 : this.data.contractCost,
      "totalCostGSt":this.data.totalCostGSt == ""?  null :this.data.totalCostGSt  ,
      "gst": this.data.gst,
      "aDIncomeTaxFL":this.data.aDIncomeTaxFL,
      "witAx": this.data.witAx,
      "blockId": this.blockId == undefined ? null :this.blockId,
      
    }
this.spinner.show();
    this.http.
      post(`${environment.apiUrl}/api/Contracts/AddContractCosting`, varr)
      .subscribe(
        res => {

          this.response = res;
          if (this.response.success == true) {
            this.toastr.success(this.response.message, 'Message.');
            // this.getEnquiryData(this.objEnquiry);
            this.activeModal.close(true);
            this.getContractCostingData();
            localStorage.setItem('rate',this.data.quantity);
this.spinner.hide();


        }
          else {
            this.toastr.error(this.response.message, 'Message.');
this.spinner.hide();

          }

        },(err: HttpErrorResponse) => {
          const messages = this.service.extractErrorMessagesFromErrorResponse(err);
          this.toastr.error(messages.toString(), 'Message.');
          console.log(messages);
this.spinner.hide();

        });
      }
      else{
        if(this.loggedInDepartmentName == "Yarn Export" || this.loggedInDepartmentName == "Yarn Export Bangladesh")
        {
          if(this.data.quantity == undefined){
            this.data.quantity ="0"
          }
       
          let varr = {
            "contractId": this.contractId,
            "quantity": this.data.quantity.replace("," , ""),
            "quantityUOMId": this.data.quantityUOMId,
      
            "quantityToleranceValue": this.data.quantityToleranceValue,
            "rate": this.data.rate,
            "rateCurrencyId": this.data.rateCurrencyId,
            
            "rateUOMId": this.data.rateUOMId,
            "contractCost":this.data.contractCost == "" ? 0 : this.data.contractCost,
            "totalCostGSt":this.data.totalCostGSt == ""?  null :this.data.totalCostGSt  ,
            "gst": this.data.gst,
            
            "witAx": this.data.witAx
            
          }
      this.spinner.show();
          this.http.
            post(`${environment.apiUrl}/api/Contracts/AddContractCosting`, varr)
            .subscribe(
              res => {
      
                this.response = res;
                if (this.response.success == true) {
                  this.toastr.success(this.response.message, 'Message.');
                  // this.getEnquiryData(this.objEnquiry);
                  this.activeModal.close(true);
                  this.getContractCostingData();
                  localStorage.setItem('rate',this.data.quantity);
      this.spinner.hide();
      
      
              }
                else {
                  this.toastr.error(this.response.message, 'Message.');
      this.spinner.hide();
      
                }
      
              },(err: HttpErrorResponse) => {
                const messages = this.service.extractErrorMessagesFromErrorResponse(err);
                this.toastr.error(messages.toString(), 'Message.');
                console.log(messages);
      this.spinner.hide();
      
              });
        }
        else if (this.loggedInDepartmentName == "Yarn Import"){
          if(this.data.quantity == undefined){
            this.data.quantity ="0"
          }
        let varr = {
          "contractId": this.contractId,
          "quantity":  this.data.quantity.replace("," , "") ,
          "quantityUOMId": this.data.quantityUOMId,
    
          "quantityToleranceValue": this.data.quantityToleranceValue,
          "rate": this.data.rate =="" ? 0 :this.data.rate,
          "rateCurrencyId": this.data.rateCurrencyId,
          
          "rateUOMId": this.data.rateUOMId,
          "contractCost":this.data.contractCost == "" ? 0 : this.data.contractCost,
          "totalCostGSt":this.data.totalCostGSt == ""?  null :this.data.totalCostGSt  ,
          "gst": this.data.gst,
          "witAx": this.data.witAx
          
        }
    this.spinner.show();
        this.http.
          post(`${environment.apiUrl}/api/Contracts/AddContractCosting`, varr)
          .subscribe(
            res => {
    
              this.response = res;
              if (this.response.success == true) {
                this.toastr.success(this.response.message, 'Message.');
                // this.getEnquiryData(this.objEnquiry);
                this.activeModal.close(true);
                this.getContractCostingData();
                localStorage.setItem('rate',this.data.quantity);
    this.spinner.hide();
    
    
            }
              else {
                this.toastr.error(this.response.message, 'Message.');
    this.spinner.hide();
    
              }
    
            },(err: HttpErrorResponse) => {
              const messages = this.service.extractErrorMessagesFromErrorResponse(err);
              this.toastr.error(messages.toString(), 'Message.');
              console.log(messages);
    this.spinner.hide();
    
            });

        }
        else{

          this.toastr.error("Quantity or Rate UMOs Are Missing", 'Message.');
        }
      }
  }

}
