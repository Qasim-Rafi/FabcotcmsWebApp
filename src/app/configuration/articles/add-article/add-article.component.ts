import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgForm } from '@angular/forms';
import { ServiceService } from 'src/app/shared/service.service';

@Component({
  selector: 'app-add-article',
  templateUrl: './add-article.component.html',
  styleUrls: ['./add-article.component.css']
})
export class AddArticleComponent implements OnInit {
  @Input() new;
  data:any={};
  obj:any={};
  response: any;
  active = true;
  @ViewChild(NgForm) addAgentForm;


  constructor(private http:HttpClient,
    private service: ServiceService,
    private toastr: ToastrService,
    private _NgbActiveModal: NgbActiveModal) { }

  ngOnInit(): void {
  }

  
  get activeModal() {
    return this._NgbActiveModal;
  }





  addArticle(form:NgForm)
  {

//     if(form.status == "INVALID"){

//       this.toastr.error("Invalid Form", 'Message.');
//     }

// else

// {



    let varr=  {
      "code": this.data.code,
      "name": this.data.name,
      "genericName": this.data.genericName,
      "description": this.data.description,
      "active": this.active,
    }

    this.http.
    post(`${environment.apiUrl}/api/Configs/AddArticle`,varr)
    .subscribe(
      res=> { 
  
        this.response = res;
        this.obj.parent = this.active;
        this.obj.id = this.response.data;

        if (this.response.success == true){
          this.toastr.success(this.response.message, 'Message.');
          this.addAgentForm.reset();
          this.activeModal.close(this.obj);
        }
        else {
          this.toastr.error(this.response.message, 'Message.');
            }

      },(err: HttpErrorResponse) => {
        const messages = this.service.extractErrorMessagesFromErrorResponse(err);
        this.toastr.error(messages.toString(), 'Message.');
        console.log(messages);
        // if (err.status == 400) {
        //   this.toastr.error(this.response.message, 'Message.');
        // }
      });
  }
}




// }
