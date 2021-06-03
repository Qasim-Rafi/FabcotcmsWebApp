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


const routes: Routes = [
  { path:'yarn-config', component:TemplateComponent,
  // canActivate:[AuthGuard],

  children:[

    { path: 'yarn-buyers' ,  component: BuyerComponent},
    { path: 'yarn-seller' , component:SellerComponent},
    { path: 'yarn-external-agents' ,  component: ForeignAgentComponent},
    { path: 'yarn-article' ,  component: ArticlesComponent},
    { path: 'yarn-fabric-type' ,  component: FabricTypeComponent},
    { path: 'yarn-payment-term' ,  component: PaymentTermComponent},
    { path: 'yarn-price-term' ,  component: PriceTermComponent},
    { path: 'yarn-packing' ,  component: PackingComponent},
    { path: 'yarn-bank' ,  component: BankComponent},
    { path: 'yarn-bank-account' ,  component: BankAccountsComponent},
    { path: 'yarn-city' ,  component: CityComponent},
    { path: 'yarn-country' ,  component: CountryComponent},
    { path: 'yarn-currency' ,  component: CurrencyComponent},
    { path: 'yarn-weave' ,  component: WeaveComponent},
    { path: 'yarn-piece-length' ,  component: PieceLengthComponent},
    { path: 'yarn-container' ,  component: ContainerComponent},





]
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class YarnConfigurationRoutingModule { }
