import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BusinessEnquryModule } from './business-enqury/business-enqury.module';
import { ActiveContractsComponent } from './contracts/active-contracts/active-contracts.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';

const configurationModule = () => import('./configuration/configuration.module')
  .then(x => x.ConfigurationModule);
const businessEnquryModule = () => import('./business-enqury/business-enqury.module')
  .then(x => x.BusinessEnquryModule);
const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent },
  { path: 'config', loadChildren: configurationModule },
  { path: 'active-contract', component: ActiveContractsComponent },
  { path: 'login', component: LoginComponent },


];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
