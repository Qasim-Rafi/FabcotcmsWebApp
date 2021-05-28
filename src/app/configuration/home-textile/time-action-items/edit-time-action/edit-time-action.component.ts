import { Component, Input, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-edit-time-action',
  templateUrl: './edit-time-action.component.html',
  styleUrls: ['./edit-time-action.component.css']
})
export class EditTimeActionComponent implements OnInit {

  data:any={};
  response: any;
  @Input() userId;
  

  constructor(private http:HttpClient,
    private toastr: ToastrService,
    private _NgbActiveModal: NgbActiveModal){ }

    ngOnInit(): void {
      this.editAction();
    }
  
    get activeModal() {
      return this._NgbActiveModal;
    }
  
    
    
    editAction()
    {
      this.http.get(`${environment.apiUrl}/api/TextileGarments/GetTnaActionById/`+this.userId )
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
  
  
    UpdateAction(form:NgForm)
    {
      if (form.status == "INVALID") {

        this.toastr.error("Invalid Form", 'Message.');
      }
      else{
      let varr = {
        "name": this.data.name,
        "description": this.data.description,
    
      }
  
      this.http.
      put(`${environment.apiUrl}/api/TextileGarments/UpdateTnaAction/`+this.userId,varr)
      .subscribe(
        res=> { 
    
          this.response = res;
          if (this.response.success == true){
            this.toastr.success(this.response.message, 'Message.');
            this.activeModal.close(true);
          }
          else {
            this.toastr.error(this.response.message, 'Message.');
              }
  
        }, err => {
          if (err.status == 400) {
            this.toastr.error(this.response.message, 'Message.');
          }
        });
    }
  }
  
  }
  