import { Component, OnInit, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgForm } from '@angular/forms';
import { ServiceService } from 'src/app/shared/service.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-add-type',
  templateUrl: './add-type.component.html',
  styleUrls: ['./add-type.component.css']
})
export class AddTypeComponent implements OnInit {
  data:any={};
  response: any;
  active = true;
 
  constructor(private http:HttpClient,
    private service: ServiceService,
    private toastr: ToastrService,private spinner: NgxSpinnerService,
    private _NgbActiveModal: NgbActiveModal) { }

  ngOnInit(): void {
  }


  
  get activeModal() {
    return this._NgbActiveModal;
  }




  
  addFabricType(form:NgForm)
  {
    // if (form.status == "INVALID") {

    //   this.toastr.error("Invalid Form", 'Message.');
    // }
    // else{
      this.spinner.show();
    let varr=  {
      "type": this.data.type,
      "description": this.data.description,
      "active": this.active,
     
    }

    this.http.
    post(`${environment.apiUrl}/api/Products/AddFabricType`,varr)
    .subscribe(
      res=> { 
  
        this.response = res;
        if (this.response.success == true){
          this.toastr.success(this.response.message, 'Message.');
      
          // this.buyerForm.reset();
          this.activeModal.close(true);
          this.spinner.hide();
        }
        else {
          this.toastr.error(this.response.message, 'Message.');
          this.spinner.hide();
            }

      }, (err: HttpErrorResponse) => {
        const messages = this.service.extractErrorMessagesFromErrorResponse(err);
        this.toastr.error(messages.toString(), 'Message.');
        console.log(messages);
        this.spinner.hide();
        if (err.status == 400) {
          this.toastr.error(this.response.message, 'Message.');
          this.spinner.hide();
        }
      });
  }
}


// }
