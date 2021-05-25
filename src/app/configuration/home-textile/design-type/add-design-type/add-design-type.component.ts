import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgForm } from '@angular/forms';
import { ServiceService } from 'src/app/shared/service.service';

@Component({
  selector: 'app-add-design-type',
  templateUrl: './add-design-type.component.html',
  styleUrls: ['./add-design-type.component.css']
})
export class AddDesignTypeComponent implements OnInit {
  data:any={};
  response: any;
  active = true;

  constructor(private http:HttpClient,
    private service: ServiceService,
    private toastr: ToastrService,
    private _NgbActiveModal: NgbActiveModal) { }

  ngOnInit(): void {
    
  }

  get activeModal() {
    return this._NgbActiveModal;
  }

  
  addDesign(form:NgForm)
  {
    // if (form.status == "INVALID") {

    //   this.toastr.error("Invalid Form", 'Message.');
    // }
    // else{
    let varr=  {
      "type": this.data.type,
      "description": this.data.description,
      "active": this.active,
    }

    this.http.
    post(`${environment.apiUrl}/api/TextileGarments/AddDesignType`,varr)
    .subscribe(
      res=> { 
  
        this.response = res;
        if (this.response.success == true){
          this.toastr.success(this.response.message, 'Message.');
      
          // this.buyerForm.reset();
          this.activeModal.close(true);
        }
        else {
          this.toastr.error(this.response.message, 'Message.');
            }

      }, (err: HttpErrorResponse) => {
        const messages = this.service.extractErrorMessagesFromErrorResponse(err);
        this.toastr.error(messages.toString(), 'Message.');
        console.log(messages);
        if (err.status == 400) {
          this.toastr.error(this.response.message, 'Message.');
        }
      });
  }
  // }



}

