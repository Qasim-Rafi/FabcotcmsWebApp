import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { YarnConfigurationRoutingModule } from './yarn-configuration-routing.module';
import { YarnBuyersComponent } from './yarn-buyers/yarn-buyers.component';
import { YarnSellersComponent } from './yarn-sellers/yarn-sellers.component';
import { YarnExternalAgentsComponent } from './yarn-external-agents/yarn-external-agents.component';
import { YarnArticlesComponent } from './yarn-articles/yarn-articles.component';
import { NgbDatepickerModule, NgbModule, } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';
import { NgSelectModule } from '@ng-select/ng-select';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { ClipboardModule } from 'ngx-clipboard';

@NgModule({
  declarations: [YarnBuyersComponent, YarnSellersComponent, YarnExternalAgentsComponent, YarnArticlesComponent
  ],
  imports: [
    CommonModule,
    YarnConfigurationRoutingModule,NgxDatatableModule,NgbDatepickerModule,NgbModule,HttpClientModule,FormsModule,ReactiveFormsModule,
    ToastrModule,BsDatepickerModule,NgSelectModule,ClipboardModule
  ]
})
export class YarnConfigurationModule { }
