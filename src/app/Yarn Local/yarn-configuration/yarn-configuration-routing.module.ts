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


]
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class YarnConfigurationRoutingModule { }
