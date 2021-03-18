import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
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
    this.http.get(`${environment.apiUrl}/api/Configs/GetArticleById/`+this.userId )
    .subscribe(
      res=> { 
        this.response = res;
        if (this.response.success == true){
          this.data =this.response.data; 
        }
        else {
          this.toastr.error('Something went Worng', 'Message.');
            }

      }, err => {
        if (err.status == 400) {
          this.toastr.error('Something went Worng', 'Message.');
        }
      });
  }


  UpdateArticle()
  {
    let varr=  {
      "code": this.data.code,
      "name": this.data.name,
      "genericName": this.data.genericName,
      "description": this.data.description,
      "active": this.data.active,
    }

    this.http.
    put(`${environment.apiUrl}/api/Configs/UpdateArticle/`+this.userId,varr)
    .subscribe(
      res=> { 
  
        this.response = res;
        if (this.response.success == true){
          this.toastr.success(this.response.message, 'Message.');
          this.activeModal.close(true);
        }
        else {
          this.toastr.error('Something went Worng', 'Message.');
            }

      }, err => {
        if (err.status == 400) {
          this.toastr.error('Something went Worng', 'Message.');
        }
      });
  }



}
