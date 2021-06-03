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
  { path:'yarn-local', component:TemplateComponent,
  // canActivate:[AuthGuard],

  children:[

    { path: 'buyers' ,  component: BuyerComponent},
    { path: 'seller' , component:SellerComponent},
    { path: 'external-agents' ,  component: ForeignAgentComponent},
    { path: 'article' ,  component: ArticlesComponent},
    { path: 'fabric-type' ,  component: FabricTypeComponent},
    { path: 'payment-term' ,  component: PaymentTermComponent},
    { path: 'price-term' ,  component: PriceTermComponent},
    { path: 'packing' ,  component: PackingComponent},
    { path: 'bank' ,  component: BankComponent},
    { path: 'bank-account' ,  component: BankAccountsComponent},
    { path: 'city' ,  component: CityComponent},
    { path: 'country' ,  component: CountryComponent},
    { path: 'currency' ,  component: CurrencyComponent},
    { path: 'weave' ,  component: WeaveComponent},
    { path: 'piece-length' ,  component: PieceLengthComponent},
    { path: 'container' ,  component: ContainerComponent},





]
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class YarnConfigurationRoutingModule { }
