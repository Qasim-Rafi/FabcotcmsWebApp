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

@Component({
  selector: 'app-yarn-active-contracts',
  templateUrl: './yarn-active-contracts.component.html',
  styleUrls: ['./yarn-active-contracts.component.css']
})
export class YarnActiveContractsComponent implements OnInit {
 totalDisplayPrice:any;
  response: any;
  data: any = {};
  rows: any = [];
  columns: any = [];
  temp: any[];
  allCount: number;
  openCount:number;
  closedCount: number;
  billAwaitedCount: number;
  billedCount: number;
  receivableCount: number;
  receivedCount: number;
  onHoldCount: number;
 status : string =  "All" ;
 @ViewChild(DataBindingDirective) dataBinding: DataBindingDirective;
  constructor(
    private router: Router,
    private http: HttpClient,
    private service: ServiceService,
    private toastr: ToastrService,
    private modalService: NgbModal,
    private spinner: NgxSpinnerService,
 
  ) { }

  ngOnInit(): void {
    this.fetch((data) => {
      this.temp = [...data]; 
      this.rows = data;
    });
  }


  // columnDefs = [
  //   { headerName: 'BuyerName', field: 'buyerName', sortable: true,  
  //   filter: true   },
  //   { headerName: 'SellerName', field: 'sellerName' ,sortable: true,  
  //   filter: true  },
  //   { headerName: 'ContractOn', field: 'contractOn',sortable: true,  
  //   filter: true   }
  // ];

  searchFilter(event) {
    const val = event.target.value.toLowerCase();
    // filter our data
    const temp = this.temp.filter(function (d) {
      return (
        d.autoContractNumber.toLowerCase().indexOf(val) !== -1 ||

         !val);
    });
    this.rows = temp;
  }


  navigateEditContract(obj) {
    this.router.navigate(['/FabCot/active-contract-details'], { queryParams: {id: obj.id} });
  };
  
  navigateAddContract() {
    this.router.navigate(['/FabCot/add-new-contract']);
  };

contractStatus(check){
if ( check == 'All'){
  this.status = null;
  this.fetch((data) => {
    this.temp = [...data]; 
    this.rows = data;
  });
}
else if ( check == 'Open'){
  this.status = "Open";
  this.fetch((data) => {
    this.temp = [...data]; 
    this.rows = data;
  });
}
else if ( check == 'Closed'){
  this.status = "Closed";
  this.fetch((data) => {
    this.temp = [...data]; 
    this.rows = data;
  });
}
else if ( check == 'BillAwaited'){
  this.status = "BillAwaited";
  this.fetch((data) => {
    this.temp = [...data]; 
    this.rows = data;
  });
}
else if ( check == 'Billed'){
  this.status = "Billed";
  this.fetch((data) => {
    this.temp = [...data]; 
    this.rows = data;
  });
}
else if ( check == 'Receivable'){
  this.status = "Receivable";
  this.fetch((data) => {
    this.temp = [...data]; 
    this.rows = data;
  });
}
else if ( check == 'OnHold'){
  this.status = "OnHold";
  this.fetch((data) => {
    this.temp = [...data]; 
    this.rows = data;
  });
}

else{
  this.status = null
  this.fetch((data) => {
    this.temp = [...data]; 
    this.rows = data;
  });
}
}
public onFilter(inputValue: string): void {
  this.rows = process(this.temp, {
      filter: {
          logic: "or",
          filters: [
              {
                  field: 'contractAge',
                  operator: 'contains',
                  value: inputValue
              },
              {
                  field: 'autoContractNumber',
                  operator: 'contains',
                  value: inputValue
              },
              {
                  field: 'contractOn',
                  operator: 'contains',
                  value: inputValue
              },
              {
                  field: 'articleName',
                  operator: 'contains',
                  value: inputValue
              },
           
              {
                  field: 'buyerName',
                  operator: 'contains',
                  value: inputValue
              }
              ,
              {
                  field: 'sellerName',
                  operator: 'contains',
                  value: inputValue
              }
              ,
              {
                  field: 'price',
                  operator: 'contains',
                  value: inputValue
              }
          
          ],
      }
  }).data;

  this.dataBinding.skip = 0;
}

fetch(cb) {
  this.spinner.show();

  this.http
    .get(`${environment.apiUrl}/api/Contracts/GetAllContract/` + this.status)
    .subscribe(res => {
      this.response = res;

      if (this.response.success == true && this.response.data != null) {

        this.totalDisplayPrice=this.response.data;
        this.data = this.response.data.list;
        this.allCount = this.response.data.allCount;
        this.openCount = this.response.data.openCount;
        this.closedCount = this.response.data.closedCount;
        this.billAwaitedCount = this.response.data.billAwaitedCount;
        this.billedCount = this.response.data.billedCount;
        this.receivableCount = this.response.data.receivableCount;
        this.receivedCount = this.response.data.receivedCount;
        this.onHoldCount = this.response.data.onHoldCount;
        this.temp = [this.data]; 
        cb(this.data);
this.spinner.hide();

      }
      else {
        if(this.response.data == null){
          
        }
        this.toastr.error(this.response.message, 'Message.');
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


cloneContract(obj){
  let varr = {

  }
this.spinner.show();
  
   this.http.put(`${environment.apiUrl}/api/Contracts/CloneContract/`+obj.id , varr )
        .subscribe(
          res => {
  
            this.response = res;
            if (this.response.success == true) {
              this.data = this.response.data;
              this.temp = [this.data];
            this.toastr.success(this.response.message, 'Message.');
            this.fetch((data) => {
              this.temp = [...data]; 
              this.rows = data;
            });
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



deleteContract(obj) {
  Swal.fire({
    title: GlobalConstants.deleteTitle, //'Are you sure?',
    text: GlobalConstants.deleteMessage + ' ' + '"' + obj.autoContractNumber + '"',
    icon: 'error',
    showCancelButton: true,
    confirmButtonColor: '#ed5565',
    cancelButtonColor: '#dae0e5',
    cancelButtonText: 'No',
    confirmButtonText: 'Yes',
    reverseButtons: true,
    position: 'top',
  }).then((result) => {
    if (result.isConfirmed) {
      this.spinner.show();

      this.http.delete(`${environment.apiUrl}/api/Contracts/DeleteContract/` + obj.id)
        .subscribe(
          res => {
            this.response = res;
            if (this.response.success == true) {
              this.toastr.error(this.response.message, 'Message.');
              // this.getAllEnquiryItems();
              this.fetch((data) => {
                this.rows = data;
              });
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
  })

}
// --------------------------Export as excel File ----------------------------//

contractExcelFile() {

  const filtered = this.rows.map(row => ({
    SNo: row.id,
    ContractAge: row.contractAge,
    ContractNo: row.autoContractNumber,
    BuyerName: row.buyerName,
    SellerName: row.sellerName,
    ArticleName: row.articleName,
    Currency: row.currencyCode,
    Price: row.price,
    Unit:row.uomName,
    Quantity: row.quantity,
    PoNumber: row.poNumber,
    ScNumber: row.scNumber,
    DispatchQuantity: row.dispatchQuantity,
    Status: row.status,
    LastUpdateOn: row.updatedDateTime,
    LastUpdateBy: row.createdByName
  }));

  this.service.exportAsExcelFile(filtered, 'Contract');

}

}
