import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { GlobalConstants } from 'src/app/Common/global-constants';
import { Dateformater } from 'src/app/shared/dateformater';
import { ServiceService } from 'src/app/shared/service.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { DispatchRegisterComponent } from './active-contract-models/dispatch-register/dispatch-register.component';
import { DeliveryTLComponent } from './active-contract-models/deliveryTL/deliveryTL.component';
import { SaleInvoicePopUpComponent } from './active-contract-models/sale-invoice-pop-up/sale-invoice-pop-up.component';
import { ProductionStatusComponent } from './active-contract-models/production-status/production-status.component';
import {PartiesComponent} from './active-contract-models/parties/parties.component'
import {ProductAndSpecificationComponent} from './active-contract-models/product-and-specification/product-and-specification.component'
import {QuantityAndCostingComponent} from './active-contract-models/quantity-and-costing/quantity-and-costing.component'
import {PaymentDeliveryComponent} from './active-contract-models/payment-delivery/payment-delivery.component'
import { DeliveryTimeLineComponent } from './active-contract-models/delivery-time-line/delivery-time-line.component';
import { RemarksComponent } from './active-contract-models/remarks/remarks.component';
import { EmployeeCommissionComponent } from './active-contract-models/employee-commission/employee-commission.component';
import { CommisionKickbackComponent } from './active-contract-models/commision-kickback/commision-kickback.component';
import { NgxSpinnerService } from 'ngx-spinner';

import { createBuilderStatusReporter } from 'typescript';
import { ContractNoteComponent } from './active-contract-models/contract-note/contract-note.component';

@Component({
  selector: 'app-active-contract-details',
  templateUrl: './active-contract-details.component.html',
  styleUrls: ['./active-contract-details.component.css']
})
export class ActiveContractDetailsComponent implements OnInit {
  dateformater: Dateformater = new Dateformater();
 
  reminderToggle : boolean = false
  rows: any = [];
  rows7: any = [];

  rows1: any = [];
  rows2: any = [{numbr:1}];
  rows3: any = [{numbr:1}];
  rows4: any = [{numbr:1}];
  rows6: any = [{numbr:1}];
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
  saleInvoiceData: any = {};
  response: any;
  ItemCount: number;
  contractCount: number;
  shipmentCount: number;
  ItemFilter: any = [];
  shipmentFilter: any = [];
  noteFilter: any = [];
  deliveryFilter: any = [];
  dispatchFilter: any = [];

  TnaData: any = {};
  TnaFilter: any = {};
  shipmentData: any = {};
  invoiceData:any =[];
  invoiceItemFilter = [];
  invoiceItem = {};
  reminderData = [];
  deliveryTimeLineData = [];
  deliveryCount: number;
  prodPlanData = [];
  dispatchData = [];
  contractKickbackData = [];
  
  // deliveryFilter: any = [];
  deliveryUrl = '/api/YarnContracts/GetAllContractDeliverySchedule'
  shipmentUrl='/api/Contracts/GetAllContractShipmentSchedule/{contractId}';
  dispatchUrl = '/api/YarnContracts/GetAllDispatchRegister'
  // tna data
  rows5: any = [];
  id: any = {};
  tnaId: any = {};
  constructor(
    private router: Router,
    private modalService: NgbModal,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private http: HttpClient,
    private service: ServiceService,
    private toastr: ToastrService,
  ) { }


