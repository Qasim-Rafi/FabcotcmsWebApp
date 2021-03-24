import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-seller-poc',
  templateUrl: './seller-poc.component.html',
  styleUrls: ['./seller-poc.component.css']
})
export class SellerPocComponent implements OnInit {
  
  @Input() userId;
  data: any ={};
  response: any;
  
  constructor(private http: HttpClient,
    private toastr: ToastrService,
    private _NgbActiveModal: NgbActiveModal,) { }

  ngOnInit(): void {
    this.editSeller(this.userId);
  }


  get activeModal() {
    return this._NgbActiveModal;
  }



  editSeller(id) {
    this.http.get(`${environment.apiUrl}/api/Sellers/GetSeller/` + id)
      .subscribe(
        res => {
          this.response = res;
          if (this.response.success == true) {
            this.data = this.response.data;


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
