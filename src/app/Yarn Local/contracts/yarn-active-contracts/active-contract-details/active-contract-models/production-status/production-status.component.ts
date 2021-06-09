import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { GlobalConstants } from 'src/app/Common/global-constants';
import { Dateformater } from 'src/app/shared/dateformater';
import { ServiceService } from 'src/app/shared/service.service';
import { environment } from 'src/environments/environment';
import {FormsModule , NgForm, ReactiveFormsModule}  from '@angular/forms'

@Component({
  selector: 'app-production-status',
  templateUrl: './production-status.component.html',
  styleUrls: ['./production-status.component.css']
})
export class ProductionStatusComponent implements OnInit {

  dateformater: Dateformater = new Dateformater();  
  data:any ={};
  @Input() dispatchId; 
  @Input() contractId; 

  response: any;
  @ViewChild(NgForm) dispatchForm;
 
  constructor(
    private _NgbActiveModal: NgbActiveModal,
    private http: HttpClient,
    private service: ServiceService,
    private toastr: ToastrService,
  ) { }


  ngOnInit(): void {

  }

  get activeModal() {
    return this._NgbActiveModal;
  }

  // getDispatch() {
  //   this.http.get(`${environment.apiUrl}` + this.dispatchId)
  //     .subscribe(
  //       res => {
  //         this.response = res;
  //         if (this.response.success == true) {
  //           this.data = this.response.data;
  //           this.data.dispatchDate = this.dateformater.fromModel(this.data.dispatchDate);
            

  //         }
  //         else {
  //           this.toastr.error(this.response.message, 'Message.');
  //         }

  //       }, err => {
  //         if (err.status == 400) {
  //           this.toastr.error(this.response.message, 'Message.');
  //         }
  //       });
  // }
  
  addProd(form:NgForm) {
    //  this.data.dispatchDate = this.dateformater.toModel(this.data.dispatchDate);
    let varr = {
      
  "contractId": this.contractId,
  "inspectionDate": this.dateformater.toModel(this.data.inspectionDate),
  "startingDate": this.dateformater.toModel(this.data.startingDate),
  "loomPlanned": this.data.loomPlanned,
  "loomRunning": this.data.loomRunning,
  "perLoomProduction": this.data.perLoomProduction,
  "perDayProduction": this.data.perDayProduction,
  "packStock": this.data.packStock,
  "looseStock": this.data.looseStock,
  "totalStock": this.data.totalStock,
  "completionDate": this.dateformater.toModel(this.data.completionDate)
    }

    this.http.
      put(`${environment.apiUrl}/api/YarnContracts/AddContractProductionStatus`, varr)
      .subscribe(
        res => {

          this.response = res;
          if (this.response.success == true) {
            this.toastr.success(this.response.message, 'Message.');
            this.activeModal.close(true);
         
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
  onSubmit(){
  this.addProd(this.dispatchForm)
  }
}
