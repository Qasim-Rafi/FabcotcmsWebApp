import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../shared/auth-service/auth.guard';
import { TemplateComponent } from '../template/template.component';
import { DocListComponent } from './doc-list/doc-list.component';
import { DocUploadComponent } from './doc-upload/doc-upload.component';


const routes: Routes = [
  { path:'', component:TemplateComponent,
  canActivate:[AuthGuard],

  children:[
 
  { path: 'doclist', component: DocListComponent },
  { path: 'docupload', component: DocUploadComponent },
]
  }
]
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CloudDocumentationRoutingModule { }
