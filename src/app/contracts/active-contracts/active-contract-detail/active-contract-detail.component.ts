import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { ToastrService } from 'ngx-toastr';

import { GlobalConstants } from 'src/app/Common/global-constants';

import { Dateformater } from 'src/app/shared/dateformater';

import { EnquiryNotesComponent } from 'src/app/shared/MODLES/enquiry-notes/enquiry-notes.component';
import { ServiceService } from 'src/app/shared/service.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { CommisionKickbackComponent } from './Active-Contract-Models/commision-kickback/commision-kickback.component';
import { DeliveryTimelineComponent } from './Active-Contract-Models/delivery-timeline/delivery-timeline.component';
import { EmployeeCommissionComponent } from './Active-Contract-Models/employee-commission/employee-commission.component';
import { ItemsComponent } from './Active-Contract-Models/items/items.component';
import { LOCComponent } from './Active-Contract-Models/loc/loc.component';
import { PartiesComponent } from './Active-Contract-Models/parties/parties.component';
import { PaymentDeliveryComponent } from './Active-Contract-Models/payment-delivery/payment-delivery.component';
import { ProductAndSpecificationComponent } from './Active-Contract-Models/product-and-specification/product-and-specification.component';
import { PRODUCTPLANComponent } from './Active-Contract-Models/product-plan/product-plan.component';
import { QualityCostingComponent } from './Active-Contract-Models/quality-costing/quality-costing.component';
import { QuantityCostingComponent } from './Active-Contract-Models/quantity-costing/quantity-costing.component';
import { RemarksComponent } from './Active-Contract-Models/remarks/remarks.component';
import { SALEINVOICEComponent } from './Active-Contract-Models/sale-invoice/sale-invoice.component';

@Component({
  selector: 'app-active-contract-detail',
  templateUrl: './active-contract-detail.component.html',
  styleUrls: ['./active-contract-detail.component.css']
})
export class ActiveContractDetailComponent implements OnInit {
  dateformater: Dateformater = new Dateformater();
  rows: any = [];
  columns: any = [];
  queryParems: any = {};
  ItemCount: number;
  contractId: any = {};
  itemId: any = {};

  contractData: any = {};

  contractPartiesData: any = {};
  contractProductData: any = {};
  contractCostingData: any = {};
  contractPaymentData: any = {};
  contractLOCdata: any = {};
  contractCommissionData: any = {};
  contractRemarksData: any = {};
  response: any;
  ItemFilter: any = [];
  ItemUrl = '/api/Contracts/GetAllContractItem';
  shipmentUrl:'/api/Contracts/GetAllContractShipmentSchedule/';
  @ViewChild('myTable') table: DatatableComponent;

  constructor(
    private modalService: NgbModal,
    private route: ActivatedRoute,
    private http: HttpClient,
    private service: ServiceService,
    private toastr: ToastrService,
  ) { }

  ngOnInit(): void {
    this.queryParems = this.route.snapshot.queryParams;
    this.contractId = this.queryParems.id;

    this.getContractData();
    this.getContractPartiesData();

    {
      this.service.fetch((data) => {
        this.ItemFilter = [...data];
        this.rows = data;
        this.ItemCount = this.rows.length;
      }, this.ItemUrl);
    }
    {
      this.service.fetch((data) => {
        this.ItemFilter = [...data];
        this.rows = data;
        this.ItemCount = this.rows.length;
      }, this.shipmentUrl);
    }

    this.getContractProductData();
    this.getContractCostingData();
    this.getContractPaymentData();
    this.getContractLOC();
    this.getContractRemarkData();
    this.getContractCommisionData();

  }



