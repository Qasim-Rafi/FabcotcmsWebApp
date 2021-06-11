import { Component, OnInit, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgForm } from '@angular/forms';
import { ServiceService } from 'src/app/shared/service.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-add-packing',
  templateUrl: './add-packing.component.html',
  styleUrls: ['./add-packing.component.css']
})
export class AddPackingComponent implements OnInit {
  data: any ={};
  obj: any ={};
  response: any;
  active = true;


  constructor(private http:HttpClient,
    private spinner: NgxSpinnerService,
    private service: ServiceService,
    private toastr: ToastrService,
    private _NgbActiveModal: NgbActiveModal) { }

  ngOnInit(): void {
  }

    
  get activeModal() {
    return this._NgbActiveModal;
  }

  addPacking(form:NgForm)
  {
    // if (form.status == "INVALID") {

    //   this.toastr.error("Invalid Form", 'Message.');
    // }
    // else{
    let varr=  {
      "name": this.data.name,
      "description":  this.data.description,
      "active": this.active,
     
    }
this.spinner.show();
    this.http.
    post(`${environment.apiUrl}/api/Products/AddPacking`,varr)
    .subscribe(
      res=> { 
        this.obj.parent = this.active;
        this.obj.status = true;
        this.response = res;
        if (this.response.success == true){
          this.toastr.success(this.response.message, 'Message.');
      
          // this.buyerForm.reset();
          this.activeModal.close(this.obj);
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
      });
  }
}


// }
