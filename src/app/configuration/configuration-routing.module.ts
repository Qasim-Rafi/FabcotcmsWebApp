import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../shared/auth-service/auth.guard';
import { TemplateComponent } from '../template/template.component';
import { ArticlesComponent } from './articles/articles.component';
import { BankAccountsComponent } from './bank-info/bank-accounts/bank-accounts.component';
import { BankComponent } from './bank-info/bank/bank.component';
import { BuyerComponent } from './buyer/buyer.component';
import { CapabilityComponent } from './capability/capability.component';
import { CityComponent } from './city/city.component';
import { ConfigurationComponent } from './configuration.component';
import { CountryComponent } from './country/country.component';
import { CurrencyComponent } from './currency/currency.component';
import { ForeignAgentComponent } from './foreign-agent/foreign-agent.component';
import { GeneralSettingsComponent } from './general-settings/general-settings.component';
import { CertificateComponent } from './home-textile/certificate/certificate.component';
import { ColorComponent } from './home-textile/color/color.component';
import { DesignTypeComponent } from './home-textile/design-type/design-type.component';
import { LoomTypeComponent } from './home-textile/loom-type/loom-type.component';
import { ProcessTypeComponent } from './home-textile/process-type/process-type.component';
import { ProcessComponent } from './home-textile/process/process.component';
import { TimeActionItemsComponent } from './home-textile/time-action-items/time-action-items.component';
import { NotificationSettingsComponent } from './notification-settings/notification-settings.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { FabricTypeComponent } from './product/fabric-type/fabric-type.component';
import { PackingComponent } from './product/packing/packing.component';
import { PaymentTermComponent } from './product/payment-term/payment-term.component';
import { PriceTermComponent } from './product/price-term/price-term.component';
import { SellerComponent } from './seller/seller.component';
import { SystemUsersComponent } from './system-users/system-users.component';



const routes: Routes = [

 { path:'config', component:TemplateComponent,
//  canActivate:[AuthGuard],

  children:[
    { path: '', component: ConfigurationComponent },
  { path: 'buyer', component: BuyerComponent },
  { path: 'seller', component: SellerComponent },
  { path: 'agent', component: ForeignAgentComponent },
  { path: 'article', component: ArticlesComponent },
  { path: 'fabric-type', component: FabricTypeComponent },
  { path: 'packing', component: PackingComponent },
  { path: 'price-term', component: PriceTermComponent },
  { path: 'payment-term', component: PaymentTermComponent },
  { path: 'certificate', component: CertificateComponent },
  { path: 'color', component: ColorComponent },
  { path: 'design-type', component: DesignTypeComponent },
  { path: 'loom-type', component: LoomTypeComponent },
  { path: 'process', component: ProcessComponent },
  { path: 'process-type', component: ProcessTypeComponent },
  { path: 'time-action-items', component: TimeActionItemsComponent },
  { path: 'bank', component: BankComponent },
  { path: 'bank-accounts', component: BankAccountsComponent },
  { path: 'city', component: CityComponent },
  { path: 'country', component: CountryComponent },
  { path: 'currency', component: CurrencyComponent },
  { path: 'system-users', component: SystemUsersComponent },
  { path: 'general-settings', component: GeneralSettingsComponent },
  { path: 'notification-settings', component: NotificationSettingsComponent},
  { path: 'notification', component: NotificationsComponent},
  { path: 'capability', component: CapabilityComponent},

]
 }

]
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConfigurationRoutingModule { }
