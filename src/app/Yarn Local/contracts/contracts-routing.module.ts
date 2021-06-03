import { Template } from '@angular/compiler/src/render3/r3_ast';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TemplateComponent } from 'src/app/template/template.component';
import { AddNewContractsComponent } from './add-new-contracts/add-new-contracts.component';
import { ContractsModule } from './contracts.module';
import { DispatchedRegisterComponent } from './dispatched-register/dispatched-register.component';
import { YarnActiveContractsComponent } from './yarn-active-contracts/yarn-active-contracts.component';

const routes: Routes = [
  { path:'yarn-local', component:TemplateComponent,
  // canActivate:[AuthGuard],

  children:[

    { path:'add-new-contract' ,  component: AddNewContractsComponent},
    { path:'active-contract' ,  component: YarnActiveContractsComponent},
    {path: 'dispatched-register' , component:DispatchedRegisterComponent}
]
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ContractsRoutingModule { }
