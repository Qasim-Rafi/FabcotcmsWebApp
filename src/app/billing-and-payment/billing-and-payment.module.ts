import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppRoutingModule } from '../app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { BillingAndPaymentRoutingModule } from './billing-and-payment-routing.module';
import { GenerateBillsComponent } from './generate-bills/generate-bills.component';
import { ActiveBillsComponent } from './active-bills/active-bills.component';
import { OpenActiveBillComponent } from './active-bills/open-active-bill/open-active-bill.component';
import { PaymentCollectionComponent } from './payment-collection/payment-collection.component';
import { CommissionPaymentComponent } from './commission-payment/commission-payment.component';
import { ExternalAgentCommissionComponent } from './external-agent-commission/external-agent-commission.component';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { NewCommissionPaymentComponent } from './new-commission-payment/new-commission-payment.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { PaymentFormComponent } from './payment-form/payment-form.component';
import { DateFilterComponent } from './date-filter/date-filter.component';
import { NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
@NgModule({
  declarations: [GenerateBillsComponent, ActiveBillsComponent, OpenActiveBillComponent, PaymentCollectionComponent, CommissionPaymentComponent, ExternalAgentCommissionComponent, NewCommissionPaymentComponent, PaymentFormComponent, DateFilterComponent],
  imports: [
    CommonModule,
    BillingAndPaymentRoutingModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    NgSelectModule,
    ReactiveFormsModule,
    NgxDatatableModule,
    NgbDatepickerModule
  ]
})
export class BillingAndPaymentModule { }
