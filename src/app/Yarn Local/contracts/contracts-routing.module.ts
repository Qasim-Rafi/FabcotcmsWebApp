
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
import { CertificateComponent } from 'src/app/configuration/home-textile/certificate/certificate.component';
import { LocalComberNoilComponent } from './local-comber-noil/local-comber-noil.component';
import { ActiveContractDetailsCombernoilLocalComponent } from './yarn-active-contracts/active-contract-details-combernoil-local/active-contract-details-combernoil-local.component';
const routes: Routes = [
  { path:'FabCot', component:TemplateComponent,
  // canActivate:[AuthGuard],

  children:[

    { path: 'add-new-contract' ,  component: AddNewContractsComponent},
    { path: 'local-comber-noil' ,  component: LocalComberNoilComponent},
    { path: 'active-contract' ,  component: YarnActiveContractsComponent},
    { path: 'completed-contract' ,  component: CompletedContractComponent},
    { path: 'dispatched-register' , component:DispatchedRegisterComponent},
    { path: 'buyer-payment' , component:BuyerPaymentComponent},
    { path: 'sale-invoice' , component:SaleInvoiceComponent},
    { path: 'tax' , component:TaxChallanComponent},
    { path: 'buyer-payment-form' , component:BuyerPaymentFormComponent},
    { path: 'add-tax' , component:AddTxChallanComponent},
    {path: 'active-contract-details' , component:ActiveContractDetailsComponent},
    {path: 'active-contract-details-combernoil-local' , component:ActiveContractDetailsCombernoilLocalComponent},
  {path: 'doc-upload' , component:DocumentUploadPopUpComponent},
  {path: 'certificate' , component:CertificateComponent},

  ]
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ContractsRoutingModule { }
 