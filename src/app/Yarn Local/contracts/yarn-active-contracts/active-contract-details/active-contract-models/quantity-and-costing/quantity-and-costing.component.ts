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
          if (this.response.success == true) {
            this.data = this.response.data;
           
            
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
  addContractCosting() {
    let varr = {
      "contractId": this.data.contractId,
      "quantity": this.data.quantity,
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

}
