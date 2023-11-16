import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BuyerComponent } from '../yarn-configuration/buyer/buyer.component';
import { TemplateComponent } from 'src/app/template/template.component';
import { SellerComponent } from './seller/seller.component';
import { ForeignAgentComponent } from './foreign-agent/foreign-agent.component';
import { ArticlesComponent } from './articles/articles.component';
import { PackingComponent } from './product/packing/packing.component';
import { FabricTypeComponent } from './product/fabric-type/fabric-type.component';
import { PaymentTermComponent } from './product/payment-term/payment-term.component';
import { PriceTermComponent } from './product/price-term/price-term.component';
import { BankComponent } from './bank-info/bank/bank.component';
import { BankAccountsComponent } from './bank-info/bank-accounts/bank-accounts.component';
import { CityComponent } from './city/city.component';
import { CountryComponent } from './country/country.component';
import { CurrencyComponent } from './currency/currency.component';
import { WeaveComponent } from './product/weave/weave.component';
import { PieceLengthComponent } from './product/piece-length/piece-length.component';
import { ContainerComponent } from './product/container/container.component';
import { WeftComponent } from './product/weft/weft.component';
import { WarpComponent } from './product/warp/warp.component';
import { SelvedgeComponent } from './product/selvedge/selvedge.component';
import { PickInsertionComponent } from './product/pick-insertion/pick-insertion.component';
import { BeneficiaryComponent } from './beneficiary/beneficiary.component';
import { ConfigContractOwnerComponent } from './config-contract-owner/config-contract-owner.component';
import { GeneralSettingsComponent } from 'src/app/configuration/general-settings/general-settings.component';
import { AuthGuard } from 'src/app/shared/auth-service/auth.guard';



const routes: Routes = [
  { path:'FabCot', component:TemplateComponent,
  // canActivate:[AuthGuard],

  children:[

    { path: 'buyers' ,  component: BuyerComponent,canActivate:[AuthGuard]},
    { path: 'seller' , component:SellerComponent,canActivate:[AuthGuard]},
    { path: 'external-agents' ,  component: ForeignAgentComponent,canActivate:[AuthGuard]},
    { path: 'article' ,  component: ArticlesComponent,canActivate:[AuthGuard]},
    { path: 'fabric-type' ,  component: FabricTypeComponent,canActivate:[AuthGuard]},
    { path: 'payment-term' ,  component: PaymentTermComponent,canActivate:[AuthGuard]},
    { path: 'price-term' ,  component: PriceTermComponent,canActivate:[AuthGuard]},
    { path: 'packing' ,  component: PackingComponent,canActivate:[AuthGuard]},
    { path: 'bank' ,  component: BankComponent,canActivate:[AuthGuard]},
    { path: 'bank-account' ,  component: BankAccountsComponent,canActivate:[AuthGuard]},
    { path: 'city' ,  component: CityComponent,canActivate:[AuthGuard]},
    { path: 'country' ,  component: CountryComponent,canActivate:[AuthGuard]},
    { path: 'currency' ,  component: CurrencyComponent,canActivate:[AuthGuard]},
    { path: 'weave' ,  component: WeaveComponent,canActivate:[AuthGuard]},
    { path: 'piece-length' ,  component: PieceLengthComponent,canActivate:[AuthGuard]},
    { path: 'container' ,  component: ContainerComponent,canActivate:[AuthGuard]},
    { path: 'selvedge' ,  component: SelvedgeComponent,canActivate:[AuthGuard]},
    { path: 'pick-insertion' ,  component: PickInsertionComponent,canActivate:[AuthGuard]},
    { path: 'Warp' ,  component: WarpComponent,canActivate:[AuthGuard]},
    { path: 'Weft' ,  component: WeftComponent,canActivate:[AuthGuard]},
    { path: 'Beneficiary' ,  component: BeneficiaryComponent,canActivate:[AuthGuard]},
    { path: 'config-contract-owner' ,  component: ConfigContractOwnerComponent,canActivate:[AuthGuard]},
    { path: 'general-settings', component: GeneralSettingsComponent ,canActivate:[AuthGuard]},
]
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class YarnConfigurationRoutingModule { }
