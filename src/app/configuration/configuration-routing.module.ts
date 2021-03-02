import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ArticlesComponent } from './articles/articles.component';
import { BankAccountsComponent } from './bank-info/bank-accounts/bank-accounts.component';
import { BankComponent } from './bank-info/bank/bank.component';
import { BuyerComponent } from './buyer/buyer.component';
import { CityComponent } from './city/city.component';
import { CountryComponent } from './country/country.component';
import { CurrencyComponent } from './currency/currency.component';
import { ForeignAgentComponent } from './foreign-agent/foreign-agent.component';
import { CertificateComponent } from './home-textile/certificate/certificate.component';
import { ColorComponent } from './home-textile/color/color.component';
import { DesignTypeComponent } from './home-textile/design-type/design-type.component';
import { LoomTypeComponent } from './home-textile/loom-type/loom-type.component';
import { ProcessTypeComponent } from './home-textile/process-type/process-type.component';
import { ProcessComponent } from './home-textile/process/process.component';
import { TimeActionItemsComponent } from './home-textile/time-action-items/time-action-items.component';
import { FabricTypeComponent } from './product/fabric-type/fabric-type.component';
import { PackingComponent } from './product/packing/packing.component';
import { PaymentTermComponent } from './product/payment-term/payment-term.component';
import { PriceTermComponent } from './product/price-term/price-term.component';
import { SellerComponent } from './seller/seller.component';

const routes: Routes = [


      {path: 'buyer', component: BuyerComponent},
      {path: 'seller', component: SellerComponent},
      {path: 'agent', component: ForeignAgentComponent},
      {path: 'article', component: ArticlesComponent},
      {path: 'fabric-type', component: FabricTypeComponent},
      {path: 'packing', component: PackingComponent},
      {path: 'price-term', component: PriceTermComponent},
      {path: 'payment-term', component: PaymentTermComponent},
      {path: 'certificate', component: CertificateComponent},
      {path: 'color', component: ColorComponent},
      {path: 'design-type', component: DesignTypeComponent},
      {path: 'loom-type', component: LoomTypeComponent},
      {path: 'process', component: ProcessComponent},
      {path: 'process-type', component: ProcessTypeComponent},
      {path: 'time-action-items', component: TimeActionItemsComponent},
      {path: 'bank', component: BankComponent},
      {path: 'bank-accounts', component: BankAccountsComponent},
      {path: 'city', component: CityComponent},
      {path: 'country', component: CountryComponent},
      {path: 'currency', component: CurrencyComponent},
      
    
    ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConfigurationRoutingModule { }
