import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit {
  menuName:any={};
  response: any;
  temp: any[];
  rows: any = [];
  columns: any = [];
  openContractReport: any = [];
  agentBookingStatus: any = [];
  cancleContarctReport: any = [];
  billingReportInvoiceWise: any = [];
  dispatchReport: any = [];
  billingReportContractWise: any = [];
  taxChallanReport: any = [];
  commissionReport: any = [];
  dbcrNoteSummary: any = [];
  externalAgentReport: any = [];
  kickbackReport: any = [];
  allContractReport: any = [];
  paymentReport:any=[];
  lCReport:any=[];

  constructor(

    private route: ActivatedRoute,
    private modalService: NgbModal,
    private http: HttpClient,
    private toastr: ToastrService,
    private router: Router,
    private spinner:NgxSpinnerService

  ) { }

  ngOnInit(): void {
    this.menuName = this.route.snapshot.queryParams;
    // this.GetReportData();
  }
  GetReportData() {
    this.spinner.show();
    this.http.get(`${environment.apiUrl}/api/Configs/GetCapabilityById`)
      .subscribe(
        res => {
          this.response = res;
          if (this.response.success == true) {

            if(this.menuName == 'OpenContractReport'){
              this.openContractReport = this.response.data;
            }
            else if(this.menuName == 'AllContractReport'){
              this.allContractReport = this.response.data;
            }
            else if(this.menuName == 'AgentBookingStatus'){
              this.agentBookingStatus = this.response.data;
            }
            else if(this.menuName == 'CancleContarctReport'){
              this.cancleContarctReport = this.response.data;
            }
            else if(this.menuName == 'BillingReportInvoiceWise'){
              this.billingReportInvoiceWise = this.response.data;
            }
            else if(this.menuName == 'DispatchReport'){
              this.dispatchReport = this.response.data;
            }
            else if(this.menuName == 'BillingReportContractWise'){
              this.billingReportContractWise = this.response.data;
            }
            else if(this.menuName == 'PaymentReport'){
              this.paymentReport = this.response.data;
            }
            else if(this.menuName == 'TaxChallanReport'){
              this.taxChallanReport = this.response.data;
            }
            else if(this.menuName == 'CommissionReport'){
              this.commissionReport = this.response.data;
            }
            else if(this.menuName == 'DbcrNoteSummary'){
              this.dbcrNoteSummary = this.response.data;
            }
            else if(this.menuName == 'ExternalAgentReport'){
              this.externalAgentReport = this.response.data;
            }
            else if(this.menuName == 'LCReport'){
              this.lCReport = this.response.data;
            }
            else if(this.menuName == 'KickbackReport'){
              this.kickbackReport = this.response.data;
            }
            //this.data = this.response.data;
            this.spinner.hide();
          }
          else {
            this.toastr.error(this.response.message, 'Message.');
            this.spinner.hide();

          }

        }, err => {
          if (err.status == 400) {
            this.toastr.error(this.response.message, 'Message.');
            this.spinner.hide();

          }
        });
        this.spinner.hide();

  }
  searchFilter(event) {
    const val = event.target.value.toLowerCase();
    // filter our data
    const temp = this.temp.filter(function (d) {
      return (
        d.autoContractNumber.toLowerCase().indexOf(val) !== -1 ||
        d.buyerName.toLowerCase().indexOf(val) !== -1 ||
         !val);
    });
    this.rows = temp;
  }
}
