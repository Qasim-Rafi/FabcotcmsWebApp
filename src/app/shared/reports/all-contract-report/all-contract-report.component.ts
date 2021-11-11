import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import { ServiceService } from '../../service.service';

@Component({
  selector: 'app-all-contract-report',
  templateUrl: './all-contract-report.component.html',
  styleUrls: ['./all-contract-report.component.css']
})
export class AllContractReportComponent implements OnInit {
  data3: any = [];
  columns: any = [];
  response: any;
  buyer: any = [];
  status: boolean = false;
  seller: any = [];
  article: any = [];

  allContractReport :  any = []
  constructor(   private route: ActivatedRoute,
    private http: HttpClient,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private service: ServiceService,

    private router: Router,) { }

  ngOnInit(): void {
    this.getAllContractReport();
    this.GetBuyersDropdown();
    this.GetSellersDropdown();
    this.GetArticleDropdown();
  }
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
  GetArticleDropdown() {
    this.service.getArticles().subscribe(res => {
      this.response = res;
      if (this.response.success == true) {
        this.article = this.response.data;
      }
      else {
        this.toastr.error(this.response.message, 'Message.');
      }
    })
  }
  GetSellersDropdown() {
    this.service.getSellers().subscribe(res => {
      this.response = res;
      if (this.response.success == true) {
        this.seller = this.response.data;
      }
      else {
        this.toastr.error(this.response.message, 'Message.');
      }
    })
  }


  getAllContractReport(){
    this.spinner.show();
    let varr = {
      "buyerId":this.data3.buyerId ==undefined ? 0 :this.data3.buyerId,
      "sellerId":this.data3.sellerId == undefined?0 :this.data3.sellerId,
      "autoContractNumber":this.data3.autoContractNumber == undefined ? '': this.data3.autoContractNumber,
      "startContractDate":this.data3.startContractDate == undefined? '': this.data3.startContractDate,
      "endContractDate":this.data3.endContractDate == undefined?'':this.data3.endContractDate,
      "status" : "All"
    }
    this.http.
      post(`${environment.apiUrl}/api/Reports/ContractReport`, varr)
      .subscribe(
        res => {

          this.response = res;
          if (this.response.success == true  && this.response.data.obj.length != 0) {
            this.toastr.success(this.response.message, 'Message.');
            this.allContractReport = this.response.data.obj;


         this.spinner.hide();
          }
          else if(this.response.data.obj.length == 0) {
            this.toastr.error("No such Contract Exist", 'Message.');
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
  clickEvent(){
    this.status = !this.status;
}
}
