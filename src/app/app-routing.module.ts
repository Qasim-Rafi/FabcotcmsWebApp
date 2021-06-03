import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './shared/auth-service/auth.guard';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { TemplateComponent } from './template/template.component';
import { ActiveContractsComponent } from './contracts/active-contracts/active-contracts.component';
import { ArchivedContractsComponent } from './contracts/archived-contracts/archived-contracts.component';
import { AddNewContractsComponent } from './Yarn Local/contracts/add-new-contracts/add-new-contracts.component';

const configurationModule = () => import('./configuration/configuration.module')
  .then(x => x.ConfigurationModule);
const businessEnquryModule = () => import('./business-enqury/business-enqury.module')
  .then(x => x.BusinessEnquryModule);
  // const CloudDocumentationModule = () => import('./cloud-documentation/cloud-documentation.module')
  // .then(x => x.CloudDocumentationModule);
const routes: Routes = [

  {path:'login', redirectTo:'login', pathMatch:'full'},
   {path:'', component:LoginComponent},

 {
   path:'', component:TemplateComponent,
   children:[
    {path:'home', component:HomeComponent,
    //  canActivate:[AuthGuard],
    },
   {
     path:'config',
   loadChildren:'./configuration/configuration.module#ConfigurationModule',
  },  
  {
    path:'cloud',
  loadChildren:'./cloud-documentation/cloud-documentation.module#CloudDocumentationModule'
 },
 {
  path:'billing-and-payment',
loadChildren:'./billing-and-payment/billing-and-payment.module#BillingAndPaymentModule'
},
{
  path:'contract',
// loadChildren:'./contracts/contracts.module#ContractsModule'
component:ActiveContractsComponent
},
{
  path:'contract',
// loadChildren:'./contracts/contracts.module#ContractsModule'
component:ArchivedContractsComponent
},
{
  path:'enquiry',
loadChildren:'./business-enqury/business-enqury.module#BusinessEnquryModule'
},
{
  path:'yarn-local/add-new-contract',
// loadChildren:'./contracts/contracts.module#ContractsModule'
component:AddNewContractsComponent
},
   ]
 },



]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
