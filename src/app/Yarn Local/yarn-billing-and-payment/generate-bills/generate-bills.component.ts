import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
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
import { process,State  } from '@progress/kendo-data-query';
import { DataBindingDirective } from '@progress/kendo-angular-grid';
import { RowArgs } from "@progress/kendo-angular-grid";
@Component({
  selector: 'app-generate-bills',
  templateUrl: './generate-bills.component.html',
  styleUrls: ['./generate-bills.component.css']
})
export class GenerateBillsComponent implements OnInit {
amount=0;
@ViewChild(DataBindingDirective) dataBinding: DataBindingDirective;
  constructor(    private service: ServiceService,
    private http: HttpClient,
    private toastr: ToastrService,
    private modalService: NgbModal,
    private router: Router,
    private spinner : NgxSpinnerService

    ) {  this.defaultColDef = {
      flex: 1,
      minWidth: 100,
      resizable: true,
     
    };
    this.rowSelection = 'multiple';}
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
      loggedInDepartmentName: string;
      response: any;
      url = '/api/BillingPayments/GetAllContractForBillGeneration'
      defaultColDef : any;
      rowSelection : any ;
      public mySelection: string[] = this.rows;
   
    
      ngOnInit(): void {
        this.loggedInDepartmentName=localStorage.getItem('loggedInDepartmentName');
    this.fetch();    
     
    }

      fetch() {
   
        this.spinner.show();
        this.http
        .get(`${environment.apiUrl}/api/BillingPayments/GetAllContractForBillGeneration`)
        .subscribe(res => {
          this.response = res;
         
        if(this.response.success==true)
        {
        this.rows=this.response.data;
        this.billFilter = [...this.rows];
    
        this.spinner.hide();
    
        }
        else{
          this.toastr.error(this.response.message, 'Message.');
          this.spinner.hide();
        
        }
    
        }, err => {
          if ( err.status == 400) {
      this.toastr.error(err.error.message, 'Message.');
      this.spinner.hide();
    
          }
        });
      }

      navigateEditContract(obj) {
        this.router.navigate(['/FabCot/active-contract-details'], { queryParams: {id: obj.id} });
      };
      public onFilter(inputValue: string): void {
        this.rows = process(this.billFilter, {
            filter: {
                logic: "or",
                filters: [
                    {
                        field: 'contractDate',
                        operator: 'contains',
                        value: inputValue
                    },
                    {
                        field: 'autoContractNumber',
                        operator: 'contains',
                        value: inputValue
                    },
                    {
                        field: 'buyerName',
                        operator: 'contains',
                        value: inputValue
                    },
                    {
                        field: 'autoContractNumber',
                        operator: 'contains',
                        value: inputValue
                    },
                 
                    {
                        field: 'sellerName',
                        operator: 'contains',
                        value: inputValue
                    }
              
                ],
            }
        }).data;
    
        this.dataBinding.skip = 0;
    }
      search(event) {
        const val = event.target.value.toLowerCase();
        const temp = this.billFilter.filter(function (d) {
          return (d.autoContractNumber.toLowerCase().indexOf(val) !== -1 ||
            d.sellerName.toLowerCase().indexOf(val) !== -1 ||
            //  d.buyerName.toLowerCase().indexOf(val) !== -1 || 
            
            !val);
        });
        this.rows = temp;
      }
      public isRowSelected(e: RowArgs){
      this.mySelection.indexOf(e.dataItem.amount);
    }

      onSelect(selecterow) {
        this.amount = 0;
        // this.amount=selecterow.selected.length !=0 ?selecterow.selected[0].amount:null;
        this.selectedids =selecterow;

        for(let i=0; i<this.selectedids.selected.length; i++ )
        {      this.amount = this.amount + this.selectedids.selected[i].amount
            this.contractIds[i] = this.selectedids.selected[i].id;
        }
      }
  
      selectedcheckbox(selecterow) {
        this.amount = 0;
        // this.amount=selecterow.selected.length !=0 ?selecterow.selected[0].amount:null;
        this.selectedids =selecterow;

        for(let i=0; i<this.selectedids.selected.length; i++ )
        {      this.amount = this.amount + this.selectedids.selected[i].amount
            this.contractIds[i] = this.selectedids.selected[i].id;
        }
      }
  generateBill() {
  if(this.contractIds.length === 0  || this.selectedids.selected.length === 0  ){
    this.toastr.error("PLease select atleast one contract to generate bill" , 'Message')
  }
  else{
    // const modalRef = this.modalService.open(BranchAddressComponent, { centered: true });
    // modalRef.result.then((p) => {
    //   if (p != null) {
        const item = [...new Set(this.contractIds)];
        let varr = {
          "contractIds": this.contractIds,
           "fabcotBranchName": "Fabcot_Local",
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
    
              }
              else {
                this.toastr.error(this.response.message, 'Message.');
              
              }
    
            }, err => {
              if (err.status == 400) {
                this.toastr.error(this.response.message.exceptionMessage, 'Message.');
              
              }
            });
    //   }
    // }, (reason) => {
    // });
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
