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
import pdfMake from "pdfmake/build/pdfmake";
import { createBuilderStatusReporter } from 'typescript';
import { ContractNoteComponent } from './active-contract-models/contract-note/contract-note.component';
import { AddNewInvComponent } from '../../sale-invoice/add-new-inv/add-new-inv.component';
import { EditIvnoicePopupComponent } from './active-contract-models/edit-ivnoice-popup/edit-ivnoice-popup.component';
import { StatusComponent } from 'src/app/shared/MODLES/status/status.component';
import pdfFonts from "pdfmake/build/vfs_fonts";
import { style } from '@angular/animations';

pdfMake.vfs = pdfFonts.pdfMake.vfs;
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
  saleinvoiceFilter: any = {};
  saleInvoice: any = {};
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
  deliveryData = [];

  contractKickbackData = [];
  saleinvoicecount: number;

  deliveryUrl = '/api/YarnContracts/GetAllContractDeliverySchedule'
  shipmentUrl='/api/Contracts/GetAllContractShipmentSchedule/{contractId}';
  dispatchUrl = '/api/YarnContracts/GetAllDispatchRegister'
  // tna data
  rows5: any = [];
  id: any = {};
  tnaId: any = {};
  contractNmbr : string
  loggedInDepartmentName: string;
  buyerName: string
  sellerName:string
  image : any;
  image2 : any;

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
    this.loggedInDepartmentName=localStorage.getItem('loggedInDepartmentName');
   
    this.http.get('/assets/fabcot.png', { responseType: 'blob' })
    .subscribe(res => {
      const reader = new FileReader();
      reader.onloadend = () => {
        var base64data = reader.result;                
            console.log(base64data);
            this.image2 = base64data;
      }
  
      reader.readAsDataURL(res); 
      console.log(res);
      this.image = res;
     
    });
    this.getContractData();
    this.getAllReminder();
    this.getContractPartiesData();
    this.getContractProductData();
    this.getContractCostingData();
    this.getContractPaymentData();
    this.getContractLOC();
    this.getContractRemarkData();
    this.getContractCommisionData();
    // this.getSaleInvoice();
    // this.getContractKickBack();
    this.getDispatches();
  
    // this.service.fetch((data) => {
    //   this.rows = data;
    //   this.deliveryFilter = [...this.rows];

    //   this.deliveryCount = this.rows.length;
    // }, this.deliveryUrl);
    this.getDeliveries();
    this.fetch((data) => {
      this.saleinvoiceFilter = [...data];

      this.rows = data;
      this.saleinvoicecount = this.rows.length;
    });
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
      d.quantity.toLowerCase().indexOf(val) !== -1 ||
      !val);
    });
    this.deliveryData = temp;
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


  getDeliveries() {

    this.http.get(`${environment.apiUrl}/api/YarnContracts/GetAllContractDeliverySchedule/`+ this.contractId)
      .subscribe(res => {
        this.response = res;
        

        if (this.response.success == true) {
          this.deliveryData = this.response.data
          this.deliveryFilter = [...this.deliveryData]
        }
        else {
          this.toastr.error(this.response.message, 'Message.');
        }
        // this.spinner.hide();
      }, err => {
        if (err.status == 400) {
          this.toastr.error(err.error.message, 'Message.');;
        }
       
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



  addinvoiceForm(check){
    const modalRef = this.modalService.open(SaleInvoicePopUpComponent, { centered: true });
    modalRef.componentInstance.statusCheck = check;
    modalRef.componentInstance.contractId = this.contractId ;
  
          modalRef.result.then((data) => {
         // on close
          if(data ==true){
          //  this.date = this.myDate;
           this.fetch((data) => {
            this.rows = data;
      this.saleinvoiceFilter = [...this.rows];
        
          });
         
        }
       }, (reason) => {
         // on dismiss
       });
  }
  
  fetch(cb) {
      this.spinner.show();
    this.http
    .get(`${environment.apiUrl}/api/YarnContracts/GetAllContractSaleInvoice/`+this.contractId )
    .subscribe(res => {
      this.response = res;
     
    if(this.response.success==true)
    {
    this.saleInvoice =this.response.data;
  
    cb(this.saleInvoice);
   this.spinner.hide(); }
    else{
      this.toastr.error(this.response.message, 'Message.');
    this.spinner.hide();
    }
      // this.spinner.hide();
    }, err => {
      if ( err.status == 400) {
  this.toastr.error(err.error.message, 'Message.');
      }
     this.spinner.hide();
    });
  }
  
  editinvoice(row) {
    const modalRef = this.modalService.open(AddNewInvComponent, { centered: true });
    modalRef.componentInstance.invoiceId = row.id;
    modalRef.result.then((data) => {
      // on close
      if (data == true) {
       this.data = data;
  
      }
    }, (reason) => {
      // on dismiss
    });
  }
  
  
  
  deleteinvoice(row) {
    Swal.fire({
      title: GlobalConstants.deleteTitle, //'Are you sure?',
      text: GlobalConstants.deleteMessage + ' ' + '"' + row.autoContractNumber + '"',
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
  
        this.http.delete(`${environment.apiUrl}/api/YarnContracts/DeleteContractSaleInvoice/` + row.id)
          .subscribe(
            res => {
              this.response = res;
              if (this.response.success == true) {
                this.toastr.error(this.response.message, 'Message.');
                // this.getAllEnquiryItems();
                this.fetch((data) => {
                  this.rows = data;
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
            this.buyerName = this.contractData.buyerName
             this.contractNmbr = this.contractData.autoContractNumber
             this.sellerName = this.contractData.sellerName
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
      this.dispatchFilter = [...this.dispatchData];

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
  this.http.get(`${environment.apiUrl}/api/YarnContracts/GetAllContractProductionStatus`)
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
          localStorage.setItem('rate',this.response.data.quantity);
          
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
  this.http.get(`${environment.apiUrl}/api/Contracts/GetContractCommissionKickBackById/` + this.contractId)
  .subscribe(
    res => {
      this.response = res;
      if (this.response.success == true) {
        // this.response.data ==null? '':this.response.data;
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
  this.dispatchData = temp;
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
  
        this.getContractRemarkData();

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
this.getContractCommisionData();      }
    }, (reason) => {
      // on dismiss
    });
  }


  // getContractKickBack() {
  //   this.http.get(`${environment.apiUrl}/api/Contracts/GetContractCommissionKickBackById/` + this.contractId)
  //     .subscribe(
  //       res => {
  //         this.response = res;
  //         if (this.response.success == true) {
  //           this.contractKickbackData = this.response.data;
            
  //         }
  //         else {
  //           this.toastr.error(this.response.message, 'Message.');
  //         }
  
  //       }, err => {
  //         if (err.status == 400) {
  //           this.toastr.error(this.response.message, 'Message.');
  //         }
  //       });
  // }
  



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















addDeliveryTL(check) {
  const modalRef = this.modalService.open(DeliveryTLComponent, { centered: true });
  modalRef.componentInstance.statusCheck = check;

  modalRef.componentInstance.contractId = this.contractId ;

  modalRef.result.then((data) => {
    // on close
    if (data == true) {
      
      this.getContractData();
    //  this.service.fetch((data=>{
    //    this.rows = data;
    //  }) , this.deliveryUrl)
    this.getDeliveries();
      
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
            this.getDeliveries();
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
      // this.service.fetch((data) => {
      //   this.rows = data;
      // }, this.deliveryUrl);
      this.getContractData();
      this.getDeliveries();
    }

 

  }, (reason) => {
    // on dismiss
  });
}
addDispatch( check) {
  const modalRef = this.modalService.open(DispatchRegisterComponent, { centered: true });
  modalRef.componentInstance.statusCheck = check;
  modalRef.componentInstance.contractId = this.contractId ;
  modalRef.componentInstance.buyerName = this.buyerName ;
  modalRef.componentInstance.sellerName = this.sellerName ;
  modalRef.componentInstance.contractNmbr = this.contractNmbr ;




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
    
      statusform(status,action,component) {
        const modalRef = this.modalService.open(StatusComponent, { centered: true });
        // modalRef.componentInstance.parentBuyerId = popup.id;
        modalRef.componentInstance.ContractId = this.contractId;
        modalRef.componentInstance.statusCheck = status;
        modalRef.componentInstance.action = action;
        modalRef.componentInstance.component = component;
        modalRef.result.then((data) => {
          // on close
          if (data == true) {
          
            this.getContractData();
    
          }
        }, (reason) => {
          // on dismiss
        });
      }
      


      AddReminder() {
            // this.data.contractUpDate = this.dateformater.toModel(this.data.contractUpDate);
    
            // if( this.data.contractUpDate == "undefined-undefined-undefined"){
            //   this.data.contractUpDate = ""

            // }
            // if( this.data.contractUpDate == "0-NaN-NaN"){
            //   this.data.contractUpDate = ""
            // }

            let varr = {
              "contractId": this.contractId,
              "contractUpDate": this.dateformater.toModel(this.data.contractUpDate)
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
                  this.router.navigate(['/yarn-billing-and-payment/generate-bills']);
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



          editpopup(row) {
            const modalRef = this.modalService.open(EditIvnoicePopupComponent , { centered: true });
            modalRef.componentInstance.bill_id = row.billPaymentId;
        
            modalRef.result.then((p) => {
              // on close
              // this.fetch((data) => {
              //   this.rows = data;
            
              // });
              
              if (p !=null)
               {
                 p.branch.name
                // this.date = this.myDate;
                // this.getBuyers();
        
              }
            }, (reason) => {
              // on dismiss
            });
          }
getImage(){
  this.http.get('/assets/fabcot.png', { responseType: 'blob' })
  .subscribe(res => {
    const reader = new FileReader();
    reader.onloadend = () => {
      var base64data = reader.result;                
          console.log(base64data);
    }

    reader.readAsDataURL(res); 
    console.log(res);
    return res;
  });
  
}

          print(){
             
         
            let docDefinition = {
              pageSize: 'A4',
              pageMargins: [ 30, 20, 40, 20 ],
              pageOrientation: 'letter',
                
                    info: {
                      title: 'Contract Buyer'
                    },
                 
                    content: [
                      // {
                      //   layout:'noBorders',
                      //   margin: [10 , 0 , 0 , 0],
                      //   table:{headerRows: 1 , widths:['40%'],
                      // body: [
                      //   [{text:'FABCOT' , style:'logo'} ],] }
                      // },
                      {
                        "image" : this.image2,
                       fit : [130 , 130]
                    
                      },
                      {
                        layout:'noBorders',
                        margin: [290 , -20 , 0 , 0],
                        table:{headerRows: 1 , widths:['30%' , '90%'],
                      body: [
                        [{text:'Contract No:'  , style:'heading'} , {text: this.contractData['autoContractNumber'] , style:'heading2'}],] }
                      },
                      {
                        layout:'noBorders',
                        margin: [290 , 0 , 0 , 0],
                        table:{headerRows: 1 , widths:['40%' , '80%'],
                      body: [
                        [{text:'Contract Date:'  , style:'heading'} , {text: this.contractData['createdDateTime'] , style:'heading2'}],] }
                      },
                      {
                        layout:'noBorders',
                        margin: [290 , 0 , 0 , 0],
                        table:{headerRows: 1 , widths:['40%' , '80%'],
                      body: [
                        [{text:'Purchase No:'  , style:'heading'} , {text: this.contractPartiesData['poNumber'] , style:'heading2'}],] }
                      },
                      {
                        layout:'noBorders',
                        margin: [10 , 10 , 0 , 0],
                        table:{headerRows: 1 , widths:['10%' , '60%'],
                      body: [
                        [{text:'Attn:'  , style:'heading'} , {text: this.contractPartiesData['buyerPOCName'] , margin:[-20,0,0,0] , style:'heading2'}]] }
                      },
                      {
                        layout:'noBorders',
                        margin: [10 , 0 , 0 , 0],
                        table:{headerRows: 1 , widths:['100%'],
                      body: [
                        [{text:' We are please to confirm here the booking as per following term and conditions.' , style:'heading2'}  ],] }
                      },
                      {
                        layout:'noBorders',
                        margin: [70 , 25 , 0 , 0],
                        table:{headerRows: 1 , widths:['20%' , '80%'],
                      body: [
                        [{text:'Buyer Name:'  , style:'heading'} , {text: this.contractData['buyerName'] , style:'heading2'}],] }
                      },
                      {
                        layout:'noBorders',
                        margin: [70 , 7 , 0 , 0],
                        table:{headerRows: 1 , widths:['20%' , '80%'],
                      body: [
                        [{text:'Supplier Name:'  , style:'heading'} , {text: this.contractPartiesData['sellerName'] , style:'heading2'}],] }
                      },
                      {
                        layout:'noBorders',
                        margin: [70 , 7 , 0 , 0],
                        table:{headerRows: 1 , widths:['20%' , '80%'],
                      body: [
                        [{text:'Description:'  , style:'heading'} , {text: this.contractProductData['articleName'] , style:'heading2'}],] }
                      },
                      {

                        layout:'noBorders',
                        margin: [70 , 7 , 0 , 0],
                        table:{headerRows: 1 , widths:['20%' , '80%'],
                      body: [
                        [{text:'Packing:'  , style:'heading'} , {text: this.contractPaymentData['packingName'] , style:'heading2'}],] }
                      },
                      {
                        layout:'noBorders',
                        margin: [70 , 7 , 0 , 0],
                        table:{headerRows: 1 , widths:['20%' , '40%' , '10%'],
                      body: [
                        [{text:'Quantity:'  , style:'heading'} , {text: this.contractCostingData['quantity'] , style:'heading2' , margin:[0,0,0,0]}, {text: this.contractCostingData['quantityUOMName'] , margin:[-120,0,0,0] , style:'heading2'}],] }
                      },
                      {
                        layout:'noBorders',
                        margin: [70 , 7 , 0 , 0],
                        table:{headerRows: 1 , widths:['20%' , '40%' , '10%'],
                      body: [
                        [{text:'Rate:'  , style:'heading'} , {text: this.contractCostingData['rate' ] , style:'heading2' , margin:[0,0,0,0]} , {text: this.contractCostingData['rateUOMName'] , margin:[-120,0,0,0] , style:'heading2'}],] }
                      },
                      {
                        layout:'noBorders',
                        margin: [70 , 7 , 0 , 0],
                        table:{headerRows: 1 , widths:['20%' , '80%'],
                      body: [
                        [{text:'Payment Term:'  , style:'heading'} , {text: this.contractPaymentData['sellerPaymentTermName'] , style:'heading2'}],] }
                      },
                      {
                        layout:'noBorders',
                        margin: [70 , 7 , 0 , 0],
                        table:{headerRows: 1 , widths:['20%' , '80%'],
                      body: [
                        [{text:'Delivery Term:'  , style:'heading'} , {text: this.contractPaymentData['priceTermName'] , style:'heading2'}],] }
                      },
                      {
                        layout:'noBorders',
                        margin: [70 , 7 , 0 , 0],
                        table:{headerRows: 1 , widths:['20%' , '80%'],
                      body: [
                        [{text:'Deliveries Date:'  , style:'heading'} , {text: this.contractPaymentData['buyerDeliveryDate'] , style:'heading2'}],] }
                      },
                      {
                        layout:'noBorders',
                        margin: [70 , 7 , 0 , 0],
                        table:{headerRows: 1 , widths:['20%' , '80%'],
                      body: [
                        [{text:'Remarks:'  , style:'heading'} , {text: this.contractRemarksData['buyerRemarks'] , style:'heading2'}],] }
                      },
                      {
                        layout:'noBorders',
                        margin: [70 , 7 , 0 , 0],
                        table:{headerRows: 1 , widths:['20%' , '50%'],
                      body: [
                        [{text:'Other Conditions:' , style:'heading'} , {text: this.contractRemarksData['otherConditionRemarks'] , style:'heading2'}],] }
                      },
                      {
                        layout:'noBorders',
                        margin: [20 , 25 , 0 , 0],
                        table:{headerRows: 1 , widths:['30%'],
                      body: [
                        [{text:'Thanks And Regards:'  , style:'heading'}],] }
                      },
                      {
                        layout:'noBorders',
                        margin: [20 , 25 , 0 , 0],
                        table:{headerRows: 1 , widths:['70%'],
                      body: [
                        [{text:'For FabCot International Enterprises'  , style:'heading'}],] }
                      },
                      {
                        layout:'noBorders',
                        margin: [20 , 220 , 0 , 0],
                        table:{headerRows: 1 , widths:[ '100%'],
                      body: [
                        [ {text:'NOTE: This is a system generated Contract and does not require any signature.'  , style:'tableheader' }],] }
                      },
                    ],
                    styles:{
                     heading:{fontSize: 11,
                      bold: true,color: '#4d4b4b' },
                      heading2:{fontSize: 11  , color:'#4d4b4b'
                        },
                        tableheader: {
                          fillColor: '#f3f3f4',
                          fontSize: 10,
                          bold: true,
                          color: '#4d4b4b',
                         alignment:'center',
                          margin:8
                        
                         }
                    },
                    
          
            };
            pdfMake.createPdf(docDefinition).print();
          
          }


          printSeller(){
            let docDefinition = {
              pageSize: 'A4',
              pageMargins: [ 30, 20, 40, 20 ],
              pageOrientation: 'letter',
                
                    info: {
                      title: 'Contract Seller'
                    },
                 
                    content: [
                      // {
                      //   layout:'noBorders',
                      //   margin: [10 , 0 , 0 , 0],
                      //   table:{headerRows: 1 , widths:['40%'],
                      // body: [
                      //   [{text:'FABCOT' , style:'logo'} ],] }
                      // },
                      {
                        "image" : this.image2,
                       fit : [130 , 130]
                    
                      },
                      {
                        layout:'noBorders',
                        margin: [290 , -20 , 0 , 0],
                        table:{headerRows: 1 , widths:['30%' , '90%'],
                      body: [
                        [{text:'Contract No:'  , style:'heading'} , {text: this.contractData['autoContractNumber'] , style:'heading2'}],] }
                      },
                      {
                        layout:'noBorders',
                        margin: [290 , 0 , 0 , 0],
                        table:{headerRows: 1 , widths:['40%' , '80%'],
                      body: [
                        [{text:'Contract Date:'  , style:'heading'} , {text: this.contractData['createdDateTime'] , style:'heading2'}],] }
                      },
                      {
                        layout:'noBorders',
                        margin: [290 , 0 , 0 , 0],
                        table:{headerRows: 1 , widths:['40%' , '80%'],
                      body: [
                        [{text:'Purchase No:'  , style:'heading'} , {text: this.contractPartiesData['poNumber'] , style:'heading2'}],] }
                      },
                      {
                        layout:'noBorders',
                        margin: [10 , 10 , 0 , 0],
                        table:{headerRows: 1 , widths:['10%' , '60%'],
                      body: [
                        [{text:'Attn:'  , style:'heading'} , {text: this.contractPartiesData['sellerPOCName'] , margin:[-20,0,0,0] , style:'heading2'}]] }
                      },
                      {
                        layout:'noBorders',
                        margin: [10 , 0 , 0 , 0],
                        table:{headerRows: 1 , widths:['100%'],
                      body: [
                        [{text:' We are please to confirm here the booking as per following term and conditions.' , style:'heading2'}  ],] }
                      },
                     
                      {
                        layout:'noBorders',
                        margin: [70 , 25 , 0 , 0],
                        table:{headerRows: 1 , widths:['20%' , '80%'],
                      body: [
                        [{text:'Supplier Name:'  , style:'heading'} , {text: this.contractPartiesData['sellerName'] , style:'heading2'}],] }
                      },
                      {
                        layout:'noBorders',
                        margin: [70 , 7 , 0 , 0],
                        table:{headerRows: 1 , widths:['20%' , '80%'],
                      body: [
                        [{text:'Buyer Name:'  , style:'heading'} , {text: this.contractData['buyerName'] , style:'heading2'}],] }
                      },
                      {
                        layout:'noBorders',
                        margin: [70 , 7 , 0 , 0],
                        table:{headerRows: 1 , widths:['20%' , '80%'],
                      body: [
                        [{text:'Description:'  , style:'heading'} , {text: this.contractProductData['articleName'] , style:'heading2'}],] }
                      },
                      {

                        layout:'noBorders',
                        margin: [70 , 7 , 0 , 0],
                        table:{headerRows: 1 , widths:['20%' , '80%'],
                      body: [
                        [{text:'Packing:'  , style:'heading'} , {text: this.contractPaymentData['packingName'] , style:'heading2'}],] }
                      },
                      {
                        layout:'noBorders',
                        margin: [70 , 7 , 0 , 0],
                        table:{headerRows: 1 , widths:['20%' , '40%' , '10%'],
                      body: [
                        [{text:'Quantity:'  , style:'heading'} , {text: this.contractCostingData['quantity'] , style:'heading2' , margin:[0,0,0,0]}, {text: this.contractCostingData['quantityUOMName'] , margin:[-120,0,0,0] , style:'heading2'}],] }
                      },
                      {
                        layout:'noBorders',
                        margin: [70 , 7 , 0 , 0],
                        table:{headerRows: 1 , widths:['20%' , '40%' , '10%'],
                      body: [
                        [{text:'Rate:'  , style:'heading'} , {text: this.contractCostingData['rate' ] , style:'heading2' , margin:[0,0,0,0]} , {text: this.contractCostingData['rateUOMName'] , margin:[-120,0,0,0] , style:'heading2'}],] }
                      },
                      {
                        layout:'noBorders',
                        margin: [70 , 7 , 0 , 0],
                        table:{headerRows: 1 , widths:['20%' , '80%'],
                      body: [
                        [{text:'Payment Term:'  , style:'heading'} , {text: this.contractPaymentData['sellerPaymentTermName'] , style:'heading2'}],] }
                      },
                      {
                        layout:'noBorders',
                        margin: [70 , 7 , 0 , 0],
                        table:{headerRows: 1 , widths:['20%' , '80%'],
                      body: [
                        [{text:'Delivery Term:'  , style:'heading'} , {text: this.contractPaymentData['priceTermName'] , style:'heading2'}],] }
                      },
                      {
                        layout:'noBorders',
                        margin: [70 , 7 , 0 , 0],
                        table:{headerRows: 1 , widths:['20%' , '80%'],
                      body: [
                        [{text:'Deliveries Date:'  , style:'heading'} , {text: this.contractPaymentData['buyerDeliveryDate'] , style:'heading2'}],] }
                      },
                      {
                        layout:'noBorders',
                        margin: [70 , 7 , 0 , 0],
                        table:{headerRows: 1 , widths:['20%' , '80%'],
                      body: [
                        [{text:'Remarks:'  , style:'heading'} , {text: this.contractRemarksData['buyerRemarks'] , style:'heading2'}],] }
                      },
                      {
                        layout:'noBorders',
                        margin: [70 , 7 , 0 , 0],
                        table:{headerRows: 1 , widths:['20%' , '50%'],
                      body: [
                        [{text:'Other Conditions:' , style:'heading'} , {text: this.contractRemarksData['otherConditionRemarks'] , style:'heading2'}],] }
                      },
                      {
                        layout:'noBorders',
                        margin: [20 , 25 , 0 , 0],
                        table:{headerRows: 1 , widths:['30%'],
                      body: [
                        [{text:'Thanks And Regards:'  , style:'heading'}],] }
                      },
                      {
                        layout:'noBorders',
                        margin: [20 , 25 , 0 , 0],
                        table:{headerRows: 1 , widths:['70%'],
                      body: [
                        [{text:'For FabCot International Enterprises'  , style:'heading'}],] }
                      },
                      {
                        layout:'noBorders',
                        margin: [20 , 220 , 0 , 0],
                        table:{headerRows: 1 , widths:[ '100%'],
                      body: [
                        [ {text:'NOTE: This is a system generated Contract and does not require any signature.'  , style:'tableheader' }],] }
                      },
                    ],
                    styles:{
                     heading:{fontSize: 11,
                      bold: true,color: '#4d4b4b' },
                      heading2:{fontSize: 11  , color:'#4d4b4b'
                        },
                        tableheader: {
                          fillColor: '#f3f3f4',
                          fontSize: 10,
                          bold: true,
                          color: '#4d4b4b',
                         alignment:'center',
                          margin:8
                        
                         }
                    },
                    
          
            };
            pdfMake.createPdf(docDefinition).print();
          }




}
