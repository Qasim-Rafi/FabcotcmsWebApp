import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { AddEnquiryComponent } from './add-enquiry/add-enquiry.component';
import { ActiveEnquiryComponent } from './active-enquiry/active-enquiry.component';
import { SearchEnquiryComponent } from './search-enquiry/search-enquiry.component';
import { NgbDateParserFormatter, NgbDatepickerModule, NgbModule, NgbTimepickerModule } from '@ng-bootstrap/ng-bootstrap';
// import { BrowserModule } from '@angular/platform-browser';
// import { AppRoutingModule } from '../app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { ConfirmationPopoverModule } from 'angular-confirmation-popover';
import { ToastrModule } from 'ngx-toastr';
import { EditActiveEnquiryComponent } from './active-enquiry/edit-active-enquiry/edit-active-enquiry.component';
import { NgSelectModule } from '@ng-select/ng-select';


@NgModule({
  declarations: [
    AddEnquiryComponent,
    ActiveEnquiryComponent,
    SearchEnquiryComponent, EditActiveEnquiryComponent

  ],



  imports: [
    CommonModule,
    NgbModule,
    // BrowserModule,
    // AppRoutingModule,
    NgxDatatableModule,
    FormsModule,
    NgSelectModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgbDatepickerModule,
    NgbTimepickerModule,
    // BrowserAnimationsModule,
    ToastrModule.forRoot({
      progressBar: true,
      timeOut: 3000
    }),
    ConfirmationPopoverModule.forRoot({
      confirmButtonType: 'danger', // set defaults here
    }),
  ],
  providers: [
    DatePipe

  ]
})
export class BusinessEnquryModule { }
