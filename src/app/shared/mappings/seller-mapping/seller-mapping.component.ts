import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-seller-mapping',
  templateUrl: './seller-mapping.component.html',
  styleUrls: ['./seller-mapping.component.css']
})
export class SellerMappingComponent implements OnInit {
  response : any;
  seller : any = [];
  sellerFilter: any[];
  constructor(private http: HttpClient,
    private toastr: ToastrService,
  
  ) { }

  ngOnInit(): void {
    this.getSellers();
  }
  updateFilter(event) {
    const val = event.target.value.toLowerCase();

    const temp = this.sellerFilter.filter(function (d) {
      return (d.sellerCode.toLowerCase().indexOf(val) !== -1 ||

        d.sellerName.toLowerCase().indexOf(val) !== -1 || !val);
    });
    this.seller = temp;

  }
  getSellers() {
    this.http.get(`${environment.apiUrl}/api/Sellers/GetSellers`)
      .subscribe(
        res => {

          this.response = res;
          if (this.response.success == true) {

            this.seller = this.response.data;
            // console.log(this.seller)
            // this.sellerFilter = [...this.seller];
            // this.sellerCount = this.response.data.length;
            // this.getTotalPOCs();


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
