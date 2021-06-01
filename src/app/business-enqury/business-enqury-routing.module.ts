import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../shared/auth-service/auth.guard';
import { TemplateComponent } from '../template/template.component';
import { ActiveEnquiryComponent } from './active-enquiry/active-enquiry.component';
import { EditActiveEnquiryComponent } from './active-enquiry/edit-active-enquiry/edit-active-enquiry.component';
import { AddEnquiryComponent } from './add-enquiry/add-enquiry.component';
import { OnholdEnquiryComponent } from './onhold-enquiry/onhold-enquiry.component';
import { SearchEnquiryComponent } from './search-enquiry/search-enquiry.component';

const routes: Routes = [
  // { path: 'onhold-enquiries', component: OnholdEnquiryComponent },
    { path:'enquiry', component:TemplateComponent,
    // canActivate:[AuthGuard],
  
    children:[
  { path: 'enquiries', component: AddEnquiryComponent },
  { path: 'active-enquiries', component: ActiveEnquiryComponent },
  { path: 'edit-active-enquiries', component: EditActiveEnquiryComponent },
  { path: 'search-enquiries', component: SearchEnquiryComponent },
  { path: 'onhold-enquiries', component: OnholdEnquiryComponent },

]
    }
]
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BusinessEnquryRoutingModule { }
