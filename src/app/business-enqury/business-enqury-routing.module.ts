import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ActiveEnquiryComponent } from './active-enquiry/active-enquiry.component';
import { AddEnquiryComponent } from './add-enquiry/add-enquiry.component';
import { SearchEnquiryComponent } from './search-enquiry/search-enquiry.component';

const routes: Routes = [

  {path: 'enquiries', component: AddEnquiryComponent},
  {path: 'active-enquiries', component: ActiveEnquiryComponent},
  {path: 'search-enquiries', component: SearchEnquiryComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BusinessEnquryRoutingModule { }
