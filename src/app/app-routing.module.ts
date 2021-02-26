import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ForeignAgentComponent } from './configuration/foreign-agent/foreign-agent.component';
import { HomeComponent } from './home/home.component';

const configurationModule = () => import('./configuration/configuration.module')
                                          .then(x => x.ConfigurationModule);

const routes: Routes = [
  {path: '', redirectTo:'home', pathMatch: 'full'},
  {path: 'home', component: HomeComponent},
  {path: 'config', loadChildren: configurationModule },
  
  
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