  getContractData() {
    this.http.get(`${environment.apiUrl}/api/Contracts/GetContractById/` + this.contractId)
      .subscribe(
        res => {
          this.response = res;
          if (this.response.success == true) {
            this.contractData = this.response.data;
            
  
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
  
  
  
PartiesForm() {
  const modalRef = this.modalService.open(PartiesComponent, { centered: true });
  modalRef.componentInstance.contractId = this.contractId;
  modalRef.result.then((data) => {
  
    // on close
    if (data == true) {
      this.getContractPartiesData();
    }
  }, (reason) => {
    // on dismiss
  });
}




getContractPartiesData() {
  this.http.get(`${environment.apiUrl}/api/Contracts/GetContractPartiesById/` + this.contractId)
    .subscribe(
      res => {
        this.response = res;
        if (this.response.success == true) {
          this.contractPartiesData = this.response.data;
          

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





ProductANDSpecificationForm() {
  const modalRef = this.modalService.open(ProductAndSpecificationComponent, { centered: true });
  modalRef.componentInstance.contractId = this.contractId;

  modalRef.result.then((data) => {
    // on close
    if (data == true) {
    this.getContractProductData();

    }
  }, (reason) => {
    // on dismiss
  });
}




getContractProductData() {
  this.http.get(`${environment.apiUrl}/api/Contracts/GetContractProductSpecificationById/` + this.contractId)
    .subscribe(
      res => {
        this.response = res;
        if (this.response.success == true) {
          this.contractProductData = this.response.data;
          
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


QuantityCosting() {
  const modalRef = this.modalService.open(QuantityCostingComponent, { centered: true });
  modalRef.componentInstance.contractId = this.contractId;

  modalRef.result.then((data) => {
    // on close
    if (data == true) {
      this.getContractCostingData();

    }
  }, (reason) => {
    // on dismiss
  });
}



getContractCostingData() {
  this.http.get(`${environment.apiUrl}/api/Contracts/GetContractCostingById/` + this.contractId)
    .subscribe(
      res => {
        this.response = res;
        if (this.response.success == true) {
          this.contractCostingData = this.response.data;
          
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


PaymentDelivery() {
  const modalRef = this.modalService.open(PaymentDeliveryComponent, { centered: true });
  modalRef.componentInstance.contractId = this.contractId;

  modalRef.result.then((data) => {
    // on close
    if (data == true) {
      this.getContractPaymentData();

    }
  }, (reason) => {
    // on dismiss
  });
}




getContractPaymentData() {
  this.http.get(`${environment.apiUrl}/api/Contracts/GetContractPaymentDeliveryById/` + this.contractId)
    .subscribe(
      res => {
        this.response = res;
        if (this.response.success == true) {
          this.contractPaymentData = this.response.data;
          
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




DeliveryTimeline() {
  const modalRef = this.modalService.open(DeliveryTimelineComponent, { centered: true });
  modalRef.componentInstance.contractId = this.contractId;

  modalRef.result.then((data) => {
    // on close
    if (data == true) {

    }
  }, (reason) => {
    // on dismiss
  });
}


CommissionKickback() {
  const modalRef = this.modalService.open(CommisionKickbackComponent, { centered: true });
  modalRef.componentInstance.contractId = this.contractId;

  modalRef.result.then((data) => {
    // on close
    if (data == true) {
      this.getContractCommisionData();

    }
  }, (reason) => {
    // on dismiss
  });
}





getContractCommisionData(){
  this.http.get(`${environment.apiUrl}/api/Contracts/GetContractCommissionById/` + this.contractId)
  .subscribe(
    res => {
      this.response = res;
      if (this.response.success == true) {
        this.contractCommissionData = this.response.data;
        // this.contractCommissionData.agenetName= parseInt(this.contractCommissionData.agenetName);
        
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






EmployeeCommission() {
  const modalRef = this.modalService.open(EmployeeCommissionComponent, { centered: true });
  modalRef.componentInstance.contractId = this.contractId;

  modalRef.result.then((data) => {
    // on close
    if (data == true) {

    }
  }, (reason) => {
    // on dismiss
  });
}


Remarks() {
  const modalRef = this.modalService.open(RemarksComponent, { centered: true });
  modalRef.componentInstance.contractId = this.contractId;

  modalRef.result.then((data) => {
    // on close
    if (data == true) {
      this.getContractRemarkData();

    }
  }, (reason) => {
    // on dismiss
  });
}





getContractRemarkData() {
  this.http.get(`${environment.apiUrl}/api/Contracts/GetContractRemarkById/` + this.contractId)
    .subscribe(
      res => {
        this.response = res;
        if (this.response.success == true) {
          this.contractRemarksData = this.response.data;
          
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


//Forms in Different Tabs


LOCform() {
  const modalRef = this.modalService.open(LOCComponent, { centered: true });
  modalRef.componentInstance.contractId = this.contractId;

  modalRef.result.then((data) => {
    // on close
    if (data == true) {
      this.getContractLOC();

    }
  }, (reason) => {
    // on dismiss
  });
}






getContractLOC() {
  this.http.get(`${environment.apiUrl}/api/Contracts/GetContractLetterCreditById/` + this.contractId)
    .subscribe(
      res => {
        this.response = res;
        if (this.response.success == true) {
          this.contractLOCdata = this.response.data;
          this.contractLOCdata.lcExpiryDate = this.dateformater.fromModel(this.contractLOCdata.lcExpiryDate);


          
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


ProductionPlanform() {
  const modalRef = this.modalService.open(PRODUCTPLANComponent, { centered: true });
  modalRef.componentInstance.contractId = this.contractId;

  modalRef.result.then((data) => {
    // on close
    if (data == true) {

    }
  }, (reason) => {
    // on dismiss
  });
}

saleInvoice() {
  const modalRef = this.modalService.open(SALEINVOICEComponent, { centered: true });
  modalRef.componentInstance.contractId = this.contractId;

  modalRef.result.then((data) => {
    // on close
    if (data == true) {

    }
  }, (reason) => {
    // on dismiss
  });
}

Note() {
  const modalRef = this.modalService.open(EnquiryNotesComponent, { centered: true });
  modalRef.componentInstance.contractId = this.contractId;

  modalRef.result.then((data) => {
    // on close
    if (data == true) {

    }
  }, (reason) => {
    // on dismiss
  });
}

// Items() {
//   const modalRef = this.modalService.open(ItemsComponent, { centered: true });
//   modalRef.componentInstance.itemId = this.itemId;

//   modalRef.result.then((data) => {
//     // on close
//     if (data == true) {

//     }
//   }, (reason) => {
//     // on dismiss
//   });
// }
Items(check, name) {
  const modalRef = this.modalService.open(ItemsComponent, { centered: true });
  modalRef.componentInstance.statusCheck = check;
  modalRef.componentInstance.FormName = name;
  modalRef.result.then((data) => {
    // on close
    if (data == true) {
      this.service.fetch((data) => {
        this.rows = data;
        this.ItemCount = this.rows.length;
      }, this.ItemUrl);


    }
  }, (reason) => {
    // on dismiss
  });
}
editItem(row, check, name) {
  const modalRef = this.modalService.open(ItemsComponent, { centered: true });
  modalRef.componentInstance.itemId = row.id; //just for edit.. to access the needed row
  modalRef.componentInstance.statusCheck = check;
  modalRef.componentInstance.FormName = name;

  modalRef.result.then((data) => {
    // on close
    if (data == true) {
      this.service.fetch((data) => {
        this.rows = data;
      }, this.ItemUrl);
    }
  }, (reason) => {
    // on dismiss
  });
}

deleteItem(id) {
  Swal.fire({
    title: GlobalConstants.deleteTitle, //'Are you sure?',
    text: GlobalConstants.deleteMessage + ' ' + '"' + id.description + '"',
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

      this.http.delete(`${environment.apiUrl}/api/Contracts/DeleteContractItem/` + id.id)
        .subscribe(
          res => {
            this.response = res;
            if (this.response.success == true) {
              this.toastr.error(GlobalConstants.deleteSuccess, 'Message.');
              this.service.fetch((data) => {
                this.rows = data;
              }, this.ItemUrl);

            }
            else {
              this.toastr.error(GlobalConstants.exceptionMessage, 'Message.');
            }

          }, err => {
            if (err.status == 400) {
              this.toastr.error(this.response.message, 'Message.');
            }
          });
    }
  })
}


}
