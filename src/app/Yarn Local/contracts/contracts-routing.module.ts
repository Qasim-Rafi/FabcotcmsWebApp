
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TemplateComponent } from 'src/app/template/template.component';
import { AddNewContractsComponent } from './add-new-contracts/add-new-contracts.component';
import { BuyerPaymentComponent } from './buyer-payment/buyer-payment.component';
import { CompletedContractComponent } from './completed-contract/completed-contract.component';
import { DispatchedRegisterComponent } from './dispatched-register/dispatched-register.component';
import { SaleInvoiceComponent } from './sale-invoice/sale-invoice.component';
import { TaxChallanComponent } from './tax-challan/tax-challan.component';
import { YarnActiveContractsComponent } from './yarn-active-contracts/yarn-active-contracts.component';

const routes: Routes = [
  { path:'yarn-local', component:TemplateComponent,
  // canActivate:[AuthGuard],

  children:[

    { path: 'add-new-contract' ,  component: AddNewContractsComponent},
    { path: 'active-contract' ,  component: YarnActiveContractsComponent},
    { path: 'completed-contract' ,  component: CompletedContractComponent},
    { path: 'dispatched-register' , component:DispatchedRegisterComponent},
    { path: 'buyer-payment' , component:BuyerPaymentComponent},
    { path: 'sale-invoice' , component:SaleInvoiceComponent},
    { path: 'tax' , component:TaxChallanComponent},
]
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ContractsRoutingModule { }
 