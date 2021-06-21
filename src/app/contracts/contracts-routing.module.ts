import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../shared/auth-service/auth.guard';
import { TemplateComponent } from '../template/template.component';
import { ActiveContractDetailComponent } from './active-contracts/active-contract-detail/active-contract-detail.component';
import { ActiveContractsComponent } from './active-contracts/active-contracts.component';
import { ArchivedContractsComponent } from './archived-contracts/archived-contracts.component';
import { ContractOwnerComponent } from './contract-owner/contract-owner.component';
import { OnholdContractsComponent } from './onhold-contracts/onhold-contracts.component';


const routes: Routes = [
  { path:'contract', component:TemplateComponent,
  // canActivate:[AuthGuard],

  children:[
  { path: 'active-contract', component: ActiveContractsComponent },
  { path: 'active-contract-details', component: ActiveContractDetailComponent },
  { path: 'onhold-contract', component: OnholdContractsComponent },
  { path: 'archived-contract', component: ArchivedContractsComponent },
  { path: 'contract-owner', component: ContractOwnerComponent },

 
]
  }
]
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ContractsRoutingModule { }
