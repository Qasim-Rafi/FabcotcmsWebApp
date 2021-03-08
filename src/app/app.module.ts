import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule} from '@angular/common/http';
import { BrowserAnimationsModule} from '@angular/platform-browser/animations'
import { ToastrModule } from 'ngx-toastr';
import { NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { ConfigurationModule } from './configuration/configuration.module';
import { HomeComponent } from './home/home.component';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { AddEnquiryComponent } from './Business Enquiry/add-enquiry/add-enquiry.component';
import { SearchEnquiryComponent } from './Business Enquiry/search-enquiry/search-enquiry.component';



const appRoutes: Routes = [

  ]



@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    AddEnquiryComponent,
    SearchEnquiryComponent,   
  ],


  imports: [
    NgbModule,
    BrowserModule,
    AppRoutingModule,
    ConfigurationModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    NgxDatatableModule,
    RouterModule.forRoot(appRoutes),
    ToastrModule.forRoot({
      progressBar: true,
      timeOut:3000
    }),
  ],


  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
