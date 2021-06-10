import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ServiceService } from 'src/app/shared/service.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-edit-article',
  templateUrl: './edit-article.component.html',
  styleUrls: ['./edit-article.component.css']
})
export class EditArticleComponent implements OnInit {
  data:any={};
  response: any;
  @Input() userId;


  constructor(private http:HttpClient,
    private service: ServiceService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
              private _NgbActiveModal: NgbActiveModal) { }

  ngOnInit(): void {
    this.editArticle();
  }


  get activeModal() {
    return this._NgbActiveModal;
  }


  editArticle()
  {
    this.spinner.show();
    this.http.get(`${environment.apiUrl}/api/Configs/GetArticleById/`+this.userId )
    .subscribe(
      res=> { 
        this.response = res;
        if (this.response.success == true){
          this.data =this.response.data; 
          this.spinner.hide();
        }
        else {
          this.toastr.success(this.response.message, 'Message.');
        this.spinner.hide();   
        }

      }, err => {
        if (err.status == 400) {
          this.toastr.success(this.response.message, 'Message.');
          this.spinner.hide();
      
        }
      });
  }


  UpdateArticle(form:NgForm)
  {



    let varr=  {
      "code": this.data.code,
      "name": this.data.name,
      "genericName": this.data.genericName,
      "description": this.data.description,
      "active": this.data.active,
    }
this.spinner.show()
    this.http.
    put(`${environment.apiUrl}/api/Configs/UpdateArticle/`+this.userId,varr)
    .subscribe(
      res=> { 
  
        this.response = res;
        if (this.response.success == true){
          this.toastr.success(this.response.message, 'Message.');
          this.activeModal.close(true);
          this.spinner.hide();
        }
        else {
          this.toastr.success(this.response.message, 'Message.');
          this.spinner.hide();
            
        }

      }, (err: HttpErrorResponse) => {
        const messages = this.service.extractErrorMessagesFromErrorResponse(err);
        this.toastr.error(messages.toString(), 'Message.');
        console.log(messages);
        this.spinner.hide();
      });
  }
}



