import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { ConfigurationRoutingModule } from './configuration-routing.module';
import { ConfigurationComponent } from './configuration.component';
import { SellerComponent } from './seller/seller.component';
import { EditSellerFormComponent } from './seller/edit-seller-form/edit-seller-form.component';
import { AddSellerFormComponent } from './seller/add-seller-form/add-seller-form.component';
import { ForeignAgentComponent } from './foreign-agent/foreign-agent.component';
import { AddAgentFormComponent } from './foreign-agent/add-agent-form/add-agent-form.component';
import { EditAgentFormComponent } from './foreign-agent/edit-agent-form/edit-agent-form.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { AppRoutingModule } from '../app-routing.module';
import { BuyerComponent } from './buyer/buyer.component';
import { AddBuyerComponent } from './buyer/add-buyer/add-buyer.component';
import { EditBuyerComponent } from './buyer/edit-buyer/edit-buyer.component';
import { ArticlesComponent } from './articles/articles.component';
import { AddArticleComponent } from './articles/add-article/add-article.component';
import { EditArticleComponent } from './articles/edit-article/edit-article.component';
import { CityComponent } from './city/city.component';
import { CountryComponent } from './country/country.component';
import { CurrencyComponent } from './currency/currency.component';
import { AddCityComponent } from './city/add-city/add-city.component';
import { EditCityComponent } from './city/edit-city/edit-city.component';
import { EditCountryComponent } from './country/edit-country/edit-country.component';
import { AddCountryComponent } from './country/add-country/add-country.component';
import { FabricTypeComponent } from './product/fabric-type/fabric-type.component';
import { PackingComponent } from './product/packing/packing.component';
import { PaymentTermComponent } from './product/payment-term/payment-term.component';
import { AddTypeComponent } from './product/fabric-type/add-type/add-type.component';
import { EditTypeComponent } from './product/fabric-type/edit-type/edit-type.component';
import { EditPackingComponent } from './product/packing/edit-packing/edit-packing.component';
import { AddPackingComponent } from './product/packing/add-packing/add-packing.component';
import { AddPaymentComponent } from './product/payment-term/add-payment/add-payment.component';
import { EditPaymentComponent } from './product/payment-term/edit-payment/edit-payment.component';
import { PriceTermComponent } from './product/price-term/price-term.component';
import { AddPriceComponent } from './product/price-term/add-price/add-price.component';
import { EditPriceComponent } from './product/price-term/edit-price/edit-price.component';
import { BankComponent } from './bank-info/bank/bank.component';
import { BankAccountsComponent } from './bank-info/bank-accounts/bank-accounts.component';
import { AddBankComponent } from './bank-info/bank/add-bank/add-bank.component';
import { EditBankComponent } from './bank-info/bank/edit-bank/edit-bank.component';
import { AddBankAccountComponent } from './bank-info/bank-accounts/add-bank-account/add-bank-account.component';
import { EditBankAccountComponent } from './bank-info/bank-accounts/edit-bank-account/edit-bank-account.component';
import { ProcessComponent } from './home-textile/process/process.component';
import { ProcessTypeComponent } from './home-textile/process-type/process-type.component';
import { DesignTypeComponent } from './home-textile/design-type/design-type.component';
import { LoomTypeComponent } from './home-textile/loom-type/loom-type.component';
import { CertificateComponent } from './home-textile/certificate/certificate.component';
import { ColorComponent } from './home-textile/color/color.component';
import { TimeActionItemsComponent } from './home-textile/time-action-items/time-action-items.component';
import { AddCertificateComponent } from './home-textile/certificate/add-certificate/add-certificate.component';
import { EditCertificateComponent } from './home-textile/certificate/edit-certificate/edit-certificate.component';
import { EditColorComponent } from './home-textile/color/edit-color/edit-color.component';
import { AddColorComponent } from './home-textile/color/add-color/add-color.component';
import { AddDesignTypeComponent } from './home-textile/design-type/add-design-type/add-design-type.component';
import { EditDesignTypeComponent } from './home-textile/design-type/edit-design-type/edit-design-type.component';
import { AddLoomTypeComponent } from './home-textile/loom-type/add-loom-type/add-loom-type.component';
import { EditLoomTypeComponent } from './home-textile/loom-type/edit-loom-type/edit-loom-type.component';
import { EditProcessComponent } from './home-textile/process/edit-process/edit-process.component';
import { AddProcessComponent } from './home-textile/process/add-process/add-process.component';
import { AddProcessTypeComponent } from './home-textile/process-type/add-process-type/add-process-type.component';
import { EditProcessTypeComponent } from './home-textile/process-type/edit-process-type/edit-process-type.component';
import { EditTimeActionComponent } from './home-textile/time-action-items/edit-time-action/edit-time-action.component';
import { AddTimeActionComponent } from './home-textile/time-action-items/add-time-action/add-time-action.component';
import { AddCurrencyComponent } from './currency/add-currency/add-currency.component';
import { EditCurrencyComponent } from './currency/edit-currency/edit-currency.component';

@NgModule({
  declarations: [
    ConfigurationComponent, 
    SellerComponent, 
    EditSellerFormComponent, 
    AddSellerFormComponent, 
    ForeignAgentComponent, 
    AddAgentFormComponent, 
    EditAgentFormComponent, 
    BuyerComponent, 
    AddBuyerComponent, 
    EditBuyerComponent,
     ArticlesComponent, 
     AddArticleComponent,
      EditArticleComponent, 
      CityComponent,
       CountryComponent, 
       CurrencyComponent,
        AddCityComponent, 
        EditCityComponent,
         EditCountryComponent,
          AddCountryComponent,
           FabricTypeComponent,
     PackingComponent, 
            PaymentTermComponent, 
            AddTypeComponent, 
            EditTypeComponent, 
            EditPackingComponent,
             AddPackingComponent, 
             AddPaymentComponent, 
             EditPaymentComponent, 
             PriceTermComponent,
              AddPriceComponent, 
              EditPriceComponent, BankComponent, BankAccountsComponent, AddBankComponent, EditBankComponent, AddBankAccountComponent, EditBankAccountComponent, ProcessComponent, ProcessTypeComponent, DesignTypeComponent, LoomTypeComponent, CertificateComponent, ColorComponent, TimeActionItemsComponent, AddCertificateComponent, EditCertificateComponent, EditColorComponent, AddColorComponent, AddDesignTypeComponent, EditDesignTypeComponent, AddLoomTypeComponent, EditLoomTypeComponent, EditProcessComponent, AddProcessComponent, AddProcessTypeComponent, EditProcessTypeComponent, EditTimeActionComponent, AddTimeActionComponent, AddCurrencyComponent, EditCurrencyComponent, 
  
  
  ],
 
  
  
  imports: [
    CommonModule,
    ConfigurationRoutingModule,
    NgbModule,
    BrowserModule,
    AppRoutingModule,
    NgxDatatableModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot({
      progressBar: true,
      timeOut:3000
    }),
  ]
})
export class ConfigurationModule { }
