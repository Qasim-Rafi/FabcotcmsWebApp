import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TemplateComponent } from 'src/app/template/template.component';
import {GenerateBillsComponent} from '../yarn-billing-and-payment/generate-bills/generate-bills.component'
import {ActiveBillsComponent} from '../yarn-billing-and-payment/active-bills/active-bills.component';
import {PaymentCollectionComponent} from '../yarn-billing-and-payment/payment-collection/payment-collection.component'
const routes: Routes = [
  { path:'yarn-billing-and-payment', component:TemplateComponent,
  // canActivate:[AuthGuard],

  children:[
{ path:'generate-bills' ,  component: GenerateBillsComponent},
{path: 'active-bills' , component: ActiveBillsComponent},
{path:'payment-collection' , component:PaymentCollectionComponent},



]
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class YarnBillingAndPaymentRoutingModule { }
