import { DOCUMENT } from '@angular/common';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, Input, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ServiceService } from 'src/app/shared/service.service';
import { environment } from 'src/environments/environment';
import { Dateformater } from '../dateformater';

@Component({
  selector: 'app-active-contract-date-filter',
  templateUrl: './active-contract-date-filter.component.html',
  styleUrls: ['./active-contract-date-filter.component.css']
})
export class ActiveContractDateFilterComponent implements OnInit {
  data:any={};
  response: any;
  @Input() userId;
    temp: any[];
  allCount: number;
  openCount:number;
  closedCount: number;
  billAwaitedCount: number;
  billedCount: number;
  receivableCount: number;
  receivedCount: number;
  onHoldCount: number;
 status : string =  "All" ;
  dateformater: Dateformater = new Dateformater();
  constructor(private http:HttpClient,
    private service: ServiceService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    @Inject(DOCUMENT) private _document: Document,
    private _NgbActiveModal: NgbActiveModal) { }

  ngOnInit(): void {
  }
  get activeModal() {
    return this._NgbActiveModal;
  }
  getContracts()
  {

    // this.data.ToDate = this.dateformater.toModel(this.data.ToDate)
    // this.data.FromDate = this.dateformater.toModel(this.data.FromDate)

    // this.spinner.show();
    // this.http
    // .get(`${environment.apiUrl}/api/Contracts/GetAllContract/` + this.status +'/'+ true+'/'+this.data.ToDate +'/'+ this.data.FromDate)
    // .subscribe(
    //   res=> { 
    //     this.response = res;
    //     if (this.response.success == true){
    //       this.data =this.response.data; 
    //       this.activeModal.close(this.data.list);
    //       this.spinner.hide();
    //     }
    //     else {
    //       this.toastr.error(this.response.message, 'Message.');
    //     this.spinner.hide();   
    //     }

    //   }, err => {
    //     if (err.status == 400) {
    //       this.toastr.success(this.response.message, 'Message.');
    //       this.spinner.hide();
      
    //     }
    //   });
    this.activeModal.close(this.data);
  }




}
