import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ServiceService } from 'src/app/shared/service.service';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-branch-address',
  templateUrl: './branch-address.component.html',
  styleUrls: ['./branch-address.component.css']
})
export class BranchAddressComponent implements OnInit {
  data:any ={};
  response: any;
  address: any={};
  branch:any;
  constructor( private _NgbActiveModal: NgbActiveModal,
    private http: HttpClient,
    private service: ServiceService,
    private toastr: ToastrService,) { }

  ngOnInit(): void {
    this.GetBranchDropdown()
  }
  get activeModal() {
    return this._NgbActiveModal;
  }
  datatransfer(){
    this.data.branch;
    this.activeModal.close(this.data);

  }
  GetBranchDropdown() {
    this.http.get(`${environment.apiUrl}/api/Lookups/FabcotBranches`).
    subscribe(res => {
      this.response = res;
      if (this.response.success == true) {
        this.address = this.response.data;
      }
      else {
        this.toastr.error(this.response.message, 'Message.');
      }
    })
  }


  
}
