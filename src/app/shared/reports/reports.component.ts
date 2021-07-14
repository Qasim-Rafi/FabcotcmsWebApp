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
    private spinner:NgxSpinnerService,
    private router: Router,
    

  ) { this.router.routeReuseStrategy.shouldReuseRoute = () => false; }

  ngOnInit(): void {
    this.menuName = this.route.snapshot.queryParams;
    this.GetReportData();
  }
  GetReportData() {
    this.spinner.show();
    this.http.get(`${environment.apiUrl}/api/Contracts/GetAllContract`)
      .subscribe(
        res => {
          this.response = res;
          if (this.response.success == true) {

            if(this.menuName.menuName == 'OpenContractReport'){
              this.openContractReport = this.response.data.list;
            }
            else if(this.menuName.menuName == 'AllContractReport'){
              this.allContractReport = this.response.data.list;
            }
            else if(this.menuName.menuName == 'AgentBookingStatus'){
              this.agentBookingStatus = this.response.data.list;
            }
            else if(this.menuName.menuName == 'CancleContarctReport'){
              this.cancleContarctReport = this.response.data.list;
            }
            else if(this.menuName.menuName == 'BillingReportInvoiceWise'){
              this.billingReportInvoiceWise = this.response.data.list;
            }
            else if(this.menuName.menuName == 'DispatchReport'){
              this.dispatchReport = this.response.data.list;
            }
            else if(this.menuName.menuName == 'BillingReportContractWise'){
              this.billingReportContractWise = this.response.data.list;
            }
            else if(this.menuName.menuName == 'PaymentReport'){
              this.paymentReport = this.response.data.list;
            }
            else if(this.menuName.menuName == 'TaxChallanReport'){
              this.taxChallanReport = this.response.data.list;
            }
            else if(this.menuName.menuName == 'CommissionReport'){
              this.commissionReport = this.response.data.list;
            }
            else if(this.menuName.menuName == 'DbcrNoteSummary'){
              this.dbcrNoteSummary = this.response.data.list;
            }
            else if(this.menuName.menuName == 'ExternalAgentReport'){
              this.externalAgentReport = this.response.data.list;
            }
            else if(this.menuName.menuName == 'LCReport'){
              this.lCReport = this.response.data.list;
            }
            else if(this.menuName.menuName == 'KickbackReport'){
              this.kickbackReport = this.response.data.list;
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
