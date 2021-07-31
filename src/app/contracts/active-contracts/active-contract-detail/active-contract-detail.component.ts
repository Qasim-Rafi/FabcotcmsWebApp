import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal, NgbProgressbarConfig } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { GlobalConstants } from 'src/app/Common/global-constants';
import { Dateformater } from 'src/app/shared/dateformater';
import { EnquiryNotesComponent } from 'src/app/shared/MODLES/enquiry-notes/enquiry-notes.component';
import { HistoryContractComponent } from 'src/app/shared/MODLES/history-contract/history-contract.component';
import { StatusComponent } from 'src/app/shared/MODLES/status/status.component';
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
import pdfFonts from "pdfmake/build/vfs_fonts";
import pdfMake from "pdfmake/build/pdfmake";
import {ContractOwnerComponent} from '../../contract-owner/contract-owner.component'
@Component({
  selector: 'app-active-contract-detail',
  templateUrl: './active-contract-detail.component.html',
  styleUrls: ['./active-contract-detail.component.css']
})

export class ActiveContractDetailComponent implements OnInit {
  dateformater: Dateformater = new Dateformater();
 
  reminderToggle : boolean = false
  rows: any = [];
  rows1: any = [];
  rows2: any = [];
  rows3: any = [];
  rows4: any = [];
  rows6: any = [];
  data:any = {};
  items:any = {};
  preview:any = {};

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
  check:any=15;
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
  invoiceItemFilter = [];
  invoiceItem = {};
  reminderData = [];
quantitynmbr : number;
  buyerShipmentDate:any = [];
 pakCurrency:string;
 usdCurrency:string;

  shipmentUrl='/api/Contracts/GetAllContractShipmentSchedule/{contractId}';
  // tna data
  rows5: any = [];
  id: any = {};
  tnaId: any = {};
  
  constructor(
    config: NgbProgressbarConfig,
    private router: Router,
    private modalService: NgbModal,
    private route: ActivatedRoute,
    private http: HttpClient,
    private service: ServiceService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
  ) { config.striped = true;
    config.animated = true;}

