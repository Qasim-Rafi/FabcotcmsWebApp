import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import { AddEditMappingsComponent } from './add-edit-mappings/add-edit-mappings.component';

@Component({
  selector: 'app-seller-mapping',
  templateUrl: './seller-mapping.component.html',
  styleUrls: ['./seller-mapping.component.css']
})
export class SellerMappingComponent implements OnInit {
  response : any;
  seller : any = [];
  sellerFilter: any[];
  departmentId:any=[];
  service: any;
deptId :  any;
columns :  any;
searchSeller : any;
  constructor(private http: HttpClient,
    private toastr: ToastrService,
    private modalService: NgbModal
  ) { }

  ngOnInit(): void {
    // this.getSellers();
    this.GetDeparmentDropdown();
  }

 
 search(event) {
    const val = event.target.value.toLowerCase();
    const temp = this.searchSeller.filter(function (d) {
      return (d.sellerName.toLowerCase().indexOf(val) !== -1   || !val);
    });
    this.seller = temp;
  }
  editCode(row) {
    const modalRef = this.modalService.open(AddEditMappingsComponent, { centered: true });
    modalRef.componentInstance.mapping = row;
    modalRef.componentInstance.id = row.id;
  
    modalRef.result.then((data) => {
      // on close
      if (data == true) {
    this.getSellers(this.deptId)
     

      }

    }, (reason) => {
      // on dismiss
    });
  }



  GetDeparmentDropdown() {
    this.http.get(`${environment.apiUrl}/api/Lookups/Departments`)
      .subscribe(
        res => {

          this.response = res;
          if (this.response.success == true) {

            this.departmentId = this.response.data;

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
  getDeptId(event){
    // console.log(event)
    this.deptId = event
    this.getSellers(this.deptId)
  }

  getSellers(id) {
    this.http.get(`${environment.apiUrl}/api/Sellers/GetSellerAccountMappingsById/` + id )
      .subscribe(
        res => {

          this.response = res;
          if (this.response.success == true) {

            this.seller = this.response.data;
            this.searchSeller = [...this.seller]

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
