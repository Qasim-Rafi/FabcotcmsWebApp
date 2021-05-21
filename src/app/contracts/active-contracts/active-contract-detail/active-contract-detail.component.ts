import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { GlobalConstants } from 'src/app/Common/global-constants';
import { Dateformater } from 'src/app/shared/dateformater';
import { EnquiryNotesComponent } from 'src/app/shared/MODLES/enquiry-notes/enquiry-notes.component';
import { ServiceService } from 'src/app/shared/service.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { CommisionKickbackComponent } from './Active-Contract-Models/commision-kickback/commision-kickback.component';
import { ContractNoteComponent } from './Active-Contract-Models/contract-note/contract-note.component';
import { DeliveryTimelineComponent } from './Active-Contract-Models/delivery-timeline/delivery-timeline.component';
import { EditTnaComponent } from './Active-Contract-Models/edit-tna/edit-tna.component';
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
import { SaleInvoiceItemComponent } from './Active-Contract-Models/sale-invoice-item/sale-invoice-item.component';
import { SALEINVOICEComponent } from './Active-Contract-Models/sale-invoice/sale-invoice.component';
import { TnaLogHistoryComponent } from './Active-Contract-Models/tna-log-history/tna-log-history.component';

@Component({
  selector: 'app-active-contract-detail',
  templateUrl: './active-contract-detail.component.html',
  styleUrls: ['./active-contract-detail.component.css']
})

export class ActiveContractDetailComponent implements OnInit {
  dateformater: Dateformater = new Dateformater();
 
  rows: any = [];
  rows1: any = [];
  rows2: any = [];
  rows3: any = [];
  rows4: any = [];
  data:any = {};
  items:any = {};
  empData:any = {};
  shipment:any = {};
  contractNote:any = {};
  columns: any = [];
  queryParems: any = {};
  contractId: any = {};
  contractData: any = {};
  contractPartiesData: any = {};
  contractProductData: any = {};
  contractCostingData: any = {};
  contractPaymentData: any = {};
  contractLOCdata: any = {};
  contractCommissionData: any = {};
  contractRemarksData: any = {};
  response: any;
  ItemCount: number;
  contractCount: number;
  shipmentCount: number;
  ItemFilter: any = [];
  shipmentFilter: any = [];
  noteFilter: any = [];
  TnaData: any = {};
  TnaFilter: any = {};

  shipmentData: any = {};
  invoiceData:any =[];
 
  shipmentUrl='/api/Contracts/GetAllContractShipmentSchedule/{contractId}';
  // tna data
  rows5: any = [];
  id: any = {};
  tnaId: any = {};
  
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
    this.getContractProductData();
    this.getContractCostingData();
    this.getContractPaymentData();
    this.getContractLOC();
    this.getContractRemarkData();
    this.getContractCommisionData();
    this.getSaleInvoice();

    this.getContractTnA((Tna)=>{
      this.rows5 = Tna;
      this.TnaFilter = [...Tna];

    });

    this.getAllBenificery((empData) => {
      this.rows1 = empData;
      // this.listCount= this.rows.length;
    });


    this.getAllItems((itemsData) => {
      this.rows2 = itemsData;
      // this.listCount= this.rows.length;
    });

