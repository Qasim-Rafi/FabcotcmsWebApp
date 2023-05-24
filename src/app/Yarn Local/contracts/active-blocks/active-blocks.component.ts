import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { GlobalConstants } from 'src/app/Common/global-constants';
import { ServiceService } from 'src/app/shared/service.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { process } from '@progress/kendo-data-query';
import { DataBindingDirective } from '@progress/kendo-angular-grid';
// import { ActiveContractDateFilterComponent } from 'src/app/shared/active-contract-date-filter/active-contract-date-filter.component';
import { Dateformater } from 'src/app/shared/dateformater';

@Component({
  selector: 'app-active-blocks',
  templateUrl: './active-blocks.component.html',
  styleUrls: ['./active-blocks.component.css']
})
export class ActiveBlocksComponent implements OnInit {
  response: any;
  data: any = {};
  columns: any = [];
  rows: any = [];
  temp: any[];
  loggedInDepartmentName: string;
  @ViewChild(DataBindingDirective) dataBinding: DataBindingDirective;
  dateformater: Dateformater = new Dateformater();
   constructor(
     private router: Router,
     private http: HttpClient,
     private service: ServiceService,
     private toastr: ToastrService,
     private modalService: NgbModal,
     private spinner: NgxSpinnerService,
  
   ) {let footer = document.getElementsByTagName('footer')[0];
   footer.classList.add('d-none');
   let body = document.getElementsByTagName('body')[0];
   body.classList.add('sidebar-collapse'); }

  ngOnInit(): void {
    this.loggedInDepartmentName=localStorage.getItem('loggedInDepartmentName');
    this.fetch((data) => {
      this.temp = [...data]; 
      this.rows = data;
    });
  }
  fetch(cb) {
    this.spinner.show();
    
    this.http
      .get(`${environment.apiUrl}/api/BlockBooking/GetblockAll`)
      .subscribe(res => {
        this.response = res;
  
        if (this.response.success == true && this.response.data != null) {
          this.data = this.response.data;
          this.temp = [...this.data]; 
          console.log(this.data)
          cb(this.data);
  this.spinner.hide();
  
        }
        else {
          if(this.response.data == null){
            
            this.toastr.error(this.response.message, 'Message.');
          }
  this.spinner.hide();
  
        }
        // this.spinner.hide();
      }, err => {
        if (err.status == 400) {
          this.toastr.error(err.error.message, 'Message.');
  this.spinner.hide();
  
        }
        //  this.spinner.hide();
      });
  }
  navigateAddContract() {
    this.router.navigate(['/FabCot/add-block']);
  };
  navigateEditBlock(row){
    this.router.navigate(['/FabCot/edit-active-block'], { queryParams: {id: row.id} });
  }
  public onFilter(inputValue: string): void {
    this.rows = process(this.temp, {
        filter: {
            logic: "or",
            filters: [
                {
                    field: 'contractNumber',
                    operator: 'contains',
                    value: inputValue
                },
                {
                    field: 'buyerName',
                    operator: 'contains',
                    value: inputValue
                },
                {
                  field: 'articleName',
                  operator: 'contains',
                  value: inputValue
              },
                {
                    field: 'packingName',
                    operator: 'contains',
                    value: inputValue
                },
                {
                    field: 'delivery',
                    operator: 'contains',
                    value: inputValue
                },
             
                {
                    field: 'deliverTerms',
                    operator: 'contains',
                    value: inputValue
                }
                ,
                {
                    field: 'condition',
                    operator: 'contains',
                    value: inputValue
                }
                ,
                {
                    field: 'termOfPayment',
                    operator: 'contains',
                    value: inputValue
                }
            
            ],
        }
    }).data;
  
    this.dataBinding.skip = 0;
  }
}
