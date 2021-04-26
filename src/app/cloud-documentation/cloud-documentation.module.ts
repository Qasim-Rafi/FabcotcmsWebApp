import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocListComponent } from './doc-list/doc-list.component';
import { DocUploadComponent } from './doc-upload/doc-upload.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { NgSelectModule } from '@ng-select/ng-select';
import { SearchmodalComponent } from './doc-list/searchmodal/searchmodal.component';
import { FilterComponent } from './doc-upload/filter/filter.component';

// const appRoutes: Routes = []

@NgModule({
  declarations: [DocListComponent, DocUploadComponent, SearchmodalComponent, FilterComponent],
  imports: [
    CommonModule,
    NgxDatatableModule,
    NgbModule ,
    FormsModule, ReactiveFormsModule,
    NgSelectModule,
    // RouterModule.forRoot(appRoutes)
  ]
})
export class CloudDocumentationModule { }
