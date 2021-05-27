import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
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
  reason: string; 
  data={};
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

  UpdateEnquiryStatus()
  { 
     let varr = {"reason":this.reason}
    
    this.http.
    put(`${environment.apiUrl}/api/Enquiries/UpdateEnquiryStatus/`+this.EnquiryId + `/`+ this.action , varr)
    .subscribe(
      res=> { 
  
        this.response = res;
        if (this.response.success == true){
          this.toastr.success(this.response.message, 'Message.');
       
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





  UpdateContractStatus()
{ 
  let varr = {"reason":this.reason}

  this.http.
  put(`${environment.apiUrl}/api/Contracts/UpdateContractStatus/`+this.ContractId + `/`+ this.action , varr)
  .subscribe(
    res=> { 

      this.response = res;
      if (this.response.success == true){
        this.toastr.success(this.response.message, 'Message.');
     
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



