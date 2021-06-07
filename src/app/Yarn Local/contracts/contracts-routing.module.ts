
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TemplateComponent } from 'src/app/template/template.component';
import { AddNewContractsComponent } from './add-new-contracts/add-new-contracts.component';
import { BuyerPaymentFormComponent } from './buyer-payment/buyer-payment-form/buyer-payment-form.component';
import { BuyerPaymentComponent } from './buyer-payment/buyer-payment.component';
import { CompletedContractComponent } from './completed-contract/completed-contract.component';
import { DispatchedRegisterComponent } from './dispatched-register/dispatched-register.component';
import { SaleInvoiceComponent } from './sale-invoice/sale-invoice.component';
import { AddTxChallanComponent } from './tax-challan/add-tx-challan/add-tx-challan.component';
import { TaxChallanComponent } from './tax-challan/tax-challan.component';
import { YarnActiveContractsComponent } from './yarn-active-contracts/yarn-active-contracts.component';
import {ActiveContractDetailsComponent} from './yarn-active-contracts/active-contract-details/active-contract-details.component'
import {DocumentUploadPopUpComponent} from './yarn-active-contracts/active-contract-details/active-contract-models/document-upload-pop-up/document-upload-pop-up.component'
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
    { path: 'buyer-payment-form' , component:BuyerPaymentFormComponent},
    { path: 'add-tax' , component:AddTxChallanComponent},
    {path: 'active-contract-details' , component:ActiveContractDetailsComponent},
  {path: 'doc-upload' , component:DocumentUploadPopUpComponent}
  ]
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ContractsRoutingModule { }
 