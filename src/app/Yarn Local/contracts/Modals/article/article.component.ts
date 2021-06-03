import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ServiceService } from 'src/app/shared/service.service';

@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.css']
})
export class ArticleComponent implements OnInit {
active : boolean = true;
data:any={};
  
constructor(private http:HttpClient,
  private service: ServiceService,
  private toastr: ToastrService,
  private _NgbActiveModal: NgbActiveModal) { }

  ngOnInit(): void {
  }


  
  get activeModal() {
    return this._NgbActiveModal;
  }



  // addArticle(form:NgForm)
  // {



  //   let varr=  {
  //     "code": this.data.code,
  //     "name": this.data.name,
  //     "genericName": this.data.genericName,
  //     "description": this.data.description,
  //     "active": this.active,
  //   }

  //   this.http.
  //   post(`${environment.apiUrl}/api/Configs/AddArticle`,varr)
  //   .subscribe(
  //     res=> { 
  
  //       this.obj.parent = this.active;
  //       this.obj.status = true;
  //       this.response = res;
  //       if (this.response.success == true){
  //         this.toastr.success(this.response.message, 'Message.');
  //         this.addAgentForm.reset();
  //         this.activeModal.close(this.obj);
  //       }
  //       else {
  //         this.toastr.error(this.response.message, 'Message.');
  //           }

  //     },(err: HttpErrorResponse) => {
  //       const messages = this.service.extractErrorMessagesFromErrorResponse(err);
  //       this.toastr.error(messages.toString(), 'Message.');
  //       console.log(messages);
  //       // if (err.status == 400) {
  //       //   this.toastr.error(this.response.message, 'Message.');
  //       // }
  //     });
  // }















}
