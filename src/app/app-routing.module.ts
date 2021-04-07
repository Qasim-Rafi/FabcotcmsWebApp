import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BusinessEnquryModule } from './business-enqury/business-enqury.module';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';

const configurationModule = () => import('./configuration/configuration.module')
                                          .then(x => x.ConfigurationModule);
const businessEnquryModule = () => import('./business-enqury/business-enqury.module')
                                          .then(x => x.BusinessEnquryModule);
const routes: Routes = [
  {path: '', redirectTo:'login', pathMatch: 'full'},
  {path: 'login', component: LoginComponent},
  {path: 'home', component: HomeComponent},
  {path: 'config', loadChildren: configurationModule },
  {path: 'enqury',loadChildren:businessEnquryModule },
  
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
