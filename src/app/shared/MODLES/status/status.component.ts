import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-status',
  templateUrl: './status.component.html',
  styleUrls: ['./status.component.css']
})
export class StatusComponent implements OnInit {

  constructor(private http: HttpClient,
    private toastr: ToastrService,
    private _NgbActiveModal: NgbActiveModal) { }

  response: any;
  data:any={};
  @Input() statusCheck;
  @Input() EnquiryId;
  @Input() ContractId;
  @Input() action;
  @Input() component;
  // @Input() objEnquiry;

  ngOnInit(): void {
    
  
  }


  get activeModal() {
    return this._NgbActiveModal;
  }

  UpdateEnquiryStatus(form:NgForm)
  { 

        if(form.status == "INVALID"){
    }

else
{
    let varr = {
    
      "reason":this.data.reason,
      "enquiryId":this.EnquiryId,
      "status":this.action
    }
    
    this.http.
    put(`${environment.apiUrl}/api/Enquiries/UpdateEnquiryStatus`, varr)
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





  UpdateContractStatus(form:NgForm)
{ 

    if(form.status == "INVALID"){

    }

else

{

  let varr = {
    
    "reason":this.data.reason,
    "contractId":this.ContractId,
    "status":this.action,
  }

  this.http.
  put(`${environment.apiUrl}/api/Contracts/UpdateContractStatus`, varr)
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
}



