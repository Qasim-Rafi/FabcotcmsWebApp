import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { ToastrModule } from 'ngx-toastr';
import { ConfirmationPopoverModule } from 'angular-confirmation-popover';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ConfigurationModule } from './configuration/configuration.module';
import { BusinessEnquryModule } from './business-enqury/business-enqury.module';
import { HomeComponent } from './home/home.component';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { NgSelectModule } from '@ng-select/ng-select';
import { EnquiryItemsComponent } from './shared/MODLES/enquiry-items/enquiry-items.component';
import { QuotationComponent } from './shared/MODLES/quotation/quotation.component';


const appRoutes: Routes = []


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    EnquiryItemsComponent,
    QuotationComponent,

    // AddEnquiryComponent,
    // SearchEnquiryComponent,
    // AddmodalComponent,
    // ArtienquirymodalComponent,

    // PackagingComponent,
    // DesignTypeComponent,
    // ProcessTypeComponent,
    // ProcessenqmodalComponent,
    // AddcitymodalComponent,
    // AddcertmodalComponent,
    // PaymentTermComponent,
    // PriceTermComponent,
    // ActiveEnquiryComponent

  ],


  imports: [
    NgbModule,
    BrowserModule,
    AppRoutingModule,
    ConfigurationModule,
    BusinessEnquryModule,
    FormsModule,
    NgSelectModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    NgxDatatableModule,
    RouterModule.forRoot(appRoutes),
    ToastrModule.forRoot({
      progressBar: true,
      timeOut: 3000
    }),
    ConfirmationPopoverModule.forRoot({
      confirmButtonType: 'success', // set defaults here
      cancelButtonType: 'danger',
      cancelText: 'No',
      confirmText: 'Yes',

    }),
  ],

  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
