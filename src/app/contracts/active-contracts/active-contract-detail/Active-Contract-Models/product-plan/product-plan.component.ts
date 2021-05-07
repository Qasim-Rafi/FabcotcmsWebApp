import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ActivatedRoute } from '@angular/router';
import { ServiceService } from 'src/app/shared/service.service';
import { ToastrService } from 'ngx-toastr';
import { ColumnMode, SelectionType } from '@swimlane/ngx-datatable';
@Component({
  selector: 'app-product-plan',
  templateUrl: './product-plan.component.html',
  styleUrls: ['./product-plan.component.css']
})
export class PRODUCTPLANComponent implements OnInit {
  checkboxData: any = [];
  @Input() contractId;

  columns: any = [];
  tnaList: any = [];
  selected = [];
  data:any ={};
  response: any;
  // ColumnMode = ColumnMode;
  SelectionType = SelectionType;
  constructor(
    private _NgbActiveModal: NgbActiveModal,
    private route: ActivatedRoute,
    private modalService: NgbModal,
    private http: HttpClient,
    private service: ServiceService,
    private toastr: ToastrService,

  ) { }

  ngOnInit(): void {
    this.GetTnaList();
  }


  get activeModal() {
    return this._NgbActiveModal;
  }
  GetTnaList() {
    this.http.get(`${environment.apiUrl}/api/Lookups/TimeAndActions`).
    subscribe(res => {
      this.response = res;
      if (this.response.success == true) {
        this.tnaList = this.response.data;
   
      }
      else {
        this.toastr.error(this.response.message, 'Message.');
      }
    })
  }
  onSelect({ selected }) {
    console.log('Select Event', selected);
  }
  // onSelect(row) {
  //   console.log(row)
  // }

  onActivate(event) {
    console.log('Activate Event', event );
      if (event.type == 'click'){
        this.checkboxData.push(event.row.id);
      }
   
}

    addTna() {
      let varr = {
        "contractId":this.data.contractId,
    "tnaIds": this.checkboxData.toString()
      }
      this.http.
        post(`${environment.apiUrl}​/api​/Contracts​/AddContractTimeAction`, varr)
        .subscribe(
          res => {
  
            this.response = res;
            if (this.response.success == true) {
              this.toastr.success(this.response.message, 'Message.');

              this.activeModal.close(true);
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
