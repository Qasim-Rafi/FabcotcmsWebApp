import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TemplateComponent } from 'src/app/template/template.component';
import {GenerateBillsComponent} from '../yarn-billing-and-payment/generate-bills/generate-bills.component'
import {ActiveBillsComponent} from '../yarn-billing-and-payment/active-bills/active-bills.component';
import {PaymentCollectionComponent} from '../yarn-billing-and-payment/payment-collection/payment-collection.component'
import {OpenActiveBillComponent} from '../yarn-billing-and-payment/active-bills/open-active-bill/open-active-bill.component'
import { PaymentFormComponent} from '../yarn-billing-and-payment/payment-form/payment-form.component' 
import {CommissionPaymentComponent} from '../yarn-billing-and-payment/commission-payment/commission-payment.component'
import {EditCommissionComponent} from '../yarn-billing-and-payment/edit-commission/edit-commission.component'
import {ExternalAgentCommissionComponent} from '../yarn-billing-and-payment/external-agent-commission/external-agent-commission.component'
import {NewCommissionPaymentComponent} from '../yarn-billing-and-payment/new-commission-payment/new-commission-payment.component'
import { ExternalAgentFormComponent } from './external-agent-commission/external-agent-form/external-agent-form.component';
const routes: Routes = [
  { path:'yarn-billing-and-payment', component:TemplateComponent,
  // canActivate:[AuthGuard],

  children:[
{ path:'generate-bills' ,  component: GenerateBillsComponent},
{path: 'active-bills' , component: ActiveBillsComponent},
{path:'payment-collection' , component:PaymentCollectionComponent},
{path:'open-bill' , component:OpenActiveBillComponent},
{path:'payment-form' , component:PaymentFormComponent},
{path: 'commission-payment' , component:CommissionPaymentComponent},
{path: 'edit-commission' , component:EditCommissionComponent},
{path:'external-agent' , component:ExternalAgentCommissionComponent},
{path:'new-commission' , component:NewCommissionPaymentComponent},
{path:'external-agent/external-agent-form' , component:ExternalAgentFormComponent},





]
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class YarnBillingAndPaymentRoutingModule { }
