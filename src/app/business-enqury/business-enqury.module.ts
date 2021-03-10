import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BusinessEnquryRoutingModule } from './business-enqury-routing.module';
import { AddEnquiryComponent } from './add-enquiry/add-enquiry.component';
import { ActiveEnquiryComponent } from './active-enquiry/active-enquiry.component';
import { SearchEnquiryComponent } from './search-enquiry/search-enquiry.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from '../app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { ConfirmationPopoverModule } from 'angular-confirmation-popover';
import { ToastrModule } from 'ngx-toastr';
import { AddcitymodalComponent } from './addcitymodal/addcitymodal.component';
import { AddcertmodalComponent } from './addcertmodal/addcertmodal.component';
import { ArtienquirymodalComponent } from './artienquirymodal/artienquirymodal.component';
import { ProcessenqmodalComponent } from './processenqmodal/processenqmodal.component';
import { DesignTypeComponent } from './add-enquiry/design-type/design-type.component';
import { PackagingComponent } from './add-enquiry/packaging/packaging.component';
import { PaymentTermComponent } from './add-enquiry/payment-term/payment-term.component';
import { PriceTermComponent } from './add-enquiry/price-term/price-term.component';
import { ProcessTypeComponent } from './add-enquiry/process-type/process-type.component';
import { AddmodalComponent } from './addmodal/addmodal.component';


@NgModule({
  declarations: [
    AddEnquiryComponent, 
    ActiveEnquiryComponent, 
    SearchEnquiryComponent, AddcitymodalComponent, AddcertmodalComponent, ArtienquirymodalComponent, ProcessenqmodalComponent, DesignTypeComponent, PackagingComponent, PaymentTermComponent, PriceTermComponent, ProcessTypeComponent, AddmodalComponent
  
  ],



  imports: [
    CommonModule,
    BusinessEnquryRoutingModule,
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
    ConfirmationPopoverModule.forRoot({
      confirmButtonType: 'danger', // set defaults here
    }),
  ]
})
export class BusinessEnquryModule { }
