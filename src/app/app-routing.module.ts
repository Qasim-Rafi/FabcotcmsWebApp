import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { AuthGuard } from './shared/auth-service/auth.guard';
import { BusinessEnquryModule } from './business-enqury/business-enqury.module';
import { ActiveContractDetailComponent } from './contracts/active-contracts/active-contract-detail/active-contract-detail.component';

import { DocListComponent } from './cloud-documentation/doc-list/doc-list.component';
import { DocUploadComponent } from './cloud-documentation/doc-upload/doc-upload.component';
import { ActiveContractsComponent } from './contracts/active-contracts/active-contracts.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { TemplateComponent } from './template/template.component';

const configurationModule = () => import('./configuration/configuration.module')
  .then(x => x.ConfigurationModule);
const businessEnquryModule = () => import('./business-enqury/business-enqury.module')
  .then(x => x.BusinessEnquryModule);

const routes: Routes = [

  {path:'login', redirectTo:'/login', pathMatch:'full'},
   {path:'', component:LoginComponent},
 {
   path:'', component:TemplateComponent,
   children:[
   {path:'home', component:HomeComponent,
  //  canActivate:[AuthGuard],
  },
   {path:'config',
   loadChildren:configurationModule},  
   ]
 },



]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
