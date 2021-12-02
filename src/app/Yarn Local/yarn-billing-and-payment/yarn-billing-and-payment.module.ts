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
import {PaymentFormComponent} from '../yarn-billing-and-payment/payment-form/payment-form.component'
import {CommissionPaymentComponent} from '../yarn-billing-and-payment/commission-payment/commission-payment.component';
import { EditCommissionComponent } from './edit-commission/edit-commission.component'
import {ExternalAgentCommissionComponent} from '../yarn-billing-and-payment/external-agent-commission/external-agent-commission.component'
import {NewCommissionPaymentComponent} from '../yarn-billing-and-payment/new-commission-payment/new-commission-payment.component'
import {NgxSpinnerModule} from 'ngx-spinner';

import { GridModule, PDFModule, ExcelModule } from '@progress/kendo-angular-grid';
import { ChartsModule } from '@progress/kendo-angular-charts';
import { InputsModule } from '@progress/kendo-angular-inputs';

@NgModule({
  declarations: [
    BranchAddressComponent,
    SaleInvoiceFormComponent,
  ActiveBillsComponent,
GenerateBillsComponent,
PaymentCollectionComponent,
OpenActiveBillComponent,
ChangeBankAccountComponent,
PaymentFormComponent,
CommissionPaymentComponent,
EditCommissionComponent,
ExternalAgentCommissionComponent,
NewCommissionPaymentComponent

  ],
  imports: [
    CommonModule,
    YarnBillingAndPaymentRoutingModule,
    HttpClientModule,
    FormsModule,
    NgxSpinnerModule,
    NgSelectModule,
    ReactiveFormsModule,
    NgxDatatableModule,
    NgbDatepickerModule,
    GridModule,
    ChartsModule,
    InputsModule,
    PDFModule,
    ExcelModule
  ]
})
export class YarnBillingAndPaymentModule { }