  ngOnInit(): void {
    // this.userName=localStorage.getItem('loggedInUserName');
    this.queryParems = this.route.snapshot.queryParams;
    this.contractId = this.queryParems.id;
   
    this.getPreview((data)=>{
      this.preview = data;
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
    this.getSaleInvoice();
    

    this.getContractTnA((Tna)=>{
      this.rows5 = Tna;
      this.TnaFilter = [...Tna];

    });

    this.getAllBenificery((empData) => {
      this.rows1 = empData;
      // this.listCount= this.rows.length;
    });


    // this.getAllItems((itemsData) => {
    //   this.rows2 = itemsData;
    //   this.ItemFilter = [...itemsData];
    // });
this.getAllItems()
    this.getAllNotes((NotesData) => {
      this.rows3 = NotesData;
      this.noteFilter = [...NotesData];
      // this.listCount= this.rows.length;
    });
    this.getAllShipmentDates((shipmentData) => {
      this.rows4 = shipmentData;
      for(let i=0 ; i<this.rows4.length; i++){
           
        this.rows4[i].buyerDate = this.rows4[i].buyerDate.split(' ').splice(1,2);
             
           }
      this.shipmentFilter = [...shipmentData];

    });
    this.getAllInvoiceItems((invoiceItem) => {
      this.rows6 = invoiceItem;
      this.invoiceItemFilter = [...invoiceItem];

    });

  }

  searchTna(event) {
    const val = event.target.value.toLowerCase();
    const temp = this.TnaFilter.filter(function (d) {
      return (d.tnaItem.toLowerCase().indexOf(val) !== -1 || !val);
    });
    this.rows5 = temp;
  }
  
  searchItems(event) {
    const val = event.target.value.toLowerCase();
    const temp = this.ItemFilter.filter(function (d) {
      return (
      d.description.toLowerCase().indexOf(val) !== -1 || 
      // d.construction.toLowerCase().indexOf(val) !== -1 ||
      // d.compositionPercentage.toLowerCase().indexOf(val) !== -1 ||
      // d.loomTypeId.toLowerCase().indexOf(val) !== -1 ||
      // d.size.toLowerCase().indexOf(val) !== -1 ||
      // d.weight.toLowerCase().indexOf(val) !== -1 || 
      // d.itemQuantity.toLowerCase().indexOf(val) !== -1 ||
      // d.contractRate.toLowerCase().indexOf(val) !== -1 ||
      // d.contractCost.toLowerCase().indexOf(val) !== -1 ||
      // d.commission.toLowerCase().indexOf(val) !== -1 ||
      !val);
    });
    this.rows2 = temp;
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


  getAllItems() {

    this.http
      .get(`${environment.apiUrl}/api/Contracts/GetAllContractItem/`+ this.contractId)
      .subscribe(res => {
        this.response = res;
        

        if (this.response.success == true) {
          this.rows2 = this.response.data
          if(this.response.data.compositionPercentage != "null"){
            this.items['compositionPercentage'] = this.response.data.compositionPercentage  + "%" 
          }
          if(this.response.data.compositionPercentage != "null"){
            this.rows2['compositionPercentage'] = this.response.data.compositionPercentage + "%"
          }
     
          for(let i = 0 ; i<this.response.data.length ; i++){

            this.rows2[i].compositionPercentage = this.response.data[i].compositionPercentage + "%"
            if(this.rows2[i].contractUOMUnit == null ){
              this.rows2[i].contractUOMUnit = ''
            }
          
            if(this.response.data[i].contractCurrencyCode == null ){
              this.rows2[i].contractCurrencyCode = ''
            }
            else if(this.rows2[i].contractCurrencyCode == 'PKR'){
             
              this.pakCurrency = "RS"
              this.rows2[i].contractCost  = this.response.data[i].contractCost + "RS"
            }
            else if(this.rows2[i].contractCurrencyCode == 'USD'){
             
              this.usdCurrency = "$"
              this.rows2[i].contractCost  = this.response.data[i].contractCost + "$"
            }
            else if(this.rows2[i].contractCurrencyCode == 'EUR'){
             
              this.rows2[i].contractCost  = this.response.data[i].contractCost + "€"
            }
            else if(this.rows2[i].contractCurrencyCode == 'GBP'){
             
              this.rows2[i].contractCost  = this.response.data[i].contractCost + "£"
            }
          }
          this.ItemFilter = [this.rows2]; 
          // cb(this.items);
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

  getPreview(cb) {

    this.http
      .get(`${environment.apiUrl}/api/Contracts/GetContractPreviewById/`+ this.contractId)
      .subscribe(res => {
        this.response = res;
        

        if (this.response.success == true) {
          this.preview = this.response.data
          cb(this.preview);
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
  


  deleteTnA(id) {
    Swal.fire({
      title: GlobalConstants.deleteTitle, //'Are you sure?',
      text: GlobalConstants.deleteMessage + ' ' + '"' + id.tnaItem + '"',
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
        this.http.delete(`${environment.apiUrl}/api/Contracts/DeleteContractTimeAction/` + id.id)
          .subscribe(
            res => {
              this.response = res;
              if (this.response.success == true) {
                this.toastr.error(GlobalConstants.deleteSuccess, 'Message.');
                this.getContractTnA((Tna) => {
                  this.rows5 = Tna;
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




  approveContract()
  {
    this.spinner.show();
    let varr=  {    }

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
    this.spinner.show();
    this.http.get(`${environment.apiUrl}/api/Contracts/GetContractById/` + this.contractId)
      .subscribe(
        res => {
          this.response = res;
          if (this.response.success == true) {
            this.contractData = this.response.data;
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
  
  
  
PartiesForm() {
  const modalRef = this.modalService.open(PartiesComponent, { centered: true });
  modalRef.componentInstance.contractId = this.contractId;
  modalRef.result.then((data) => {
  
    // on close
    if (data == true) {
      this.getContractPartiesData();
      // this.getContractData();
    }
  }, (reason) => {
    // on dismiss
  });
}

contractOwner() {
  const modalRef = this.modalService.open(ContractOwnerComponent, { centered: true });
  modalRef.componentInstance.contractId = this.contractId;
  modalRef.result.then((data) => {
  
    // on close
    if (data == true) {
      this.getContractData();
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
    // this.getContractData();


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
      // this.getContractData();
      
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
          this.quantitynmbr = this.response.data.quantity;
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
      // this.getContractData();


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
          if(this.response.data.paymentTermDays == 0){
            this.contractPaymentData.paymentTermDays = ""
          }
          if(this.response.data.paymentTermName = "null"){
            this.contractPaymentData.paymentTermName = ""
          }
          // if(this.response.data.paymentTermInfo == null){
          //   this.contractPaymentData.paymentTermInfo = ""
          // }
          
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
      // this.getContractData();


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
        if(this.response.data.buyerSideCommission != 'null'){
          this.contractCommissionData['buyerSideCommission'] = this.response.data.buyerSideCommission + "%"
        }
        if( this.response.data.buyerSideCommission == "0%"){
          this.contractCommissionData['buyerSideCommission'] = " "
        }
        if(this.response.data.sellerSideCommission != 'null'){
          this.contractCommissionData['sellerSideCommission'] = this.response.data.sellerSideCommission + "%"
        }
        if( this.response.data.sellerSideCommission == "0%"){
          this.contractCommissionData['sellerSideCommission'] = " "
        }
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
      // this.getContractData();


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




Remarks() {
  const modalRef = this.modalService.open(RemarksComponent, { centered: true });
  modalRef.componentInstance.contractId = this.contractId;

  modalRef.result.then((data) => {
    // on close
    if (data == true) {
      this.getContractRemarkData();
      // this.getContractData();


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
        if (this.response.success == true ) {
          if(this.response.data != null){
          this.contractLOCdata = this.response.data;

          }
         


          
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
    
      // this.getContractData();
    }

  }, (reason) => {
    // on dismiss
  });
}


addSaleInvoice(status) {
  const modalRef = this.modalService.open(SALEINVOICEComponent, { centered: true });
  modalRef.componentInstance.contractId = this.contractId;
  modalRef.componentInstance.statusCheck = status;
  modalRef.result.then((data) => {
    // on close
    if (data == true) {
      this.getSaleInvoice();
      // this.getContractData();


    }
  }, (reason) => {
    // on dismiss
  });
}



editSaleInvoice(status, obj) {
  const modalRef = this.modalService.open(SALEINVOICEComponent, { centered: true });
  modalRef.componentInstance.contractId = this.contractId;
  modalRef.componentInstance.statusCheck = status;
  modalRef.componentInstance.invoiceId = obj.id;
  modalRef.result.then((data) => {
    // on close
    if (data == true) {
      this.getSaleInvoice();
    // this.getContractData();

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
        this.noteFilter = [...NotesData];
        // this.listCount= this.rows.length;
      });
    // this.getContractData();


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
        this.noteFilter = [...NotesData];
        // this.listCount= this.rows.length;
      });
    // this.getContractData();

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
  // modalRef.componentInstance.id = row.id;
  modalRef.componentInstance.Id = row.id;
  modalRef.componentInstance.tnaId = row.tnaId;


  modalRef.result.then((data) => {
    // on close
    if (data == true) {
      this.getContractTnA((Tna)=>{
        this.rows5 = Tna;
        this.TnaFilter = [...Tna];
  
      });


    }
  }, (reason) => {
    // on dismiss
  });
}
TnaHistory(row) {
  const modalRef = this.modalService.open(TnaLogHistoryComponent, { centered: true });
  modalRef.componentInstance.id = row.id;

  modalRef.result.then((data) => {
    // on close
    if (data == true) {
      this.getContractTnA((Tna)=>{
        this.rows5 = Tna;
        this.TnaFilter = [...Tna];
  
      });


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

showhistorycontract() {
  const modalRef = this.modalService.open(HistoryContractComponent, { centered: true });
  modalRef.componentInstance.contractId = this.contractId;
  modalRef.result.then((data) => {
    // on close
    if (data == true) {
    //   this.getSaleInvoice();
    // // this.getContractData();
    // this.getAllInvoiceItems((invoiceItem) => {
    //   this.rows6 = invoiceItem;
    //   this.invoiceItemFilter = [...invoiceItem];

    // });


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
      this.getSaleInvoice();
    // this.getContractData();
    this.getAllInvoiceItems((invoiceItem) => {
      this.rows6 = invoiceItem;
      this.invoiceItemFilter = [...invoiceItem];

    });


    }
  }, (reason) => {
    // on dismiss
  });
}
EditsaleInvoiceItem(check , obj ) {
  const modalRef = this.modalService.open(SaleInvoiceItemComponent, { centered: true });
  modalRef.componentInstance.contractId = this.contractId;
  modalRef.componentInstance.statusCheck = check;
  modalRef.componentInstance.contractSaleInvoiceId = obj.contractSaleInvoiceId;
  modalRef.componentInstance.invoiceItemId = obj.id;

  modalRef.result.then((data) => {
    // on close
    if (data == true) {
      this.getSaleInvoice();
    // this.getContractData();
    this.getAllInvoiceItems((invoiceItem) => {
      this.rows6 = invoiceItem;
      this.invoiceItemFilter = [...invoiceItem];

    });


    }
  }, (reason) => {
    // on dismiss
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








addItems(check, name) {
  const modalRef = this.modalService.open(ItemsComponent, { centered: true });
  modalRef.componentInstance.statusCheck = check;
  modalRef.componentInstance.FormName = name;
  modalRef.componentInstance.contractId = this.contractId ;

  modalRef.result.then((data) => {
    // on close
    if (data == true) {
      // this.getAllItems((itemsData) => {
      //   this.rows2 = itemsData;
       
      // });
      this.getAllItems();
      // this.getContractData();
  


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
        this.noteFilter = [...NotesData];
        // this.listCount= this.rows.length;
      });
    // this.getContractData();

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

      this.spinner.show();
      this.http.delete(`${environment.apiUrl}/api/Contracts/DeleteContractItem/` + id.id)
        .subscribe(
          res => {
            this.response = res;
            if (this.response.success == true) {
              this.toastr.error(GlobalConstants.deleteSuccess, 'Message.');
              // this.getAllItems((itemsData) => {
              //   this.rows2 = itemsData;
              // });
this.getAllItems();
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
editItem(row, check, name) {
  const modalRef = this.modalService.open(ItemsComponent, { centered: true });
  modalRef.componentInstance.itemId = row.id; //just for edit.. to access the needed row
  modalRef.componentInstance.statusCheck = check;
  modalRef.componentInstance.FormName = name;
  modalRef.componentInstance.contractId = this.contractId ;

  modalRef.result.then((data) => {
    // on close
    if (data == true) {
      // this.getAllItems((itemsData) => {
      //   this.rows2 = itemsData;
      // });
  this.getAllItems();
    }
    this.getContractData();

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
        this.shipmentFilter = [...shipmentData];
  
      });
    // this.getContractData();

  


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
      this.getAllShipmentDates((shipmentData) => {
        this.rows4 = shipmentData;
        this.shipmentFilter = [...shipmentData];
  
      });
    // this.getContractData();

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

      this.spinner.show();
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


deleteContract(){

  Swal.fire({
    title: GlobalConstants.deleteTitle, //'Are you sure?',
    text: GlobalConstants.deleteMessage + this.contractData.buyerName +' '+  'Contract'+ ' '+this.contractData.autoContractNumber,
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
        delete(`${environment.apiUrl}/api/Contracts/DeleteContract/`+ this.queryParems.id )
        .subscribe(
          res => {
  
            this.response = res;
            if (this.response.success == true) {
              this.toastr.error(this.response.message, 'Message.');
              this.router.navigate(['/contract/active-contract']);
             
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
    
    
      statusOpen()
      { 
        this.spinner.show();
        let varr = {
        
          "reason":"Open",
          "contractId": this.contractId,
          "status": "Open"
        }
        
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
        this.spinner.show();
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
            this.spinner.show();
            let varr=  {}
        
            this.http.
            put(`${environment.apiUrl}/api/Contracts/ContractReadyForBill/`+this.contractId,varr)
            .subscribe(
              res=> { 
          
                this.response = res;
                if (this.response.success == true){
                  this.toastr.success(this.response.message, 'Message.');
                  this.router.navigate(['/billing-and-payment/generate-bills']);
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
    
          print() {
            let docDefinition = {
              pageSize: 'A4',
              pageOrientation: 'LETTER',
              pageMargins: [ 15, 10, 10, 0 ],
              info: {
                title: 'Fabcot | Contract'
              },
              content: [
                {
                 
                  table: {
                    headerRows: 1,
                    widths: ['100%'],
                    body: [
                    [{
                      style: 'heading',
                      text: 'FABCOT INTERNATIONAL'
                    }],
                      ]
                   
                  }
        
                },
                    
                {
                  layout:'noBorders',
                  margin: [10 , 30 , 0 , 0],
                  table:{headerRows: 1 , widths:['20%' ],
                body: [
                  [{text:'133 Aurangzeb Block'  , style:'propertyValue'} 
                    ],] }
                },
        
                {
                  layout:'noBorders',
                  margin: [10 , 0 , 0 , 0],
                  table:{headerRows: 1 , widths:['20%'],
                body: [
                  [{text:'New Garden Town'  , style:'propertyValue'}  ],] }
                },
                {
                  margin: [300 , -40 , 0 , 0],
                 
                  table: {
                    headerRows: 1,
                    widths: ['50%','50%'],
                    body: [
                      [{text:'Indent Number' , style: 'tableheader'}, {text:'Indent Date' , style: 'tableheader'}],
                      [ {text:this.contractData['autoContractNumber']  , style:'propertyValue'  }  , {text:this.contractData['createdDateTime'] , style:'propertyValue' }]
                    
                    ]
                  }
                },
                { margin:[300 , 6 , 0 , 0],
                  text:"Commission Payable to Fabcot (Buyer Side):"  , style:'propertyValue2',
                  
                },
                { margin:[500 , -11 , 0 , 0],
                  text:this.contractCommissionData['buyerSideCommission']  , style:'propertyValue3',
                  
                },
                { margin:[300 , 0 , 0 , 0],
                  text:"Commission Payable to Fabcot (Seller Side):"  , style:'propertyValue2',
                  
                },
                { margin:[500 , -11 , 0 , 0],
                  text:this.contractCommissionData['sellerSideCommission']  , style:'propertyValue3',
                  
                },
                {
                  margin: [0 , 17 , 0 , 0],
                 
                  table: {
                    headerRows: 1,
                    widths: ['30%'],
                    body: [
                      [{text:'Supplier ' , style: 'tableheader'}
                    
                    ],
                   [{text:this.contractData['sellerName']   , style:'propertyValue'},
                  ],
                  [{ text:this.preview['sellerBillingAdress']   , style:'propertyValue'}]
                    
                    ]
                  }
                },
            
                {
                  margin: [300 , -55 , 0 , 0],
                 
                  table: {
                    headerRows: 1,
                    widths: ['100%'],
                    body: [
                      [{text:'CUSTOMER' , style: 'tableheader'}],
                      [ {text:this.contractData['buyerName'] , style:'propertyValue'  } ],
                      [{ text:this.preview['buyerBillingAdress']   , style:'propertyValue'}]
                    ] 
                  }
                },
                {
                  margin: [300 , 23 , 0 , 0],
                 
                  table: {
                    headerRows: 1,
                    widths: ['100%'],
                    body: [
                      [{text:'FORWARDED/SHIPPING LINE' , style: 'tableheader'}]
                     
                    
                    ] 
                  }
                },
                {
                  margin:[0,30,0,0],
                  table: {
                    headerRows: 1,
                    widths: ['20%' , '20%' , '20%' , '20%' , '20%'],
                    body: [
                      [{text:'Shipped To' , style: 'tableheader'},
                      {text:'PO Number' , style: 'tableheader'},
                      {text:'Shipped Date' , style: 'tableheader'},
                      {text:'Ship Via' , style: 'tableheader'},
                      {text:'Payment Terms' , style: 'tableheader'}],
                      [ {text:this.contractPartiesData['buyerName'] , style:'propertyValue'   },
                      {text:this.contractPartiesData['poNumber'] , style:'propertyValue'   },
                      {text:this.rows4.map((row=>row.buyerDate[0] +"      ")) , style:'propertyValue'   } ,
                      {text:this.rows4[0].shipmentMode  , style:'propertyValue'   } ,
                      {text:this.contractPaymentData['paymentTermName'] + this.contractPaymentData['paymentTermDays'] + this.contractPaymentData['paymentTermInfo'] , style:'propertyValue'   }   ]
                     
                    
                    ] 
                  }
                },
                {
                  margin:[0,40,0,0],
                  table: {
                    headerRows: 1,
                    widths: ['12%' , '14%','13%' , '11%' , '8%' , '6%' , '10%','10%','9%','8%'],
                    body: [
                      [{text:'Item' , style: 'tableheader2'},
                      {text:'Composition ' , style: 'tableheader2'},
                      {text:'Construction' , style: 'tableheader2'},
                      {text:'Sizes' , style: 'tableheader2'},
                      {text:'GSM/Weight' , style: 'tableheader2'},
                      {text:'Color' , style: 'tableheader2'},
                      {text:'Quantity' , style: 'tableheader2'},
                      {text:'Unit Price' , style: 'tableheader2'},
                      {text:'Amount' , style: 'tableheader2'},
                      {text:'Comm' , style: 'tableheader2'}],
                  
                    ...this.rows2.map((row=>
                      [{text:row.description , style:'propertyValue'}, {text:row.compositionPercentage + row.compositionFebricTypeName+row.compositionAdditionalInfo , style:'propertyValue'} ,
                         {text:row.construction , style:'propertyValue'},{text:row.size , style:'propertyValue'}, {text:row.weight , style:'propertyValue'} , {text:row.colorName , style:'propertyValue'} ,
                         { text:row.itemQuantity + row.itemUOMUnit , style:'propertyValue'} ,
                          {text:row.contractRate+" " + row.contractCurrencyCode+" " + row.contractUOMUnit , style:'propertyValue'} , 
                          {text:row.contractCost, style:'propertyValue'} , {text:row.commission , style:'propertyValue'},
                   
                        ]
                      )),
                  
                   
                    ]

                  }
                },
                {
                 
                  table: {
                    headerRows: 1,
                    widths: ['67%' , '9.5%' , '9%' , '8%' , '7.5%'],
                    body: [
                      [{text:'Total' , style: 'tableheader3'},
                      {text:this.preview['enquiryItemQuantityTotal'] , style: 'tableheader3'},
                      {text:this.preview['unitPriceTotal'], style: 'tableheader3'},
                      {text:this.preview['enquiryItemAmountTotal'] , style: 'tableheader3'},
                      {text:this.preview['enquiryItemCommissionTotal'] , style: 'tableheader3'},]
                     
                    
                    ] 
                  }
                },
                { margin:[20 , 60 , 0 , 0],
                  
                  text:'Terms & Conditions'   , style:'propertyValue4',
                  
                },
                { margin:[20 , 5 , 0 , 0],
                  text:this.contractRemarksData['otherConditionRemarks']   , style:'propertyValue3',
                  
                },
                { margin:[20 , 30 , 0 , 0],
                  text:'For Fabcot International'   , style:'propertyValue4',
                  
                },
              
              ],
              styles: {
                heading: {
                  fillColor: '#f3f3f4',
                  fontSize: 20,
                  bold: true,
                  color: '#4d4b4b',
                  alignment: 'center',
                  margin : 4,
                
                  
                 },
                commonTable:{
                  margin: [0 , 25 , 0 , 0]     
                },
                propertyName:{
                  alignment: 'center',
                   bold:true,
                   fontSize: 10,
                   margin:2
                },
                propertyValue:{
                  alignment: 'center',  
                  fontSize: 9,
                  margin:2
        
                },
                propertyValue2:{
                  alignment: 'left',  
                  fontSize: 10,
                  margin:2,
                  bold:true
        
                },
                propertyValue3:{
                  alignment: 'left',  
                  fontSize: 10,
                  margin:2,
                 
                },
                propertyValue4:{
                  alignment: 'left',  
                  fontSize: 10,
                  margin:2,
                  
                 
                },
                tableheader: {
                  fillColor: '#f3f3f4',
                  fontSize: 10,
                  bold: true,
                  color: '#4d4b4b',
                  alignment: 'center',
                  margin:3
                
                 },
                 tableheader2: {
                  fillColor: '#f3f3f4',
                  fontSize: 9,
                  bold: true,
                  color: '#4d4b4b',
                  alignment: 'left',
                  margin:3
                
                 },
                 tableheader3: {
                  fillColor: '#f3f3f4',
                  fontSize: 9,
                  bold: true,
                  color: '#4d4b4b',
                  alignment: 'center',
                  margin:3
                
                 }
              }
            };
            pdfMake.createPdf(docDefinition).print();
        
          }
          
        
          printB2() {
            let docDefinition = {
              pageSize: 'A4',
              pageOrientation: 'LETTER',
              pageMargins: [ 20, 10, 10, 0 ],
              info: {
                title: 'Fabcot | Contract'
              },
              content: [
                {
                 
                  table: {
                    headerRows: 1,
                    widths: ['100%'],
                    body: [
                    [{
                      style: 'heading',
                      text: 'FABCOT INTERNATIONAL'
                    }],
                      ]
                   
                  }
        
                },
                    
                {
                  layout:'noBorders',
                  margin: [10 , 30 , 0 , 0],
                  table:{headerRows: 1 , widths:['20%' ],
                body: [
                  [{text:'133 Aurangzeb Block'  , style:'propertyValue'} 
                    ],] }
                },
        
                {
                  layout:'noBorders',
                  margin: [10 , 0 , 0 , 0],
                  table:{headerRows: 1 , widths:['20%'],
                body: [
                  [{text:'New Garden Town'  , style:'propertyValue'}  ],] }
                },
                {
                  margin: [300 , -40 , 0 , 0],
                 
                  table: {
                    headerRows: 1,
                    widths: ['50%','50%'],
                    body: [
                      [{text:'Indent Number' , style: 'tableheader'}, {text:'Indent Date' , style: 'tableheader'}],
                      [ {text:this.contractData['autoContractNumber']  , style:'propertyValue'  }  , {text:this.contractData['createdDateTime'] , style:'propertyValue' }]
                    
                    ]
                  }
                },
                { margin:[300 , 6 , 0 , 0],
                  text:"Commission Payable to Fabcot (Buyer Side):"  , style:'propertyValue2',
                  
                },
                { margin:[500 , -11 , 0 , 0],
                  text:this.contractCommissionData['buyerSideCommission']  , style:'propertyValue3',
                  
                },
                { margin:[300 , 0 , 0 , 0],
                  text:"Commission Payable to Fabcot (Seller Side):"  , style:'propertyValue2',
                  
                },
                { margin:[500 , -11 , 0 , 0],
                  text:this.contractCommissionData['sellerSideCommission']  , style:'propertyValue3',
                  
                },
                {
                  margin: [0 , 17 , 0 , 0],
                 
                  table: {
                    headerRows: 1,
                    widths: ['30%'],
                    body: [
                      [{text:'Supplier ' , style: 'tableheader'}
                    
                    ],
                   [{text:this.contractData['sellerName']   , style:'propertyValue'},
                  ],
                  [{ text:this.preview['sellerBillingAdress']   , style:'propertyValue'}]
                    
                    ]
                  }
                },
            
                {
                  margin: [300 , -55 , 0 , 0],
                 
                  table: {
                    headerRows: 1,
                    widths: ['100%'],
                    body: [
                      [{text:'CUSTOMER' , style: 'tableheader'}],
                      [ {text:this.contractData['buyerName'] , style:'propertyValue'  } ],
                      [{ text:this.preview['buyerBillingAdress']   , style:'propertyValue'}]
                    ] 
                  }
                },
                {
                  margin: [300 , 23 , 0 , 0],
                 
                  table: {
                    headerRows: 1,
                    widths: ['100%'],
                    body: [
                      [{text:'FORWARDED/SHIPPING LINE' , style: 'tableheader'}]
                     
                    
                    ] 
                  }
                },
                {
                  margin:[0,30,0,0],
                  table: {
                    headerRows: 1,
                    widths: ['20%' , '20%' , '20%' , '20%' , '20%'],
                    body: [
                      [{text:'Shipped To' , style: 'tableheader'},
                      {text:'PO Number' , style: 'tableheader'},
                      {text:'Shipped Date' , style: 'tableheader'},
                      {text:'Ship Via' , style: 'tableheader'},
                      {text:'Payment Terms' , style: 'tableheader'}],
                      [ {text:this.contractPartiesData['buyerName'] , style:'propertyValue'   },
                      {text:this.contractPartiesData['poNumber'] , style:'propertyValue'   },
                      {text:this.rows4.map((row=>row.buyerDate[0] +"      ")) , style:'propertyValue'   } ,
                      {text:this.rows4[0].shipmentMode  , style:'propertyValue'   } ,
                      {text:this.contractPaymentData['paymentTermName'] + this.contractPaymentData['paymentTermDays'] + this.contractPaymentData['paymentTermInfo'] , style:'propertyValue'   }   ]
                     
                    
                    ] 
                  }
                },
                {
                  margin:[0,40,0,0],
                  table: {
                    headerRows: 1,
                    widths: ['12%' , '14%','13%' , '11%' , '8%' , '6%' , '10%','10%','9%'],
                    body: [
                      [{text:'Item' , style: 'tableheader2'},
                      {text:'Composition ' , style: 'tableheader2'},
                      {text:'Construction' , style: 'tableheader2'},
                      {text:'Sizes' , style: 'tableheader2'},
                      {text:'GSM/Weight' , style: 'tableheader2'},
                      {text:'Color' , style: 'tableheader2'},
                      {text:'Quantity' , style: 'tableheader2'},
                      {text:'Unit Price' , style: 'tableheader2'},
                      {text:'Amount' , style: 'tableheader2'},
                      ],
                  
                    ...this.rows2.map((row=>
                      [{text:row.description , style:'propertyValue'}, {text:row.compositionPercentage + row.compositionFebricTypeName+row.compositionAdditionalInfo , style:'propertyValue'} ,
                         {text:row.construction , style:'propertyValue'},{text:row.size , style:'propertyValue'}, {text:row.weight , style:'propertyValue'} , {text:row.colorName , style:'propertyValue'} ,
                         { text:row.itemQuantity + row.itemUOMUnit , style:'propertyValue'} ,
                          {text:row.contractRate+" " + row.contractCurrencyCode+" " + row.contractUOMUnit , style:'propertyValue'} , 
                          {text:row.contractCost, style:'propertyValue'} 
                   
                        ]
                      )),
                     
                   
                    ]

                  }
                },
                {
                 
                  table: {
                    headerRows: 1,
                    widths: ['67%' , '9.25%' , '9.25%' , '8.25%' ],
                    body: [
                      [{text:'Total' , style: 'tableheader3'},
                      {text:this.preview['enquiryItemQuantityTotal'] , style: 'tableheader3'},
                      {text:'', style: 'tableheader3'},
                      {text:this.preview['enquiryItemAmountTotal'] , style: 'tableheader3'},
                      ]
                     
                    
                    ] 
                  }
                },
                { margin:[20 , 60 , 0 , 0],
                  
                  text:'Terms & Conditions'   , style:'propertyValue4',
                  
                },
                { margin:[20 , 5 , 0 , 0],
                  text:this.contractRemarksData['otherConditionRemarks']   , style:'propertyValue3',
                  
                },
                { margin:[20 , 30 , 0 , 0],
                  text:'For Fabcot International'   , style:'propertyValue4',
                  
                },
              
              ],
              styles: {
                heading: {
                  fillColor: '#f3f3f4',
                  fontSize: 20,
                  bold: true,
                  color: '#4d4b4b',
                  alignment: 'center',
                  margin : 4,
                
                  
                 },
                commonTable:{
                  margin: [0 , 25 , 0 , 0]     
                },
                propertyName:{
                  alignment: 'center',
                   bold:true,
                   fontSize: 10,
                   margin:2
                },
                propertyValue:{
                  alignment: 'center',  
                  fontSize: 9,
                  margin:2
        
                },
                propertyValue2:{
                  alignment: 'left',  
                  fontSize: 10,
                  margin:2,
                  bold:true
        
                },
                propertyValue3:{
                  alignment: 'left',  
                  fontSize: 10,
                  margin:2,
                 
                },
                propertyValue4:{
                  alignment: 'left',  
                  fontSize: 10,
                  margin:2,
                  
                 
                },
                tableheader: {
                  fillColor: '#f3f3f4',
                  fontSize: 10,
                  bold: true,
                  color: '#4d4b4b',
                  alignment: 'center',
                  margin:3
                
                 },
                 tableheader2: {
                  fillColor: '#f3f3f4',
                  fontSize: 9,
                  bold: true,
                  color: '#4d4b4b',
                  alignment: 'left',
                  margin:3
                
                 },
                 tableheader3: {
                  fillColor: '#f3f3f4',
                  fontSize: 9,
                  bold: true,
                  color: '#4d4b4b',
                  alignment: 'center',
                  margin:3
                
                 }
              }
            };
            pdfMake.createPdf(docDefinition).print();
        
          }
                
          printS() {
            let docDefinition = {
              pageSize: 'A4',
              pageOrientation: 'LETTER',
              pageMargins: [ 30, 10, 10, 0 ],
              info: {
                title: 'Fabcot | Contract'
              },
              content: [
                {
                 
                  table: {
                    headerRows: 1,
                    widths: ['100%'],
                    body: [
                    [{
                      style: 'heading',
                      text: 'FABCOT INTERNATIONAL'
                    }],
                      ]
                   
                  }
        
                },
                    
                {
                  layout:'noBorders',
                  margin: [10 , 30 , 0 , 0],
                  table:{headerRows: 1 , widths:['20%' ],
                body: [
                  [{text:'133 Aurangzeb Block'  , style:'propertyValue'} 
                    ],] }
                },
        
                {
                  layout:'noBorders',
                  margin: [10 , 0 , 0 , 0],
                  table:{headerRows: 1 , widths:['20%'],
                body: [
                  [{text:'New Garden Town'  , style:'propertyValue'}  ],] }
                },
                {
                  margin: [300 , -40 , 0 , 0],
                 
                  table: {
                    headerRows: 1,
                    widths: ['50%','50%'],
                    body: [
                      [{text:'Indent Number' , style: 'tableheader'}, {text:'Indent Date' , style: 'tableheader'}],
                      [ {text:this.contractData['autoContractNumber']  , style:'propertyValue'  }  , {text:this.contractData['createdDateTime'] , style:'propertyValue' }]
                    
                    ]
                  }
                },
                { margin:[300 , 6 , 0 , 0],
                  text:"Commission Payable to Fabcot (Buyer Side):"  , style:'propertyValue2',
                  
                },
                { margin:[500 , -11 , 0 , 0],
                  text:this.contractCommissionData['buyerSideCommission']  , style:'propertyValue3',
                  
                },
                { margin:[300 , 0 , 0 , 0],
                  text:"Commission Payable to Fabcot (Seller Side):"  , style:'propertyValue2',
                  
                },
                { margin:[500 , -11 , 0 , 0],
                  text:this.contractCommissionData['sellerSideCommission']  , style:'propertyValue3',
                  
                },
                {
                  margin: [0 , 17 , 0 , 0],
                 
                  table: {
                    headerRows: 1,
                    widths: ['30%'],
                    body: [
                      [{text:'Supplier ' , style: 'tableheader'}
                    
                    ],
                   [{text:this.contractData['sellerName']   , style:'propertyValue'},
                  ],
                  [{ text:this.preview['sellerBillingAdress']   , style:'propertyValue'}]
                    
                    ]
                  }
                },
            
                {
                  margin: [300 , -55 , 0 , 0],
                 
                  table: {
                    headerRows: 1,
                    widths: ['100%'],
                    body: [
                      [{text:'CUSTOMER' , style: 'tableheader'}],
                      [ {text:this.contractData['buyerName'] , style:'propertyValue'  } ],
                      [{ text:this.preview['buyerBillingAdress']   , style:'propertyValue'}]
                    ] 
                  }
                },
                {
                  margin: [300 , 23 , 0 , 0],
                 
                  table: {
                    headerRows: 1,
                    widths: ['100%'],
                    body: [
                      [{text:'FORWARDED/SHIPPING LINE' , style: 'tableheader'}]
                     
                    
                    ] 
                  }
                },
                {
                  margin:[0,30,0,0],
                  table: {
                    headerRows: 1,
                    widths: ['20%' , '20%' , '20%' , '20%' , '20%'],
                    body: [
                      [{text:'Shipped To' , style: 'tableheader'},
                      {text:'PO Number' , style: 'tableheader'},
                      {text:'Shipped Date' , style: 'tableheader'},
                      {text:'Ship Via' , style: 'tableheader'},
                      {text:'Payment Terms' , style: 'tableheader'}],
                      [ {text:this.contractPartiesData['buyerName'] , style:'propertyValue'   },
                      {text:this.contractPartiesData['poNumber'] , style:'propertyValue'   },
                      {text:this.rows4.map((row=>row.buyerDate[0] +"      ")) , style:'propertyValue'   } ,
                      {text:this.rows4[0].shipmentMode  , style:'propertyValue'   } ,
                      {text:this.contractPaymentData['paymentTermName'] + this.contractPaymentData['paymentTermDays'] + this.contractPaymentData['paymentTermInfo'] , style:'propertyValue'   }   ]
                     
                    
                    ] 
                  }
                },
                {
                  margin:[0,40,0,0],
                  table: {
                    headerRows: 1,
                    widths: ['15%'  , '15%' , '10%' , '10%' , '10%','10%','10%','10%'],
                    body: [
                      [{text:'Item' , style: 'tableheader2'},
                  
                      {text:'Sizes' , style: 'tableheader2'},
                      {text:'GSM/Weight' , style: 'tableheader2'},
                      {text:'Color' , style: 'tableheader2'},
                      {text:'Quantity' , style: 'tableheader2'},
                      {text:'Unit Price' , style: 'tableheader2'},
                      {text:'Amount' , style: 'tableheader2'},
                      {text:'Comm' , style: 'tableheader2'}],
                  
                    ...this.rows2.map((row=>
                      [{text:row.description , style:'propertyValue'},{text:row.size , style:'propertyValue'}, {text:row.weight , style:'propertyValue'} , {text:row.colorName , style:'propertyValue'} ,
                         { text:row.itemQuantity + row.itemUOMUnit , style:'propertyValue'} ,
                          {text:row.contractRate+" " + row.contractCurrencyCode+" " + row.contractUOMUnit , style:'propertyValue'} , 
                          {text:row.contractCost, style:'propertyValue'} , {text:row.commission , style:'propertyValue'},
                   
                        ]
                      )),
                     
                   
                    ]

                  }
                },
                {
                 
                  table: {
                    headerRows: 1,
                    widths: ['52.725%' , '9.325%' , '9.475%' , '9.55%' , '9.35%'],
                    body: [
                      [{text:'Total' , style: 'tableheader3'},
                      {text:this.preview['enquiryItemQuantityTotal'] , style: 'tableheader3'},
                      {text:'', style: 'tableheader3'},
                      {text:this.preview['enquiryItemAmountTotal'] , style: 'tableheader3'},
                      {text:this.preview['enquiryItemCommissionTotal'] , style: 'tableheader3'},]
                     
                    
                    ] 
                  }
                },
                { margin:[20 , 60 , 0 , 0],
                  
                  text:'Terms & Conditions'   , style:'propertyValue4',
                  
                },
                { margin:[20 , 5 , 0 , 0],
                  text:this.contractRemarksData['otherConditionRemarks']   , style:'propertyValue3',
                  
                },
                { margin:[20 , 30 , 0 , 0],
                  text:'For Fabcot International'   , style:'propertyValue4',
                  
                },
              
              ],
              styles: {
                heading: {
                  fillColor: '#f3f3f4',
                  fontSize: 20,
                  bold: true,
                  color: '#4d4b4b',
                  alignment: 'center',
                  margin : 4,
                
                  
                 },
                commonTable:{
                  margin: [0 , 25 , 0 , 0]     
                },
                propertyName:{
                  alignment: 'center',
                   bold:true,
                   fontSize: 10,
                   margin:2
                },
                propertyValue:{
                  alignment: 'center',  
                  fontSize: 9,
                  margin:2
        
                },
                propertyValue2:{
                  alignment: 'left',  
                  fontSize: 10,
                  margin:2,
                  bold:true
        
                },
                propertyValue3:{
                  alignment: 'left',  
                  fontSize: 10,
                  margin:2,
                 
                },
                propertyValue4:{
                  alignment: 'left',  
                  fontSize: 10,
                  margin:2,
                  
                 
                },
                tableheader: {
                  fillColor: '#f3f3f4',
                  fontSize: 10,
                  bold: true,
                  color: '#4d4b4b',
                  alignment: 'center',
                  margin:3
                
                 },
                 tableheader2: {
                  fillColor: '#f3f3f4',
                  fontSize: 9,
                  bold: true,
                  color: '#4d4b4b',
                  alignment: 'left',
                  margin:3
                
                 },
                 tableheader3: {
                  fillColor: '#f3f3f4',
                  fontSize: 9,
                  bold: true,
                  color: '#4d4b4b',
                  alignment: 'center',
                  margin:3
                
                 }
              }
            };
            pdfMake.createPdf(docDefinition).print();
        
          }
          
}
