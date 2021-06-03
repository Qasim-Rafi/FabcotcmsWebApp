import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { YarnConfigurationRoutingModule } from './yarn-configuration-routing.module';
import { YarnBuyersComponent } from './yarn-buyers/yarn-buyers.component';
import { YarnSellersComponent } from './yarn-sellers/yarn-sellers.component';
import { YarnExternalAgentsComponent } from './yarn-external-agents/yarn-external-agents.component';
import { YarnArticlesComponent } from './yarn-articles/yarn-articles.component';


@NgModule({
  declarations: [YarnBuyersComponent, YarnSellersComponent, YarnExternalAgentsComponent, YarnArticlesComponent],
  imports: [
    CommonModule,
    YarnConfigurationRoutingModule
  ]
})
export class YarnConfigurationModule { }