  ngOnInit(): void {
    // this.userName=localStorage.getItem('loggedInUserName');
    
    this.queryParems = this.route.snapshot.queryParams;
    this.contractId = this.queryParems.id;
   

    this.getContractData();
    this.getAllReminder();
    this.getContractPartiesData();
    this.getContractProductData();
    this.getContractCostingData();
    this.getContractPaymentData();
    this.getContractLOC();
    this.getContractRemarkData();
    this.getContractCommisionData();
    this.getSaleInvoice();
    this.getContractKickBack();
    this.getDispatches();
  
    this.service.fetch((data) => {
      this.rows = data;
      this.deliveryFilter = [...this.rows];

      this.deliveryCount = this.rows.length;
    }, this.deliveryUrl);

    // this.service.fetch((data) => {
    //   this.rows7 = data;
    // }, this.dispatchUrl);

    this.getAllBenificery((empData) => {
      this.rows1 = empData;
      // this.listCount= this.rows.length;
    });

    this.getAllNotes((NotesData) => {
      this.rows3 = NotesData;
      this.noteFilter = [...NotesData];
      // this.listCount= this.rows.length;
    });
    this.getAllShipmentDates((shipmentData) => {
      this.rows4 = shipmentData;
      this.shipmentFilter = [...shipmentData];

    });
    this.getAllInvoiceItems((invoiceItem) => {
      this.rows6 = invoiceItem;
      this.invoiceItemFilter = [...invoiceItem];

    });

  }
  navigateUploadDoc() {
    this.router.navigate(['/FabCot/doc-upload']);
  };
  searchTna(event) {
    const val = event.target.value.toLowerCase();
    const temp = this.TnaFilter.filter(function (d) {
      return (d.tnaItem.toLowerCase().indexOf(val) !== -1 || !val);
    });
    this.rows5 = temp;
  }
  
  searchdelivery(event) {
    const val = event.target.value.toLowerCase();
    const temp = this.deliveryFilter.filter(function (d) {
      return (
      // d.supplierDate.toLowerCase().indexOf(val) !== -1 || 
      // d.buyerDate.toLowerCase().indexOf(val) !== -1 ||
      d.quantity.toLowerCase().indexOf(val) !== -1 ||
      // d.loomTypeId.toLowerCase().indexOf(val) !== -1 ||
      // d.size.toLowerCase().indexOf(val) !== -1 ||
      // d.weight.toLowerCase().indexOf(val) !== -1 || 
      // d.itemQuantity.toLowerCase().indexOf(val) !== -1 ||
      // d.contractRate.toLowerCase().indexOf(val) !== -1 ||
      // d.contractCost.toLowerCase().indexOf(val) !== -1 ||
      // d.commission.toLowerCase().indexOf(val) !== -1 ||
      !val);
    });
    this.rows = temp;
  }
   searchShipmentDates(event) {
    const val = event.target.value.toLowerCase();
    const temp = this.shipmentFilter.filter(function (d) {
      return (
      d.shipmentNo.toLowerCase().indexOf(val) !== -1 ||
      d.buyerDate.toLowerCase().indexOf(val) !== -1 ||
      d.shipmentMode.toLowerCase().indexOf(val) !== -1 ||
      d.supplierDate.toLowerCase().indexOf(val) !== -1 ||
      d.shipmentRemarks.toLowerCase().indexOf(val) !== -1 ||
      !val);
    });
    this.rows4 = temp;
  }

  searchNotes(event) {
    const val = event.target.value.toLowerCase();
    const temp = this.noteFilter.filter(function (d) {
      return (
      d.createdByName.toLowerCase().indexOf(val) !== -1 ||
      d.description.toLowerCase().indexOf(val) !== -1 ||
      d.createdDateTime.toLowerCase().indexOf(val) !== -1 ||
      !val);
    });
    this.rows3 = temp;
  }



  toggle(){
    this.reminderToggle = !this.reminderToggle;

}


  // getAllItems(cb) {

  //   this.http
  //     .get(`${environment.apiUrl}/api/Contracts/GetAllContractItem/`+ this.contractId)
  //     .subscribe(res => {
  //       this.response = res;
        

  //       if (this.response.success == true) {
  //         this.items = this.response.data
  //         this.ItemFilter = [this.items]; 
  //         cb(this.items);
  //       }
  //       else {
  //         this.toastr.error(this.response.message, 'Message.');
  //       }
  //       // this.spinner.hide();
  //     }, err => {
  //       if (err.status == 400) {
  //         this.toastr.error(err.error.message, 'Message.');;
  //       }
       
  //     });
  // }



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
    this.http.get(`${environment.apiUrl}/api/Contracts/GetAllContractSaleInvoice/`+ this.contractId )
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




