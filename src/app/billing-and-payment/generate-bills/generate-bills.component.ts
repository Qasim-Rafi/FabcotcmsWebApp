import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { ToastrService } from 'ngx-toastr';
import { ServiceService } from 'src/app/shared/service.service';
import { environment } from 'src/environments/environment';
import { GlobalConstants } from '../../Common/global-constants';
import { ColumnMode, SelectionType } from '@swimlane/ngx-datatable';

import Swal from 'sweetalert2/dist/sweetalert2.js';
import { SaleInvoiceFormComponent } from './sale-invoice-form/sale-invoice-form.component';
import { Router } from '@angular/router';
@Component({
  selector: 'app-generate-bills',
  templateUrl: './generate-bills.component.html',
  styleUrls: ['./generate-bills.component.css']
})
export class GenerateBillsComponent implements OnInit {

  constructor(    private service: ServiceService,
    private http: HttpClient,
    private toastr: ToastrService,
    private modalService: NgbModal,
    private router: Router,

    ) { }



      contractIds: any = [];
      data: any = {};
      rows: any = [];
      selected: any = [];

      checkboxData: any = [];
      SelectionType = SelectionType;
      date: number;
      myDate = Date.now();
      columns: any = [];
      response: any;
      url = '/api/BillingPayments/GetAllContractForBillGeneration'
      
   
    
      ngOnInit(): void {
        this.service.fetch((data)=>{
            this.rows = data;
        } , this.url)
        
      }
      onSelect({ selected }) {
        console.log('Select Event', selected, this.selected);
    
        // this.selected.splice(0, this.selected.length);
        // this.selected.push(...selected);
        for(let i=0; i<selected.length; i++ )
        {
            this.contractIds[i] = selected[i].id;
            
        }
      }
      // displayCheck(row) {
      //   console.log(row.id)
      //   return row.id;
      // }
      // onActivate(event) {
        // console.log('Activated Event', event );
          // if (event.type === 'click' ){
          //   this.checkboxData.push({['id']:event.row.contractBillId , 
                                    // ['buyerId']:event.row.buyerId ,
                                    // ['sellerId']:event.row.sellerId , 
                                    // ['taxAmount']:event.row.id
    //                                });
                                   
    //         console.log( "checkbox",this.checkboxData)
    //       }
          
    //       for(let i=0; i<this.checkboxData.length; i++ )
    //     {
    //         this.contractIds[i] = this.checkboxData[i].id;
            
    //     }

          
      
    // }

  generateBill() {
    // console.log("checkbox data in " , this.checkboxData)
  if(this.contractIds.length === 0){
    this.toastr.error("PLease select atleast one contract to generate bill" , 'Message')
  }
  else{
    let varr = {
      "contractIds": this.contractIds,
      // "billForBuyerId": this.data,
      // "billForSelerId": this.checkboxData.sellerId,
      // "taxAmount": this.checkboxData.taxAmount,
      // "dueDate": "2021-05-27"
    }
    this.http.
      post(`${environment.apiUrl}/api/BillingPayments/GenerateContractBill`, varr)
      .subscribe(
        res => {

          this.response = res;
          if (this.response.success == true) {
            this.toastr.success(GlobalConstants.addMessage, 'Message.');
            this.router.navigate(['/billing-and-payment/active-bills']);

          }
          else {
            this.toastr.error(this.response.message, 'Message.');
          }

        }, err => {
          if (err.status == 400) {
            this.toastr.error(GlobalConstants.exceptionMessage, 'Message.');
          }
        });
      }
      }
  SaleInvoiceForm() {
    const modalRef = this.modalService.open(SaleInvoiceFormComponent , { centered: true });
    modalRef.result.then((data) => {
      // on close
      if (data == true) {
        this.date = this.myDate;
        // this.getBuyers();

      }
    }, (reason) => {
      // on dismiss
    });
  }
}
