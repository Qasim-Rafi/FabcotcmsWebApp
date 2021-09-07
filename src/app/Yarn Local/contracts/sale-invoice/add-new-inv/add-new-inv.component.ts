import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { GlobalConstants } from 'src/app/Common/global-constants';
import { Dateformater } from 'src/app/shared/dateformater';
import { ServiceService } from 'src/app/shared/service.service';
import { environment } from 'src/environments/environment';
import { SearchComponent } from '../search/search.component';

@Component({
  selector: 'app-add-new-inv',
  templateUrl: './add-new-inv.component.html',
  styleUrls: ['./add-new-inv.component.css']
})
export class AddNewInvComponent implements OnInit {

  dateformater: Dateformater = new Dateformater();  

  @Input() contractId;
  @Input() invoiceId; 
  @Input() statusCheck; 
  rows: any = {};
  contract: any = [];

  timeout: any = null;
  data:any ={};
  data2:any ={};

  response: any;
uomList : any = {};
rate:any;
quantitya:any;
calculatedcost:any;
buyerName : any;
contractNum : any;
autocontractId : any;
acontractId : any;
loggedInDepartmentName : any;
aQuantity : any;
// response: any;
  constructor(
    private _NgbActiveModal: NgbActiveModal,
    private spinner: NgxSpinnerService,
    private modalService: NgbModal,
    private http: HttpClient,
    private service: ServiceService,
    private toastr: ToastrService,
  ) { }


