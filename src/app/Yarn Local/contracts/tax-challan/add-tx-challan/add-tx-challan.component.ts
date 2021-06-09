import { Component, Input, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ServiceService } from 'src/app/shared/service.service';
import { environment } from 'src/environments/environment';
import { HttpClient  , HttpErrorResponse} from '@angular/common/http';
import { Dateformater } from 'src/app/shared/dateformater';

@Component({
  selector: 'app-add-tx-challan',
  templateUrl: './add-tx-challan.component.html',
  styleUrls: ['./add-tx-challan.component.css']
})
export class AddTxChallanComponent implements OnInit {
  dateformater: Dateformater = new Dateformater();

  buyer: any=[];
  seller: any=[];
  currency: any=[];
  data:any = {}
  columns: any
  response: any

  rows = []

  constructor(
    private service: ServiceService,
    private toastr: ToastrService,
    private http: HttpClient,
  ) { }

  ngOnInit(): void {
    this.GetCurrencyDropdown();
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

      let varr = {
        "buyerId": this.data.buyerId,
        "sellerId": this.data.sellerId,
        "challanDate": this.dateformater.toModel(this.data.chalanDate),
        "amount": this.data.amount,
        "currencyId": this.data.currencyId,
        "cprNumber": this.data.cprNumber,
        "remarks": this.data.remarks
      
   
      }

    this.http.
      post(`${environment.apiUrl}/api/YarnContracts/AddTaxChallan`, varr)
      .subscribe(
        res => {

          this.response = res;
          if (this.response.success == true) {
            this.data = this.response.data;
            this.toastr.success(this.response.message, 'Message.');

          }
          else {
            this.toastr.error(this.response.message, 'Message.');
          }

        }, (err: HttpErrorResponse) => {
          const messages = this.service.extractErrorMessagesFromErrorResponse(err);
          this.toastr.error(messages.toString(), 'Message.');
          console.log(messages);
        });
  }





}
