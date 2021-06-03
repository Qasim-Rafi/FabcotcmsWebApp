import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TemplateComponent } from 'src/app/template/template.component';
import { YarnArticlesComponent } from './yarn-articles/yarn-articles.component';
import { YarnBuyersComponent } from './yarn-buyers/yarn-buyers.component';
import { YarnExternalAgentsComponent } from './yarn-external-agents/yarn-external-agents.component';
import { YarnSellersComponent } from './yarn-sellers/yarn-sellers.component';

const routes: Routes = [
  { path:'yarn-config', component:TemplateComponent,
  // canActivate:[AuthGuard],

  children:[

    { path: 'yarn-article' ,  component: YarnArticlesComponent},
    { path: 'yarn-buyers' ,  component: YarnBuyersComponent},
    { path: 'yarn-external-agents' ,  component: YarnExternalAgentsComponent},
    { path: 'yarn-seller' , component:YarnSellersComponent},
]
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class YarnConfigurationRoutingModule { }
