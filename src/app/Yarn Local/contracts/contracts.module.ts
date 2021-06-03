import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ContractsRoutingModule } from './contracts-routing.module';
import { AddNewContractsComponent } from './add-new-contracts/add-new-contracts.component';
import { NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { BuyerComponent } from './Modals/buyer/buyer.component';
import { SellerComponent } from './Modals/seller/seller.component';
import { ArticleComponent } from './Modals/article/article.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { YarnActiveContractsComponent } from './yarn-active-contracts/yarn-active-contracts.component';

import { NgxDatatableModule } from '@swimlane/ngx-datatable';

import { DispatchedRegisterComponent } from './dispatched-register/dispatched-register.component';



@NgModule({
  declarations: [AddNewContractsComponent, BuyerComponent, SellerComponent, ArticleComponent,
     YarnActiveContractsComponent,
    DispatchedRegisterComponent],
  imports: [
    CommonModule,
    BrowserModule,
    FormsModule,
    HttpClientModule,
    ContractsRoutingModule,
    NgbDatepickerModule,
    NgSelectModule,
    NgxDatatableModule
  ]
})
export class ContractsModule { }
