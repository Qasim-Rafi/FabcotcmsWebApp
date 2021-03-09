import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class ServiceService {
  response:any;
  country:any=[];
  buyer:any=[];
  constructor(private http: HttpClient, private toastr: ToastrService,) { }

  getCountry()
  {
    this.http.get(`${environment.apiUrl}/api/Lookups/Countries`)
    .subscribe(
      res=> { 
        this.response = res;
        if (this.response.success == true){
          this.country =this.response.data;
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
  
  getBuyers()
  {
    this.http.get(`${environment.apiUrl}/api/Lookups/Buyers`)
    .subscribe(
      res=> { 
        this.response = res;
        if (this.response.success == true){
          this.buyer =this.response.data;
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