  ngOnInit(): void {
    this.GetUOMDropdown();
    this.loggedInDepartmentName = localStorage.getItem
    ('loggedInDepartmentName');
    if (this.statusCheck == 'edit') {
      this.editSaleInvoice();
    }
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
//   getquantity(event){
//     clearTimeout(this.timeout);
    
//     this.rate=parseInt(localStorage.getItem('rate'))
//       if (event.keyCode != 13) {
//     this.quantitya=event.target.value;
//  this.calculatedcost= this.quantitya*this.rate;
//  this.data.amount=this.calculatedcost;

//       }
    
//    }

getContractCostingData(contractId) {
  this.http.get(`${environment.apiUrl}/api/Contracts/GetContractCostingById/` + contractId)
    .subscribe(
      res => {
        this.response = res;
        if (this.response.success == true) {
          this.rate = this.response.data.rate;
       
        
        }

        else {
          this.toastr.error(this.response.message, 'Message.');
        }

      },(err: HttpErrorResponse) => {
        const messages = this.service.extractErrorMessagesFromErrorResponse(err);
        this.toastr.error(messages.toString(), 'Message.');
        console.log(messages);
      });
}


getquantity(event){

  clearTimeout(this.timeout);
  
    if (event.keyCode != 13) {
      if(this.loggedInDepartmentName=="Yarn Local"){
        this.quantitya=event.target.value;
        this.calculatedcost= this.quantitya*this.rate*10;
        this.data.amount=this.calculatedcost;
      }else{
        this.quantitya=event.target.value;
        this.calculatedcost= this.quantitya*this.rate;
        this.data.amount=this.calculatedcost;
      }
    }
  
 }


   getunit(event:any){
    // clearTimeout(this.timeout);
   
      if (event.keyCode != 13) {

if(event==8){
 
  this.data.amount=this.calculatedcost*10;
}else if(event==7){
  this.data.amount=this.calculatedcost;
}
      }
    
   }
  get activeModal() {
    return this._NgbActiveModal;
  }
  ContractsDropdown() {
    //  let number=parseInt(this.data.contractNmbr);
this.http.get(`${environment.apiUrl}/api/Lookups/GetContractsAgainstNumber?contractNo=`+ this.data.contractNo)
.subscribe(res => {
 this.response = res;
 if (this.response.success == true) {
  this.contract = this.response.data;

  this.acontractId = this.response.data[0].contractId;
  const modalRef = this.modalService.open(SearchComponent , { centered: true });
  modalRef.componentInstance.autoContractNumbr = this.response.data[0].autoContractNumber ;
  modalRef.componentInstance.sellerName = this.response.data[0].sellerName;
  modalRef.componentInstance.buyerName = this.response.data[0].buyerName;
  modalRef.componentInstance.contractNumb = this.data.contractNo;


  modalRef.result.then((p) => {
    if (p !=null)
     {
      this.autocontractId =  p.contractId
     this.contractNum =  p.autoContractNumber
       this.getContractCostingData(p.contractId)

    
    }
  }, (reason) => {
  
  });
 
 }
 else {
   this.toastr.error(this.response.message, 'Message.');
 }
})
}
contractNumber(){
  this.http.get(`${environment.apiUrl}/api/Lookups/GetContractsAgainstNumber?contractNo=`+ this.data.contractNo)
.subscribe(res => {
 this.response = res;
 if (this.response.success == true) {
  this.contract = this.response.data;
  this.acontractId = this.response.data[0].contractId;
 }
  else {
    this.toastr.error(this.response.message, 'Message.');
  }
 })
}
  // ChangeBankForm(rows) {
   
  
  // }



  fetch(cb) {
    // this.spinner.show();
    this.http
    .get(`${environment.apiUrl}/api/YarnContracts/GetContractSaleInvoiceById/` + this.invoiceId)
    .subscribe(res => {
      this.response = res;
     
    if(this.response.success==true)
    {
    this.data =this.response.data;
    cb(this.data);
    // this.spinner.hide();
    }
    else{
      this.toastr.error(this.response.message, 'Message.');
  //  this.spinner.hide();
    }
      // this.spinner.hide();
    }, err => {
      if ( err.status == 400) {
 this.toastr.error(err.error.message, 'Message.');
// this.spinner.hide();      
}
    //  this.spinner.hide();
    });
  }








  addSaleInvoice() {
    //  this.data.saleInvoiceDate = this.dateformater.toModel(this.data.saleInvoiceDate);
    let varr = {

      "contractId": this.autocontractId == null ? this.acontractId : this.autocontractId,
      // "certificateIds": this.data.certificateIds != null ? this.data.certificateIds.toString() : null,
      "saleInvoiceNo": this.data.saleInvoiceNo,
      "saleInvoiceDate":this.dateformater.toModel(this.data.saleInvoiceDate),
      "saleInvoiceRemarks":this.data.saleInvoiceRemarks,
      "amount": this.data.amount,
      "quantity": this.data.quantity,
      "unit": this.data.unit.toString(),
      "taxPercentage": this.data.taxPercentage,
    }
this.spinner.show();
    this.http.
      post(`${environment.apiUrl}/api/YarnContracts/AddContractSaleInvoice`, varr)
      .subscribe(
        res => {

          this.response = res;
          if (this.response.success == true) {
            this.toastr.success(this.response.message, 'Message.');
            this.activeModal.close(true);
          localStorage.setItem('quantity',this.data.quantity);
         this.spinner.hide();
          }
          else {
            this.toastr.error(this.response.message, 'Message.');
         this.spinner.hide();
          }

        }, (err: HttpErrorResponse) => {
          const messages = this.service.extractErrorMessagesFromErrorResponse(err);
          this.toastr.error(messages.toString(),'Message.');
          this.spinner.hide();
          
        });
  }



  editSaleInvoice() {
    // this.spinner.show();
    this.http.get(`${environment.apiUrl}/api/YarnContracts/GetContractSaleInvoiceById/` + this.invoiceId)
      .subscribe(
        res => {
          this.response = res;
          if (this.response.success == true) {
            this.data = this.response.data;
            this.data.saleInvoiceDate = this.dateformater.fromModel(this.data.saleInvoiceDate);
            // this.spinner.hide();

          }
          else {
            this.toastr.error(GlobalConstants.exceptionMessage, 'Message.');
            // this.spinner.hide();
          }

        }, err => {
          if (err.status == 400) {
            this.toastr.error(GlobalConstants.exceptionMessage, 'Message.');
            // this.spinner.hide();
          }
        });
  }
  




  
  updateSaleInvoice() {
   let varr = {
    "contractId":   this.autocontractId == null ? this.data.contractId : this.autocontractId,
      "saleInvoiceNo": this.data.saleInvoiceNo,
      "saleInvoiceDate":this.dateformater.toModel(this.data.saleInvoiceDate),
      "saleInvoiceRemarks":this.data.saleInvoiceRemarks,
      "amount": this.data.amount,
      "quantity": this.data.quantity,
      "unit": this.data.unit,
      "taxPercentage": this.data.taxPercentage,
   }
this.spinner.show();
   this.http.
     put(`${environment.apiUrl}/api/YarnContracts/UpdateContractSaleInvoice/` + this.invoiceId, varr)
     .subscribe(
       res => {

         this.response = res;
         if (this.response.success == true) {
           this.toastr.success(GlobalConstants.updateMessage, 'Message.');
           this.activeModal.close(true);
           this.spinner.hide();
          }
         else {
           this.toastr.error(this.response.message, 'Message.');
           this.spinner.hide();
          }

       }, err => {
         if (err.status == 400) {
           this.toastr.error(GlobalConstants.exceptionMessage, 'Message.');
           this.spinner.hide();
          }
       });
 }





}

