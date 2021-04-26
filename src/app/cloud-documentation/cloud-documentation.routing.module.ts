import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../shared/auth-service/auth.guard';
import { LayoutComponent } from '../template/layout/layout.omponent';
import { TemplateComponent } from '../template/template.component';
import { CloudDocumentationComponent } from './cloud-documentations.component';
import { DocListComponent } from './doc-list/doc-list.component';
import { DocUploadComponent } from './doc-upload/doc-upload.component';


const routes: Routes = [
  { 
 path:'cloud', component:TemplateComponent,

    // path:'cloud',
  // canActivate:[AuthGuard],

  children:[
  { path: '', component: CloudDocumentationComponent },
  { path: 'doclist', component: DocListComponent },
  { path: 'docupload', component: DocUploadComponent },
]
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CloudDocumentationRoutingModule { }
