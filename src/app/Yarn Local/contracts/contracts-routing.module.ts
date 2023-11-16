
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
import { AddBlockComponent } from './add-block/add-block.component';
import { ActiveBlocksComponent } from './active-blocks/active-blocks.component';
import { EditActiveBlockComponent } from './active-blocks/edit-active-block/edit-active-block.component';
import { AuthGuard } from 'src/app/shared/auth-service/auth.guard';
const routes: Routes = [
  { path:'FabCot', component:TemplateComponent,
  // canActivate:[AuthGuard],

  children:[

    { path: 'add-new-contract' ,  component: AddNewContractsComponent,canActivate:[AuthGuard]},
    { path: 'add-block' ,  component: AddBlockComponent,canActivate:[AuthGuard]},
    { path: 'local-comber-noil' ,  component: LocalComberNoilComponent,canActivate:[AuthGuard]},
    { path: 'active-contract' ,  component: YarnActiveContractsComponent,canActivate:[AuthGuard]},
    { path: 'active-blocks' ,  component: ActiveBlocksComponent,canActivate:[AuthGuard]},
    { path: 'completed-contract' ,  component: CompletedContractComponent,canActivate:[AuthGuard]},
    { path: 'dispatched-register' , component:DispatchedRegisterComponent,canActivate:[AuthGuard]},
    { path: 'buyer-payment' , component:BuyerPaymentComponent,canActivate:[AuthGuard]},
    { path: 'sale-invoice' , component:SaleInvoiceComponent,canActivate:[AuthGuard]},
    { path: 'tax' , component:TaxChallanComponent,canActivate:[AuthGuard]},
    { path: 'buyer-payment-form' , component:BuyerPaymentFormComponent,canActivate:[AuthGuard]},
    { path: 'add-tax' , component:AddTxChallanComponent,canActivate:[AuthGuard]},
    {path: 'active-contract-details' , component:ActiveContractDetailsComponent,canActivate:[AuthGuard]},
    {path: 'edit-active-block' , component:EditActiveBlockComponent,canActivate:[AuthGuard]},
    {path: 'active-contract-details-combernoil-local' , component:ActiveContractDetailsCombernoilLocalComponent,canActivate:[AuthGuard]},
  {path: 'doc-upload' , component:DocumentUploadPopUpComponent,canActivate:[AuthGuard]},
  {path: 'certificate' , component:CertificateComponent,canActivate:[AuthGuard]},

  ]
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ContractsRoutingModule { }
 