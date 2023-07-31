import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ServiceService } from '../service.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { environment } from 'src/environments/environment';



@Component({
  selector: 'app-emailgeneration',
  templateUrl: './emailgeneration.component.html',
  styleUrls: ['./emailgeneration.component.css']
})
export class EmailgenerationComponent implements OnInit {
  data: any = {};
  response: any;
  constructor(

    private http: HttpClient,
    private toastr: ToastrService,
    private service: ServiceService,
    private spinner: NgxSpinnerService,

  ) { }

  ngOnInit(): void {
  }
  generate(){
        this.http.get(`${environment.apiUrl}/api/Lookups/generateEmail`)
        .subscribe(
          res => {
            this.response = res;
        
              if (this.response.success == true) {
              
                 //this.data = this.response.data;
                this.toastr.success(this.response.message, 'Message.');
              }
              else {
                this.toastr.error(this.response.message, 'Message.');
              }
            
  
          }, err => {
            if (err.status == 400) {
              this.toastr.error(this.response.message, 'Message.');
            }
          });
    
  }
}
