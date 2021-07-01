import { DatePipe } from '@angular/common';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { GlobalConstants } from 'src/app/Common/global-constants';
import { ServiceService } from 'src/app/shared/service.service';
import { environment } from 'src/environments/environment';
import {NgxSpinnerService} from 'ngx-spinner'

@Component({
  selector: 'app-contract-owner',
  templateUrl: './contract-owner.component.html',
  styleUrls: ['./contract-owner.component.css']
})
export class ContractOwnerComponent implements OnInit {
  @Input() contractId;
 owner : any = {}
  data:any;
search:any;
ownerFilter: any = [];
searchOwner: any = [];
loggedInDepartmentName : any = {}

temp: any[];
response:any;
  constructor(

    private route: ActivatedRoute,
    private modalService: NgbModal,
    private http: HttpClient,
    private service: ServiceService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private router: Router,
    private _NgbActiveModal: NgbActiveModal
  
  ) { }

  ngOnInit(): void {
  this.GetUsersDropdown();
  this.loggedInDepartmentName=localStorage.getItem('loggedInDepartmentName');
  }
  updateFilter(event) {
    const val = event.target.value.toLowerCase();

    const temp = this.temp.filter(function (d) {
      return (
        d.fullName.toLowerCase().indexOf(val) !== -1 ||
      
        !val);
    });
    this.owner = temp;

  }
  get activeModal() {
    return this._NgbActiveModal;
  }
  GetUsersDropdown() {
    this.http.get(`${environment.apiUrl}/api/Lookups/Owners`).
    subscribe(res => {
      this.response = res;
      if (this.response.success == true) {
        this.owner = this.response.data;
        this.temp = [...this.owner];
      }
      else {
        this.toastr.error(this.response.message, 'Message.');
      }
    })
  }
  update(i) {
    this.spinner.show();
    let varr = {

    "contractOwner":i.id
    }

    this.http.
      put(`${environment.apiUrl}/api/Contracts/UpdateContract/`+ this.contractId, varr)
      .subscribe(
        res => {

          this.response = res;
          if (this.response.success == true) {
            this.toastr.success(this.response.message, 'Message.');
       
            this.activeModal.close(true);
           
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

}
