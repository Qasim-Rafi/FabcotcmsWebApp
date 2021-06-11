import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ActivatedRoute } from '@angular/router';
import { ServiceService } from 'src/app/shared/service.service';
import { ToastrService } from 'ngx-toastr';
import { ColumnMode, SelectionType } from '@swimlane/ngx-datatable';
import { createBuilderStatusReporter } from 'typescript';
import { NgxSpinnerService } from 'ngx-spinner';
@Component({
  selector: 'app-product-plan',
  templateUrl: './product-plan.component.html',
  styleUrls: ['./product-plan.component.css']
})
export class PRODUCTPLANComponent implements OnInit {
  checkboxData: any = [];
  @Input() contractId;
  tnaIds: any = [];

  columns: any = [];
  tnaList: any = [];
  selected = [];
  data:any ={};
  TnaFilter:any ={};
  selectedids: any ={};
  contractIds: any = [];

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
    private spinner: NgxSpinnerService,

  ) { }

  ngOnInit(): void {
    this.GetTnaList((Tna)=>{
      this.tnaList = Tna;
      this.TnaFilter = [...Tna];

    });
  }

  searchTna(event) {
    const val = event.target.value.toLowerCase();
    const temp = this.TnaFilter.filter(function (d) {
      return (d.name.toLowerCase().indexOf(val) !== -1 || !val);
    });
    this.tnaList = temp;
  }
  get activeModal() {
    return this._NgbActiveModal;
  }
  GetTnaList(cb) {
    this.http.get(`${environment.apiUrl}/api/Lookups/TimeAndActions`).
    subscribe(res => {
      this.response = res;
      if (this.response.success == true) {
        this.tnaList = this.response.data;
     cb(this.tnaList)
      }
      else {
        this.toastr.error(this.response.message, 'Message.');
      }
    })
  }
  onSelect(selecterow) {
    this.selectedids =selecterow;
console.log(this.selectedids)
    for(let i=0; i<this.selectedids.selected.length; i++ )
    {      
        this.tnaIds[i] = this.selectedids.selected[i].id;
    }
  }


    addTna() {
      this.spinner.show();
      if(this.tnaIds.length === 0 || this.selectedids.selected.length === 0 ){
        this.toastr.error("Select atleast one row to add" , 'Message')

      }
      else{
      let varr = {
        "contractId":this.contractId,
    "tnaIds": this.tnaIds
      }
      this.http.post(`${environment.apiUrl}/api/Contracts/AddContractTimeAction`, varr)
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
  
          }, err => {
            if (err.status == 400) {
              this.toastr.error(this.response.message, 'Message.');
              this.spinner.hide();
            }
          });
    
        }
        }



 
}