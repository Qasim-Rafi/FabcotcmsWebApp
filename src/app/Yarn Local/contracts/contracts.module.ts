import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContractsRoutingModule } from './contracts-routing.module';
import { AddNewContractsComponent } from './add-new-contracts/add-new-contracts.component';
import { NgbDatepickerModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
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
import { CompletedContractComponent } from './completed-contract/completed-contract.component';
import { EditBuyerPaymentComponent } from './Modals/edit-buyer-payment/edit-buyer-payment.component';
import { SaleInvoiceComponent } from './sale-invoice/sale-invoice.component';
import { TaxChallanComponent } from './tax-challan/tax-challan.component';
import { BuyerPaymentComponent } from './buyer-payment/buyer-payment.component';
import { BuyerPaymentFormComponent } from './buyer-payment/buyer-payment-form/buyer-payment-form.component';
import { AddTxChallanComponent } from './tax-challan/add-tx-challan/add-tx-challan.component';
import { AddNewInvComponent } from './sale-invoice/add-new-inv/add-new-inv.component';
import {EditDispatchComponent} from '../contracts/dispatched-register/edit-dispatch/edit-dispatch.component';
import { ActiveContractDetailsComponent } from './yarn-active-contracts/active-contract-details/active-contract-details.component'
import {DeliveryTLComponent} from './yarn-active-contracts/active-contract-details/active-contract-models/deliveryTL/deliveryTL.component';
import { DispatchRegisterComponent } from './yarn-active-contracts/active-contract-details/active-contract-models/dispatch-register/dispatch-register.component';
import { SaleInvoicePopUpComponent } from './yarn-active-contracts/active-contract-details/active-contract-models/sale-invoice-pop-up/sale-invoice-pop-up.component'
import {ContractNoteComponent} from './yarn-active-contracts/active-contract-details/active-contract-models/contract-note/contract-note.component';
import { ProductionStatusComponent } from './yarn-active-contracts/active-contract-details/active-contract-models/production-status/production-status.component';
import { DocumentUploadPopUpComponent } from './yarn-active-contracts/active-contract-details/active-contract-models/document-upload-pop-up/document-upload-pop-up.component'
import {  ReactiveFormsModule } from '@angular/forms';
import {PartiesComponent} from './yarn-active-contracts/active-contract-details/active-contract-models/parties/parties.component';
import { ProductAndSpecificationComponent } from './yarn-active-contracts/active-contract-details/active-contract-models/product-and-specification/product-and-specification.component';
import { QuantityAndCostingComponent } from './yarn-active-contracts/active-contract-details/active-contract-models/quantity-and-costing/quantity-and-costing.component'
import {PaymentDeliveryComponent} from './yarn-active-contracts/active-contract-details/active-contract-models/payment-delivery/payment-delivery.component';
import { DeliveryTimeLineComponent } from './yarn-active-contracts/active-contract-details/active-contract-models/delivery-time-line/delivery-time-line.component'
import {RemarksComponent} from './yarn-active-contracts/active-contract-details/active-contract-models/remarks/remarks.component'
import {EmployeeCommissionComponent} from './yarn-active-contracts/active-contract-details/active-contract-models/employee-commission/employee-commission.component'
import {CommisionKickbackComponent} from './yarn-active-contracts/active-contract-details/active-contract-models/commision-kickback/commision-kickback.component'
import { NgxSpinnerModule } from 'ngx-spinner';
import { SearchComponent } from './sale-invoice/search/search.component';
import { EditIvnoicePopupComponent } from './yarn-active-contracts/active-contract-details/active-contract-models/edit-ivnoice-popup/edit-ivnoice-popup.component';
import { DebitComponent } from './yarn-active-contracts/active-contract-details/active-contract-models/sale-invoice-pop-up/debit/debit.component';
import { CreditComponent } from './yarn-active-contracts/active-contract-details/active-contract-models/sale-invoice-pop-up/credit/credit.component';
import { LCInfoComponent } from './yarn-active-contracts/active-contract-details/active-contract-models/lcinfo/lcinfo.component';
import { NgProgressModule } from 'ngx-progressbar';
import { NgxScrollTopModule } from 'ngx-scrolltop';
import { SummaryComponent } from './Modals/summary/summary.component';
import { AgGridModule } from 'ag-grid-angular';
import { GridModule, PDFModule, ExcelModule } from '@progress/kendo-angular-grid';
import { ChartsModule } from '@progress/kendo-angular-charts';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { LocalComberNoilComponent } from './local-comber-noil/local-comber-noil.component';
import { ActiveContractDetailsCombernoilLocalComponent } from './yarn-active-contracts/active-contract-details-combernoil-local/active-contract-details-combernoil-local.component';
import { AddBlockComponent } from './add-block/add-block.component';
import { ActiveBlocksComponent } from './active-blocks/active-blocks.component';
import { EditActiveBlockComponent } from './active-blocks/edit-active-block/edit-active-block.component';

import {ExternalAgentCommissionArticleWiseComponent} from './yarn-active-contracts/active-contract-details/active-contract-models/external-agent-commission-article-wise/external-agent-commission-article-wise.component';
import { AddExternalAgentCommissionArticleWiseComponent } from './yarn-active-contracts/active-contract-details/active-contract-models/add-external-agent-commission-article-wise/add-external-agent-commission-article-wise.component'

@NgModule({
  declarations: [AddNewContractsComponent,
    EditDispatchComponent,
    BuyerPaymentComponent, BuyerComponent, SellerComponent, ArticleComponent,YarnActiveContractsComponent, DispatchedRegisterComponent, CompletedContractComponent, SaleInvoiceComponent, TaxChallanComponent, EditBuyerPaymentComponent, BuyerPaymentFormComponent, AddTxChallanComponent, AddNewInvComponent, ActiveContractDetailsComponent,
    DeliveryTLComponent,
    DispatchRegisterComponent,
    SaleInvoicePopUpComponent,
    ContractNoteComponent,
    ProductionStatusComponent,
    DocumentUploadPopUpComponent,
    PartiesComponent,
    ProductAndSpecificationComponent,
    QuantityAndCostingComponent,
    PaymentDeliveryComponent,
    DeliveryTimeLineComponent,
 RemarksComponent,
EmployeeCommissionComponent,
CommisionKickbackComponent,
SearchComponent,
EditIvnoicePopupComponent,
DebitComponent,
CreditComponent,
LCInfoComponent,
SummaryComponent,
LocalComberNoilComponent,
ActiveContractDetailsCombernoilLocalComponent,
AddBlockComponent,
ActiveBlocksComponent,
EditActiveBlockComponent,
ExternalAgentCommissionArticleWiseComponent,
AddExternalAgentCommissionArticleWiseComponent

  ],
  imports: [
    CommonModule,
    BrowserModule,
    FormsModule,
    NgxSpinnerModule,
    HttpClientModule,
    ContractsRoutingModule,
    NgbDatepickerModule,
    NgProgressModule,
    NgSelectModule,
    NgbModule,
    NgxDatatableModule,
    ReactiveFormsModule,
    NgxScrollTopModule,
    InputsModule,
    ChartsModule,
    GridModule,
    PDFModule,
    ExcelModule,
    AgGridModule.withComponents([])
  ]
})
export class ContractsModule { }
