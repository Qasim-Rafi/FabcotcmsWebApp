import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { YarnBillingAndPaymentRoutingModule } from './yarn-billing-and-payment-routing.module';
import { BranchAddressComponent } from '../yarn-billing-and-payment/generate-bills/branch-address/branch-address.component';
import {SaleInvoiceFormComponent} from '../yarn-billing-and-payment/generate-bills/sale-invoice-form/sale-invoice-form.component'
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { ActiveBillsComponent } from '../yarn-billing-and-payment/active-bills/active-bills.component';
import {GenerateBillsComponent} from '../yarn-billing-and-payment/generate-bills/generate-bills.component'
import {PaymentCollectionComponent} from '../yarn-billing-and-payment/payment-collection/payment-collection.component'
import {OpenActiveBillComponent} from '../yarn-billing-and-payment/active-bills/open-active-bill/open-active-bill.component'
import {ChangeBankAccountComponent} from '../yarn-billing-and-payment/active-bills/open-active-bill/change-bank-account/change-bank-account.component'
@NgModule({
  declarations: [
    BranchAddressComponent,
    SaleInvoiceFormComponent,
  ActiveBillsComponent,
GenerateBillsComponent,
PaymentCollectionComponent,
OpenActiveBillComponent,
ChangeBankAccountComponent

  ],
  imports: [
    CommonModule,
    YarnBillingAndPaymentRoutingModule,
    HttpClientModule,
    FormsModule,
    NgSelectModule,
    ReactiveFormsModule,
    NgxDatatableModule,
    NgbDatepickerModule
  ]
})
export class YarnBillingAndPaymentModule { }
