import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { ToastrService } from 'ngx-toastr';
import { ServiceService } from 'src/app/shared/service.service';
import { environment } from 'src/environments/environment';
import { ColumnMode, SelectionType } from '@swimlane/ngx-datatable';
import { Router } from '@angular/router';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { BranchAddressComponent } from '../generate-bills/branch-address/branch-address.component';
import { SaleInvoiceFormComponent } from '../generate-bills/sale-invoice-form/sale-invoice-form.component';
import {NgxSpinnerService} from 'ngx-spinner'
@Component({
  selector: 'app-generate-bills',
  templateUrl: './generate-bills.component.html',
  styleUrls: ['./generate-bills.component.css']
})
export class GenerateBillsComponent implements OnInit {
amount:any;
  constructor(    private service: ServiceService,
    private http: HttpClient,
    private toastr: ToastrService,
    private modalService: NgbModal,
    private router: Router,
    private spinner : NgxSpinnerService

    ) { }
      contractIds: any = [];
      data: any = {};
      billFilter: any = {};

      rows: any = [];
      selectedids: any ={};

      checkboxData: any = [];
      SelectionType = SelectionType;
      date: number;
      myDate = Date.now();
      columns: any = [];
      names: any = [];

      response: any;
      url = '/api/BillingPayments/GetAllContractForBillGeneration'

      
   
    
      ngOnInit(): void {
        this.service.fetch((data)=>{
      this.billFilter = [...data];

            this.rows = data;
        } , this.url)
        
      }
      navigateEditContract(obj) {
        this.router.navigate(['/FabCot/active-contract-details'], { queryParams: {id: obj.id} });
      };
    
      search(event) {
        const val = event.target.value.toLowerCase();
        const temp = this.billFilter.filter(function (d) {
          return (d.autoContractNumber.toLowerCase().indexOf(val) !== -1 ||
            d.sellerName.toLowerCase().indexOf(val) !== -1 || d.buyerName.toLowerCase().indexOf(val) !== -1 || !val);
        });
        this.rows = temp;
      }
      onSelect(selecterow) {
        this.amount=selecterow.selected.length !=0 ?selecterow.selected[0].amount:null;
        this.selectedids =selecterow;

        for(let i=0; i<this.selectedids.selected.length; i++ )
        {      
            this.contractIds[i] = this.selectedids.selected[i].id;
        }
      }
  
  generateBill() {
  if(this.contractIds.length === 0  || this.selectedids.selected.length === 0  ){
    this.toastr.error("PLease select atleast one contract to generate bill" , 'Message')
  }
  else{
    const modalRef = this.modalService.open(BranchAddressComponent, { centered: true });
    modalRef.result.then((p) => {
      if (p != null) {
        const item = [...new Set(this.contractIds)];
        let varr = {
          "contractIds": this.contractIds,
           "fabcotBranchName": p.branch.name,
        }
        this.spinner.show();
        this.http.
          post(`${environment.apiUrl}/api/BillingPayments/GenerateContractBill`, varr)
          .subscribe(
            res => {
    
              this.response = res;
              if (this.response.success == true) {
                this.toastr.success(this.response.message, 'Message.');
                this.router.navigate(['yarn-billing-and-payment/active-bills']);
                this.spinner.hide();
    
              }
              else {
                this.toastr.error(this.response.message, 'Message.');
                this.spinner.hide();
              
              }
    
            }, err => {
              if (err.status == 400) {
                this.toastr.error(this.response.message.exceptionMessage, 'Message.');
                this.spinner.hide();
              
              }
            });
      }
    }, (reason) => {
    });
      }  
      }
  SaleInvoiceForm(row) {
    const modalRef = this.modalService.open(SaleInvoiceFormComponent , { centered: true });
    modalRef.componentInstance.contractId = row.id;
    modalRef.componentInstance.contractNumber = row.autoContractNumber;

    modalRef.result.then((data) => {
      // on close
      if (data == true) {
        // this.getBuyers();

      }
    }, (reason) => {
      // on dismiss
    });
  }
  getCheckboxClass(row: any) {
    return 'stylecheckbox';
  }
}
