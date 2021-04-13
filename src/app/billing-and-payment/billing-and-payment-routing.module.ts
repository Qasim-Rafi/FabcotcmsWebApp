import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ActiveBillsComponent } from './active-bills/active-bills.component';
import { CommissionPaymentComponent } from './commission-payment/commission-payment.component';
import { ExternalAgentCommissionComponent } from './external-agent-commission/external-agent-commission.component';
import { GenerateBillsComponent } from './generate-bills/generate-bills.component';
import { NewCommissionPaymentComponent } from './new-commission-payment/new-commission-payment.component';
import { PaymentCollectionComponent } from './payment-collection/payment-collection.component';

const routes: Routes = [
{ path:'generate-bills' ,  component: GenerateBillsComponent},
{path: 'active-bills' , component: ActiveBillsComponent},
{path:'payment-collection' , component:PaymentCollectionComponent},
{path:'commission-payment' , component:CommissionPaymentComponent},
{path:'external-agent' , component:ExternalAgentCommissionComponent},
{path:'new-commission' , component:NewCommissionPaymentComponent}

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BillingAndPaymentRoutingModule { }
