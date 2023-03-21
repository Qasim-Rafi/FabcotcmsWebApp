import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './shared/auth-service/auth.guard';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { TemplateComponent } from './template/template.component';
import { ActiveContractsComponent } from './contracts/active-contracts/active-contracts.component';
import { ArchivedContractsComponent } from './contracts/archived-contracts/archived-contracts.component';
import { ReportsComponent } from './shared/reports/reports.component';
import { AdvanceFilterComponent } from './template/advance-filter/advance-filter.component';
import { BulkPrintComponent } from './bulk-print/bulk-print.component';
import { BillInvoicesComponent } from './accounts/bill-invoices/bill-invoices.component';
import { SaleInvoiceBillComponent } from './accounts/sale-invoice-bill/sale-invoice-bill.component';
import { AccBulkPrintComponent } from './accounts/acc-bulk-print/acc-bulk-print.component';
import { AllContractReportComponent } from './shared/reports/all-contract-report/all-contract-report.component';
import { SellerMappingComponent } from './shared/mappings/seller-mapping/seller-mapping.component';
import { FabcotTrendsComponent } from './shared/fabcot-trends/fabcot-trends.component';
import { BuyerSellerLedgerComponent } from './shared/reports/buyer-seller-ledger/buyer-seller-ledger.component';
import { AllContractReportAccountsComponent } from './accounts/all-contract-report-accounts/all-contract-report-accounts.component';
import { VoucherReportAccountComponent } from './accounts/voucher-report-account/voucher-report-account.component';


const configurationModule = () => import('./configuration/configuration.module')
  .then(x => x.ConfigurationModule);
const businessEnquryModule = () => import('./business-enqury/business-enqury.module')
  .then(x => x.BusinessEnquryModule);
  // const CloudDocumentationModule = () => import('./cloud-documentation/cloud-documentation.module')
  // .then(x => x.CloudDocumentationModule);
const routes: Routes = [
  {path:'fabcot-trends' , component:FabcotTrendsComponent},
  {path:'login', redirectTo:'login', pathMatch:'full'},
   {path:'', component:LoginComponent},
   {
    path:'bulkPrint',
    component:BulkPrintComponent
  },
  {path:'accBulk' , component:AccBulkPrintComponent},
  
 {
   path:'', component:TemplateComponent,
   children:[
    {path:'home', component:HomeComponent},
    {path:'filter', component:AdvanceFilterComponent},
    {path:'accounts' , component:BillInvoicesComponent},
    {path:'saleBill' , component:SaleInvoiceBillComponent},
    {path:'all-contract-report-accounts' , component:AllContractReportAccountsComponent},
    {path:'voucher-report-account' , component:VoucherReportAccountComponent},
    {path:'buyer-seller-ledger' , component:BuyerSellerLedgerComponent},


   {
     path:'config',
   loadChildren:'./configuration/configuration.module#ConfigurationModule',
  },  
  {
    path:'cloud',
  loadChildren:'./cloud-documentation/cloud-documentation.module#CloudDocumentationModule'
 },
 {
  path:'billing-and-payment',
loadChildren:'./billing-and-payment/billing-and-payment.module#BillingAndPaymentModule'
},
{
  path:'contract',
// loadChildren:'./contracts/contracts.module#ContractsModule'
component:ActiveContractsComponent
},
{
  path:'reports',
// loadChildren:'./contracts/contracts.module#ContractsModule'
component:ReportsComponent
},
{
  path:'sellerMapping',
// loadChildren:'./contracts/contracts.module#ContractsModule'
component:SellerMappingComponent
},
{
  path:'allContractReport',
// loadChildren:'./contracts/contracts.module#ContractsModule'
component:AllContractReportComponent
},
{
  path:'contract',
// loadChildren:'./contracts/contracts.module#ContractsModule'
component:ArchivedContractsComponent
},
{
  path:'enquiry',
loadChildren:'./business-enqury/business-enqury.module#BusinessEnquryModule'
},

   ]
 },



]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