  deleteSaleInvoice(obj) {
    Swal.fire({
      title: GlobalConstants.deleteTitle, //'Are you sure?',
      text: GlobalConstants.deleteMessage + ' ' + 'Sale Invoice Number:'+'"' + obj.saleInvoiceNo + '"'+'?',
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
        this.http.delete(`${environment.apiUrl}/api/Contracts/DeleteContractSaleInvoice/` + obj.id )
          .subscribe(
            res => {
              this.response = res;
              if (this.response.success == true) {
                this.toastr.error(this.response.message, 'Message.');
                this.getSaleInvoice();
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
  




  approveContract()
  {
    let varr=  {    }
    this.spinner.show();

    this.http.
    put(`${environment.apiUrl}/api/Contracts/ApproveContract/`+this.contractId,varr)
    .subscribe(
      res=> { 
  
        this.response = res;
        if (this.response.success == true){
          this.toastr.success(this.response.message, 'Message.');
          this.getContractData()
  this.spinner.hide();
        
        }
        else {
          this.toastr.error(this.response.message, 'Message.');
  this.spinner.hide();
}

      }, (err: HttpErrorResponse) => {
        const messages = this.service.extractErrorMessagesFromErrorResponse(err);
        this.toastr.error(messages.toString(), 'Message.');
        console.log(messages);
  this.spinner.hide();

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


getDeliveryTimeLine() {
  this.http.get(`${environment.apiUrl}​/api​/YarnContracts​/GetAllContractDeliverySchedule` )
    .subscribe(
      res => {
        this.response = res;
        if (this.response.success == true) {
          this.deliveryTimeLineData = this.response.data;
          

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
getDispatches() {
  this.http.get(`${environment.apiUrl}/api/YarnContracts/GetAllDispatchRegister/`+ this.contractId)
    .subscribe(
      res => {
        this.response = res;
        if (this.response.success == true) {
          this.dispatchData = this.response.data;
          // this.dispatchFilter = [...this.dispatchData]
          // cb(this.dispatchData);
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

getProdPlan() {
  this.http.get(`${environment.apiUrl}​/api/YarnContracts/GetAllContractProductionStatus`)
    .subscribe(
      res => {
        this.response = res;
        if (this.response.success == true) {
          this.prodPlanData = this.response.data;
          

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



searchDispatch(event) {
  const val = event.target.value.toLowerCase();
  const temp = this.dispatchFilter.filter(function (d) {
    return (d.number.toLowerCase().indexOf(val) !== -1 ||   
    !val);
  });
  this.rows = temp;
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
this.spinner.show();
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
  this.spinner.hide();

              });

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

 editParties(row) {
    const modalRef = this.modalService.open(PartiesComponent, { centered: true });
    modalRef.componentInstance.contractId = this.contractId;
    // modalRef.componentInstance.statusCheck = status;
    // modalRef.componentInstance.beneficiaryId = row.id;
  
  
    modalRef.result.then((data) => {
      // on close
      if (data == true) {
  
        this.getContractPartiesData();
      this.getContractData();

    
      }
    }, (reason) => {
      // on dismiss
    });
  }

  editProductAndSpec(row) {
    const modalRef = this.modalService.open(ProductAndSpecificationComponent, { centered: true });
    modalRef.componentInstance.contractId = this.contractId;
    modalRef.result.then((data) => {
      // on close
      if (data == true) {
  
        this.getContractProductData();
        this.getContractData();
      }
    }, (reason) => {
      // on dismiss
    });
  }
  editQuantity(row) {
    const modalRef = this.modalService.open(QuantityAndCostingComponent, { centered: true });
    modalRef.componentInstance.contractId = this.contractId;

    modalRef.result.then((data) => {
      // on close
      if (data == true) {
  
        this.getContractCostingData();
        this.getContractData();
      }
    }, (reason) => {
      // on dismiss
    });
  }
  editPaymentAndDelivery(row) {
    const modalRef = this.modalService.open(PaymentDeliveryComponent, { centered: true });
    modalRef.componentInstance.contractId = this.contractId;
    // modalRef.componentInstance.statusCheck = status;
    // modalRef.componentInstance.beneficiaryId = row.id;
  
  
    modalRef.result.then((data) => {
      // on close
      if (data == true) {
  
        // this.getAllBenificery((empData) => {
          // this.rows1 = empData;
          // this.listCount= this.rows.length;
        // });
        this.getContractData();
        this.getContractPaymentData();
      }
    }, (reason) => {
      // on dismiss
    });
  }
  editDeliveryTimeLine() {
    const modalRef = this.modalService.open(DeliveryTimeLineComponent, { centered: true });
    modalRef.componentInstance.contractId = this.contractId;

    modalRef.result.then((data) => {
      // on close
      if (data == true) {
        this.getContractPaymentData();
        this.getContractData();
      }
    }, (reason) => {
      // on dismiss
    });
  }
  editRemarks(row) {
    const modalRef = this.modalService.open(RemarksComponent, { centered: true });
    modalRef.componentInstance.contractId = this.contractId;
    // modalRef.componentInstance.statusCheck = status;
    // modalRef.componentInstance.beneficiaryId = row.id;
  
  
    modalRef.result.then((data) => {
      // on close
      if (data == true) {
  
        // this.getAllBenificery((empData) => {
          // this.rows1 = empData;
          // this.listCount= this.rows.length;
        // });
      }
    }, (reason) => {
      // on dismiss
    });
  }
  AddEmployeeComm(status) {
    const modalRef = this.modalService.open(EmployeeCommissionComponent, { centered: true });
    modalRef.componentInstance.contractId = this.contractId;
    modalRef.componentInstance.statusCheck = status;
    // modalRef.componentInstance.beneficiaryId = row.id;
  
  
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
  editEmployeeComm(status , row) {
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
  editKickbackComm() {
    const modalRef = this.modalService.open(CommisionKickbackComponent, { centered: true });
    modalRef.componentInstance.contractId = this.contractId;
    // modalRef.componentInstance.statusCheck = status;
    // modalRef.componentInstance.beneficiaryId = row.id;
  
  
    modalRef.result.then((data) => {
      // on close
      if (data == true) {
  
      this.getContractData();
      
      }
    }, (reason) => {
      // on dismiss
    });
  }


  getContractKickBack() {
    this.http.get(`${environment.apiUrl}` + this.contractId)
      .subscribe(
        res => {
          this.response = res;
          if (this.response.success == true) {
            this.contractKickbackData = this.response.data;
            
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



addSaleInvoice() {
  const modalRef = this.modalService.open(SaleInvoicePopUpComponent, { centered: true });
  //modalRef.componentInstance.contractId = this.contractId;
  //modalRef.componentInstance.statusCheck = status;
  modalRef.result.then((data) => {
    // on close
    if (data == true) {
   


    }
  }, (reason) => {
    // on dismiss
  });
}
 

getAllInvoiceItems(cb) {

  this.http
    .get(`${environment.apiUrl}/api/Contracts/GetAllSaleInvoiceItem/`+ this.contractId)
    .subscribe(res => {
      this.response = res;
      

      if (this.response.success == true) {
        this.invoiceItem = this.response.data
        this.invoiceItemFilter = [this.invoiceItem]; 
        cb(this.invoiceItem);
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





deleteInvoiceItem(id) {
  Swal.fire({
    title: GlobalConstants.deleteTitle, //'Are you sure?',
    text: GlobalConstants.deleteMessage + ' ' + '"' + id.invoiceItem + '"',
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

      this.http.delete(`${environment.apiUrl}/api/Contracts/DeleteSaleInvoiceItem/` + id.id)
        .subscribe(
          res => {
            this.response = res;
            if (this.response.success == true) {
              this.toastr.error(GlobalConstants.deleteSuccess, 'Message.');
              this.getSaleInvoice();
              this.getAllInvoiceItems((invoiceItem) => {
                this.rows6 = invoiceItem;
                this.invoiceItemFilter = [...invoiceItem];
  this.spinner.hide();
          
              });


            }
            else {
              this.toastr.error(GlobalConstants.exceptionMessage, 'Message.');
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








addDeliveryTL(check) {
  const modalRef = this.modalService.open(DeliveryTLComponent, { centered: true });
  modalRef.componentInstance.statusCheck = check;

  modalRef.componentInstance.contractId = this.contractId ;

  modalRef.result.then((data) => {
    // on close
    if (data == true) {
      
      this.getContractData();
     this.service.fetch((data=>{
       this.rows = data;
     }) , this.deliveryUrl)
      
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

      this.spinner.show();
      this.http.delete(`${environment.apiUrl}/api/Contracts/DeleteContractNote/` + id.id)
        .subscribe(
          res => {
            this.response = res;
            if (this.response.success == true) {
              this.toastr.error(GlobalConstants.deleteSuccess, 'Message.');
              this.getAllNotes((NotesData) => {
                this.rows3 = NotesData;
                this.noteFilter = [...NotesData];
                // this.listCount= this.rows.length;
              });

              this.spinner.hide();
            }
            else {
              this.toastr.error(GlobalConstants.exceptionMessage, 'Message.');
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

deleteDeliveries(id) {
  Swal.fire({
    title: GlobalConstants.deleteTitle, //'Are you sure?',
    text: GlobalConstants.deleteMessage + ' Delivery Number' +''+'"' + id.id + '"',
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

      this.http.delete(`${environment.apiUrl}/api/YarnContracts/DeleteContractDeliverySchedule/` + id.id )
      .subscribe(
        res => {
          this.response = res;
          if (this.response.success == true) {
            this.toastr.error(GlobalConstants.deleteSuccess, 'Message.');
            this.service.fetch((data) => {
              this.rows = data;
            }, this.deliveryUrl);
  this.spinner.hide();

          }
          else {
            this.toastr.error(GlobalConstants.exceptionMessage, 'Message.');
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
editDeliveries(row, check) {
  const modalRef = this.modalService.open(DeliveryTLComponent, { centered: true });
  modalRef.componentInstance.deliveryId = row.id; //just for edit.. to access the needed row
  modalRef.componentInstance.statusCheck = check;
  modalRef.componentInstance.contractId = this.contractId ;

  modalRef.result.then((data) => {
    // on close
    if (data == true) {
      this.service.fetch((data) => {
        this.rows = data;
      }, this.deliveryUrl);
    }

 

  }, (reason) => {
    // on dismiss
  });
}
addDispatch( check) {
  const modalRef = this.modalService.open(DispatchRegisterComponent, { centered: true });
  modalRef.componentInstance.statusCheck = check;
  modalRef.componentInstance.contractId = this.contractId ;

  modalRef.result.then((data) => {
    // on close
    if (data == true) {
      this.getContractData();
      this.getDispatches();
  
    }
    // this.getContractData();

  }, (reason) => {
    // on dismiss
  });
}
editDispatch( row ,check) {
  const modalRef = this.modalService.open(DispatchRegisterComponent, { centered: true });
  modalRef.componentInstance.statusCheck = check;
  modalRef.componentInstance.dispatchId = row.id ;
  modalRef.componentInstance.contractId = this.contractId ;


  modalRef.result.then((data) => {
    // on close
    if (data == true) {
  
    }
    this.getContractData();
    this.getDispatches();


  }, (reason) => {
    // on dismiss
  });
}

ContractNotes(check) {
  const modalRef = this.modalService.open(ContractNoteComponent, { centered: true });
  modalRef.componentInstance.statusCheck = check;
  // modalRef.componentInstance.FormName = name;
  modalRef.componentInstance.contractId = this.contractId;
  modalRef.result.then((data) => {
    // on close
    if (data == true) {
      this.getAllNotes((NotesData) => {
        this.rows3 = NotesData;
        this.noteFilter = [...NotesData];
        // this.listCount= this.rows.length;
      });
    this.getContractData();

    }
  }, (reason) => {
    // on dismiss
  });
}
editNote(row, check) {
  const modalRef = this.modalService.open(ContractNoteComponent, { centered: true });
  modalRef.componentInstance.NoteId = row.id; //just for edit.. to access the needed row
  modalRef.componentInstance.statusCheck = check;
  // modalRef.componentInstance.FormName = name;
  modalRef.componentInstance.contractId =this.contractId;

  modalRef.result.then((data) => {
    // on close
    if (data == true) {
      this.getAllNotes((NotesData) => {
        this.rows3 = NotesData;
        this.noteFilter = [...NotesData];
        // this.listCount= this.rows.length;
      });
    this.getContractData();

    }
  }, (reason) => {
    // on dismiss
  });
}

addProd() {
  const modalRef = this.modalService.open(ProductionStatusComponent, { centered: true });
  // modalRef.componentInstance.statusCheck = check;
  // modalRef.componentInstance.contractId = this.contractId ;

  modalRef.result.then((data) => {
    // on close
    if (data == true) {
      this.getProdPlan();
  
    }
    // this.getContractData();

  }, (reason) => {
    // on dismiss
  });
}




deleteDispatch(id) {
  Swal.fire({
    title: GlobalConstants.deleteTitle, //'Are you sure?',
    text: GlobalConstants.deleteMessage,
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

      this.http.delete(`${environment.apiUrl}/api/YarnContracts/DeleteDispatchRegister/` + id.id)
        .subscribe(
          res => {
            this.response = res;
            if (this.response.success == true) {
              this.toastr.error(GlobalConstants.deleteSuccess, 'Message.');
              this.getDispatches();
              this.spinner.hide();
            }
            else {
              this.toastr.error(GlobalConstants.exceptionMessage, 'Message.');
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






    
    
      statusOpen()
      { 
        let varr = {
        
          "reason":"Open",
          "contractId": this.contractId,
          "status": "Open"
        }
  this.spinner.show();
        
        this.http.
        put(`${environment.apiUrl}/api/Contracts/UpdateContractStatus`, varr)
        .subscribe(
          res=> { 
      
            this.response = res;
            if (this.response.success == true){
              this.toastr.success(this.response.message, 'Message.');
              this.getContractData();
              this.spinner.hide();


           
            }
            else {
              this.toastr.error('Something went Worng', 'Message.');
  this.spinner.hide();
              
            }
    
          }, err => {
            if (err.status == 400) {
              this.toastr.error('Something went Worng', 'Message.');
  this.spinner.hide();
           
            }
          });
      }
    

      


      AddReminder() {
            this.data.contractUpDate = this.dateformater.toModel(this.data.contractUpDate);
    
            if( this.data.contractUpDate == "undefined-undefined-undefined"){
              this.data.contractUpDate = ""

            }
            if( this.data.contractUpDate == "0-NaN-NaN"){
              this.data.contractUpDate = ""
            }

            let varr = {
              "contractId": this.contractId,
              "contractUpDate": this.data.contractUpDate
            }
  this.spinner.show();
        
            this.http.
              post(`${environment.apiUrl}/api/Contracts/AddContractFollowUp`, varr)
              .subscribe(
                res => {
        
                  this.response = res;
                  if (this.response.success == true) {
                    this.toastr.success(this.response.message, 'Message.');
                    this.getAllReminder();
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


          readyForBill()
          {
            let varr=  {}
  this.spinner.show();
        
            this.http.
            put(`${environment.apiUrl}/api/Contracts/ContractReadyForBill/`+this.contractId,varr)
            .subscribe(
              res=> { 
          
                this.response = res;
                if (this.response.success == true){
                  this.toastr.success(this.response.message, 'Message.');
                  this.router.navigate(['/FabCot/generate-bills']);
  this.spinner.hide();
}
                else {
                  this.toastr.error(this.response.message, 'Message.');
  this.spinner.hide();
}
        
              }, (err: HttpErrorResponse) => {
                const messages = this.service.extractErrorMessagesFromErrorResponse(err);
                this.toastr.error(messages.toString(), 'Message.');
                console.log(messages);
  this.spinner.hide();

              });
          }


          getAllReminder() {
            this.http.get(`${environment.apiUrl}/api/Contracts/GetAllContractFollowUp/` + this.contractId)
              .subscribe(
                res => {
                  this.response = res;

                  if (this.response.success == true) {
                    this.reminderData = this.response.data;
                    
          
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
          
          deleteReminder(objReminder) {
            Swal.fire({
              title: GlobalConstants.deleteTitle, //'Are you sure?',
              text: GlobalConstants.deleteMessage + 'this Reminder' +  '"',
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

                this.http.
                  delete(`${environment.apiUrl}/api/Contracts/DeleteContractFollowUp/`+ objReminder.id )
                  .subscribe(
                    res => {
            
                      this.response = res;
                      if (this.response.success == true) {
                        this.toastr.error(this.response.message, 'Message.');
                    this.getAllReminder();
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
}