    this.getAllNotes((NotesData) => {
      this.rows3 = NotesData;
      // this.listCount= this.rows.length;
    });
    this.getAllShipmentDates((shipmentData) => {
      this.rows4 = shipmentData;
    });

  }

  searchTna(event) {
    const val = event.target.value.toLowerCase();
    const temp = this.TnaFilter.filter(function (d) {
      return (d.tnaItem.toLowerCase().indexOf(val) !== -1 || !val);
    });
    this.rows5 = temp;
  }



  getAllItems(cb) {

    this.http
      .get(`${environment.apiUrl}/api/Contracts/GetAllContractItem/`+ this.contractId)
      .subscribe(res => {
        this.response = res;
        

        if (this.response.success == true) {
          this.items = this.response.data
          this.ItemFilter = [this.items]; 
          cb(this.items);
        }
        else {
          this.toastr.error(this.response.message, 'Message.');
        }
        // this.spinner.hide();
      }, err => {
        if (err.status == 400) {
          this.toastr.error(err.error.message, 'Message.');;
        }
        //  this.spinner.hide();
      });
  }



  getAllNotes(cb) {

    this.http
      .get(`${environment.apiUrl}/api/Contracts/GetAllContractNote/`+ this.contractId)
      .subscribe(res => {
        this.response = res;
        

        if (this.response.success == true) {
          this.contractNote = this.response.data
          this.noteFilter = [this.contractNote]; 
          cb(this.contractNote);
        }
        else {
          this.toastr.error(this.response.message, 'Message.');
        }
        // this.spinner.hide();
      }, err => {
        if (err.status == 400) {
          this.toastr.error(err.error.message, 'Message.');;
        }
        //  this.spinner.hide();
      });
  }



  getAllShipmentDates(cb) {

    this.http
      .get(`${environment.apiUrl}/api/Contracts/GetAllContractShipmentSchedule/`+ this.contractId)
      .subscribe(res => {
        this.response = res;
        

        if (this.response.success == true) {
          this.shipment = this.response.data
          this.shipmentFilter = [this.shipment]; 
          cb(this.shipment);
        }
        else {
          this.toastr.error(this.response.message, 'Message.');
        }
        // this.spinner.hide();
      }, err => {
        if (err.status == 400) {
          this.toastr.error(err.error.message, 'Message.');;
        }
        //  this.spinner.hide();
      });
  }



  getSaleInvoice() {
    this.http.get(`${environment.apiUrl}/api/Contracts/GetAllContractSaleInvoice`)
      .subscribe(
        res => {
          this.response = res;
          if (this.response.success == true) {
            this.invoiceData = this.response.data;
            
  
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






EmployeeCommission(status) {
  const modalRef = this.modalService.open(EmployeeCommissionComponent, { centered: true });
  modalRef.componentInstance.contractId = this.contractId;
  modalRef.componentInstance.statusCheck = status;

  modalRef.result.then((data) => {
    // on close
    if (data == true) {
      this.getAllBenificery((empData) => {
        this.rows1 = empData;
        // this.listCount= this.rows.length;
      });

    }
  }, (reason) => {
    // on dismiss
  });
}

editEmployeeCommission(status , row) {
  const modalRef = this.modalService.open(EmployeeCommissionComponent, { centered: true });
  modalRef.componentInstance.contractId = this.contractId;
  modalRef.componentInstance.statusCheck = status;
  modalRef.componentInstance.beneficiaryId = row.id;


  modalRef.result.then((data) => {
    // on close
    if (data == true) {

      this.getAllBenificery((empData) => {
        this.rows1 = empData;
        // this.listCount= this.rows.length;
      });
    }
  }, (reason) => {
    // on dismiss
  });
}

getAllBenificery(cb) {
    
  this.http
  .get(`${environment.apiUrl}/api/Contracts/GetAllContractBeneficiary/` + this.contractId)
  .subscribe(res => {
    this.response = res;
   
  if(this.response.success==true)
  {
  this.empData =this.response.data;
  cb(this.empData);
  }
  else{
    this.toastr.error(this.response.message, 'Message.');
  }
    // this.spinner.hide();
  }, err => {
    if ( err.status == 400) {
this.toastr.error(err.error.message, 'Message.');
    }
  //  this.spinner.hide();
  });
}



deleteCommission(row) {
  Swal.fire({
    title: GlobalConstants.deleteTitle, //'Are you sure?',
    text: GlobalConstants.deleteMessage + ' ' + '"' + row.criteriaDetail + '"',
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

      this.http.delete(`${environment.apiUrl}/api/Contracts/DeleteContractBeneficiary/` + row.id )
        .subscribe(
          res => {
            this.response = res;
            if (this.response.success == true) {
              this.toastr.error(this.response.message, 'Message.');
              // this.getAllEnquiryItems();
              // this.getEnquiryData(this.objEnquiry);
              this.getAllBenificery((empData) => {
                this.rows1 = empData;
                // this.listCount= this.rows.length;
              });

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
  })

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
      this.getContractTnA((Tna)=>{
        this.rows5 = Tna;
      });
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
      this.getAllNotes((NotesData) => {
        this.rows3 = NotesData;
        // this.listCount= this.rows.length;
      });

    }
  }, (reason) => {
    // on dismiss
  });
}

ContractNotes(check, name) {
  const modalRef = this.modalService.open(ContractNoteComponent, { centered: true });
  modalRef.componentInstance.statusCheck = check;
  modalRef.componentInstance.FormName = name;
  modalRef.componentInstance.contractId = this.contractId;
  modalRef.result.then((data) => {
    // on close
    if (data == true) {
      this.getAllNotes((NotesData) => {
        this.rows3 = NotesData;
        // this.listCount= this.rows.length;
      });
    }
  }, (reason) => {
    // on dismiss
  });
}
// Items() {
//   const modalRef = this.modalService.open(ItemsComponent, { centered: true });
//   modalRef.componentInstance.contractId = this.contractId;

//   modalRef.result.then((data) => {
//     // on close
//     if (data == true) {

//     }
//   }, (reason) => {
//     // on dismiss
//   });
// }
getContractTnA(cb) {
  this.http.get(`${environment.apiUrl}/api/Contracts/GetAllContractTimeAction/` + this.contractId)
    .subscribe(
      res => {
        this.response = res;
        if (this.response.success == true) {
          this.TnaData = this.response.data;
          cb(this.TnaData)
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

EditTna(row) {
  const modalRef = this.modalService.open(EditTnaComponent, { centered: true });
  modalRef.componentInstance.contractId = this.contractId;
  modalRef.componentInstance.id = row.id;
  modalRef.componentInstance.tnaId = row.tnaId;


  modalRef.result.then((data) => {
    // on close
    if (data == true) {
      this.getContractTnA((Tna)=>{
        this.rows5 = Tna;
      });
    }
  }, (reason) => {
    // on dismiss
  });
}
TnaHistory(row) {
  const modalRef = this.modalService.open(TnaLogHistoryComponent, { centered: true });
  modalRef.componentInstance.contractId = this.contractId;
  modalRef.componentInstance.id = row.id;
  modalRef.componentInstance.tnaId = row.tnaId;


  modalRef.result.then((data) => {
    // on close
    if (data == true) {
      this.getContractTnA((Tna)=>{
        this.rows5 = Tna;
      });
    }
  }, (reason) => {
    // on dismiss
  });
}
AddsaleInvoiceItem(check,value) {
  const modalRef = this.modalService.open(SaleInvoiceItemComponent, { centered: true });
  modalRef.componentInstance.contractId = this.contractId;
  modalRef.componentInstance.contractSaleInvoiceId = value.id;
  modalRef.componentInstance.statusCheck = check;
  modalRef.result.then((data) => {
    // on close
    if (data == true) {

    }
  }, (reason) => {
    // on dismiss
  });
}
EditsaleInvoiceItem(check) {
  const modalRef = this.modalService.open(SaleInvoiceItemComponent, { centered: true });
  modalRef.componentInstance.contractId = this.contractId;
  modalRef.componentInstance.statusCheck = check;
  modalRef.result.then((data) => {
    // on close
    if (data == true) {

    }
  }, (reason) => {
    // on dismiss
  });
}
addItems(check, name) {
  const modalRef = this.modalService.open(ItemsComponent, { centered: true });
  modalRef.componentInstance.statusCheck = check;
  modalRef.componentInstance.FormName = name;
  modalRef.componentInstance.contractId = this.contractId ;

  modalRef.result.then((data) => {
    // on close
    if (data == true) {
      this.getAllItems((itemsData) => {
        this.rows2 = itemsData;
        // this.listCount= this.rows.length;
      });
  


    }
  }, (reason) => {
    // on dismiss
  });
}
deleteContractNote(id) {
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

      this.http.delete(`${environment.apiUrl}/api/Contracts/DeleteContractNote/` + id.id)
        .subscribe(
          res => {
            this.response = res;
            if (this.response.success == true) {
              this.toastr.error(GlobalConstants.deleteSuccess, 'Message.');
              this.getAllNotes((NotesData) => {
                this.rows3 = NotesData;
                // this.listCount= this.rows.length;
              });

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
editContractNote(row, check, name) {
  const modalRef = this.modalService.open(ContractNoteComponent, { centered: true });
  modalRef.componentInstance.NoteId = row.id; //just for edit.. to access the needed row
  modalRef.componentInstance.statusCheck = check;
  modalRef.componentInstance.FormName = name;
  modalRef.componentInstance.contractId =this.contractId;

  modalRef.result.then((data) => {
    // on close
    if (data == true) {
      this.getAllNotes((NotesData) => {
        this.rows3 = NotesData;
        // this.listCount= this.rows.length;
      });
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
              this.getAllItems((itemsData) => {
                this.rows2 = itemsData;
                // this.listCount= this.rows.length;
              });

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
editItem(row, check, name) {
  const modalRef = this.modalService.open(ItemsComponent, { centered: true });
  modalRef.componentInstance.itemId = row.id; //just for edit.. to access the needed row
  modalRef.componentInstance.statusCheck = check;
  modalRef.componentInstance.FormName = name;
  modalRef.componentInstance.contractId = this.contractId ;

  modalRef.result.then((data) => {
    // on close
    if (data == true) {
      this.getAllItems((itemsData) => {
        this.rows2 = itemsData;
        // this.listCount= this.rows.length;
      });
  
    }
  }, (reason) => {
    // on dismiss
  });
}
addShipmentTimeline(check) {
  const modalRef = this.modalService.open(DeliveryTimelineComponent, { centered: true });
  modalRef.componentInstance.statusCheck = check;
  modalRef.componentInstance.contractId = this.contractId ;

  modalRef.result.then((data) => {
    // on close
    if (data == true) {
      this.getAllShipmentDates((shipmentData) => {
        this.rows4 = shipmentData;
        // this.listCount= this.rows.length;
      });
  


    }
  }, (reason) => {
    // on dismiss
  });
}
EditShipmentTimeline(check , row) {
  const modalRef = this.modalService.open(DeliveryTimelineComponent, { centered: true });
  modalRef.componentInstance.shipmentId = row.id; //just for edit.. to access the needed row
  modalRef.componentInstance.statusCheck = check;
  modalRef.componentInstance.contractId =this.contractId;

  modalRef.result.then((data) => {
    // on close
    if (data == true) {
      this.getAllShipmentDates((shipmentData) => {
        this.rows4 = shipmentData;
        // this.listCount= this.rows.length;
      });
    }
  }, (reason) => {
    // on dismiss
  });
}
deleteShipmentTimeline(id) {
  Swal.fire({
    title: GlobalConstants.deleteTitle, //'Are you sure?',
    text: GlobalConstants.deleteMessage + ' ' + '"' + id.shipmentNo + '"',
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

      this.http.delete(`${environment.apiUrl}/api/Contracts/DeleteContractShipmentSchedule/` + id.id)
        .subscribe(
          res => {
            this.response = res;
            if (this.response.success == true) {
              this.toastr.error(GlobalConstants.deleteSuccess, 'Message.');
              this.getAllShipmentDates((shipmentData) => {
                this.rows4 = shipmentData;
                // this.listCount= this.rows.length;
              });

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
