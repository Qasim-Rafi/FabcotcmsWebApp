import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ActiveEnquiryComponent } from './Business Enquiry/active-enquiry/active-enquiry.component';
import { AddEnquiryComponent } from './Business Enquiry/add-enquiry/add-enquiry.component';
import { HomeComponent } from './home/home.component';

const configurationModule = () => import('./configuration/configuration.module')
                                          .then(x => x.ConfigurationModule);

const routes: Routes = [
  {path: '', redirectTo:'home', pathMatch: 'full'},
  {path: 'home', component: HomeComponent},
  {path: 'config', loadChildren: configurationModule },
  {path: 'enquiries', component: AddEnquiryComponent },
  {path: 'active-enquiries', component: ActiveEnquiryComponent },
  
  
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
