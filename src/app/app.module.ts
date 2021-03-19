import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule} from '@angular/common/http';
import { BrowserAnimationsModule} from '@angular/platform-browser/animations'
import { ToastrModule } from 'ngx-toastr';
import { ConfirmationPopoverModule } from 'angular-confirmation-popover';
import { NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { ConfigurationModule } from './configuration/configuration.module';
import { BusinessEnquryModule } from './business-enqury/business-enqury.module';
import { HomeComponent } from './home/home.component';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { Select2Module } from 'ng2-select2';


const appRoutes: Routes = [ ]


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
   
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
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    Select2Module,
    NgxDatatableModule,
    RouterModule.forRoot(appRoutes),
    ToastrModule.forRoot({
      progressBar: true,
      timeOut:3000
    }),
    ConfirmationPopoverModule.forRoot({
      confirmButtonType: 'success', // set defaults here
      cancelButtonType: 'danger',
      cancelText:'No',
      confirmText:'Yes',

    }),
  ],

  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
