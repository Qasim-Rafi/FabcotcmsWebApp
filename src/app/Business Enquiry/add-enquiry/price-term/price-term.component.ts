import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-price-term',
  templateUrl: './price-term.component.html',
  styleUrls: ['./price-term.component.css']
})
export class PriceTermComponent implements OnInit {

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
  addPrice()
  {
    let varr=  {
           "term": this.data.term,
           "description":this.data.description
     
    }

    this.http.
    post(`${environment.apiUrl}/api/Products/AddPriceTerm`,varr)
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
