import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-payment-term',
  templateUrl: './payment-term.component.html',
  styleUrls: ['./payment-term.component.css']
})
export class PaymentTermComponent implements OnInit {
  data:any={};
  response: any;
  constructor(private http:HttpClient,
    private toastr: ToastrService,
    private _NgbActiveModal: NgbActiveModal) { }

  ngOnInit(): void {
  }
  get activeModal() {
    return this._NgbActiveModal;
  }
  addPayment()
  {
    let varr=  {
           "term": this.data.term,
           "description":this.data.description
     
    }

    this.http.
    post(`${environment.apiUrl}/api/Products/AddPaymentTerm`,varr)
    .subscribe(
      res=> { 
  
        this.response = res;
        if (this.response.success == true){
          this.toastr.success(this.response.message, 'Message.');
      
          // this.buyerForm.reset();
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
