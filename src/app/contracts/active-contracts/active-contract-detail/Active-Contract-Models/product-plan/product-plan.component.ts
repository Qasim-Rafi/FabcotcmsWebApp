import { Component, OnInit } from '@angular/core';
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
  columns: any = [];
  tnaList: any = [];
  selected = [];
  // ColumnMode = ColumnMode;
  SelectionType = SelectionType;
  response: any;
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
  // onSelect({ selected }) {
  //   console.log('Select Event', selected);
  // }
  // onSelect(row) {
  //   console.log(row)
  // }

  onActivate(event) {
    // console.log('Activate Event', event );
    this.checkboxData = event.row;
   
  }
  addTna() {

  console.log(this.checkboxData)

}

 
}
