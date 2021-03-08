import { Component, OnInit } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ToastrService } from 'ngx-toastr';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-add-country',
  templateUrl: './add-country.component.html',
  styleUrls: ['./add-country.component.css']
})
export class AddCountryComponent implements OnInit {
  data:any={};
  response: any;
 
  constructor(  
    private http:HttpClient, private toastr: ToastrService,
    private _NgbActiveModal: NgbActiveModal) { }
 
  get activeModal() {
    return this._NgbActiveModal;
  }


  ngOnInit(): void {
  }
 
   active2 : boolean;
  addCountry()
  {
    let varr=  {
      "name": this.data.name,
      "details":this.data.details,
     "active":this.data.active
    }

    this.http.
    post(`${environment.apiUrl}/api/Configs/AddCountry`,varr)
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
