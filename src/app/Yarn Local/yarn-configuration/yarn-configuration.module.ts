import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { YarnConfigurationRoutingModule } from './yarn-configuration-routing.module';
import { NgbDatepickerModule, NgbModule, } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';
import { NgSelectModule } from '@ng-select/ng-select';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { ClipboardModule } from 'ngx-clipboard';
import { BuyerComponent } from '../yarn-configuration/buyer/buyer.component';
import {EditBuyerComponent} from '../yarn-configuration/buyer/edit-buyer/edit-buyer.component'
import {AddBuyerComponent} from '../yarn-configuration/buyer/add-buyer/add-buyer.component'
import { SellerComponent } from './seller/seller.component';
import { AddSellerFormComponent } from './seller/add-seller-form/add-seller-form.component';
import { EditSellerFormComponent } from './seller/edit-seller-form/edit-seller-form.component';
import { SellerPocComponent } from './seller/seller-poc/seller-poc.component';
import { ForeignAgentComponent } from './foreign-agent/foreign-agent.component';
import { EditAgentFormComponent } from './foreign-agent/edit-agent-form/edit-agent-form.component';
import { AddAgentFormComponent } from './foreign-agent/add-agent-form/add-agent-form.component';
import { ArticlesComponent } from './articles/articles.component';
import { EditArticleComponent } from './articles/edit-article/edit-article.component';
import { AddArticleComponent } from './articles/add-article/add-article.component';
import { FabricTypeComponent } from './product/fabric-type/fabric-type.component';
import { EditTypeComponent } from './product/fabric-type/edit-type/edit-type.component';
import { AddTypeComponent } from './product/fabric-type/add-type/add-type.component';
import { PackingComponent } from './product/packing/packing.component';
import { EditPackingComponent } from './product/packing/edit-packing/edit-packing.component';
import { AddPackingComponent } from './product/packing/add-packing/add-packing.component';
import { PaymentTermComponent } from './product/payment-term/payment-term.component';
import { EditPaymentComponent } from './product/payment-term/edit-payment/edit-payment.component';
import { AddPaymentComponent } from './product/payment-term/add-payment/add-payment.component';
import { PriceTermComponent } from './product/price-term/price-term.component';
import { EditPriceComponent } from './product/price-term/edit-price/edit-price.component';
import { AddPriceComponent } from './product/price-term/add-price/add-price.component';
import { BankAccountsComponent } from './bank-info/bank-accounts/bank-accounts.component';
import { EditBankAccountComponent } from './bank-info/bank-accounts/edit-bank-account/edit-bank-account.component';
import { AddBankAccountComponent } from './bank-info/bank-accounts/add-bank-account/add-bank-account.component';
import { BankComponent } from './bank-info/bank/bank.component';
import { EditBankComponent } from './bank-info/bank/edit-bank/edit-bank.component';
import { AddBankComponent } from './bank-info/bank/add-bank/add-bank.component';
import { CityComponent } from './city/city.component';
import { EditCityComponent } from './city/edit-city/edit-city.component';
import { CountryComponent } from './country/country.component';
import { EditCountryComponent } from './country/edit-country/edit-country.component';
import { CurrencyComponent } from './currency/currency.component';
import { EditCurrencyComponent } from './currency/edit-currency/edit-currency.component';
import { AddCurrencyComponent } from './currency/add-currency/add-currency.component';
import { WeaveComponent } from './product/weave/weave.component';
import { PieceLengthComponent } from './product/piece-length/piece-length.component';
import { ContainerComponent } from './product/container/container.component';
import { AddWeaveComponent } from './product/weave/add-weave/add-weave.component';
import { AddPieceLengthComponent } from './product/piece-length/add-piece-length/add-piece-length.component';
import { AddContainerComponent } from './product/container/add-container/add-container.component';

@NgModule({
  declarations: [
     BuyerComponent,
     EditBuyerComponent,
     AddBuyerComponent,SellerComponent,AddSellerFormComponent,EditSellerFormComponent,SellerPocComponent,ForeignAgentComponent,
     EditAgentFormComponent,AddAgentFormComponent,ArticlesComponent,EditArticleComponent,AddArticleComponent,FabricTypeComponent,
     EditTypeComponent,AddTypeComponent,PackingComponent,EditPackingComponent,AddPackingComponent,PaymentTermComponent,
     EditPaymentComponent,AddPaymentComponent,PriceTermComponent,EditPriceComponent,AddPriceComponent,BankAccountsComponent,
     EditBankAccountComponent,AddBankAccountComponent,BankComponent,EditBankComponent,AddBankComponent, CityComponent,
     EditCityComponent,CountryComponent,EditCountryComponent, CurrencyComponent, EditCurrencyComponent ,AddCurrencyComponent, WeaveComponent, PieceLengthComponent, ContainerComponent, AddWeaveComponent, AddPieceLengthComponent, AddContainerComponent
  ],
  imports: [
    CommonModule,
    YarnConfigurationRoutingModule,NgxDatatableModule,NgbDatepickerModule,NgbModule,HttpClientModule,FormsModule,ReactiveFormsModule,
    ToastrModule,NgSelectModule,ClipboardModule, BsDatepickerModule.forRoot(),
  

  ]
})
export class YarnConfigurationModule { }
