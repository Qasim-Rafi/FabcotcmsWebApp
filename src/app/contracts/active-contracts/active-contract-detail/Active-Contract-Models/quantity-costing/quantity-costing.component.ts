import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ServiceService } from 'src/app/shared/service.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-quantity-costing',
  templateUrl: './quantity-costing.component.html',
  styleUrls: ['./quantity-costing.component.css']
})
export class QuantityCostingComponent implements OnInit {


  
  @Input() contractId;
  data:any ={};
  response: any;
  currency: any={};

  
  constructor( private _NgbActiveModal: NgbActiveModal,
    private http: HttpClient,
    private service: ServiceService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,) { }

  ngOnInit(): void {
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




  getContractCostingData() {
    this.http.get(`${environment.apiUrl}/api/Contracts/GetContractCostingById/` + this.contractId)
      .subscribe(
        res => {
          this.response = res;
          if (this.response.success == true && this.response.data != null) {
            this.data = this.response.data;
            
          }
          else {
            this.toastr.error(this.response.message, 'Message.');
          }
 
        }, err => {
          if (err.status == 400) {
            this.toastr.error(this.response.message, 'Message.');
          }
        });
  }



  addContractCosting() {
    this.spinner.show();
    let varr = {

      "contractId": this.contractId,
      "currencyId": this.data.currencyId,
      "quantity": this.data.quantity,
      "contractCost": this.data.contractCost,
    }

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
