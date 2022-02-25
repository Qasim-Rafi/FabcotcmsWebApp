import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ServiceService } from 'src/app/shared/service.service';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-bill-breakup',
  templateUrl: './bill-breakup.component.html',
  styleUrls: ['./bill-breakup.component.css']
})
export class BillBreakupComponent implements OnInit {
  @Input() contractId;
data: any= {}
response:any=[];
  constructor(private http: HttpClient,
    private service: ServiceService,
    private spinner: NgxSpinnerService,
    private router: Router,
    private toastr: ToastrService,
    private _NgbActiveModal: NgbActiveModal) { }

  ngOnInit(): void {
  }

  billBreakupMethod(){
       let varr=  {
        //  "taxPercentage": this.data.precentage,
        //   "contractIds":this.ids,
        //   "departmentId":this.deptName
       }
       this.spinner.show();
       this.http.
       put(`${environment.apiUrl}/api/BillingPayments/UpdateBillBreakUp/`+this.contractId+'/'+ this.data.precentage,{})
       .subscribe(
         res=> {   
           this.response = res;
           if (this.response.success == true){
             this.toastr.success(this.response.message, 'Message.');
             this.activeModal.close();
             this.router.navigate(['/accounts']);
       this.spinner.hide();
   
           }
           else {
             this.toastr.error(this.response.message, 'Message.');
       this.spinner.hide();
   
               }
   
         },(err: HttpErrorResponse) => {
           const messages = this.service.extractErrorMessagesFromErrorResponse(err);
           this.toastr.error(messages.toString(), 'Message.');
           console.log(messages);
       this.spinner.hide();
         });
       }

       get activeModal() {
        return this._NgbActiveModal;
      }


     }




 

