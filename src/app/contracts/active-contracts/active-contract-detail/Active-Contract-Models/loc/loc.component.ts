import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Dateformater } from 'src/app/shared/dateformater';
import { ServiceService } from 'src/app/shared/service.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-loc',
  templateUrl: './loc.component.html',
  styleUrls: ['./loc.component.css']
})
export class LOCComponent implements OnInit {

  dateformater: Dateformater = new Dateformater();
  @Input() contractId;
  data:any ={};
  response: any;
  
  constructor(
    private _NgbActiveModal: NgbActiveModal,
    private http: HttpClient,
    private service: ServiceService,
    private toastr: ToastrService,
  ) { }

  ngOnInit(): void {
    this.getContractLOC();
  }

  get activeModal() {
    return this._NgbActiveModal;
  }


  getContractLOC() {
    this.http.get(`${environment.apiUrl}/api/Contracts/GetContractLetterCreditById/` + this.contractId)
      .subscribe(
        res => {
          this.response = res;
          if (this.response.success == true) {
            this.data = this.response.data;
            this.data.lcExpiryDate = this.dateformater.fromModel(this.data.lcExpiryDate);
            this.data.lcShipmentOn = this.dateformater.fromModel(this.data.lcShipmentOn);
            this.data.lcOpenOn = this.dateformater.fromModel(this.data.lcOpenOn);
            
  

            
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



  addContractLOC(form:NgForm) {
    
    this.data.lcExpiryDate = this.dateformater.toModel(this.data.lcExpiryDate);
    this.data.lcShipmentOn = this.dateformater.toModel(this.data.lcShipmentOn);
    this.data.lcOpenOn = this.dateformater.toModel(this.data.lcOpenOn);


    let varr = {

      "contractId": this.contractId,
      "lcNumber": this.data.lcNumber,
      "lcOpenOn": this.data.lcOpenOn,
      "lcShipmentOn": this.data.lcShipmentOn,
      "lcShipmentInfo": this.data.lcShipmentInfo,
      "lcExpiryDate":this.data.lcExpiryDate,
      "remarks": this.data.remarks,
    }

    this.http.
      post(`${environment.apiUrl}/api/Contracts/AddContractLetterCredit`, varr)
      .subscribe(
        res => {

          this.response = res;
          if (this.response.success == true) {
            this.toastr.success(this.response.message, 'Message.');
            // this.getEnquiryData(this.objEnquiry);
            this.activeModal.close(true);
            this.getContractLOC();

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
}



