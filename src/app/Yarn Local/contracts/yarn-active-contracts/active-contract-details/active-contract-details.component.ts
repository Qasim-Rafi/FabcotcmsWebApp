import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, HostListener, OnInit } from '@angular/core';
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
import { CreditComponent } from './active-contract-models/sale-invoice-pop-up/credit/credit.component';
import { DebitComponent } from './active-contract-models/sale-invoice-pop-up/debit/debit.component';
import {ContractOwnerComponent} from 'src/app/contracts/contract-owner/contract-owner.component'
import { LCInfoComponent } from './active-contract-models/lcinfo/lcinfo.component';
import { DocumentUploadPopUpComponent } from './active-contract-models/document-upload-pop-up/document-upload-pop-up.component';
import { ArticleRevisePopupComponent } from 'src/app/shared/MODLES/article-revise-popup/article-revise-popup.component';
import {NgbProgressbarConfig} from '@ng-bootstrap/ng-bootstrap';
import { ExternalAgentCommissionArticleWiseComponent } from './active-contract-models/external-agent-commission-article-wise/external-agent-commission-article-wise.component';


pdfMake.vfs = pdfFonts.pdfMake.vfs;
@Component({
  selector: 'app-active-contract-details',
  templateUrl: './active-contract-details.component.html',
  styleUrls: ['./active-contract-details.component.css']
})
export class ActiveContractDetailsComponent implements OnInit {
  isnotEditAble:boolean=false;
  ShowRevised:string;
  dateformater: Dateformater = new Dateformater();
 costingDataWithGstFL: any;
  reminderToggle : boolean = false
  rows: any = [];
  dataMC:any={};
  currency: any = [];
  rows7: any = [];
printData : any = {}
  rows1: any = [];
  rows2: any = [{numbr:1}];
  rows3: any = [];
  rows4: any = [{numbr:1}];
  rows6: any = [{numbr:1}];
  data:any = {};
  items:any = {};
  empData:any = {};
  shipment:any = {};
  contractNote:any = {};
  columns: any = [];
  queryParems: any = {};
  invoiceId: any = {};
  documentId: any = {};
  contractId: any = {};
  contractData: any = {};
  DocumentData: any = {};
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
  check:any=15;
  ItemCount: number;
  contractCount: number;
  shipmentCount: number;
  ItemFilter: any = [];
  shipmentFilter: any = [];
  noteFilter: any = [];
  deliveryFilter: any = [];
  dispatchFilter: any = [];
  TnaData: any = {};
  article: any = [];
  articleArray : any = [];
  // check="75";
  TnaFilter: any = {};
  shipmentData: any = {};
  invoiceData:any =[];
  invoiceItemFilter = [];
  invoiceItem = {};
  reminderData = [];
  creditdebit = [];
  deliveryTimeLineData = [];
  Documents = [];
  deliveryCount: number;
  prodPlanData = [];
  dispatchData = [];
  deliveryData = [];
  block:any=[];
  commissionBill:any = [];
lengthcheckfordevelery:any
  saleInvoiceNo:string
  contractKickbackData = [];
  saleinvoicecount: number;
  saleInvoiceDate: any;
  saleInvoiceId: any;
  revisedContractData:any={};
  deliveryUrl = '/api/YarnContracts/GetAllContractDeliverySchedule'
  shipmentUrl='/api/Contracts/GetAllContractShipmentSchedule/{contractId}';
  dispatchUrl = '/api/YarnContracts/GetAllDispatchRegister'
  // tna data
  rows5: any = [];
  rowsDoc:any=[];
  id: any = {};
  tnaId: any = {};
  agent: any = {};
max:any;
max1:any;
  contractNmbr : string
  loggedInDepartmentName: string;
  buyerName: string
  sellerName:string
  image : any;
  image2 : any;
  Article: any = [];
 data5: any = {};
 newArticle: any;
 contractArticles : any = {};
 percent:string;
 firstTime:any;
 fabCot:any;
 isdeletedArticla:boolean=false;
 isRevisedStart:boolean =false;
 thereisrevisedData:boolean=false;
 yarnExportInvoiceReports:any={};
 revisedindexData:any;
 value : any;
 value2 : any;
 uom : any;
 ishide:boolean =false;
quantity : any;
comm = "Commission:";
revised : any;
checkR: any;
billCount : any;
isShown: boolean = false
isShownMC: boolean = false
screenHeight:any;
screenWidth:any;
saleQuantityT:any;
@HostListener('window:resize', ['$event'])
errorMessage: string = ''; 
onResize(event?) {
   this.screenHeight = window.innerHeight;
   this.screenWidth = window.innerWidth;
}
  constructor(
    config: NgbProgressbarConfig,
    private router: Router,
    private modalService: NgbModal,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private http: HttpClient,
    private service: ServiceService,
    private toastr: ToastrService,
  ) { 
    config.striped = true;
    config.animated = true;
    this.router.routeReuseStrategy.shouldReuseRoute = () => false; 
    let body = document.getElementsByTagName('body')[0];
    body.classList.add('sidebar-collapse'); 
    let footer = document.getElementsByTagName('footer')[0];
    footer.classList.add('d-none'); 
    
    let zoom = document.getElementById('zoom').style.minHeight =this.screenWidth;
  }


  ngOnInit(): void {

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
   this.GetArticleDropdown("start");
 
  this.getAllDocuments();

    this.getContractData();
    this.getAllReminder();

    this.getContractPartiesData();

    this.getContractProductData();
    
    this.getContractCostingData();
    this.getContractPaymentData();

    if(this.loggedInDepartmentName == 'Yarn Export' || this.loggedInDepartmentName == 'Yarn Export Bangladesh' || this.loggedInDepartmentName == 'Yarn Import' || this.loggedInDepartmentName == 'Comber noil' || this.loggedInDepartmentName == 'Synthetic Fibers'){
    this.getContractLOC();
    this.GetCurrencyDropdown();
    }
    
    this.getContractRemarkData();
    this.getContractCommisionData();
 
    this.getDispatches();
  this.getContractLOC();
    this.getDeliveries();
    this.getAllInvoices();
    
    if(this.saleInvoice.length>1){
          this.check=this.check+15;
        }
  

  this.getAllBenificery();
    if(this.loggedInDepartmentName == 'Yarn Export' || this.loggedInDepartmentName == 'Yarn Export Bangladesh' || this.loggedInDepartmentName == 'Yarn Import' || this.loggedInDepartmentName == 'Comber noil' || this.loggedInDepartmentName == 'Synthetic Fibers'){

    this.getAllNotes((NotesData) => {
      this.rows3 = NotesData;
      this.noteFilter = [...NotesData];
      // this.listCount= this.rows.length;
    });
  }
    this.getAllShipmentDates((shipmentData) => {
      this.rows4 = shipmentData;
      this.shipmentFilter = [...shipmentData];
     
    });
  

  }

  goTo(){
    this.router.navigate(['/FabCot/active-contract-details?id='+ this.contractId]);
  }
  signchange(event){
if(event == 6){
  this.ishide =true;
}
else{
  this.ishide =false
}

  }
  GetCurrencyDropdown() {
    this.service.getCurrencyType().subscribe(res => {
      this.response = res;
      if (this.response.success == true) {
        this.currency = this.response.data;
      }
      else {
        this.toastr.error(this.response.message, 'Message.');
      }
    })
  }
  addArticle() {
    this.contractArticles.push({ id: this.contractArticles.length });
    let last = this.contractArticles[this.contractArticles.length-1];
    let filterlist = this.contractArticles.findIndex(x => x.id ==last.id );
    if (filterlist !== -1) {
      this.contractArticles[filterlist].isAddedMore = true;
      this.contractArticles[filterlist].isDeleted = false;
      
    }
 
  }
  GetBlockLookup(blockId) {
    if(blockId != null){
    this.service.GetBlockLookup(blockId).subscribe(res => {
      this.response = res;
      if (this.response.success == true) {

        this.block = this.response.data;
      }
      else {
        this.toastr.error(this.response.message, 'Message.');
      }
    })}
    else{
      this.service.GetBlockLookupNopara().subscribe(res => {
        this.response = res;
        if (this.response.success == true) {
  
          this.block = this.response.data;
        }
        else {
          this.toastr.error(this.response.message, 'Message.');
        }
      })
    }
  }
  removeArticle(a) {
    // this.contractArticles.splice(i, 1);
    // for( let i = 0 ; i < this.contractArticles.length ; i++ ){
    let filterlist = this.contractArticles.findIndex(x => x.id ==a.id );
    if (filterlist !== -1) {
      this.contractArticles[filterlist].isDeleted = true;
      // this.contractArticles[filterlist].isAddedMore = false;

  
    }

  // }
  this.isdeletedArticla=true;


  }
  GetArticleDropdown(type: string) {
    this.service.getArticles().subscribe(res => {
      this.response = res;
      if (this.response.success == true) {
        this.article = this.response.data;
        
        if (type == "other") {
          // this.seller.id = this.newSeller;
          this.data.articleId = this.newArticle
        }
      }
      else {
        this.toastr.error(this.response.message, 'Message.');
      }
    })
  }
  
  editArticle()
  {
    this.spinner.show();
    for(let i =0; i <this.contractArticles.length ;i++ ){
      let varr = {
        "id" :this.contractArticles[i].id,
        "articleId": this.contractArticles[i].articleId,
        "contractId":this.contractId,
        "contractArticleQuantity" :this.contractArticles[i].contractArticleQuantity,
        "contractArticleRate": this.contractArticles[i].contractArticleRate,
        "contractArticleCommission": this.contractArticles[i].contractArticleCommission,
        "contractArticleForignAgentCommission": this.contractArticles[i].contractArticleForignAgentCommission,
        "isDeleted": this.contractArticles[i].isDeleted,
        "isAddedMore": this.contractArticles[i].isAddedMore,
        "contractArticleCurrencyId": this.contractArticles[i].contractArticleCurrencyId,
        "contractArticleContainer": this.contractArticles[i].contractArticleContainer,
  
      }
    
      this.articleArray.push(varr);
    // this.spinner.show();
    }
    this.http.
    put(`${environment.apiUrl}/api/ExportContracts/UpdateContractArticle`,this.articleArray)
    .subscribe(
      res=> { 
  
        this.response = res;
        if (this.response.success == true){
          this.toastr.success(this.response.message, 'Message.');
          this.contractArticles =[];
          this.articleArray=[];
          this.getContractData();
         
          this.isdeletedArticla =false;
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
//   revisedMethod(){
//     if(this.loggedInDepartmentName =='Yarn Export' || this.loggedInDepartmentName =='Yarn Import'){
  
//     this.isRevisedStart = true;

//     this.spinner.show();
        
//     this.http.
//       put(`${environment.apiUrl}/api/Contracts/ReviseContract/`+ this.contractId , {})
//       .subscribe(
//         res => {

//           this.response = res;
//           if (this.response.success == true) {
//            this.revised = true;
//            this.checkR = "REVISED"
//             this.toastr.success(this.response.message, 'Message.');
//              this.getContractData();
//             this.spinner.hide();

//           }
//           else {
//             this.toastr.error(this.response.message, 'Message.');
          
// this.spinner.hide();
// }

//         }, err => {
//           if (err.status == 400) {
//             this.toastr.error(this.response.message, 'Message.');
// this.spinner.hide();
          
//           }
//         });


//     }
//   }

  notRevisedMethod(){

    this.spinner.show();
        
    this.http.
      put(`${environment.apiUrl}/api/Contracts/NotReviseContract/`+ this.contractId , {})
      .subscribe(
        res => {

          this.response = res;
          if (this.response.success == true) {
            this.revised = false;
    this.isRevisedStart = false;

            this.checkR = "";
            this.toastr.success(this.response.message, 'Message.');
             this.getContractData();
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
 
  reviseContract() {
        
    this.spinner.show();
        
            this.http.
              put(`${environment.apiUrl}/api/Contracts/ReviseContract/`+ this.contractId , {})
              .subscribe(
                res => {
        
                  this.response = res;
                  if (this.response.success == true) {
                   this.revised = true;
    this.isRevisedStart = false;

                   this.checkR = "REVISED"
                    this.toastr.success(this.response.message, 'Message.');
                     this.getContractData();
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

  salesInvoicereportLocalYarn(){
        this.http.get(`${environment.apiUrl}/api/YarnContracts/GetAllContractSaleInvoiceReport/`+ this.contractId)
      .subscribe(res => {
        this.response = res;

        if (this.response.success == true && this.response.data != null) {
          this.yarnExportInvoiceReports = this.response.data;
          this.yarnExportInvoicesReportPrint();
    
        }
        else if(this.response.success == false) {
         
          this.toastr.error(this.response.message, 'Message.');
        }
        // this.spinner.hide();
      },(err: HttpErrorResponse) => {
        const messages = this.service.extractErrorMessagesFromErrorResponse(err);
        this.toastr.error(messages.toString(), 'Message.');
        console.log(messages);
      });

  }
  // getArticles() {

  //   this.http.get(`${environment.apiUrl}/api/Lookups/ContractArticles/`+ this.contractId)
  //     .subscribe(res => {
  //       this.response = res;

  //       if (this.response.success == true) {
  //         this.contractArticles = this.response.data
    
  //       }
  //       else {
  //         this.toastr.error(this.response.message, 'Message.');
  //       }
  //       // this.spinner.hide();
  //     },(err: HttpErrorResponse) => {
  //       const messages = this.service.extractErrorMessagesFromErrorResponse(err);
  //       this.toastr.error(messages.toString(), 'Message.');
  //       console.log(messages);
  //     });
  // }
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
  navigateUploadDoc(check) {
    const modalRef = this.modalService.open(DocumentUploadPopUpComponent, { centered: true });
    modalRef.componentInstance.contractId = this.contractId;
    modalRef.componentInstance.statusCheck = check;
    modalRef.result.then((data) => {
    
      // on close
      if (data == true) {
        this.getAllDocuments();
      }
    }, (reason) => {
      // on dismiss
    });
    // this.router.navigate(['/FabCot/doc-upload']);
  };
  editDocument(row, check) {
    const modalRef = this.modalService.open(DocumentUploadPopUpComponent, { centered: true });
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
  revisedpopup(row,check){
    const modalRef = this.modalService.open(ArticleRevisePopupComponent, { centered: true });
    modalRef.componentInstance.rowData = row;
    modalRef.componentInstance.statusCheck = check;
    modalRef.result.then((data) => {
    
      // on close
      if (data == true) {
        // this.firstTime=data.obj.
        this.isRevisedStart = false;
        this.getContractData();
      }
    }, (reason) => {
      // on dismiss
    });

  }
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

        if (this.response.success == true && this.response.data != null) {
          this.deliveryData = this.response.data;

          this.lengthcheckfordevelery =this.deliveryData.length;
          if(this.deliveryData[0].buyerDateDay == null){
            this.deliveryData[0].buyerDateDay = '';
          }
          this.deliveryFilter = [...this.deliveryData]
        }
        else if(this.response.success == false) {
         
          this.toastr.error(this.response.message, 'Message.');
        }
        // this.spinner.hide();
      },(err: HttpErrorResponse) => {
        const messages = this.service.extractErrorMessagesFromErrorResponse(err);
        this.toastr.error(messages.toString(), 'Message.');
        console.log(messages);
      });
  }



  getAllNotes(cb) {
if(this.loggedInDepartmentName == 'Yarn Export' || this.loggedInDepartmentName == 'Yarn Export Bangladesh' || this.loggedInDepartmentName == 'Yarn Import' || this.loggedInDepartmentName == 'Comber noil' || this.loggedInDepartmentName == 'Synthetic Fibers'){
    this.http
      .get(`${environment.apiUrl}/api/Contracts/GetAllContractNote/`+ this.contractId)
      .subscribe(res => {
        this.response = res;
        

        if (this.response.success == true && this.response.data != null) {
          this.contractNote = this.response.data
          this.noteFilter = [this.contractNote]; 
          cb(this.contractNote);
        }
        else if(this.response.success == false) {
         
          this.toastr.error(this.response.message, 'Message.');
        }
        // this.spinner.hide();
      },(err: HttpErrorResponse) => {
        const messages = this.service.extractErrorMessagesFromErrorResponse(err);
        this.toastr.error(messages.toString(), 'Message.');
        console.log(messages);
      });
    }
  }



  getAllShipmentDates(cb) {

    this.http
      .get(`${environment.apiUrl}/api/Contracts/GetAllContractShipmentSchedule/`+ this.contractId)
      .subscribe(res => {
        this.response = res;
        

        if (this.response.success == true && this.response.data != null) {
          this.shipment = this.response.data
          this.shipmentFilter = [this.shipment]; 
          cb(this.shipment);
        }
        else if(this.response.success == false) {
         
          this.toastr.error(this.response.message, 'Message.');
        }
        // this.spinner.hide();
      },(err: HttpErrorResponse) => {
        const messages = this.service.extractErrorMessagesFromErrorResponse(err);
        this.toastr.error(messages.toString(), 'Message.');
        console.log(messages);
      });
  }

  editExternalAgentCommArticleWise(check,RData){
    const modalRef = this.modalService.open(ExternalAgentCommissionArticleWiseComponent, { centered: true });
    modalRef.componentInstance.statusCheck = check;
    modalRef.componentInstance.contractId = this.contractId ;
    modalRef.componentInstance.RowData = RData ;
          modalRef.result.then((data) => {
         // on close
          if(data ==true){

          //  this.date = this.myDate;
           this.fetch((data) => {
            this.rows = data;
      this.saleinvoiceFilter = [...this.rows];
          });
          this.getContractData();
         
        }
       }, (reason) => {
         // on dismiss
       });
  }

  addinvoiceForm(check){
    const modalRef = this.modalService.open(SaleInvoicePopUpComponent, { centered: true });
    modalRef.componentInstance.statusCheck = check;
    modalRef.componentInstance.contractId = this.contractId ;
    modalRef.componentInstance.quantity = this.max ;
    modalRef.componentInstance.saleInvoiceQuantity = this.max1 ;
    modalRef.componentInstance.saleInvoiceQuantityTo = this.saleQuantityT ;
    modalRef.componentInstance.uom = this.uom ;



  
          modalRef.result.then((data) => {
         // on close
          if(data ==true){

          //  this.date = this.myDate;
           this.fetch((data) => {
            this.rows = data;
      this.saleinvoiceFilter = [...this.rows];
          });
          this.getContractData();
         
        }
       }, (reason) => {
         // on dismiss
       });
  }
  
//  ----------------- L/C pop up -----------------------


lcForm(x ,check){
  const modalRef = this.modalService.open(LCInfoComponent, { centered: true });
  modalRef.componentInstance.statusCheck = check;
  modalRef.componentInstance.contractId = this.contractId ;
  modalRef.componentInstance.id = x.id;

        modalRef.result.then((data) => {
       // on close
        if(data ==true){
          this.getContractLOC();

       
      }
     }, (reason) => {
       // on dismiss
     });
}
lcForm2( check){
  const modalRef = this.modalService.open(LCInfoComponent, { centered: true });
  modalRef.componentInstance.statusCheck = check;
  modalRef.componentInstance.contractId = this.contractId ;

        modalRef.result.then((data) => {
       // on close
        if(data ==true){
  this.getContractLOC();
       
      }
     }, (reason) => {
       // on dismiss
     });
}

  fetch(cb) {
      // this.spinner.show();
    this.http
    .get(`${environment.apiUrl}/api/YarnContracts/GetAllContractSaleInvoice/`+this.contractId )
    .subscribe(res => {
      this.response = res;
     
    if(this.response.success==true && this.response.data != null)
    {
      this.saleInvoice =this.response.data;
      // this.saleInvoiceNo=this.response.data[0].saleInvoiceNo;
      // this.saleInvoiceDate=this.response.data[0].saleInvoiceDate;
      // this.saleInvoiceId=this.response.data[0].id;
      if(this.loggedInDepartmentName =='Fabric Local' && this.contractCostingData.adIncomeTaxFL != null){
      for(let i=0; i<this.saleInvoice.length; i++){
        let am= parseFloat(this.saleInvoice[i].quantity)  * parseFloat(this.contractCostingData.rate);
        this.saleInvoice[i].amount =am
      }   
    }    
    cb(this.saleInvoice);
  //  this.spinner.hide();
   }
   else if(this.response.success == false) {
         
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
  getAllInvoices() {

    this.http.get(`${environment.apiUrl}/api/YarnContracts/GetAllContractSaleInvoice/`+ this.contractId)
      .subscribe(res => {
        this.response = res;

        if (this.response.success == true && this.response.data != null) {
          this.saleInvoice = this.response.data
          this.checkForDuplicateInvoices()
          if(this.loggedInDepartmentName =='Fabric Local' && this.contractCostingData.adIncomeTaxFL != null){
            for(let i=0; i<this.saleInvoice.length; i++){
              let am= parseFloat(this.saleInvoice[i].quantity)  * parseFloat(this.contractCostingData.rate);
              this.saleInvoice[i].amount =am
            }   
          } 
if(this.saleInvoice[0].billInvoiceNumber != 0 ){
  if(this.loggedInDepartmentName !='Fabric Local' && this.loggedInDepartmentName !='Yarn Import' && this.loggedInDepartmentName !='Fabric Export'){
          this.isnotEditAble = true
  }
}
          // this.deliveryFilter = [...this.deliveryData]


           


        }
        else if(this.response.success == false) {
         
          this.toastr.error(this.response.message, 'Message.');
        }
        // this.spinner.hide();
      },(err: HttpErrorResponse) => {
        const messages = this.service.extractErrorMessagesFromErrorResponse(err);
        this.toastr.error(messages.toString(), 'Message.');
        console.log(messages);
      });
  }
  checkForDuplicateInvoices(): boolean {
  const invoiceNumbers = this.saleInvoice.map(inv => inv.saleInvoiceNo);
  const duplicates = invoiceNumbers.filter((item, index) => invoiceNumbers.indexOf(item) !== index);

  if (duplicates.length > 0) {
    this.errorMessage = `Duplicate invoice numbers found: ${[...new Set(duplicates)].join(', ')}`;
    return true;
  }

  this.errorMessage = '';
  return false;
}
  editinvoice(row,check) {
    const modalRef = this.modalService.open(SaleInvoicePopUpComponent, { centered: true });
  modalRef.componentInstance.contractId = this.contractId;
  modalRef.componentInstance.invoiceId = row.id;
    modalRef.componentInstance.statusCheck = check;
    modalRef.componentInstance.uom = this.uom;
    modalRef.componentInstance.saleInvoiceQuantity = this.max1 ;
    modalRef.componentInstance.quantity = this.max ;

    modalRef.result.then((data) => {
      // on close
      if(data ==true){
        //  this.date = this.myDate;
         this.fetch((data) => {
          this.rows = data;
    this.saleinvoiceFilter = [...this.rows];
      this.getContractData();
        });
       
      }
    }, (reason) => {
      // on dismiss
    });
  }
  
  deleteDocument(row) {
    Swal.fire({
      title: GlobalConstants.deleteTitle, //'Are you sure?',
      text: GlobalConstants.deleteMessage + ' ' +'Sale Invoice Number:'+ '"' + row.saleInvoiceNo + '"',
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
  
            },(err: HttpErrorResponse) => {
              const messages = this.service.extractErrorMessagesFromErrorResponse(err);
              this.toastr.error(messages.toString(), 'Message.');
              console.log(messages);
            });
  
      }
    })
  
  }
  
  deleteinvoice(row) {
    Swal.fire({
      title: GlobalConstants.deleteTitle, //'Are you sure?',
      text: GlobalConstants.deleteMessage + ' ' +'Sale Invoice Number:'+ '"' + row.saleInvoiceNo + '"',
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
  
            },(err: HttpErrorResponse) => {
              const messages = this.service.extractErrorMessagesFromErrorResponse(err);
              this.toastr.error(messages.toString(), 'Message.');
              console.log(messages);
            });
  
      }
    })
  
  }
  
  
 
  deleteDebit(row) {
    Swal.fire({
      title: GlobalConstants.deleteTitle, //'Are you sure?',
      text: GlobalConstants.deleteMessage + ' ' +'Debit/Credit Note:'+ '"' + row.debitNoteNo + '"',
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
  this.spinner.show()
        this.http.delete(`${environment.apiUrl}/api/YarnContracts/DeleteInvoiceDebitCreditNote/` + row.id)
          .subscribe(
            res => {
              this.response = res;
              if (this.response.success == true) {
                this.toastr.error(this.response.message, 'Message.');
                // this.getCreditDebit();
              this.getAllInvoices();
                this.spinner.hide();
  
              }
              else {
                this.toastr.error(this.response.message, 'Message.');
                this.spinner.hide();

              }
  
            },(err: HttpErrorResponse) => {
              const messages = this.service.extractErrorMessagesFromErrorResponse(err);
              this.toastr.error(messages.toString(), 'Message.');
              console.log(messages);
              this.spinner.hide();

            });
  
      }
    })
  
  }

  deleteCredit(row) {
    Swal.fire({
      title: GlobalConstants.deleteTitle, //'Are you sure?',
      text: GlobalConstants.deleteMessage + ' ' +'Debit/Credit Note:'+ '"' + row.creditNoteNo + '"',
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
  this.spinner.show()
        this.http.delete(`${environment.apiUrl}/api/YarnContracts/DeleteInvoiceDebitCreditNote/` + row.id)
          .subscribe(
            res => {
              this.response = res;
              if (this.response.success == true) {
                this.toastr.error(this.response.message, 'Message.');
                // this.getCreditDebit();
              this.getAllInvoices();
                this.spinner.hide();
  
              }
              else {
                this.toastr.error(this.response.message, 'Message.');
                this.spinner.hide();

              }
  
            },(err: HttpErrorResponse) => {
              const messages = this.service.extractErrorMessagesFromErrorResponse(err);
              this.toastr.error(messages.toString(), 'Message.');
              console.log(messages);
              this.spinner.hide();

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
    this.spinner.show();
    this.http.get(`${environment.apiUrl}/api/Contracts/GetContractById/` + this.contractId )
      .subscribe(
        res => {
          this.response = res;
          if (this.response.success == true && this.response.data != null) {
            this.contractData = this.response.data;
            
            if(this.contractData.status == "Billed"){
              if(this.loggedInDepartmentName !='Fabric Local' && this.loggedInDepartmentName !='Yarn Import' && this.loggedInDepartmentName !='Fabric Export'){
              this.isnotEditAble =true
              }

            }

            this.revised=this.contractData.revisedCount !=0? true : false ;
            this.checkR=this.contractData.revisedCount !=0? "REVISED" : "" ;

            this.contractData.createdDateTime = this.contractData.createdDateTime.slice(0 ,16)
            this.contractArticles = this.response.data.contractArticles;
            this.buyerName = this.contractData.buyerName
            if(this.contractData.contractBillInfo != null){
            this.commissionBill = this.contractData.contractBillInfo
            }
             this.contractNmbr = this.contractData.autoContractNumber
             this.sellerName = this.contractData.sellerName
             this.max1 = this.response.data.saleInvoiceQuantity;
             this.saleQuantityT =this.response.data.tolerancevalueclaculated;
             if(this.loggedInDepartmentName == 'Yarn Local'){

              this.GetBlockLookup(this.contractData.blockId);
              }
             this.data.alocation = this.contractData.isAlocation;
             this.data.blockId = this.contractData.blockId;
            //  if(this.commissionBill['billNo'] != ''){
            //    this.billCount = 1
            //  }
            //  else{
            //    this.billCount = 0
            //  }
             this.spinner.hide();

          }
          else if(this.response.success == false) {
         
            this.toastr.error(this.response.message, 'Message.');
            this.spinner.hide();
          }
        },(err: HttpErrorResponse) => {
          const messages = this.service.extractErrorMessagesFromErrorResponse(err);
          this.toastr.error(messages.toString(), 'Message.');
          console.log(messages);
          this.spinner.hide();
        });
  }


getContractPartiesData() {
  this.http.get(`${environment.apiUrl}/api/Contracts/GetContractPartiesById/` + this.contractId)
    .subscribe(
      res => {
        this.response = res;
        if (this.response.success == true && this.response.data != null) {
          this.contractPartiesData = this.response.data;
          

        }
        else if(this.response.success == false) {
         
          this.toastr.error(this.response.message, 'Message.');
        }

      },(err: HttpErrorResponse) => {
        const messages = this.service.extractErrorMessagesFromErrorResponse(err);
        this.toastr.error(messages.toString(), 'Message.');
        console.log(messages);
      });
}


getDeliveryTimeLine() {
  this.http.get(`${environment.apiUrl}/api/YarnContracts/GetAllContractDeliverySchedule` )
    .subscribe(
      res => {
        this.response = res;
        if (this.response.success == true && this.response.data != null) {
          this.deliveryTimeLineData = this.response.data;
          

        }
        else if(this.response.success == false) {
         
          this.toastr.error(this.response.message, 'Message.');
        }

      },(err: HttpErrorResponse) => {
        const messages = this.service.extractErrorMessagesFromErrorResponse(err);
        this.toastr.error(messages.toString(), 'Message.');
        console.log(messages);
      });
}
// getCreditDebit() {
//   this.http.get(`${environment.apiUrl}/api/YarnContracts/GetAllInvoiceDebitCreditNote/`+28 )
//     .subscribe(
//       res => {
//         this.response = res;
//         if (this.response.success == true) {
//           this.creditdebit = this.response.data;
          
//           this.getCreditDebit();

//         }
//         else {
//           this.toastr.error(this.response.message, 'Message.');
//         }

//       },(err: HttpErrorResponse) => {
//         const messages = this.service.extractErrorMessagesFromErrorResponse(err);
//         this.toastr.error(messages.toString(), 'Message.');
//         console.log(messages);
//       });
// }

fileDownload(row){
  let file =row.file;
  window.open(file, '_blank');
  //this.writeContents(file, 'File'+'.pdf', 'application/pdf');
  }

  // downloadFile(data: Response) {
  //   const blob = new Blob([data], { type: 'text/csv' });
  //   const url= window.URL.createObjectURL(blob);
  //   window.open(url);
  // }
getAllDocuments() {
  this.http.get(`${environment.apiUrl}/api/Contracts/GetAllUploadDocument/`+this.contractId )
    .subscribe(
      res => {
        this.response = res;
        if (this.response.success == true && this.response.data != null)  {
          this.Documents = this.response.data;
              this.rowsDoc=this.Documents

        }
        else if(this.response.success == false) {
         
          this.toastr.error(this.response.message, 'Message.');
        }

      },(err: HttpErrorResponse) => {
        const messages = this.service.extractErrorMessagesFromErrorResponse(err);
        this.toastr.error(messages.toString(), 'Message.');
        console.log(messages);
      });
}

getDocumentData() {
  this.http.get(`${environment.apiUrl}/api/Contracts/GetContractById/` + this.documentId)
    .subscribe(
      res => {
        this.response = res;
        if (this.response.success == true && this.response.data != null) {
          this.DocumentData = this.response.data;
        }
        else if(this.response.success == false) {
         
          this.toastr.error(this.response.message, 'Message.');
        }

      },(err: HttpErrorResponse) => {
        const messages = this.service.extractErrorMessagesFromErrorResponse(err);
        this.toastr.error(messages.toString(), 'Message.');
        console.log(messages);
      });
}


getDispatches() {
  this.http.get(`${environment.apiUrl}/api/YarnContracts/GetAllDispatchRegister/`+ this.contractId)
    .subscribe(
      res => {
        this.response = res;
        if (this.response.success == true && this.response.data != null) {
          this.dispatchData = this.response.data;
       
      this.dispatchFilter = [...this.dispatchData];

        }
        else if(this.response.success == false) {
         
          this.toastr.error(this.response.message, 'Message.');
        }

      },(err: HttpErrorResponse) => {
        const messages = this.service.extractErrorMessagesFromErrorResponse(err);
        this.toastr.error(messages.toString(), 'Message.');
        console.log(messages);
      });
}

getProdPlan() {
  if(this.loggedInDepartmentName == 'Yarn Export' || this.loggedInDepartmentName == 'Yarn Export Bangladesh' || this.loggedInDepartmentName == 'Yarn Import' || this.loggedInDepartmentName == 'Comber noil' || this.loggedInDepartmentName == 'Synthetic Fibers'){
  this.http.get(`${environment.apiUrl}/api/YarnContracts/GetAllContractProductionStatus`)
    .subscribe(
      res => {
        this.response = res;
        if (this.response.success == true && this.response.data != null) {
          this.prodPlanData = this.response.data;
          

        }
        else if(this.response.success == false) {
         
          this.toastr.error(this.response.message, 'Message.');
        }

      },(err: HttpErrorResponse) => {
        const messages = this.service.extractErrorMessagesFromErrorResponse(err);
        this.toastr.error(messages.toString(), 'Message.');
        console.log(messages);
      });
    }
}




getContractProductData() {
  this.http.get(`${environment.apiUrl}/api/Contracts/GetContractProductSpecificationById/` + this.contractId)
    .subscribe(
      res => {
        this.response = res;
        if (this.response.success == true && this.response.data != null) {
          this.contractProductData = this.response.data;
          if(this.response.data.pecenetAge == null){
            this.contractProductData.pecenetAge = ""
          }
         
          if(this.response.data.febricType == null){
            this.contractProductData.febricType = ""
          }
          if(this.response.data.construction == null){
            this.contractProductData.construction = ""
          }
        }
        else if(this.response.success == false) {
         
          this.toastr.error(this.response.message, 'Message.');
        }

      },(err: HttpErrorResponse) => {
        const messages = this.service.extractErrorMessagesFromErrorResponse(err);
        this.toastr.error(messages.toString(), 'Message.');
        console.log(messages);
      });
}


getContractCostingData() {
  this.http.get(`${environment.apiUrl}/api/Contracts/GetContractCostingById/` + this.contractId)
    .subscribe(
      res => {
        this.response = res;
        if (this.response.success == true && this.response.data != null) {
          this.contractCostingData = this.response.data;

          // .......calculating with gst........
          let value=(this.contractCostingData.contractCost * this.contractCostingData.gst) /100;
            // this.costingDataWithGstFL=parseInt(this.contractCostingData.contractCost)
          
          this.costingDataWithGstFL =parseInt(this.contractCostingData.contractCost) + value+".00";
          if(this.loggedInDepartmentName == 'Fabric Local' && this.contractCostingData.adIncomeTaxFL !=null){
            this.costingDataWithGstFL =parseFloat(this.costingDataWithGstFL) + (parseFloat(this.costingDataWithGstFL) * parseFloat(this.contractCostingData.adIncomeTaxFL)) /100;
          }
          // .......calculating with gst........
          this.max = this.response.data.quantityWithTolerance;
      this.uom = this.contractCostingData.rateUOMName;
          if(this.contractCostingData.length=1){
            this.check=this.check+15;
          }
          localStorage.setItem('rate',this.response.data.quantity);
          if(this.response.data.quantity === "0"){
            this.contractCostingData.quantity = ""
          }
          if(this.response.data.quantityToleranceValue == null){
            this.contractCostingData.quantityToleranceValue = ""
            this.percent = ""
          }
        
          
          if(this.response.data.rate === 0){
            this.contractCostingData.rate = ""
          }
          if(this.response.data.gst == null){
            this.contractCostingData.gst = ""
          }
          if(this.response.data.witAx == null){
            this.contractCostingData.witAx = ""
          }
          if(this.response.data.contractCost == 0){
            this.contractCostingData.contractCost = ""
          }
        
        }

        else if(this.response.success == false) {
         
          this.toastr.error(this.response.message, 'Message.');
        }
      },(err: HttpErrorResponse) => {
        const messages = this.service.extractErrorMessagesFromErrorResponse(err);
        this.toastr.error(messages.toString(), 'Message.');
        console.log(messages);
      });
}

getContractPaymentData() {
  this.http.get(`${environment.apiUrl}/api/Contracts/GetContractPaymentDeliveryById/` + this.contractId)
    .subscribe(
      res => {
        this.response = res;
        if (this.response.success == true && this.response.data != null) {
          this.contractPaymentData = this.response.data;
          if(this.response.data.sellerPaymentTermName == null){
            this.contractPaymentData.sellerPaymentTermName = ""
          }
          if(this.response.data.sellerPaymentTermDays == null || this.response.data.sellerPaymentTermDays == 0){
            this.contractPaymentData.sellerPaymentTermDays = ""
          }
          if(this.response.data.sellerPaymentTermInfo == null){
            this.contractPaymentData.sellerPaymentTermInfo = ""
          }
          if(this.response.data.priceTermName == null){
            this.contractPaymentData.priceTermName = ""
          }
        
          if(this.response.data.destinationName == null){
            this.contractPaymentData.destinationName = ""
          }
          if(this.response.data.count == null){
            this.contractPaymentData.count = ""
          }
          if(this.response.data.containerName == null){
            this.contractPaymentData.containerName = ""
          }
          if(this.response.data.buyerDeliveryDateDay == null){
            this.contractPaymentData.buyerDeliveryDateDay = ""
          }
          if(this.response.data.buyerDeliveryDateMonth == null){
            this.contractPaymentData.buyerDeliveryDateMonth = ""
          }
          if(this.response.data.buyerDeliveryDateYear == null){
            this.contractPaymentData.buyerDeliveryDateYear = ""
          }
          for(let i=0; i<this.response.data.contractDeliveryDates.length; i++){
          if(this.response.data.contractDeliveryDates[i].sellerDeliveryDateDay == null){
            this.contractPaymentData.contractDeliveryDates[i].sellerDeliveryDateDay = ""
          }
          if(this.response.data.contractDeliveryDates[i].sellerDeliveryDateMonth == null){
            this.contractPaymentData.contractDeliveryDates[i].sellerDeliveryDateMonth = ""
          }
          if(this.response.data.contractDeliveryDates[i].sellerDeliveryDateYear == null){
            this.contractPaymentData.contractDeliveryDates[i].sellerDeliveryDateYear = ""
          }
        }
    
        }
        else if(this.response.success == false) {
         
          this.toastr.error(this.response.message, 'Message.');
        }

      },(err: HttpErrorResponse) => {
        const messages = this.service.extractErrorMessagesFromErrorResponse(err);
        this.toastr.error(messages.toString(), 'Message.');
        console.log(messages);
      });
}






getContractCommisionData(){
  this.http.get(`${environment.apiUrl}/api/Contracts/GetContractCommissionKickBackById/` + this.contractId)
  .subscribe(
    res => {
      this.response = res;
      if (this.response.success == true && this.response.data != null) {
        // this.response.data ==null? '':this.response.data;
        this.contractCommissionData = this.response.data;
        this.agent = this.response.data.agentCommissions;
    // if(this.response.data.fabCotComission == null ){
    //   this.contractCommissionData.fabCotComission == "";
    // }
        // this.contractCommissionData.agenetName= parseInt(this.contractCommissionData.agenetName);
       if(this.response.data.buyersideCommision == null){
         this.contractCommissionData.buyersideCommision = '';
       }
       if(this.response.data.fabCotCommision == null){
        this.contractCommissionData.fabCotCommision = '';
      }
  

      }
      else if(this.response.success == false) {
         
        this.toastr.error(this.response.message, 'Message.');
      }

    },(err: HttpErrorResponse) => {
      const messages = this.service.extractErrorMessagesFromErrorResponse(err);
      this.toastr.error(messages.toString(), 'Message.');
      console.log(messages);
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



getAllBenificery() {
    
  this.http
  .get(`${environment.apiUrl}/api/Contracts/GetAllContractBeneficiary/` + this.contractId)
  .subscribe(res => {
    this.response = res;
   
  if(this.response.success==true && this.response.data != null)
  {
  this.empData =this.response.data;
  if(this.empData.length !==null){
    this.check=this.check+15;
  }
  }
  else if(this.response.success == false) {
         
    this.toastr.error(this.response.message, 'Message.');
  }
    // this.spinner.hide();
  },(err: HttpErrorResponse) => {
    const messages = this.service.extractErrorMessagesFromErrorResponse(err);
    this.toastr.error(messages.toString(), 'Message.');
    console.log(messages);
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
           this.getAllBenificery();
           this.spinner.hide();
            }
            else {
              this.toastr.error(this.response.message, 'Message.');
  this.spinner.hide();
}

          },(err: HttpErrorResponse) => {
            const messages = this.service.extractErrorMessagesFromErrorResponse(err);
            this.toastr.error(messages.toString(), 'Message.');
            console.log(messages);
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
      // this.getContractData();

    
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
        // this.getContractData();
      }
    }, (reason) => {
      // on dismiss
    });
  }
  editQuantity(row) {
    const modalRef = this.modalService.open(QuantityAndCostingComponent, { centered: true });
    modalRef.componentInstance.contractId = this.contractId;
    modalRef.componentInstance.contractNumber = row.autoContractNumber;
    modalRef.componentInstance.blockId = this.data.blockId;


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
        // this.getContractData();
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
        // this.getContractData();
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
  
     this.getAllBenificery();
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
  
   this.getAllBenificery();
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
  
      // this.getContractData();
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
        if (this.response.success == true && this.response.data != null) {
          this.contractRemarksData = this.response.data;
          this.contractRemarksData.otherConditionRemarks.replace(/\./g,'.<br/>');
          this.contractRemarksData.contractRemarks.replace(/\./g,'.<br/>');
          this.contractRemarksData.title.replace(/\./g,'.<br/>');
          
        }
        else if(this.response.success == false) {
         
          this.toastr.error(this.response.message, 'Message.');
        }

      },(err: HttpErrorResponse) => {
        const messages = this.service.extractErrorMessagesFromErrorResponse(err);
        this.toastr.error(messages.toString(), 'Message.');
        console.log(messages);
      });
}







getContractLOC() {

  if(this.loggedInDepartmentName == 'Yarn Export' || this.loggedInDepartmentName == 'Yarn Export Bangladesh' || this.loggedInDepartmentName == 'Yarn Import' ||
  this.loggedInDepartmentName == 'Fabric Export' || this.loggedInDepartmentName == 'Comber noil' || this.loggedInDepartmentName == 'Synthetic Fibers'){
  this.http.get(`${environment.apiUrl}/api/Contracts/GetAllContractLetterCredit/` + this.contractId)

    .subscribe(
      res => {
        this.response = res;
        if (this.response.success == true ) {
         
          this.contractLOCdata = this.response.data;
          
        }
        else {
          this.toastr.error(this.response.message, 'Message.');
        }

      },(err: HttpErrorResponse) => {
        const messages = this.service.extractErrorMessagesFromErrorResponse(err);
        this.toastr.error(messages.toString(), 'Message.');
        console.log(messages);
      });
  }
}















addDeliveryTL(check) {
  const modalRef = this.modalService.open(DeliveryTLComponent, { centered: true });
  modalRef.componentInstance.statusCheck = check;

  modalRef.componentInstance.contractId = this.contractId ;

  modalRef.result.then((data) => {
    // on close
    if (data == true) {
      
      // this.getContractData();
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
      // this.getContractData();
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
    if (data == true) {
  
    }

  }, (reason) => {
  });
}

addCredit(x, check) {
  const modalRef = this.modalService.open(CreditComponent, { centered: true });
  modalRef.componentInstance.statusCheck = check;
  modalRef.componentInstance.contractId = this.contractId ;
  modalRef.componentInstance.buyerName = this.buyerName ;
  modalRef.componentInstance.saleInvoiceId = x.id ;
  modalRef.componentInstance.saleInvoiceNo = x.saleInvoiceNo;
  modalRef.componentInstance.saleInvoiceDate = x.saleInvoiceDate;
  modalRef.componentInstance.saleInvoiceQuantity = x.quantity;
  modalRef.componentInstance.quantity = this.max;





  modalRef.result.then((data) => {
    // on close
    if (data == true) {
      // this.getContractData();
      // this.getDispatches();
      this.getAllInvoices();
      this.getContractData();
    
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
  modalRef.componentInstance.buyerName = this.buyerName ;
  modalRef.componentInstance.sellerName = this.sellerName ;
  modalRef.componentInstance.contractNmbr = this.contractNmbr ;
  modalRef.result.then((data) => {
    if (data == true) {
      this.getDispatches();
    }
    
  }, (reason) => {
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
    // this.getContractData();

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
    // this.getContractData();

    }
  }, (reason) => {
    // on dismiss
  });
}

addProd() {
  if(this.loggedInDepartmentName == 'Yarn Export' || this.loggedInDepartmentName == 'Yarn Export Bangladesh' || this.loggedInDepartmentName == 'Yarn Import' || this.loggedInDepartmentName == 'Comber noil' || this.loggedInDepartmentName == 'Synthetic Fibers'){

  const modalRef = this.modalService.open(ProductionStatusComponent, { centered: true });
  modalRef.result.then((data) => {
    // on close
    if (data == true) {
      this.getProdPlan();
    }

  }, (reason) => {
  });
}
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


updateAlocation()
{ 
  let varr = {
  
    "isAlocation":this.data.alocation,
    "blockId":this.data.blockId,
  }
this.spinner.show();
  
  this.http.
  put(`${environment.apiUrl}/api/Contracts/UpdateAlocation/`+this.contractId, varr)
  .subscribe(
    res=> { 

      this.response = res;
      if (this.response.success == true ){
        this.toastr.success(this.response.message, 'Message.');
        this.getContractData();
        this.spinner.hide();


     
      }
      else if(this.response.success == false) {
   
        this.toastr.error(this.response.message, 'Message.');
      }

    }, err => {
      if (err.status == 400) {
        this.toastr.error('Something went Worng', 'Message.');
this.spinner.hide();
     
      }
    });
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
            if (this.response.success == true ){
              this.toastr.success(this.response.message, 'Message.');
              this.getContractData();
              this.spinner.hide();


           
            }
            else if(this.response.success == false) {
         
              this.toastr.error(this.response.message, 'Message.');
            }
    
          }, err => {
            if (err.status == 400) {
              this.toastr.error('Something went Worng', 'Message.');
  this.spinner.hide();
           
            }
          });
      }


      cancelBill()
      { 
        let varr = {
        
          "reason":"Bill Cancel",
          "contractId": this.contractId,
          "status": "Open"
        }
  this.spinner.show();
        
        this.http.
        put(`${environment.apiUrl}/api/Contracts/UpdateContractStatusCancelBill`, varr)
        .subscribe(
          res=> { 
      
            this.response = res;
            if (this.response.success == true ){
              this.toastr.success(this.response.message, 'Message.');
              this.getContractData();
              this.spinner.hide();


           
            }
            else if(this.response.success == false) {
         
              this.toastr.error(this.response.message, 'Message.');
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
      
      closeContract() {
        
      
this.spinner.show();
    
        this.http.
          put(`${environment.apiUrl}/api/Contracts/ContractClose/`+ this.contractId , {})
          .subscribe(
            res => {
    
              this.response = res;
              if (this.response.success == true) {
                this.toastr.success(this.response.message, 'Message.');
                 this.getContractData();
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

 

              cancelContract()
              {
                let varr=  {}
      this.spinner.show();
            
                this.http.
                put(`${environment.apiUrl}/api/Contracts/ContractCancel/`+this.contractId,varr)
                .subscribe(
                  res=> { 
              
                    this.response = res;
                    if (this.response.success == true){
                      this.toastr.success(this.response.message, 'Message.');
                   this.getContractData();
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

      AddReminder() {
        
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

                  if (this.response.success == true && this.response.data != null) {
                    this.reminderData = this.response.data;
                    
          
                  }
                  else if(this.response.success == false) {
         
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

          deleteContract(id) {
            Swal.fire({
              title: GlobalConstants.deleteTitle, //'Are you sure?',
              text: GlobalConstants.deleteMessage + ' ' + '"' + this.contractData.autoContractNumber + '"',
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
          
                this.http.delete(`${environment.apiUrl}/api/Contracts/DeleteContract/` + id)
                  .subscribe(
                    res => {
                      this.response = res;
                      if (this.response.success == true) {
                        this.toastr.error(this.response.message, 'Message.');
                        // this.getAllEnquiryItems();
                        this.fetch((data) => {
                          this.rows = data;

                        });
            this.router.navigate(['/FabCot/active-contract']);
                        
          
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
          navigateafterdelete() {
            this.router.navigate(['/FabCot/active-contract']);
          };
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

  getPrintData(deptName){
 
    this.spinner.show();
  this.http.get(`${environment.apiUrl}/api/Reports/ContractIndentPrint/`+ this.contractId)
  .subscribe(
    res => {
    this.response = res;
    if (this.response.success == true && this.response.data != null) {
      this.printData = this.response.data;
   
   if(deptName == 'yarnLocalB'){
    this.print();
    this.spinner.hide();

   }
  else if(deptName == 'yarnLocalS'){
    this.printSeller();
    this.spinner.hide();

   }
   else if(deptName == 'fabricLocalB'){
    this.print2();
    this.spinner.hide();

   }
   else if(deptName == 'fabricExportB'){
    this.printFE();
    this.spinner.hide();

   }

   else if(deptName == 'fabricExportS'){
    this.print2FE();
    this.spinner.hide();

   }
   else if(deptName == 'fabricLocalS'){
    this.printS();
    this.spinner.hide();

   }
   else if(deptName == 'supplier'){
    this.printSupplier();
    this.spinner.hide();

   }
   else if(deptName == 'supplierBang'){
    this.printSupplierBangla();
    this.spinner.hide();

   }
   else if(deptName == 'ComberBuyer'){
    this.printBuyerComber();
    this.spinner.hide();

   }
   else if(deptName == 'Combersupplier'){
    this.printSupplierComber();
    this.spinner.hide();

   }
   else if(deptName == 'supplier2'){
    this.printSupplier2();
    this.spinner.hide();

   }
   this.spinner.hide();


    }
    else if(this.response.success == false) {
       
      this.toastr.error(this.response.message, 'Message.');
    this.spinner.hide();

    }

      
     
    },(err: HttpErrorResponse) => {
      const messages = this.service.extractErrorMessagesFromErrorResponse(err);
      this.toastr.error(messages.toString(), 'Message.');
      console.log(messages);
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
toggleShow() {

  this.isShown = ! this.isShown;
  
  }

  toggleShowtoupdateMC() {

    this.isShownMC = ! this.isShownMC;
    
    }
    updateMC(){
      this.spinner.show();
      let varr = {
        "contractId": this.contractId,
        "manualContractNumber": this.dataMC.manualCNumber
      }
      this.http.
      put(`${environment.apiUrl}/api/Contracts/UpdateMunalContractNumber/`+this.contractId, varr)
      .subscribe(
        res => {

          this.response = res;
          if (this.response.success == true) {
            this.toastr.success(this.response.message, 'Message.');

            this.getContractData();
this.isShownMC = ! this.isShownMC;
// this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
//   this.router.navigate(['/active-contract-details']);
// });
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
  contractdatechange(event){
    this.spinner.show();
        this.data.createdDateTime = this.dateformater.toModel(event);
  
        if( this.data.contractUpDate == "undefined-undefined-undefined"){
          this.data.contractUpDate = ""
  
        }
        if( this.data.contractUpDate == "0-NaN-NaN"){
          this.data.contractUpDate = ""
        }
  
        let varr = {
          "contractId": this.contractId,
          "date": this.data.createdDateTime
        }
    
        this.http.
          put(`${environment.apiUrl}/api/Contracts/UpdateContractCreatedDate/`+this.contractId, varr)
          .subscribe(
            res => {
    
              this.response = res;
              if (this.response.success == true) {
                this.toastr.success(this.response.message, 'Message.');

                this.getContractData();
  this.isShown = ! this.isShown;

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
                       fit : [100 , 100]
                    
                      },
                      
                      {
                        layout:'noBorders',
                        margin: [390 , -30 , 0 , 0],
                        table:{headerRows: 1 , widths:['100%'],
                      body: [
                        [{text:this.contractData['revisedCount'] !=0? 'Revised': '' , style:'headingR'} ],] }
                      },

                      {
                        layout:'noBorders',
                        margin: [330 , 0 , 0 , 0],
                        table:{headerRows: 1 , widths:['40%' , '80%'],
                      body: [
                        [{text:'Contract No:'  , style:'heading'} , {text: this.loggedInDepartmentName == 'Yarn Local Karachi'?this.contractData['manualContractNumber']:this.contractData['autoContractNumber']  , margin:[-24,0,0,0] , style:'heading2'}],] }
                      },
                      {
                        layout:'noBorders',
                        margin: [330 , 0 , 0 , 0],
                        table:{headerRows: 1 , widths:['40%' , '80%'],
                      body: [
                        [{text:'Contract Date:'  , style:'heading'} , {text: this.contractData['createdDateTime']  , margin:[-24,0,0,0] , style:'heading2'}],] }
                      },
                      {
                        layout:'noBorders',
                        margin: [330 , 0 , 0 , 0],
                        table:{headerRows: 1 , widths:['40%' , '80%'],
                      body: [
                        [{text:'Purchase No:'  , style:'heading'} , {text: this.contractPartiesData['poNumber'], margin:[-25,0,0,0]  , style:'heading2'}],] }
                      },
                      {
                        layout:'noBorders',
                        margin: [70 , 10 , 0 , 0],
                        table:{headerRows: 1 , widths:['10%' , '60%'],
                      body: [
                        [{text:'Attn:'  , style:'heading'} , {text: this.contractPartiesData['buyerPOCName'] , margin:[-20,0,0,0] , style:'heading4'}]] }
                      },
                      {
                        layout:'noBorders',
                        margin: [70 , 0 , 0 , 0],
                        table:{headerRows: 1 , widths:['100%'],
                      body: [
                        [{text:' We are please to confirm here the booking as per following term and conditions.' , style:'heading2'}  ],] }
                      },
                      {
                        layout:'noBorders',
                        margin: [70 , 17 , 0 , 0],
                        table:{headerRows: 1 , widths:['20%' , '80%'],
                      body: [
                        [{text:'Buyer Name:'  , style:'heading'} , {text: this.contractPartiesData['buyerName'], style:'heading2'}],] }
                      },
                      {
                        layout:'noBorders',
                        margin: [280 , -2 , 0 , 0],
                        table:{headerRows: 1 , widths:['12%' , '80%'],
                      body: [
                        [{text:'GST:'  , style:'heading3'} , {text: this.printData['buyerGSTNumber'], style:'heading3' ,margin:[-20 , 0,0,0] }],] }
                      },
                      {
                        layout:'noBorders',
                        margin: [380 , -11 , 0 , 0],
                        table:{headerRows: 1 , widths:['16%' , '80%'],
                      body: [
                        [{text:'NTN:'  , style:'heading3'} , {text: this.printData['buyerNTNNumber'] , style:'heading3',margin:[-10 , 0,0,0] }],] }
                      },
                      {
                        layout:'noBorders',
                        margin: [70 , -3 , 0 , 0],
                        table:{headerRows: 1 , widths:['20%' , '80%'],
                      body: [
                        [{text:'Supplier Name:'  , style:'heading'} , {text: this.contractPartiesData['sellerName'] , style:'heading2'}],] }
                      },
                      {
                        layout:'noBorders',
                        margin: [280 , -4 , 0 , 0],
                        table:{headerRows: 1 , widths:['12%' , '80%'],
                      body: [
                        [{text:'GST:'  , style:'heading3'} , {text: this.printData['sellerGSTNumber'] , style:'heading3',margin:[-20 , 0,0,0] }],] }
                      },
                      {
                        layout:'noBorders',
                        margin: [380 , -13 , 0 , 0],
                        table:{headerRows: 1 , widths:['16%' , '80%'],
                      body: [
                        [{text:'NTN:'  , style:'heading3'} , {text: this.printData['sellerNTNNumber'] , style:'heading3' , margin:[-10 , 0,0,0] }],] }
                      },
                      {
                        layout:'noBorders',
                        margin: [70 , 4 , 0 , 0],
                        table:{headerRows: 1 , widths:['20%' , '80%'],
                      body: [
                        [{text:'Description:'  , style:'heading'} , {text:this.contractProductData['articleName'] == null ? "" : this.contractProductData['articleName']+ "  " + this.contractProductData['construction'] , style:'heading2'}],] }
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
                        table:{headerRows: 1 , widths:['20%' , '80%'],
                      body: [
                        [{text:'Quantity:'  , style:'heading'} , {text: this.contractCostingData['quantity'] != ''? this.contractCostingData['quantity'] + " " +this.contractCostingData['quantityUOMName'] : " " , style:'heading2' , margin:[0,0,0,0]}],] }
                       
                      },
                      {
                        layout:'noBorders',
                        margin: [70 , 7 , 0 , 0],
                        table:{headerRows: 1 , widths:['20%' , '80%'],
                      body: [
                        [{text:'Rate:'  , style:'heading'} , {text:this.contractCostingData['rate'] != null ?  this.contractCostingData['rate']+ " per " + this.contractCostingData['rateUOMName'] :  " " , style:'heading2' , margin:[0,0,0,0]} ],] }
                      },
                      {
                        layout:'noBorders',
                        margin: [70 , 7 , 0 , 0],
                        table:{headerRows: 1 , widths:['20%' , '80%'],
                      body: [
                        [{text:'Total Value:'  , style:'heading'} , {text:this.contractCostingData['contractCost'] != '' ?  this.contractCostingData['rateCurrencyName'] + " " +this.contractCostingData['contractCost'] :  " " , style:'heading2' , margin:[0,0,0,0]} ],] }
                      
                      },
                      {
                        layout:'noBorders',
                        margin: [70 , 7 , 0 , 0],
                        table:{headerRows: 1 , widths:['20%' , '80%'],
                      body: [
                        [{text:'Payment Term:'  , style:'heading'} , {text: this.contractPaymentData['buyerPaymentTermName'] , style:'heading2'}],] }
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
                        [{text:'Deliveries Date:'  , style:'heading'} , {text: this.deliveryData.map((row=>row.buyerDateDay)) , style:'heading2'}],] }
                      },
                      {
                        layout:'noBorders',
                        margin: [70 , 7 , 0 , 0],
                        table:{headerRows: 1 , widths:['20%' , '80%'],
                        
                      body: [
                        [{text: this.contractCommissionData['commissionAmountBuyer'] == 0 ? " " :  'Commission:'  , style:'heading'} ,
                         {text:   this.contractCommissionData['commissionAmountBuyer'] == 0  ? " " : this.contractCommissionData['buyersideCommisionUOMName'] == null ?   this.contractCommissionData['buyersideCommision'] + "%" +"  ("+  " "+"Buyer Side Comm." +" )" : this.contractCommissionData['buyersideCommision'] + " per " + this.contractCommissionData['buyersideCommisionUOMName'] + " " +"( Buyer Side Comm. )" , style:'heading2'}],] }
                        
                        //  {text:  this.contractCommissionData['commissionAmountFabcot'] == 0  ? " " : this.contractCommissionData['fabCotCommisionUOMName'] == null ?   this.contractCommissionData['fabCotCommision'] + "%" +"  ("+  " "+"From Seller Side Comm." +" )": this.contractCommissionData['fabCotCommision'] + " per " + this.contractCommissionData['fabCotCommisionUOMName'] + " " +"From Seller Side"  , style:'heading2'}],] }
                        
                         // [{text: "Commission"  , style:'heading'} , {text:this.contractCommissionData['buyersideCommisionUOMName'] == null  ?  this.contractCostingData['rateCurrencyName']+ " " + this.contractCommissionData['commissionAmountBuyer']  + " Buyer Side Comm." : this.contractCommissionData['buyersideCommision'] + "/ " + this.contractCommissionData['buyersideCommisionUOMName'] + " "+"From Buyer Side" , style:'heading2'}],] }
                      },
                      {
                        layout:'noBorders',
                        margin: [168 , 0 , 0 , 3],
                        table:{headerRows: 1 , widths:['100%'],
                      body: [
                        [
                          {text: this.contractCommissionData['agentCommissions'] == '' ? " " : "Foreign Agent: " +  this.contractCommissionData['agentCommissions'].map((row=> row.agentName + " " + row.agentCommission + "%"))   , style : 'heading5'}
                        ],
                      ] }
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
                        [{text:'For FabCot International'  , style:'heading'}],] }
                      },
                      {
                        layout:'noBorders',
                        margin: [20 , 180 , 0 , 0],
                        table:{headerRows: 1 , widths:[ '100%'],
                      body: [
                        [ {text:'NOTE: This is a system generated Contract and does not require any signature.'  , style:'tableheader' }],] }
                      },
                    ],
                    styles:{
                     heading:{fontSize: 9,
                      bold: true,color: '#4d4b4b' },
                      headingR:{fontSize: 12,
                        bold: true,color: '#4d4b4b' },
                      heading2:{fontSize: 9  , color:'#4d4b4b'
                        },
                        heading4:{fontSize: 9  , color:'#4d4b4b',bold: true,
                      },
                        heading3:{fontSize: 6  , color:'#4d4b4b'
                      },
                      heading5:{fontSize: 8,color: '#4d4b4b' },
                        tableheader: {
                          fillColor: '#f3f3f4',
                          fontSize: 8,
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

            this.http.get(`${environment.apiUrl}/api/Reports/ContractIndentPrint/`+ this.contractId)
            .subscribe(
              res => {
                this.response = res;
                if (this.response.success == true && this.response.data != null) {
                  this.printData = this.response.data;
              
        
                }
                else if(this.response.success == false) {
                 
                  this.toastr.error(this.response.message, 'Message.');
                }
        
              },(err: HttpErrorResponse) => {
                const messages = this.service.extractErrorMessagesFromErrorResponse(err);
                this.toastr.error(messages.toString(), 'Message.');
                console.log(messages);
              });
        

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
                       fit : [100 , 100]
                    
                      },
                      {
                        layout:'noBorders',
                        margin: [390 , -30 , 0 , 0],
                        table:{headerRows: 1 , widths:['100%'],
                      body: [
                        [{text:this.contractData['revisedCount'] !=0? 'Revised': '' , style:'headingR'} ],] }
                      },
                      {
                        layout:'noBorders',
                        margin: [330 , 20 , 0 , 0],
                        table:{headerRows: 1 , widths:['30%' , '90%'],
                      body: [
                        [{text:'Contract No:'  , style:'heading'} , {text: this.loggedInDepartmentName =='Yarn Local Karachi'?this.contractData['manualContractNumber'] :this.contractData['autoContractNumber'] , 
                         margin:[-9,0,0,0] ,style:'heading2'}],] }
                      },
                      {
                        layout:'noBorders',
                        margin: [330 , 0 , 0 , 0],
                        table:{headerRows: 1 , widths:['40%' , '80%'],
                      body: [
                        [{text:'Contract Date:'  , style:'heading'} , {text: this.contractData['createdDateTime'] , margin:[-24,0,0,0],style:'heading2'}],] }
                      },
                      {
                        layout:'noBorders',
                        margin: [330 , 0 , 0 , 0],
                        table:{headerRows: 1 , widths:['40%' , '80%'],
                      body: [
                        [{text:'Purchase No:'  , style:'heading'} , {text: this.contractPartiesData['poNumber'] ,margin:[-25,0,0,0] , style:'heading2'}],] }
         },
                      {
                        layout:'noBorders',
                        margin: [70 , 10 , 0 , 0],
                        table:{headerRows: 1 , widths:['10%' , '60%'],
                      body: [
                        [{text:'Attn:'  , style:'heading'} , {text: this.contractPartiesData['sellerPOCName'] , margin:[-20,0,0,0] , style:'heading4'}]] }
                      },
                      {
                        layout:'noBorders',
                        margin: [70 , 0 , 0 , 0],
                        table:{headerRows: 1 , widths:['100%'],
                      body: [
                        [{text:' We are please to confirm here the booking as per following term and conditions.' , style:'heading2'}  ],] }
                      },
                     
                      {
                        layout:'noBorders',
                        margin: [70 , 17 , 0 , 0],
                        table:{headerRows: 1 , widths:['20%' , '80%'],
                      body: [
                        [{text:'Supplier Name:'  , style:'heading'} , {text: this.contractPartiesData['sellerName'] , style:'heading2'}],] }
                      },
                      {
                        layout:'noBorders',
                        margin: [280 , -2 , 0 , 0],
                        table:{headerRows: 1 , widths:['12%' , '80%'],
                      body: [
                        [{text:'GST:'  , style:'heading3'} , {text: this.printData['sellerGSTNumber'], style:'heading3' ,margin:[-20 , 0,0,0] }],] }
                      },
                      {
                        layout:'noBorders',
                        margin: [380 , -11 , 0 , 0],
                        table:{headerRows: 1 , widths:['16%' , '80%'],
                      body: [
                        [{text:'NTN:'  , style:'heading3'} , {text: this.printData['sellerNTNNumber'] , style:'heading3',margin:[-10 , 0,0,0] }],] }
                      },
                      {
                        layout:'noBorders',
                        margin: [70 , -3 , 0 , 0],
                        table:{headerRows: 1 , widths:['20%' , '80%'],
                      body: [
                        [{text:'Buyer Name:'  , style:'heading'} , {text: this.contractPartiesData['buyerName'] , style:'heading2'}],] }
                      },
                          
                      {
                        layout:'noBorders',
                        margin: [280 , -4 , 0 , 0],
                        table:{headerRows: 1 , widths:['12%' , '80%'],
                      body: [
                        [{text:'GST:'  , style:'heading3'} , {text: this.printData['buyerGSTNumber'] , style:'heading3',margin:[-20 , 0,0,0] }],] }
                      },
                      {
                        layout:'noBorders',
                        margin: [380 , -13 , 0 , 0],
                        table:{headerRows: 1 , widths:['16%' , '80%'],
                      body: [
                        [{text:'NTN:'  , style:'heading3'} , {text: this.printData['buyerNTNNumber'] , style:'heading3' , margin:[-10 , 0,0,0] }],] }
                      },
                      {
                        layout:'noBorders',
                        margin: [70 , 7 , 0 , 0],
                        table:{headerRows: 1 , widths:['20%' , '80%'],
                      body: [
                        [{text:'Description:'  , style:'heading'} , {text: this.contractProductData['articleName'] == null ? "" : this.contractProductData['articleName']+ "  " + this.contractProductData['construction'] , style:'heading2'}],] }
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
                        table:{headerRows: 1 , widths:['20%' , '80%'],
                      body: [
                        [{text:'Quantity:'  , style:'heading'} , {text: this.contractCostingData['quantity'] != ''? this.contractCostingData['quantity'] + " " +this.contractCostingData['quantityUOMName'] : " " , style:'heading2' , margin:[0,0,0,0]}],] }
                      },
                      {
                        layout:'noBorders',
                        margin: [70 , 7 , 0 , 0],
                        table:{headerRows: 1 , widths:['20%' , '80%'],
                      body: [
                        [{text:'Rate:'  , style:'heading'} , {text:this.contractCostingData['rate'] != null ?  this.contractCostingData['rate']+ " per " + this.contractCostingData['rateUOMName'] :  " " , style:'heading2' , margin:[0,0,0,0]} ],] }
                      
                      },
                      {
                        layout:'noBorders',
                        margin: [70 , 7 , 0 , 0],
                        table:{headerRows: 1 , widths:['20%' , '80%'],
                      body: [
                        [{text:'Total Value:'  , style:'heading'} , {text:this.contractCostingData['contractCost'] != '' ?  this.contractCostingData['rateCurrencyName'] + " " +this.contractCostingData['contractCost'] :  " " , style:'heading2' , margin:[0,0,0,0]} ],] }
                      
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
                        [{text:'Deliveries Date:'  , style:'heading'} , {text: this.deliveryData.map((row=>row.supplierDateDay)) , style:'heading2'}],] }
                      },
                      {
                        layout:'noBorders',
                        margin: [70 , 7 , 0 , 0],
                        table:{headerRows: 1 , widths:['20%' , '80%'],
                      body: [
                        [{text: this.contractCommissionData['commissionAmountFabcot'] == 0 ? " " :  'Commission:'  , style:'heading'} ,
                         {text:  this.contractCommissionData['commissionAmountFabcot'] == 0  ? " " : this.contractCommissionData['fabCotCommisionUOMName'] == null ?   this.contractCommissionData['fabCotCommision'] + "%" +"  ("+  " "+"From Seller Side Comm." +" )": this.contractCommissionData['fabCotCommision'] + " per " + this.contractCommissionData['fabCotCommisionUOMName'] + " " +"From Seller Side"  , style:'heading2'}],] }
                        
                      },
                      // {
                      //   layout:'noBorders',
                      //   margin: [168 , 0 , 0 , 3],
                      //   table:{headerRows: 1 , widths:['100%'],
                      // body: [
                      //   [
                      //     {text: this.contractCommissionData['agentCommissions'] == '' ? " " : "Foreign Agent: " +  this.contractCommissionData['agentCommissions'].map((row=> row.agentName + " " + row.agentCommission + "%"))   , style : 'heading5'}
                      //   ],
                      // ] }
                      // },
                      {
                        layout:'noBorders',
                        margin: [70 , 7 , 0 , 0],
                        table:{headerRows: 1 , widths:['20%' , '80%'],
                      body: [
                        [{text:'Remarks:'  , style:'heading'} , {text: this.contractRemarksData['contractRemarks'] , style:'heading2'}],] }
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
                        [{text:'For FabCot International'  , style:'heading'}],] }
                      },
                      {
                        layout:'noBorders',
                        margin: [20 , 180 , 0 , 0],
                        table:{headerRows: 1 , widths:[ '100%'],
                      body: [
                        [ {text:'NOTE: This is a system generated Contract and does not require any signature.'  , style:'tableheader' }],] }
                      },
                    ],
                    styles:{
                     heading:{fontSize: 9,
                      bold: true,color: '#4d4b4b' },
                      headingR:{fontSize: 12,
                        bold: true,color: '#4d4b4b' },
                      heading2:{fontSize: 9  , color:'#4d4b4b'
                        },
                        heading4:{fontSize: 9  , color:'#4d4b4b', bold:true
                      },
                        heading3:{fontSize: 6  , color:'#4d4b4b'
                      },
                      heading5:{fontSize: 8,color: '#4d4b4b' },
                        tableheader: {
                          fillColor: '#f3f3f4',
                          fontSize: 8,
                          bold: true,
                          color: '#4d4b4b',
                         alignment:'center',
                          margin:8
                        
                         }
                    },
                    
          
            };
            pdfMake.createPdf(docDefinition).print();
          }

     

          print2(){
            
           
            this.http.get(`${environment.apiUrl}/api/Reports/ContractIndentPrint/`+ this.contractId)
            .subscribe(
              res => {
                this.response = res;
                if (this.response.success == true && this.response.data != null) {
                  this.printData = this.response.data;
              
        
                }
                else if(this.response.success == false) {
                 
                  this.toastr.error(this.response.message, 'Message.');
                }
        
              },(err: HttpErrorResponse) => {
                const messages = this.service.extractErrorMessagesFromErrorResponse(err);
                this.toastr.error(messages.toString(), 'Message.');
                console.log(messages);
              });
            
           
            let docDefinition = {
              pageSize: 'A4',
              pageMargins: [ 5, 5, 5, 10 ],
              pageOrientation: 'letter',
                
                    info: {
                      title: 'Contract Buyer'
                    },
                 
                    content: [
                   
                      {
                        "image" : this.image2,
                       fit : [130 , 130] , margin:[420,5,0,0]
                    
                      },
                      // {
                      //   layout:'noBorders',
                      //   margin: [330 , -30 , 0 , 0],
                      //   table:{headerRows: 1 , widths:['100%'],
                      // body: [
                      //   [{text:this.checkR  , style:'heading'} ],] }
                      // },
                       {
                        layout:'noBorders',
                        margin: [20 , -50 , 0 , 0],
                        table:{headerRows: 1 , widths:['60%' , '40%' ],
                      body: [
                        [{text:'FABCOT INTERNATIONAL'  , style:'heading10'} ,
                        {text:this.checkR  , style:'heading10'}
                      ],] }
                      },
                      {
                        layout:'noBorders',
                        margin: [20 , 8 , 0 , 0],
                        table:{headerRows: 1 , widths:['100%' ],
                      body: [
                        [{text:'133 Aurangzeb Block, New Garden Town, Lahore'  , style:'heading'} 
                      ],] }
                      },
                      {
                        layout:'noBorders',
                        margin: [20 , 8 , 0 , 0],
                        table:{headerRows: 1 , widths:['20%' , '50%' ],
                      body: [
                        [{text:'Tel. +92-42-35846171-4'  , style:'heading'} ,
                        {text:'Fax: +92-42-35846175'  , style:'heading'} 
                      ],] }
                      },
                      { 
                        margin:[0,-56,0,0],
                        canvas: 
                        [
                            
                            {
                              type: 'line',
                              x1: 0, y1: 60,
                              x2: 590, y2: 60,
                              lineWidth: 0.5,
                            

                            }
                        ]
                     },
                     { 
                      margin:[0,-58.5,0,0],
                      canvas: 
                      [
                          
                          {
                            type: 'line',
                            x1: 0, y1: 60,
                            x2: 590, y2: 60,
                            lineWidth: 0.5,
                          

                          }
                      ]
                   },
                         {
                        layout:'noBorders',
                        margin: [70 , 2 , 0 , 0],
                        table:{headerRows: 1 , widths:['50%' , '50%'],
                      body: [
                        [{text:'To:  ' + this.contractPartiesData['buyerName']  , style:'heading'} ,
                        {text:'Contract No:  ' + this.contractData['autoContractNumber']  , margin:[60, 0,0,0] , style:'heading'}
                      ],] }
                      },
                      {
                        layout:'noBorders',
                        margin: [70 , 0 , 0 , 0],
                        table:{headerRows: 1 , widths:['50%' , '50%'],
                      body: [
                        [{text:'Attn:  ' + this.contractPartiesData['buyerPOCName']  , style:'heading'} ,
                        {text:'Contract Date:  ' + this.contractData['createdDateTime']  , margin:[60, 0,0,0] , style:'heading'}
                      ],] }
                      },
                      {
                        layout:'noBorders',
                        margin: [0 , 0 , 0 , 0],
                        table:{headerRows: 1 , widths:['90%' , '50%'],
                      body: [
                        [{text: this.contractPartiesData['sellerContract'] ==null ? " ": this.contractPartiesData['sellerContract'] ==''?" ": 'Supplier Contract# :  ' + this.contractPartiesData['sellerContract']  , style:'heading'  , margin:[392, -1,0,-10] } ,
                      
                      ],] }
                      },
                      // {
                      //   layout:'headerLineOnly',
                        
                      //   margin: [0 , 0 , 0 , 0],
                      //   table : {
                      //     headerRows : 1,
                      //     widths: ['100%'],
                      //     body : [
                      //             [''],
                      //             [''],
                             
                      //             ]
                      // },
                      // },
                      { 
                        margin:[0,-49,0,0],
                        canvas: 
                        [
                            
                            {
                              type: 'line',
                              x1: 0, y1: 60,
                              x2: 590, y2: 60,
                              lineWidth: 0.5,
                            

                            }
                        ]
                     },
                     { 
                      margin:[0,-58.5,0,0],
                      canvas: 
                      [
                          
                          {
                            type: 'line',
                            x1: 0, y1: 60,
                            x2: 590, y2: 60,
                            lineWidth: 0.5,
                           

                          }
                      ]
                   },
                      {
                        layout:'noBorders',
                        margin: [105 , 0 , 0 , 0],
                        table:{headerRows: 1 , widths:['100%'],
                      body: [
                        [{text:' We are please to confirm the following contract for A Grade Air Jet Fabric ' , style:'heading'}  ],] }
                      },

                      
                      { 
                        margin:[10,-105,0,0],
                        canvas: 
                        [
                            
                            {
                              type: 'line',
                              x1: 90, y1: 90,
                              x2:90, y2: 630,
                              lineWidth: 1,
                              
                            }
                        ]
                     },
              {
                        layout:'noBorders',
                        margin: [20 , -510 , 0 , 0],
                        table:{headerRows: 1 , widths:['20%' , '45%' ],
                      body: [
                        [{text:'Seller Name:'  , style:'heading'} , {text: this.printData['sellerName'] ,margin:[-30,0,0,0] ,   style:'heading2'} , 
                        // {text:this.printData['sellerNTNNumber'] ==''? '' : 'NTN:'  , style:'heading4' ,margin:[0,0,0,0]} , 
                        // {text: this.printData['sellerNTNNumber'], style:'heading5' ,margin:[-38,0,0,0] }, 
                        // {text:this.printData['sellerGSTNumber'] ==''? '' :'GST:'  , style:'heading4' ,margin:[-15,0,0,0]} , 
                        // {text: this.printData['sellerGSTNumber'], style:'heading5' ,margin:[-28,0,0,0] }, 
                      
                      
                      ],] }
                      },

                      // {
                      //   layout:'noBorders',
                      //   margin: [0 , 0 , 0 , 0],
                      //   table:{headerRows: 1 , widths:['70%' , '30%'],
                      // body: [
                      //   [{text: "NTN:" , style:'heading' , margin:[392, -1,0,-10] } , {text:'GST:' , style:'heading'}
                      
                      // ],] }
                      // },
                     
                       {
                        layout:'noBorders',
                        margin: [20 , 2 , 0 , 0],
                        table:{headerRows: 1 , widths:['20%' , '40%'],
                      body: [
                        [{text:'Items:'  , style:'heading'} , {text: this.printData['articleName'] , margin:[-35,0,0,0],    style:'heading2'}],] }
                      },
                      {
                        layout:'noBorders',
                        margin: [20 , 2 , 0 , 0],
                        table:{headerRows: 1 , widths:['20%' , '40%'],
                      body: [
                        [{text:'Pick Insertion:'  , style:'heading'} , {text: this.printData['pickInsertionName'] , margin:[-35,0,0,0] , style:'heading2'}],] }
                      },

                      {
                        layout:'noBorders',
                        margin: [20 , 2 , 0 , 0],
                        table:{headerRows: 1 , widths:['20%' , '40%'],
                      body: [
                        [{text:'Width:'  , style:'heading'} , {text: this.printData['width'] == null ?  " " : this.printData['width'] + " inch" , margin:[-35,0,0,0]  , style:'heading2'}],] }
                      },
                   
                      {
                        layout:'noBorders',
                        margin: [20 , 2 , 0 , 0],
                        table:{headerRows: 1 , widths:['20%' , '40%'],
                      body: [
                        [{text:'Weave:'  , style:'heading'} , {text: this.printData['weaveName'] ,    margin:[-35,0,0,0] , style:'heading2'}],] }
                      },
                      {
                        layout:'noBorders',
                        margin: [20 , 2 , 0 , 0],
                        table:{headerRows: 1 , widths:['20%' , '40%'],
                      body: [
                        [{text:'Selvedge:'  , style:'heading'} , {text: this.printData['selvedgeName'] ,  margin:[-35,0,0,0] ,style:'heading2'}],] }
                      },
                      {
                        layout:'noBorders',
                        margin: [20 , 2 , 0 , 0],
                        table:{headerRows: 1 , widths:['20%' , '7%' , '40%'],
                      body: [
                        [{text:'Blending Ratio:'  , style:'heading'} , {text: "Warp:" , margin:[-35,0,0,0] , style:'heading'} ,  {text: this.printData['blendingRatioWarpName'] , margin:[-40,0,0,0] ,  style:'heading2'}],] }
                      },
                      {
                        layout:'noBorders',
                        margin: [20 , 2 , 0 , 0],
                        table:{headerRows: 1 , widths:['20%' , '5%' ,'40%'],
                      body: [
                        [{text:'     '  , style:'heading'} , {text: "Weft:" , margin:[-35,0,0,0] , style:'heading'} ,  {text: this.printData['blendingRatioWeftpName'] , margin:[-30,0,0,0] , style:'heading2'}],] }
                      },
                

  {
                        layout:'noBorders',
                        margin: [20 , 2 , 0 , 0],
                        table:{headerRows: 1 , widths:['20.5%' , '35%' , '10%' , '20%'],
                      body: [
                        [
                          {text:'Quantity:'  , style:'heading'} , {text: this.contractCostingData['quantity'] + "  " + this.contractCostingData['quantityUOMName'] ,  style:'heading2' , margin:[-35,0,0,0]}, {text: "Margin:"  , margin:[-120,0,0,0] , style:'heading'} , {text: "+/-" +this.contractCostingData['quantityToleranceValue'] + '%' , margin:[-140,0,0,0] , style:'heading2'}],
                        ] }
                      },
                      {
                        layout:'noBorders',
                        margin: [22 , 2 , 0 , 0],
                        table:{headerRows: 1 , widths:['21%' , '20%' , '10%' , '20%' , '10%' , '10%','5%','5%'],
                      body: [
                        [
                          {text:'Rate:'  , style:'heading'} , {text: this.contractCostingData['rateUOMName'] == "Meters" ?  
                          this.contractCostingData['rateCurrencyName'] == 'PKR' ? " Rs " + this.contractCostingData['rate'] +  " /  Meter"  : " $ " +  this.contractCostingData['rateCurrencyName'] == 'USD' ? this.contractCostingData['rate'] +  " /  Meter" : this.contractCostingData['rateCurrencyName'] == 'EUR' ? " € " + this.contractCostingData['rate'] +  " /  Meter" : this.contractCostingData['rateCurrencyName'] == 'GBP' ? " £ " + this.contractCostingData['rate'] +  " /  Meter" : ''
                          : 
                          this.contractCostingData['rateCurrencyName'] == 'PKR' ?  " Rs " + this.contractCostingData['rate'] + " / Yard" : " $ " +  this.contractCostingData['rateCurrencyName'] == 'USD' ? this.contractCostingData['rate'] +  " /  Yard" : this.contractCostingData['rateCurrencyName'] == 'EUR' ? " € " + this.contractCostingData['rate'] + " /  Yard" :" £ " + this.contractCostingData['rateCurrencyName'] == 'GBP' ? this.contractCostingData['rate'] +  " /  Yard" : '' 
                          
                           ,
                          
                           style:'heading2' , margin:[-35,0,0,0]},
                            {text: "GST:"  , margin:[-30,0,0,0] , style:'heading'} , {text: this.printData['gst'] != null ? this.contractCostingData['gst'] + "%" : " "  , margin:[-60,0,0,0] , style:'heading2'} , 
                            {text: "AI.Tax:" , margin:[-120,0,0,0] , style:'heading'} , {text: this.contractCostingData['adIncomeTaxFL'] != null ? this.contractCostingData['adIncomeTaxFL'] + "%" : "0"  , margin:[-140,0,0,0] , style:'heading2'} ,
                           {text: "W.Tax:"  , margin:[-140,0,0,0] , style:'heading'} , {text: "As applicable by Government Law"  , margin:[-140,0,0,0] , style:'heading2'}],
                        ] }
                      },
                      {
                        layout:'noBorders',
                        margin: [20 , 2 , 0 , 0],
                        table:{headerRows: 1 , widths:['20.5%' , '39%' , '20%' , '20%'],
                      body: [
                        [{text:'Total Amount:'  , style:'heading'} , {text:    
                          this.contractCostingData['rateCurrencyName'] + " "+ this.contractCostingData['contractCost'] ,  margin:[-35,0,0,0] ,style:'heading2'} , {text: "Amount Incl GST:"  , margin:[-160,0,0,0] , style:'heading'} , {text: 
                          
                            this.contractCostingData['rateCurrencyName'] + " " + this.contractCostingData['totalCostGSt']   , margin:[-200,0,0,0] , style:'heading2'}],] }
                      },
                     
                      {

                        layout:'noBorders',
                        margin: [20 , 2 , 0 , 0],
                        table:{headerRows: 1 , widths:['20%' , '40%'],
                      body: [
                        [{text:'Packing:'  , style:'heading'} , {text: this.contractPaymentData['packingName'] , margin:[-35,0,0,0] , style:'heading2'}],] }
                      },
                      {
                        layout:'noBorders',
                        margin: [20 , 2 , 0 , 0],
                        table:{headerRows: 1 , widths:['20%' , '40%'],
                      body: [
                        [{text:'Piece Length:'  , style:'heading'} , {text: this.contractProductData['pieceLengthName'] , margin:[-35,0,0,0] , style:'heading2'}],] }
                      },
                   
                      {
                        layout:'noBorders',
                        margin: [20 , 2 , 0 , 0],
                        table:{headerRows: 1 , widths:['20%' , '40%'],
                      body: [
                        [{text:'Payment Terms:'  , style:'heading'} , {text: this.contractPaymentData['buyerPaymentTermDays'] == '' ? this.contractPaymentData['buyerPaymentTermName'] +
                        this.contractPaymentData['buyerSidePaymentTermInfo']  :this.contractPaymentData['buyerPaymentTermName'] + this.contractPaymentData['buyerPaymentTermDays']+ " Days " + this.contractPaymentData['buyerSidePaymentTermInfo']  , margin:[-35,0,0,0] , style:'heading2'}],] }
                      },
                      {
                        layout:'noBorders',
                        margin: [20 , 2 , 0 , 0],
                        table:{headerRows: 1 , widths:['20%' , '40%'],
                      body: [
                        [{text:'Mode of Payment:'  , style:'heading'} , {text: this.contractPaymentData['paymentMode'] , margin:[-35,0,0,0] , style:'heading2'}],] }
                      },
                      {
                        layout:'noBorders',
                        margin: [20 , 2 , 0 , 0],
                        table:{headerRows: 1 , widths:['20%' , '40%'],
                      body: [
                        [{text:'Delivery Term:'  , style:'heading'} , {text: this.contractPaymentData['priceTermName'] + " " +this.contractPaymentData['destinationName']  , margin:[-35,0,0,0] , style:'heading2'}],] }
                      },
                      {
                        layout:'noBorders',
                        margin: [20 , 2 , 0 , 0],
                        table:{headerRows: 1 , widths:['20%' , '40%'],
                      body: [
                        [{text:'Deliveries Date:'  , style:'heading'} , {text: this.deliveryData.map((row=>row.buyerDateDay)) , margin:[-35,0,0,0] , style:'heading2'}],] }
                      
                      },
                      {
                        layout:'noBorders',
                        margin: [20 , 2 , 0 , 0],
                        table:{headerRows: 1 , widths:['20%' , '40%'],
                      body: [
                        [{text:'Delivery Address:'  , style:'heading'} , {text: this.printData['deliveryAddress'] , margin:[-35,0,0,0] , style:'heading2'}],] }
                      },
                      {
                        layout:'noBorders',
                        margin: [20 , 2 , 0 , 0],
                        table:{headerRows: 1 , widths:['20%' , '40%'],
                      body: [
                        [{text:'Invoice Address:'  , style:'heading'} , {text: this.printData['invoiceAddress'] , margin:[-35,0,0,0] , style:'heading2'}],] }
                      },
                      {
                        layout:'noBorders',
                        margin: [20 , 2 , 0 , 0],
                        table:{headerRows: 1 , widths:['20%' , '40%'],
                      body: [
                        [{text:'GST#:'  , style:'heading'} , {text: this.printData['sellerGSTNumber'] , margin:[-35,0,0,0] ,style:'heading2'}],] }
                      },
                      {
                        layout:'noBorders',
                        margin: [20 , 2 , 0 , 0],
                        table:{headerRows: 1 , widths:['20%' , '80%'],
                      body: [
                        [{text:'Remarks:' , style:'heading'} , {text: this.contractRemarksData['contractRemarks'] , margin:[-35,0,0,0] , style:'heading2'}],] }
                      },

                      {
                        layout:'noBorders',
                        margin: [20 , 2 , 0 , 0],
                        table:{headerRows: 1 , widths:['20%' , '80%'],
                      body: [
                        [{text:'Other Conditions:' , style:'heading'} , {text: this.contractRemarksData['otherConditionRemarks'] , margin:[-35,0,0,0] , style:'heading2'}],] }
                      },
                   
                      // {
                      //   layout:'headerLineOnly',
                        
                      //   margin: [0 , 5 , 0 , 0],

                      //   table : {
                      //     headerRows : 1,
                         

                      //     widths: ['100%'],
                      //     body : [
                      //             [''],
                      //             [''],
                             
                      //             ]
                      // },
                      // },

                      { 
                        margin:[0,15,0,0],
                        canvas: 
                        [
                            
                            {
                              type: 'line',
                              x1: 0, y1: 60,
                              x2: 590, y2: 60,
                              lineWidth: 1,
                              // lineColor:'#535353'

                            }
                        ]
                     },


                       {
                        layout:'noBorders',
                        margin: [20 , 80 , 0 , 0],
                        table:{headerRows: 1 , widths:['100%'],
                      body: [
                        [{text:'Please get it signed & send back same for our record purpose'  ,  style:'heading'}],] }
                      },
                      {
                        layout:'noBorders',
                        margin: [20 , 10 , 0 , 0],
                        table:{headerRows: 1 , widths:['100%'],
                      body: [
                        [{text:'For FabCot International'  , style:'heading'}],] }
                      },
            
                    ],
                    styles:{
                     heading:{fontSize: 9,
                      bold: true,
                     },
                     heading4:{fontSize: 8,
                      bold: true,
                     },
                      heading10:{fontSize: 10,
                        bold: true,
                        // color: '#4d4b4b' 
                      },
                      heading2:{fontSize: 9  , 
                        },
                        heading5:{fontSize: 8  , 
                        },
                        heading3:{fontSize: 7  , 
                          // color:'#4d4b4b'
                            bold:true
                      },
                      lineColor:{
                        // color:'#535353'
                      },
                        tableheader: {
                          fillColor: '#f3f3f4',
                          fontSize: 9,
                          bold: true,
                          // color: '#4d4b4b',
                         alignment:'center',
                          margin:8
                        
                         }
                    },
                    
          
            };
            pdfMake.createPdf(docDefinition).print();
          
          }

          printFE(){


            this.http.get(`${environment.apiUrl}/api/Reports/ContractIndentPrint/`+ this.contractId)
            .subscribe(
              res => {
                this.response = res;
                if (this.response.success == true && this.response.data != null) {
                  this.printData = this.response.data;
              
        
                }
                else if(this.response.success == false) {
                 
                  this.toastr.error(this.response.message, 'Message.');
                }
        
              },(err: HttpErrorResponse) => {
                const messages = this.service.extractErrorMessagesFromErrorResponse(err);
                this.toastr.error(messages.toString(), 'Message.');
                console.log(messages);
              });

            let docDefinition = {
              pageSize: 'A4',
              pageMargins: [ 30, 20, 40, 20],
              pageOrientation: 'letter',
                
                    info: {
                      title: 'Contract Buyer'
                    },
                 
                    content: [
             
                      {
                        "image" : this.image2,
                       fit : [140 , 140]
                    
                      },
                      {
                        layout:'noBorders',
                        margin: [340 , -35 , 0 , 0],
                        table:{headerRows: 1 , widths:['100%'],
                      body: [
                        [{text:this.checkR  , style:'heading'} ],] }
                      },
                      {
                        layout:'noBorders',
                        margin: [340 , 0 , 0 , 0],
                        table:{headerRows: 1 , widths:['40%' , '60%'],
                      body: [
                        [{text:'Contract No:'  , style:'heading'} , {text: this.contractData['autoContractNumber'] , style:'heading2' , margin:[-7 , 0, 0,0]}],] }
                      },
                      {
                        layout:'noBorders',
                        margin: [340 , 0 , 0 , 0],
                        table:{headerRows: 1 , widths:['45%' , '75%'],
                      body: [
                        [{text:'Contract Date:'  , style:'heading'} , {text: this.contractData['createdDateTime'] , style:'heading2' , margin:[-20 , 0, 0,0]}],] }
                      },
                      {
                        layout:'noBorders',
                        margin: [340 , 0 , 0 , 0],
                        table:{headerRows: 1 , widths:['40%' , '80%'],
                      body: [
                        [{text:this.contractPartiesData['poNumber'] =='' || this.contractPartiesData['poNumber'] == null ? "" :  'Purchase No:'  , style:'heading'} , {text:this.contractPartiesData['poNumber']== ''|| this.contractPartiesData['poNumber'] == null ? "" : this.contractPartiesData['poNumber'] , style:'heading2' , margin:[-15 , 0, 0,0]}],] }
                      },
                      {
                        layout:'noBorders',
                        margin: [70 , 40 , 0 , 0],
                        table:{headerRows: 1 , widths:['10%' , '60%'],
                      body: [
                        [{text:this.contractPartiesData['buyerPOCName'] ==null ? " " : 'Attn:'  , style:'heading'} , {text:this.contractPartiesData['buyerPOCName'] ==null?" " : this.contractPartiesData['buyerPOCName'] , margin:[-20,0,0,0] , style:'heading5'}]] }
                      },
                      {
                        layout:'noBorders',
                        margin: [70 , 3 , 0 , 0],
                        table:{headerRows: 1 , widths:['100%'],
                      body: [
                        [{text:' We are please to confirm here the booking as per following term and conditions.' , style:'heading2'}  ],] }
                      },
                      {
                        layout:'noBorders',
                        margin: [70 , 15 , 0 , 0],
                        table:{headerRows: 1 , widths:['20%' , '70%'],
                      body: [
                        [{text:'Buyer :'  , style:'heading'} , {text: this.contractPartiesData['buyerName'], style:'heading2'}],] }
                      },
                 
                      {
                        layout:'noBorders',
                        margin: [70 , 4 , 0 , 0],
                        table:{headerRows: 1 , widths:['20%' , '80%'],
                      body: [
                        [{text:'Supplier :'  , style:'heading'} , {text: this.contractPartiesData['sellerName'] , style:'heading2'}],] }
                      },
                     
                    
                      {
                      
                        layout:'noBorders',
                        margin: this.contractProductData.pecenetAge || this.contractProductData.febricType || this.contractProductData.construction !=''? [70 , 4 , 0 , 0]:[0 , -15 , 0 , 0],
                        table:{headerRows: 1 , widths:['20%' , '80%' ],
                      body: [
                        [{text:this.contractProductData['pecenetAge'] || this.contractProductData['febricType'] || this.contractProductData['construction'] !='' ?'Blend:' :'' , style:'heading'} , {text:this.contractProductData['pecenetAge'] !='' ? this.contractProductData['pecenetAge']+ '%'+ ' ' + this.contractProductData['febricType']+ ' ' +this.contractProductData['construction']  : this.contractProductData['febricType']+ ' ' +this.contractProductData['construction']  , style:'heading2'},
                       
                      
                      ],] }
                      
                      },
                      {
                        layout:'noBorders',
                        margin: [70 , 4 , 0 , 0],
                        table:{headerRows: 1 , widths:['20%' , '80%'],
                      body: [
                        [{text:'Description:'  , style:'heading'} , {text: this.contractProductData['articleName'] , style:'heading2'}],] }
                      },
                   
                     
                      {
                        layout:'noBorders',
                        margin: this.contractProductData.weaveName !=''? [70 , 4 , 0 , 0]:[0 , -5 , 0 , 0],
                        table:{headerRows: 1 , widths:['20%' , '80%' ],
                      body: [

                        [{text:this.contractProductData['weaveName'] !='' ?'Weave:':''  , style:'heading'} , {text: this.contractProductData['weaveName'] , style:'heading2' } ,



                        // [{text:'Weave:'  , style:'heading'} , {text: this.printData['weaveName'] , style:'heading2'} ,
                        // {text: this.contractProductData['selvedgeName'] =='' ? " " :'Selvedge:'  , style:'heading'} , 
                        // {text:this.contractProductData['selvedgeName'] =='' ? "" :  this.contractProductData['selvedgeName'] , style:'heading2'},
                        // {text:this.contractProductData['gsm'] ==''? '' : 'GSM:'  , style:'heading'} , {text:this.contractProductData['gsm'] ==''? '' : this.contractProductData['gsm'] , style:'heading2'}  ,
                        // {text: this.contractProductData['tolerance'] == null?  " " :   this.contractProductData['tolerance'] ==0? " ": "+/- " + this.contractProductData['tolerance'] + "%" , style:'heading2'},
                     
                      ],] }
                      },
                      {
                        layout:'noBorders',
                        margin: [70 , 4 , 0 , 0],
                        table:{headerRows: 1 , widths:['20%' , '80%'],
                      body: [
                        [{text: this.contractProductData['selvedgeName'] =='' ? " " :'Selvedge:'  , style:'heading'} , 
                        {text:this.contractProductData['selvedgeName'] ='' ? "" : this.contractProductData['selvedgeName'] , style:'heading2'}],] }
                      },


                      {
                        layout:'noBorders',
                        margin: this.contractProductData.gsm !=''? [70 , 4 , 0 , 0]:[0 , -15 , 0 , 0],
                        table:{headerRows: 1 , widths:this.contractProductData.gsm !=''?['20%' , '10%' , '8%']:['0%' , '0%' , '0%'],
                      body: [
                        [{text:this.contractProductData['gsm'] ==''? '' : 'GSM:'  , style:'heading'} , {text:this.contractProductData['gsm'] =''? '' : this.contractProductData['gsm'] , style:'heading2'}  ,
                         {text: this.contractProductData['tolerance'] == null?  " " : this.contractProductData['tolerance'] ==0? " ": "+/- " + this.contractProductData['tolerance'] + "%" , style:'heading2'}],] }
                      },
                      {

                        layout:'noBorders',
                        margin: [70 , 4 , 0 , 0],
                        table:{headerRows: 1 , widths:['20%' , '80%'],
                      body: [
                        [{text:'Packing:'  , style:'heading'} , {text: this.contractPaymentData['packingName'] , style:'heading2'}],] }
                      },
                      {
                        layout:'noBorders',
                        margin: [70 , 4 , 0 , 0],
                        table:{headerRows: 1 , widths:['20%' , '80%'],
                      body: [
                        [{text:'Piece Length:'  , style:'heading'} , {text: this.contractProductData['pieceLengthName'] , style:'heading2'}],] }
                      },
                    
                      {
                        layout:'noBorders',
                        margin: [70 , 4 , 0 , 0],
                        table:{headerRows: 1 , widths:['20%' , '35%' , '10%'],
                      body: [
                        [{text:'Quantity:'  , style:'heading'} , {text:this.contractCostingData['quantity'] != null ?  this.contractCostingData['quantity'] + " " + this.contractCostingData['quantityUOMName'] : "", style:'heading2' , margin:[0,0,0,0]},
                        
                        {text:"  " +this.contractCostingData['quantityToleranceValue'] !='' && this.contractCostingData['quantityToleranceValue'] !=0 ?  "+/-" +this.contractCostingData['quantityToleranceValue'] + '%' : " " , margin:[-80,0,0,0] , style:'heading2'}],] }
                      },
                      {
                        layout:'noBorders',
                        margin: [340 , -13 , 0 , 0],
                        table:{headerRows: 1 , widths:['30%' , '70%'],
                      body: [
                        [{text:this.contractPaymentData['count'] ==''?'':'Container:'  , style:'heading3'} , {text: this.contractPaymentData['count'] + " " + this.contractPaymentData['containerName'], margin:[-20,0,0,0] , style:'heading3'}],] }
                      },
                     
                      {
                        layout:'noBorders',
                        margin: [70 , 4 , 0 , 0],
                        table:{headerRows: 1 , widths:['20%' , '80%'],
                      body: [
                        [
                          {text:'Rate:'  , style:'heading'} , {text:this.contractCostingData['rateCurrencyName']+ " " + this.contractCostingData['rate' ]
                          + "  /" + this.contractCostingData['rateUOMName']  , style:'heading2' , margin:[0,0,0,0]} ,
                        ],] }
                      },
                     
                      {
                        layout:'noBorders',
                        margin: [70 , 4 , 0 , 0],
                        table:{headerRows: 1 , widths:['20%' , '80%'],
                      body: [
                        [{text:'Total Amount:'  , style:'heading'} , {text: this.contractCostingData['rateCurrencyName'] + " " + this.contractCostingData['contractCost'] , style:'heading2'}],] }
                      },
                      {
                        layout:'noBorders',
                        margin: [70 , 4 , 0 , 0],
                        table:{headerRows: 1 , widths:['20%' , '80%'],
                      body: [
                        [{text:'Payment Term:'  , style:'heading'} ,
                        
                        {text: this.contractPaymentData['sellerPaymentTermName'] + " "+this.contractPaymentData['sellerPaymentTermDays']+" " +this.contractPaymentData['sellerPaymentTermInfo'] , style:'heading2'}
                        
                      
                      
                      ],] }
                      },
                      {
                        layout:'noBorders',
                        margin: [70 , 4 , 0 , 0],
                        table:{headerRows: 1 , widths:['20%' , '80%'],
                      body: [
                        [{text:'Delivery Term:'  , style:'heading'} , {text: this.contractPaymentData['priceTermName'] + " " +this.contractPaymentData['destinationName'] , style:'heading2'}],] }
                      },
                      {
                        layout:'noBorders',
                        margin: [70 , 4 , 0 , 0],
                        table:{headerRows: 1 , widths:['20%' , '80%'],
                      body: [
                        [{text:'Deliveries Date:'  , style:'heading'} , {text: this.deliveryData.map((row=>row.buyerDateDay)) , style:'heading2'}],] }

                      },
                      // {
                      //   layout:'noBorders',
                      //   margin: [80 , 2 , 0 , 0],
                      //   table:{headerRows: 1 , widths:['20%' , '80%'],
                      // body: [
                      //   [{text:this.contractCommissionData['kickbackPercentage'] ==0 ?" ": 'Commission:'  , style:'heading'} ,{text:this.contractCommissionData['kickbackPercentage'] ==0 ? " " :  "Fabcot International FZE: " + this.contractCostingData['rateCurrencyName']  + " "  + this.contractCommissionData['kickbackPercentage'] + "%" , style:'heading2'}],] }
                      // },
                      // {
                      //   layout:'noBorders',
                      //   margin: [185 , 0 , 0 , 3],
                      //   table:{headerRows: 1 , widths:['100%'],
                      // body: [
                      //   [
                      //     {text: this.contractCommissionData['agentCommissions'] == '' ? " " : "Foreign Agent: " +  this.contractCommissionData['agentCommissions'].map((row=> row.agentName + " " + row.agentCommission + "%"))   , style : 'heading5'}
                      //   ],
                      // ] }
                      // },
                      {

                        
                        layout:'noBorders',
                        margin:this.contractRemarksData['contractRemarks'] == null || this.contractRemarksData['contractRemarks'] == ''?[0 , -10 , 0 , 0]: [70 , 4 , 0 , 0],
                        table:{headerRows: 1 , widths:this.contractRemarksData['contractRemarks'] == null || this.contractRemarksData['contractRemarks'] == ''?['0%' , '0%']:['20%' , '80%'],
                      body: [
                        [{text:this.contractRemarksData['contractRemarks'] == null || this.contractRemarksData['contractRemarks'] == ''?"" :'Remarks:'  , style:'heading'} , {text: this.contractRemarksData['contractRemarks'] , style:'heading2'}],] }
                      },
                      {
                        layout:'noBorders',
                        margin: [70 , 4 , 0 , 0],
                        table:{headerRows: 1 , widths:['20%' , '80%'],
                      body: [
                        [{text:'Other Conditions:' , style:'heading'} , {text: this.contractRemarksData['otherConditionRemarks'] , style:'heading2'}],] }
                      },
                      {
                        layout:'noBorders',
                        margin: [70 , 15 , 0 , 0],
                        table:{headerRows: 1 , widths:['30%'],
                      body: [
                        [{text:'Thanks And Regards:'  , style:'heading'}],] }
                      },
                      {
                        layout:'noBorders',
                        margin: [70 , 12 , 0 , 0],
                        table:{headerRows: 1 , widths:['70%'],
                      body: [
                        [{text:'For FabCot International'  , style:'heading'}],] }
                      },
                      {
                        layout:'noBorders',
                        margin: [20 , 120 , 0 , 0],
                        table:{headerRows: 1 , widths:[ '100%'],
                      body: [
                        [ {text:'NOTE: This is a system generated Contract and does not require any signature.'  , style:'tableheader' }],] }
                      },
                    ],
                    styles:{
                     heading:{fontSize: 10,
                      bold: true,color: '#4d4b4b' },
                      heading2:{fontSize: 10  , color:'#4d4b4b'
                        },
                        heading5:{fontSize: 10  , color:'#4d4b4b',bold: true,
                      },
                        heading3:{fontSize: 9  , color:'#4d4b4b' , bold:true
                      },
                        tableheader: {
                          fillColor: '#f3f3f4',
                          fontSize: 9,
                          bold: true,
                          color: '#4d4b4b',
                         alignment:'center',
                          margin:8
                        
                         }
                    },
                    
          
            };
            pdfMake.createPdf(docDefinition).print();
          
          }
  
          print2FE(){

            this.http.get(`${environment.apiUrl}/api/Reports/ContractIndentPrint/`+ this.contractId)
            .subscribe(
              res => {
                this.response = res;
                if (this.response.success == true && this.response.data != null) {
                  this.printData = this.response.data;
              
        
                }
                else if(this.response.success == false) {
                 
                  this.toastr.error(this.response.message, 'Message.');
                }
        
              },(err: HttpErrorResponse) => {
                const messages = this.service.extractErrorMessagesFromErrorResponse(err);
                this.toastr.error(messages.toString(), 'Message.');
                console.log(messages);
              });

            let docDefinition = {
              pageSize: 'A4',
              pageMargins: [ 30, 20, 40, 20 ],
              pageOrientation: 'letter',
                
                    info: {
                      title: 'Contract Seller'
                    },
                 
                    content: [
             
                      {
                        "image" : this.image2,
                       fit : [140 , 140]
                    
                      },
                      {
                        layout:'noBorders',
                        margin: [340 , -35 , 0 , 0],
                        table:{headerRows: 1 , widths:['100%'],
                      body: [
                        [{text:this.checkR  , style:'heading'} ],] }
                      },
                      {
                        layout:'noBorders',
                        margin: [340 , 0 , 0 , 0],
                        table:{headerRows: 1 , widths:['35%' , '85%'],
                      body: [
                        [{text:'Contract No:'  , style:'heading'} , {text: this.contractData['autoContractNumber'] , style:'heading2' , margin:[-7 , 0, 0,0]}],] }
                      },
                      {
                        layout:'noBorders',
                        margin: [340 , 0 , 0 , 0],
                        table:{headerRows: 1 , widths:['45%' , '75%'],
                      body: [
                        [{text:'Contract Date:'  , style:'heading'} , {text: this.contractData['createdDateTime'] , style:'heading2' , margin:[-20 , 0, 0,0]}],] }
                      },
                      {
                        layout:'noBorders',
                        margin: [340 , 0 , 0 , 0],
                       table:{headerRows: 1 , widths:['45%' , '75%'],
                      body: [
                        [{text:this.contractPartiesData['poNumber'] =='' || this.contractPartiesData['poNumber'] == null ? "" :  'Purchase No:'  , style:'heading'} , {text:this.contractPartiesData['poNumber']== '' ? "": this.contractPartiesData['poNumber']  , style:'heading2' , margin:[-15 , 0, 0,0]}],] }
                      },
                      {
                        layout:'noBorders',
                        margin: [70 , 35 , 0 , 0],
                        table:{headerRows: 1 , widths:['10%' , '60%'],
                      body: [
                        [{text:this.contractPartiesData['sellerPOCName'] ==null ? " " : 'Attn:'  , style:'heading'} , {text:this.contractPartiesData['sellerPOCName'] ==null?" " : this.contractPartiesData['sellerPOCName'] , margin:[-20,0,0,0] , style:'heading5'}]] }
                      },
                      {
                        layout:'noBorders',
                        margin: [70 , 3 , 0 , 0],
                        table:{headerRows: 1 , widths:['100%'],
                      body: [
                        [{text:' We are please to confirm here the booking as per following term and conditions.' , style:'heading2'}  ],] }
                      },
                      {
                        layout:'noBorders',
                        margin: [70 , 15 , 0 , 0],
                        table:{headerRows: 1 , widths:['20%' , '80%'],
                      body: [
                        [{text:'Buyer :'  , style:'heading'} , {text: this.contractPartiesData['buyerName'] , style:'heading2'}],] }
                      },
                 
                      {
                        layout:'noBorders',
                        margin: [70 , 4 , 0 , 0],
                        table:{headerRows: 1 , widths:['20%' , '80%'],
                      body: [
                        [{text:'Supplier :'  , style:'heading'} , {text: this.contractPartiesData['sellerName'] , style:'heading2'}],] }
                      },
                     
                    
                      {
                        layout:'noBorders',
                        margin: this.contractProductData.pecenetAge || this.contractProductData.febricType || this.contractProductData.construction !=''? [70 , 4 , 0 , 0]:[0 , -15 , 0 , 0],
                        table:{headerRows: 1 , widths:['20%' , '80%'],
                      body: [
                        [{text:this.contractProductData['pecenetAge'] || this.contractProductData['febricType'] || this.contractProductData['construction'] !='' ?'Blend:' :''  , style:'heading'} , {text:this.contractProductData['pecenetAge'] !='' ? this.contractProductData['pecenetAge']+ '%'+ ' ' + this.contractProductData['febricType']+ ' ' +this.contractProductData['construction']  : this.contractProductData['febricType']+ ' ' +this.contractProductData['construction']  , style:'heading2'},
                       
                      
                      ],] }
                      },
                      {
                        layout:'noBorders',
                        margin: [70 , 4 , 0 , 0],
                        table:{headerRows: 1 , widths:['20%' , '80%'],
                      body: [
                        [{text:'Description:'  , style:'heading'} , {text: this.contractProductData['articleName'] , style:'heading2'}],] }
                      },
                      
                     
                      {
                        layout:'noBorders',
                        margin: this.contractProductData.weaveName !=''? [70 , 4 , 0 , 0]:[0 , -5 , 0 , 0],
                        table:{headerRows: 1 , widths:['20%' , '80%' ],
                      body: [
                        [{text:this.contractProductData['weaveName'] !=''?'Weave:':''  , style:'heading'} , {text: this.contractProductData['weaveName'] , style:'heading2' } ,
                        // {text: this.contractProductData['selvedgeName'] =='' ? " " :'Selvedge:' , style:'heading'} , 
                        // {text:this.contractProductData['selvedgeName'] =='' ? "" :  this.contractProductData['selvedgeName']  , style:'heading2' , margin:[-5,0,0,0]},
                        // {text: this.contractProductData['gsm'] ==''? '' : 'GSM:'    , style:'heading'} , {text:this.contractProductData['gsm'] ==''? '' : this.contractProductData['gsm']  , style:'heading2' , margin:[-12,0,0,0]}  ,
                        // {text: this.contractProductData['tolerance'] == null?  " " :   this.contractProductData['tolerance'] ==0? " ": "+/- " + this.contractProductData['tolerance'] + "%" , style:'heading2' , margin:[-1,0,0,0]},
                      
                      
                      
                      
                      ],] }
                      },

                      {
                        layout:'noBorders',
                        margin: [70 , 4 , 0 , 0],
                        table:{headerRows: 1 , widths:['20%' , '80%'],
                      body: [
                        [{text: this.contractProductData['selvedgeName'] =='' ? " " :'Selvedge:'  , style:'heading'} , 
                        {text:this.contractProductData['selvedgeName'] ='' ? "" : this.contractProductData['selvedgeName'] , style:'heading2'}],] }
                      },


                      {
                        layout:'noBorders',
                        margin: this.contractProductData.gsm !=''? [70 , 4 , 0 , 0]:[0 , -15 , 0 , 0],
                        table:{headerRows: 1 , widths:['20%' , '7%' , '7%'],
                      body: [
                        [{text:this.contractProductData['gsm'] ==''? '' : 'GSM:'  , style:'heading'} , {text:this.contractProductData['gsm'] =''? '' : this.contractProductData['gsm'] , style:'heading2'}  ,
                         {text: this.contractProductData['tolerance'] == null?  " " : this.contractProductData['tolerance'] ==0? " ": "+/- " + this.contractProductData['tolerance'] + "%" , style:'heading2'}],] }
                      },


                      {

                        layout:'noBorders',
                        margin: [70 , 4 , 0 , 0],
                        table:{headerRows: 1 , widths:['20%' , '80%'],
                      body: [
                        [{text:'Packing:'  , style:'heading'} , {text: this.contractPaymentData['packingName'] , style:'heading2'}],] }
                      },
                      {
                        layout:'noBorders',
                        margin: [70 , 4 , 0 , 0],
                        table:{headerRows: 1 , widths:['20%' , '80%'],
                      body: [
                        [{text:'Piece Length:'  , style:'heading'} , {text: this.contractProductData['pieceLengthName'] , style:'heading2'}],] }
                      },
                    
                      {
                        layout:'noBorders',
                        margin: [70 , 4 , 0 , 0],
                        table:{headerRows: 1 , widths:['20%' , '35%' , '10%'],
                      body: [
                        [{text:'Quantity:'  , style:'heading'} , {text: this.contractCostingData['quantity'] + " " +  this.contractCostingData['quantityUOMName'] , style:'heading2' , margin:[0,0,0,0]},
                        {text:"  " +this.contractCostingData['quantityToleranceValue'] !='' && this.contractCostingData['quantityToleranceValue'] !=0  ?  "+/-" +this.contractCostingData['quantityToleranceValue'] + '%' : " " , margin:[-80,0,0,0] , style:'heading2'}],] }
                      },
                      {
                        layout:'noBorders',
                        margin: [340 , -13 , 0 , 0],
                        table:{headerRows: 1 , widths:['30%' , '70%'],
                      body: [
                        [{text:this.contractPaymentData['count'] ==''?'':'Container:'  , style:'heading3'} , {text: this.contractPaymentData['count'] + " " +this.contractPaymentData['containerName'] , margin:[-20,0,0,0]  , style:'heading3'}],] }
                      },
                     
                      {
                        layout:'noBorders',
                        margin: [70 , 4 , 0 , 0],
                        table:{headerRows: 1 , widths:['20%' , '80%' ],
                      body: [
                        [
                          {text:'Rate:'  , style:'heading'} , {text: this.contractCostingData['rateCurrencyName'] + " " +this.contractCostingData['rate' ]
                        + "  /" + this.contractCostingData['rateUOMName']  , style:'heading2' , margin:[0,0,0,0]} ,
                        //  {text:"/" + this.contractCostingData['rateUOMName'] , margin:[-130,0,0,0] , style:'heading2'}
                        ],] }
                      },
                     
                      {
                        layout:'noBorders',
                        margin: [70 , 4 , 0 , 0],
                        table:{headerRows: 1 , widths:['20%' , '80%'],
                      body: [
                        [{text:'Total Amount:'  , style:'heading'} , {text: this.contractCostingData['rateCurrencyName'] +"  " +this.contractCostingData['contractCost'] , style:'heading2'}],] }
                      },
                      {
                        layout:'noBorders',
                        margin: [70 , 4 , 0 , 0],
                        table:{headerRows: 1 , widths:['20%' , '80%'],
                      body: [
                        [{text:'Payment Term:'  , style:'heading'} , {text: this.contractPaymentData['sellerPaymentTermName'] + " "+this.contractPaymentData['sellerPaymentTermDays']+" " +this.contractPaymentData['sellerPaymentTermInfo'] , style:'heading2'}],] }
                      },
                      {
                        layout:'noBorders',
                        margin: [70 , 4 , 0 , 0],
                        table:{headerRows: 1 , widths:['20%' , '80%'],
                      body: [
                        [{text:'Delivery Term:'  , style:'heading'} , {text: this.contractPaymentData['priceTermName'] +" "+ this.contractPaymentData['destinationName'] , style:'heading2'}],] }
                      },
                      {
                        layout:'noBorders',
                        margin: [70 , 4 , 0 , 0],
                        table:{headerRows: 1 , widths:['20%' , '80%'],
                      body: [
                        [{text:'Deliveries Date:'  , style:'heading'} , {text: this.deliveryData.map((row=>row.supplierDateDay)) , style:'heading2'}],] }
                        // [{text:'Deliveries Date:'  , style:'heading'} , {text:    this.contractPaymentData['buyerDeliveryDateDay']  + this.contractPaymentData['buyerDeliveryDateMonth']  +this.contractPaymentData['buyerDeliveryDateYear'] , style:'heading2'}],] }

                      },

                      {
                        layout:'noBorders',
                        margin: [70 , 4 , 0 , 0],
                        table:{headerRows: 1 , widths:['20%' , '80%'],
                      body: [
                        [{text:this.contractCommissionData['fabCotCommision'] ==null ?" ": 'Commission:'  , style:'heading'} ,{text:this.contractCommissionData['fabCotCommision'] ==null ? " " :  "Fabcot International FZE: " + this.contractCostingData['rateCurrencyName']  + " "  + this.contractCommissionData['fabCotCommision'] + "%" , style:'heading2'}],] }
                      },
                      {
                        layout:'noBorders',
                        margin: [167 , 0 , 0 , 3],
                        table:{headerRows: 1 , widths:['100%'],
                      body: [
                        [
                          {text: this.contractCommissionData['agentCommissions'] == '' ? " " :    this.contractCommissionData['agentCommissions'].map((  row=> "Foreign Agent:  " +    row.agentName + " [" + row.agentCommission + "%] \n"))   , style : 'heading5'}
                        ],
                      ] }
                      },
                      
                      {
                        
                        layout:'noBorders',
                        margin:this.contractRemarksData['contractRemarks'] == null || this.contractRemarksData['contractRemarks'] == ''?[0 , -10 , 0 , 0]: [70 , 4 , 0 , 0],
                        table:{headerRows: 1 , widths:this.contractRemarksData['contractRemarks'] == null || this.contractRemarksData['contractRemarks'] == ''?['0%' , '0%']:['20%' , '80%'],
                      body: [
                        [{text:this.contractRemarksData['contractRemarks'] == null || this.contractRemarksData['contractRemarks'] == ''?"" :'Remarks:' , style:'heading'} , {text: this.contractRemarksData['contractRemarks'] , style:'heading2'}],] }
                      },
                      {
                        layout:'noBorders',
                        margin: [70 , 4 , 0 , 0],
                        table:{headerRows: 1 , widths:['20%' , '80%'],
                      body: [
                        [{text:'Other Conditions:' , style:'heading'} , {text: this.contractRemarksData['otherConditionRemarks'] , style:'heading2'}],] }
                      },
                      {
                        layout:'noBorders',
                        margin: [70 , 12 , 0 , 0],
                        table:{headerRows: 1 , widths:['30%'],
                      body: [
                        [{text:'Thanks And Regards:'  , style:'heading'}],] }
                      },
                      {
                        layout:'noBorders',
                        margin: [70 , 10 , 0 , 0],
                        table:{headerRows: 1 , widths:['70%'],
                      body: [
                        [{text:'For FabCot International'  , style:'heading'}],] }
                      },
                      {
                        layout:'noBorders',
                        margin: [20 , 120 , 0 , 0],
                        table:{headerRows: 1 , widths:[ '100%'],
                      body: [
                        [ {text:'NOTE: This is a system generated Contract and does not require any signature.'  , style:'tableheader' }],] }
                      },
                    ],
                    styles:{
                     heading:{fontSize: 10,
                      bold: true,color: '#4d4b4b' },
                      heading2:{fontSize: 10  , color:'#4d4b4b'
                        },
                        heading3:{fontSize: 9  , color:'#4d4b4b' , bold:true
                      },
                      heading4:{fontSize: 10  , color:'#4d4b4b',bold: true,
                    },
                      heading5:{fontSize: 10,color: '#4d4b4b' },
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
  

          printS(){
            
           
       
            
           
            let docDefinition = {
              pageSize: 'A4',
              pageMargins: [ 5, 5, 5, 10 ],
              pageOrientation: 'letter',
                
                    info: {
                      title: 'Contract Seller'
                    },
                 
                    content: [
                   
                      {
                        "image" : this.image2,
                       fit : [130 , 130] , margin:[420,5,0,0]
                    
                      },
                      // {
                      //   layout:'noBorders',
                      //   margin: [330 , -30 , 0 , 0],
                      //   table:{headerRows: 1 , widths:['100%'],
                      // body: [
                      //   [{text:this.checkR  , style:'heading'} ],] }
                      // },
                      {
                        layout:'noBorders',
                        margin: [20 , -50 , 0 , 0],
                        table:{headerRows: 1 , widths:['60%' , '40%' ],
                      body: [
                        [{text:'FABCOT INTERNATIONAL'  , style:'heading10'} ,
                        {text:this.checkR  , style:'heading10'}
                      ],] }
                      },
                      {
                        layout:'noBorders',
                        margin: [20 , 8 , 0 , 0],
                        table:{headerRows: 1 , widths:['100%' ],
                      body: [
                        [{text:'133 Aurangzeb Block, New Garden Town, Lahore'  , style:'heading'} 
                      ],] }
                      },
                      {
                        layout:'noBorders',
                        margin: [20 , 8 , 0 , 0],
                        table:{headerRows: 1 , widths:['20%' , '50%' ],
                      body: [
                        [{text:'Tel. +92-42-35846171-4'  , style:'heading'} ,
                        {text:'Fax: +92-42-35846175'  , style:'heading'} 
                      ],] }
                      },
                      { 
                        margin:[0,-56,0,0],
                        canvas: 
                        [
                            
                            {
                              type: 'line',
                              x1: 0, y1: 60,
                              x2: 590, y2: 60,
                              lineWidth: 0.5,
                            

                            }
                        ]
                     },
                     { 
                      margin:[0,-58.5,0,0],
                      canvas: 
                      [
                          
                          {
                            type: 'line',
                            x1: 0, y1: 60,
                            x2: 590, y2: 60,
                            lineWidth: 0.5,
                          

                          }
                      ]
                   },
                         {
                        layout:'noBorders',
                        margin: [70 , 2 , 0 , 0],
                        table:{headerRows: 1 , widths:['50%' , '50%'],
                      body: [
                        [{text:'To:  ' + this.contractPartiesData['sellerName']  , style:'heading'} ,
                        {text:'Contract No:  ' + this.contractData['autoContractNumber']  , margin:[60, 0,0,0] , style:'heading'}
                      ],] }
                      },
                      {
                        layout:'noBorders',
                        margin: [70 , 0 , 0 , 0],
                        table:{headerRows: 1 , widths:['50%' , '50%'],
                      body: [
                        [{text:'Attn:  ' + this.contractPartiesData['sellerPOCName']  , style:'heading'} ,
                        {text:'Contract Date:  ' + this.contractData['createdDateTime']  , margin:[60, 0,0,0] , style:'heading'}
                      ],] }
                      },
                      { 
                        margin:[0,-49,0,0],
                        canvas: 
                        [
                            
                            {
                              type: 'line',
                              x1: 0, y1: 60,
                              x2: 590, y2: 60,
                              lineWidth: 0.5,
                            

                            }
                        ]
                     },
                     { 
                      margin:[0,-58.5,0,0],
                      canvas: 
                      [
                          
                          {
                            type: 'line',
                            x1: 0, y1: 60,
                            x2: 590, y2: 60,
                            lineWidth: 0.5,
                           

                          }
                      ]
                   },
                      {
                        layout:'noBorders',
                        margin: [105 , 0 , 0 , 0],
                        table:{headerRows: 1 , widths:['100%'],
                      body: [
                        [{text:' We are please to confirm the following contract for A Grade Air Jet Fabric ' , style:'heading'}  ],] }
                      },
     
                      { 
                        margin:[10,-105,0,0],
                        canvas: 
                        [
                            
                            {
                              type: 'line',
                              x1: 90, y1: 90,
                              x2:90, y2: 630,
                              lineWidth: 1,
                              
                            }
                        ]
                     },
                     {
                      layout:'noBorders',
                      margin: [20 , -510 , 0 , 0],
                      table:{headerRows: 1 , widths:['20%' , '45%' , '10%' , '10%' , '5%', '10%'  ],
                    body: [
                      [{text:'Buyer Name:'  , style:'heading'} , {text: this.printData['buyerName'] ,margin:[-30,0,0,0] ,   style:'heading2'} , 
                      // {text:this.printData['buyerNTNNumber'] ==''? '' : 'NTN:'  , style:'heading4' ,margin:[0,0,0,0]} , 
                      // {text: this.printData['buyerNTNNumber'], style:'heading5' ,margin:[-38,0,0,0] }, 
                      // {text:this.printData['buyerGSTNumber'] ==''? '' :'GST:'  , style:'heading4' ,margin:[-15,0,0,0]} , 
                      // {text: this.printData['buyerGSTNumber'], style:'heading5' ,margin:[-28,0,0,0] }, 
                    
                    
                    ],] }
                    },
                     
                       {
                        layout:'noBorders',
                        margin: [20 , 2 , 0 , 0],
                        table:{headerRows: 1 , widths:['20%' , '40%'],
                      body: [
                        [{text:'Items:'  , style:'heading'} , {text: this.printData['articleName'] , margin:[-35,0,0,0],    style:'heading2'}],] }
                      },
                      {
                        layout:'noBorders',
                        margin: [20 , 2 , 0 , 0],
                        table:{headerRows: 1 , widths:['20%' , '40%'],
                      body: [
                        [{text:'Pick Insertion:'  , style:'heading'} , {text: this.printData['pickInsertionName'] , margin:[-35,0,0,0] , style:'heading2'}],] }
                      },

                      {
                        layout:'noBorders',
                        margin: [20 , 2 , 0 , 0],
                        table:{headerRows: 1 , widths:['20%' , '40%'],
                      body: [
                        [{text:'Width:'  , style:'heading'} , {text: this.printData['width'] == null ?  " " : this.printData['width'] + " inch" , margin:[-35,0,0,0]  , style:'heading2'}],] }
                      },
                   
                      {
                        layout:'noBorders',
                        margin: [20 , 2 , 0 , 0],
                        table:{headerRows: 1 , widths:['20%' , '40%'],
                      body: [
                        [{text:'Weave:'  , style:'heading'} , {text: this.printData['weaveName'] ,    margin:[-35,0,0,0] , style:'heading2'}],] }
                      },
                      {
                        layout:'noBorders',
                        margin: [20 , 2 , 0 , 0],
                        table:{headerRows: 1 , widths:['20%' , '40%'],
                      body: [
                        [{text:'Selvedge:'  , style:'heading'} , {text: this.printData['selvedgeName'] ,  margin:[-35,0,0,0] ,style:'heading2'}],] }
                      },
                      {
                        layout:'noBorders',
                        margin: [20 , 2 , 0 , 0],
                        table:{headerRows: 1 , widths:['20%' , '7%' , '40%'],
                      body: [
                        [{text:'Blending Ratio:'  , style:'heading'} , {text: "Warp:" , margin:[-35,0,0,0] , style:'heading'} ,  {text: this.printData['blendingRatioWarpName'] , margin:[-40,0,0,0] ,  style:'heading2'}],] }
                      },
                      {
                        layout:'noBorders',
                        margin: [20 , 2 , 0 , 0],
                        table:{headerRows: 1 , widths:['20%' , '5%' ,'40%'],
                      body: [
                        [{text:'     '  , style:'heading'} , {text: "Weft:" , margin:[-35,0,0,0] , style:'heading'} ,  {text: this.printData['blendingRatioWeftpName'] , margin:[-30,0,0,0] , style:'heading2'}],] }
                      },
                

  {
                        layout:'noBorders',
                        margin: [20 , 2 , 0 , 0],
                        table:{headerRows: 1 , widths:['20.5%' , '35%' , '10%' , '20%'],
                      body: [
                        [
                          {text:'Quantity:'  , style:'heading'} , {text: this.contractCostingData['quantity'] + "  " + this.contractCostingData['quantityUOMName'] ,  style:'heading2' , margin:[-35,0,0,0]}, {text: "Margin:"  , margin:[-120,0,0,0] , style:'heading'} , {text: "+/-" +this.contractCostingData['quantityToleranceValue'] + '%' , margin:[-140,0,0,0] , style:'heading2'}],
                        ] }
                      },
                    
                      {
                        layout:'noBorders',
                        margin: [22 , 2 , 0 , 0],
                        table:{headerRows: 1 , widths:['21%' , '20%' , '10%' , '20%' , '10%' , '10%','5%','5%'],
                      body: [
                        [
                          {text:'Rate:'  , style:'heading'} , {text: this.contractCostingData['rateUOMName'] == "Meters" ?  
                          this.contractCostingData['rateCurrencyName'] == 'PKR' ? "Rs " + this.contractCostingData['rate']  + " /  Meter"  :  this.contractCostingData['rateCurrencyName'] == 'USD' ? " $ " + this.contractCostingData['rate'] +  " /  Meter" : " €" + this.contractCostingData['rateCurrencyName'] == 'EUR' ? this.contractCostingData['rate'] +  " /  Meter" : " £ " +  this.contractCostingData['rateCurrencyName'] == 'GBP' ? this.contractCostingData['rate'] + " /  Meter" : ''
                          : 
                          this.contractCostingData['rateCurrencyName'] == 'PKR' ? " Rs " + this.contractCostingData['rate'] +  " / Yard" : " $ " +  this.contractCostingData['rateCurrencyName'] == 'USD' ? this.contractCostingData['rate'] +  " /  Yard" : this.contractCostingData['rateCurrencyName'] == 'EUR' ? " € " + this.contractCostingData['rate'] +  " /  Yard" :  this.contractCostingData['rateCurrencyName'] == 'GBP' ? "£ " + this.contractCostingData['rate'] +  " /  Yard" : '' 
                          
                           ,
                          
                           style:'heading2' , margin:[-35,0,0,0]},
                            {text: "GST:"  , margin:[-25,0,0,0] , style:'heading'} , {text: this.printData['gst'] != null ? this.contractCostingData['gst'] + "%" : " "  , margin:[-60,0,0,0] , style:'heading2'} ,
                            {text: "AI.Tax:" , margin:[-120,0,0,0] , style:'heading'} , {text: this.contractCostingData['adIncomeTaxFL'] != null ? this.contractCostingData['adIncomeTaxFL'] + "%" : "0"  , margin:[-140,0,0,0] , style:'heading2'} ,
                             {text: "W.Tax:"  , margin:[-140,0,0,0] , style:'heading'} , {text: "As applicable by Government Law"  , margin:[-140,0,0,0] , style:'heading2'}],
                        ] }
                      },
                      {
                        layout:'noBorders',
                        margin: [20 , 2 , 0 , 0],
                        table:{headerRows: 1 , widths:['20.5%' , '39%' , '20%' , '20%'],
                      body: [
                        [{text:'Total Amount:'  , style:'heading'} , {text:    
                        this.contractCostingData['rateCurrencyName'] + " "+ this.contractCostingData['contractCost'] ,  margin:[-35,0,0,0] ,style:'heading2'} , {text: "Amount Incl GST:"  , margin:[-160,0,0,0] , style:'heading'} , {text: 
                        
                          this.contractCostingData['rateCurrencyName'] + " " + this.contractCostingData['totalCostGSt']   , margin:[-200,0,0,0] , style:'heading2'}],] }
                      },
                     
                      {

                        layout:'noBorders',
                        margin: [20 , 2 , 0 , 0],
                        table:{headerRows: 1 , widths:['20%' , '40%'],
                      body: [
                        [{text:'Packing:'  , style:'heading'} , {text: this.contractPaymentData['packingName'] , margin:[-35,0,0,0] , style:'heading2'}],] }
                      },
                      {
                        layout:'noBorders',
                        margin: [20 , 2 , 0 , 0],
                        table:{headerRows: 1 , widths:['20%' , '40%'],
                      body: [
                        [{text:'Piece Length:'  , style:'heading'} , {text: this.contractProductData['sellerPieceLengthName'] , margin:[-35,0,0,0] , style:'heading2'}],] }
                      },
                   
                      {
                        layout:'noBorders',
                        margin: [20 , 2 , 0 , 0],
                        table:{headerRows: 1 , widths:['20%' , '40%'],
                      body: [
                        [{text:'Payment Terms:'  , style:'heading'} , {text: this.contractPaymentData['sellerPaymentTermDays'] == '' ? this.contractPaymentData['sellerPaymentTermName'] + 
                        this.contractPaymentData['sellerPaymentTermInfo']  :this.contractPaymentData['sellerPaymentTermName'] + this.contractPaymentData['sellerPaymentTermDays']+ " Days " + this.contractPaymentData['sellerPaymentTermInfo']  , margin:[-35,0,0,0] , style:'heading2'}],] }
                      },
                      {
                        layout:'noBorders',
                        margin: [20 , 2 , 0 , 0],
                        table:{headerRows: 1 , widths:['20%' , '40%'],
                      body: [
                        [{text:'Mode of Payment:'  , style:'heading'} , {text: this.contractPaymentData['paymentMode'] , margin:[-35,0,0,0] , style:'heading2'}],] }
                      },
                      {
                        layout:'noBorders',
                        margin: [20 , 2 , 0 , 0],
                        table:{headerRows: 1 , widths:['20%' , '40%'],
                      body: [
                        [{text:'Delivery Term:'  , style:'heading'} , {text: this.contractPaymentData['priceTermName'] + " " + this.contractPaymentData['destinationName']  , margin:[-35,0,0,0] , style:'heading2'}],] }
                      },
                      {
                        layout:'noBorders',
                        margin: [20 , 2 , 0 , 0],
                        table:{headerRows: 1 , widths:['20%' , '40%'],
                      body: [
                        [{text:'Deliveries Date:'  , style:'heading'} , {text: this.deliveryData.map((row=>row.buyerDateDay)) , margin:[-35,0,0,0] , style:'heading2'}],] }
                      
                      },
                      {
                        layout:'noBorders',
                        margin: [20 , 2 , 0 , 0],
                        table:{headerRows: 1 , widths:['20%' , '40%'],
                      body: [
                        [{text:'Commission:'  , style:'heading'} , {text: this.contractCommissionData['fabCotCommision'] + "%" , margin:[-35,0,0,0] , style:'heading2'}],] }
                      
                      },
                      {
                        layout:'noBorders',
                        margin: [20 , 2 , 0 , 0],
                        table:{headerRows: 1 , widths:['20%' , '40%'],
                      body: [
                        [{text:'Delivery Address:'  , style:'heading'} , {text: this.printData['deliveryAddress'] , margin:[-35,0,0,0] , style:'heading2'}],] }
                      },
                      {
                        layout:'noBorders',
                        margin: [20 , 2 , 0 , 0],
                        table:{headerRows: 1 , widths:['20%' , '40%'],
                      body: [
                        [{text:'Invoice Address:'  , style:'heading'} , {text: this.printData['invoiceAddress'] , margin:[-35,0,0,0] , style:'heading2'}],] }
                      },
                      {
                        layout:'noBorders',
                        margin: [20 , 2 , 0 , 0],
                        table:{headerRows: 1 , widths:['20%' , '40%'],
                      body: [
                        [{text:'GST#:'  , style:'heading'} , {text: this.printData['buyerGSTNumber'] , margin:[-35,0,0,0] ,style:'heading2'}],] }
                      },
                      {
                        layout:'noBorders',
                        margin: [20 , 2 , 0 , 0],
                        table:{headerRows: 1 , widths:['20%' , '80%'],
                      body: [
                        [{text:'Remarks:' , style:'heading'} , {text: this.contractRemarksData['contractRemarks'] , margin:[-35,0,0,0] , style:'heading2'}],] }
                      },

                      {
                        layout:'noBorders',
                        margin: [20 , 2 , 0 , 0],
                        table:{headerRows: 1 , widths:['20%' , '80%'],
                      body: [
                        [{text:'Other Conditions:' , style:'heading'} , {text: this.contractRemarksData['otherConditionRemarks'] , margin:[-35,0,0,0] , style:'heading2'}],] }
                      },
                   
                      { 
                        margin:[0,0,0,0],
                        canvas: 
                        [
                            
                            {
                              type: 'line',
                              x1: 0, y1: 60,
                              x2: 590, y2: 60,
                              lineWidth: 1,

                            }
                        ]
                     },

                       {
                        layout:'noBorders',
                        margin: [20 , 80 , 0 , 0],
                        table:{headerRows: 1 , widths:['100%'],
                      body: [
                        [{text:'Please get it signed & send back same for our record purpose'  ,  style:'heading'}],] }
                      },
                      {
                        layout:'noBorders',
                        margin: [20 , 10 , 0 , 0],
                        table:{headerRows: 1 , widths:['100%'],
                      body: [
                        [{text:'For FabCot International'  , style:'heading'}],] }
                      },
                   
                    ],
                    styles:{
                      heading:{fontSize: 9,
                       bold: true,
                       // color: '#4d4b4b'
                      },
                       heading10:{fontSize: 10,
                         bold: true,
                         // color: '#4d4b4b' 
                       },
                       heading4:{fontSize: 8,
                        bold: true,
                       },
                       heading5:{fontSize: 8,
                       },
                       heading2:{fontSize: 9  , 
                         // color:'#4d4b4b'
                         },
                         heading3:{fontSize: 7  , 
                           // color:'#4d4b4b'
                             bold:true
                       },
                       lineColor:{
                         // color:'#535353'
                       },
                         tableheader: {
                           fillColor: '#f3f3f4',
                           fontSize: 9,
                           bold: true,
                           // color: '#4d4b4b',
                          alignment:'center',
                           margin:8
                         
                          }
                     },
                    
          
            };
            pdfMake.createPdf(docDefinition).print();
          
          }


yarnExportInvoicesReportPrint(){

  
  this.http.get(`${environment.apiUrl}/api/Reports/ContractIndentPrint/`+ this.contractId)
  .subscribe(
    res => {
      this.response = res;
      if (this.response.success == true && this.response.data != null) {
        this.printData = this.response.data;
    

      }
      else if(this.response.success == false) {
       
        this.toastr.error(this.response.message, 'Message.');
      }

    },(err: HttpErrorResponse) => {
      const messages = this.service.extractErrorMessagesFromErrorResponse(err);
      this.toastr.error(messages.toString(), 'Message.');
      console.log(messages);
    });


  for(let i =0;i<this.yarnExportInvoiceReports.length;i++ ){
    if( this.yarnExportInvoiceReports[i].contractArticleRevisedTransactions.length > 0){
          this.thereisrevisedData=true;
          this.revisedindexData=this.yarnExportInvoiceReports[i].contractArticleRevisedTransactions
          // let a =[];
          // a.push(this.yarnExportInvoiceReports[i].contractArticleRevisedTransactions)
          // this.revisedindexData=a;

    }
  }
  if(this.thereisrevisedData == true){
    let docDefinition = {
      pageSize: 'A4',
      pageMargins: [ 30, 10, 40, 20 ],
      pageOrientation: 'letter',
        
            info: {
              title: 'Invoice Report'
            },
          
            content: [
           
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
                margin: [70 , 7 , 5 , 0],
                table:{headerRows: 1 , widths:['20%' , '80%'],
              body: [
                [{text:'Buyer Name:'  , style:'heading'} , {text: this.contractData['buyerName'] , style:'heading2'}],] }
              },
              {
                layout: {
                  hLineWidth: function (i, node) {
                    return 0.75;
                  },
                  vLineWidth: function (i, node) {
                    return 0.75;
                  }
                },
                margin: [20 , 10 , 0 , 0],
                table:{
                  headerRows:1,
                  widths: [ 'auto' , 'auto' , 'auto' , 'auto','auto','auto','auto','auto' ],
                  body:[
                    [  {text:'Invoice #' , style: 'tableheader2'},
                    {text:'Article' , style: 'tableheader2'},
                    {text:'Unit' , style: 'tableheader2'},
                     {text:'Quantity' , style: 'tableheader2'},
                    {text:'Commission' , style: 'tableheader2'},
                     {text:'Rate' , style: 'tableheader2'},
                    {text:'Tax Amount' , style: 'tableheader2'},
                    {text:'Invoice Amount' , style: 'tableheader2'},
                   
  
                  ],
            ...this.yarnExportInvoiceReports.map((row=>
            [row.saleInvoiceNo,row.contractArticleName,row.unit, row.contractArticleQuantity, row.contractArticleCommission,
                row.contractArticleRate,row.taxAmount,row.amount
                ]
                
              ))
          
                  ],
                }
              },
  
              {
                layout:'noBorders',
                margin: [20 , 25 , 0 , 0],
                table:{headerRows: 1 , widths:['30%'],
              body: [
                [{text:'Revised Article:'  , style:'heading'}],] }
              },
            
              {
                layout: {
                  hLineWidth: function (i, node) {
                    return 0.75;
                  },
                  vLineWidth: function (i, node) {
                    return 0.75;
                  }
                },
                margin: [20 , 10 , 0 , 0],
                table:{
                  headerRows:1,
                  widths: [ 'auto' , 'auto' , 'auto' , 'auto','auto','auto','auto' ],
                  body:[
                    [  {text:'Invoice #' , style: 'tableheader2'},
                    {text:'Article' , style: 'tableheader2'},
                    {text:'Unit' , style: 'tableheader2'},
                     {text:'Quantity' , style: 'tableheader2'},
                    {text:'Commission' , style: 'tableheader2'},
                     {text:'Rate' , style: 'tableheader2'},
                    // {text:'Tax Amount' , style: 'tableheader2'},
                    {text:'Invoice Amount' , style: 'tableheader2'},
                   
  
                  ],
            ...this.revisedindexData.map((row=>
            [row.saleInvoiceNo,row.contractArticleName,row.unit, row.contractArticleQuantity, row.contractArticleCommission,
                row.contractArticleRate,row.saleInvoiceAmount
                ]
                
              ))
          
                  ],
                }
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
                
                heading3:{fontSize: 8  , color:'#4d4b4b'
              },
                tableheader: {
                  fillColor: '#f3f3f4',
                  fontSize: 10,
                  bold: true,
                  color: '#4d4b4b',
                 alignment:'center',
                  margin:8
                
                 },
                 
                tableheader2: {
                  fillColor: '#f3f3f4',
                  fontSize: 8,
                  bold: true,
                  color: '#4d4b4b',
                 alignment:'center',
                  margin:5
                
                 }
            },
            
  
    };
    pdfMake.createPdf(docDefinition).print();
    this.revisedindexData=[];
  }
  else{
    let docDefinition = {
      pageSize: 'A4',
      pageMargins: [ 30, 5, 5, 5 ],
      pageOrientation: 'letter',
        
            info: {
              title: 'Invoice Report'
            },
          
            content: [
           
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
                margin: [70 , 7 , 5 , 0],
                table:{headerRows: 1 , widths:['20%' , '80%'],
              body: [
                [{text:'Buyer Name:'  , style:'heading'} , {text: this.contractPartiesData['buyerName'], style:'heading2'}],] }
              },
              {
                layout: {
                  hLineWidth: function (i, node) {
                    return 0.75;
                  },
                  vLineWidth: function (i, node) {
                    return 0.75;
                  }
                },
                margin: [20 , 10 , 0 , 0],
                table:{
                  headerRows:1,
                  widths: [ 'auto' , 'auto' , 'auto' , 'auto','auto','auto','auto','auto' ],
                  body:[
                    [  {text:'Invoice #' , style: 'tableheader2'},
                    {text:'Article' , style: 'tableheader2'},
                    {text:'Unit' , style: 'tableheader2'},
                     {text:'Quantity' , style: 'tableheader2'},
                    {text:'Commission' , style: 'tableheader2'},
                     {text:'Rate' , style: 'tableheader2'},
                    {text:'Tax Amount' , style: 'tableheader2'},
                    {text:'Invoice Amount' , style: 'tableheader2'},
                   
  
                  ],
            ...this.yarnExportInvoiceReports.map((row=>
            [row.saleInvoiceNo,row.contractArticleName,row.unit, row.contractArticleQuantity, row.contractArticleCommission,
                row.contractArticleRate,row.taxAmount,row.amount
                ]
                
              ))
          
                  ],
                }
              },
  
              {
                layout:'noBorders',
                margin: [20 , 25 , 0 , 0],
                table:{headerRows: 1 , widths:['30%'],
              body: [
                [{text:'Revised Article:'  , style:'heading'}],['None']] }
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
                margin: [20 , 20 , 0 , 0],
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
                
                heading3:{fontSize: 8  , color:'#4d4b4b'
              },
                tableheader: {
                  fillColor: '#f3f3f4',
                  fontSize: 10,
                  bold: true,
                  color: '#4d4b4b',
                 alignment:'center',
                  margin:8
                
                 },
                 
                tableheader2: {
                  fillColor: '#f3f3f4',
                  fontSize: 10,
                  bold: true,
                  color: '#4d4b4b',
                 alignment:'center',
                  margin:5
                
                 }
            },
            
  
    };
    pdfMake.createPdf(docDefinition).print();
    this.revisedindexData=[];
  }

  

}

          printSupplier(){


            this.http.get(`${environment.apiUrl}/api/Reports/ContractIndentPrint/`+ this.contractId)
            .subscribe(
              res => {
                this.response = res;
                if (this.response.success == true && this.response.data != null) {
                  this.printData = this.response.data;
              
        
                }
                else if(this.response.success == false) {
                 
                  this.toastr.error(this.response.message, 'Message.');
                }
        
              },(err: HttpErrorResponse) => {
                const messages = this.service.extractErrorMessagesFromErrorResponse(err);
                this.toastr.error(messages.toString(), 'Message.');
                console.log(messages);
              });

            let docDefinition = {
              pageSize: 'A4',
              pageMargins: [ 30, 20, 40, 20 ],
              pageOrientation: 'letter',
                
                    info: {
                      title: 'Contract Seller'
                    },
                 
                    content: [
                   
                      {
                        "image" : this.image2,
                       fit : [130 , 130]
                    
                      },
                      {
                        layout:'noBorders',
                        margin: [290 , -40 , 0 , 0],
                        table:{headerRows: 1 , widths:['100%'],
                      body: [
                        [{text:this.checkR  , style:'heading'} ],] }
                      },
                      {
                        layout:'noBorders',
                        margin: [290 , 0 , 0 , 0],
                        table:{headerRows: 1 , widths:['28%' , '90%'],
                      body: [
                        [{text:'Contract No:'  , style:'heading'} , {text: this.contractData['autoContractNumber'] , style:'heading2'}],] }
                      },
                      {
                        layout:'noBorders',
                        margin: [290 , 0 , 0 , 0],
                        table:{headerRows: 1 , widths:['28%' , '90%'],
                      body: [
                        [{text:'Contract Date:'  , style:'heading'} , {text: this.contractData['createdDateTime'] , style:'heading2'}],] }
                      },
                      {
                        layout:'noBorders',
                        margin: [290 , 0 , 0 , 0],
                        table:{headerRows: 1 , widths:['28%' , '90%'],
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
                        margin: [10 , 10 , 0 , 0],
                        table:{headerRows: 1 , widths:['100%'],
                      body: [
                        [{text:' We are please to confirm here the booking as per following term and conditions.' , style:'heading2'}  ],] }
                      },
                     
                      {
                        layout:'noBorders',
                        margin: [10 , 10 , 0 , 0],
                        table:{headerRows: 1 , widths:['20%' , '80%'],
                      body: [
                        [{text:'Supplier Name:'  , style:'heading'} , {text: this.contractPartiesData['sellerName'] , style:'heading5'}],] }
                      },
                   
                      // {
                      //   layout:'noBorders',
                      //   margin: [70 , 7 , 0 , 0],
                      //   table:{headerRows: 1 , widths:['20%' , '80%'],
                      // body: [
                      //   [{text:'Buyer Name:'  , style:'heading'} , {text: this.contractPartiesData['buyerName'], style:'heading5'}],] }
                      // },
                      {
                        layout:'noBorders',
                        margin: [10 , 10 , 0 , 0],
                        table:{headerRows: 1 , widths:['20%' , '80%'],
                      body: [
                        [{text:'LC Opner:'  , style:'heading'} , {text: this.contractPartiesData['lcOpner'], style:'heading5'}],] }
                      },
                      {
                        margin: [10 , 10 , 0 , 0],
                       
                        table:{
                          headerRows:1,
                          widths: [ '20%' , '10%' , '10%' , '15%' , '20%','10%','15%' ],
                          body:[
                            [ {text:'Article' , style: 'tableheader2' , }, {text:'Quantity' , style: 'tableheader2'},
                            {text:'Rate' , style: 'tableheader2'},
                            {text:'Fabcot Comm' , style: 'tableheader2'} , 
                             {text:'Foreign Agent Comm' , style: 'tableheader2'},
                             {text:'Currency' , style: 'tableheader2'},
                             {text:'Container' , style: 'tableheader2'},
      
                          ],
                    ...this.contractData['contractArticles'].map((row=>
                      [
                        // row.articleName  , row.contractArticleQuantity, row.contractArticleCommission,
                        // row.contractArticleRate 
                             {text: row.articleName + '\n' + this.contractProductData['construction'] , style: 'tableheader3'} , 
                             {text:   this.contractCostingData['quantityToleranceValue'] != '' &&  this.contractCostingData['quantityToleranceValue'] != 0 ? row.contractArticleQuantity + '\n' +  "+/-" + this.contractCostingData['quantityToleranceValue'] + '%' +' '+ row.uomUnit : row.contractArticleQuantity  , style: 'tableheader3'},
                             {text: row.contractArticleRate == null ? '' : this.contractCostingData['rateCurrencyName'] == 'USD' ?  "$ " + row.contractArticleRate : this.contractCostingData['rateCurrencyName'] == 'PKR' ? "RS " + row.contractArticleRate : this.contractCostingData['rateCurrencyName'] == 'EUR' ?  "€ " + row.contractArticleRate : this.contractCostingData['rateCurrencyName'] == 'GBP' ?  "GBP " + row.contractArticleRate : row.contractArticleRate , style: 'tableheader3'},

                             {text: row.contractArticleCommission == null ? '' : row.contractArticleCommission + "%" , style: 'tableheader3'},
                             {text: row.agentsNames == null ? '' : row.agentsNames , style: 'tableheader3'},
                             {text: row.contractArticleCurrencyName == null ? '' : row.contractArticleCurrencyName  , style: 'tableheader3'},
                             {text: row.contractArticleContainer == null ? '' : row.contractArticleContainer  , style: 'tableheader3'},

                        ]
                      ))
                  
                          ]
                        }
                      },

                      {

                        layout:'noBorders',
                        margin: [10 , 10 , 0 , 0],
                        table:{headerRows: 1 , widths:['20%' , '80%'],
                      body: [
                        [{text:'Packing:'  , style:'heading'} , {text: this.contractPaymentData['packingName'] , style:'heading2'}],] }
                      },
                      // {

                      //   layout:'noBorders',
                      //   margin: [70 , 7 , 0 , 0],
                      //   table:{headerRows: 1 , widths:['20%' , '80%'],
                      // body: [
                      //   [{text:'Construction:'  , style:'heading'} , {text: this.contractProductData['construction'] , style:'heading2'}],] }
                      // },
                     
                      {

                        layout:'noBorders',
                       
                        table:{  headerRows: 1 , widths:['20%' , '80%'],
                      body: [ this.contractProductData['brandName'] !='' ?
                        [{text:this.contractProductData['brandName'] != ""   ?  'Brand Name:' : '' ,  margin: [10 , 10 , 0 , 0]    , style:'heading'} , {text: this.contractProductData['brandName'] != '' ? this.contractProductData['brandName'] : ''  , margin: [8 , 5 , 0 , 0] , style:'heading2'}]: ''  , ] }
                      },
                     
                      {
                        layout:'noBorders',
                        margin: [10 , 10 , 0 , 0],
                        table:{headerRows: 1 , widths:['20%' , '80%'],
                      body: [
                        [{text:'Payment Term:'  , style:'heading'} ,
                         {text: this.contractPaymentData['paymentTermDays'] == 0?this.contractPaymentData['paymentTermName'] :this.contractPaymentData['paymentTermDays'] + "  "+this.contractPaymentData['paymentTermName'] , style:'heading2'}],] }
                      },
                      {
                        layout:'noBorders',
                        margin: [10 , 10 , 0 , 0],
                        table:{headerRows: 1 , widths:['20%' , '80%'],
                      body: [
                        [{text:'Delivery Term:'  , style:'heading'} , {text: this.contractPaymentData['priceTermName'] +" " +this.contractPaymentData['destinationName'] , style:'heading2'}],] }
                      },
                      {

                        layout:'noBorders',
                        margin: [10 , 10 , 0 , 0],
                        table:{headerRows: 1 , widths:['20%' , '80%'],
                      body: [
                        [{text:'Container:'  , style:'heading'} ,
                         {text: this.contractPaymentData['count'] && this.contractPaymentData['containerName'] != null?
                          this.contractPaymentData['count'] + this.contractPaymentData['containerName'] :this.contractPaymentData['count'] + " " +this.contractPaymentData['containerName']  , style:'heading2'}],] }
                      },
                      {
                        layout:'noBorders',
                        margin: [10 , 10 , 0 , 0],
                        table:{headerRows: 1 , widths:['20%' , '80%'],
                      body: [
                          [{text:'Deliveries Date:'  , style:'heading'} , {text: this.deliveryData.map((row=>row.supplierDateDay)) , style:'heading2'}],] }
                      },
                      // {
                      //   layout:'noBorders',
                      //   margin: [70 , 7 , 0 , 0],
                      //   table:{headerRows: 1 , widths:['20%' , '80%'],
                      // body: [
                      //   [{text:'Commission:'  , style:'heading'} ,{text:   "Fabcot International FZE: " + this.contractCostingData['rateCurrencyName']  + " "  + this.contractCommissionData['fabCotCommision'] + "%" , style:'heading2'}],] }
                      // },
                      // {
                      //   layout:'noBorders',
                      //   margin: [165 , 0 , 0 , 3],
                      //   table:{headerRows: 1 , widths:['100%'],
                      // body: [
                      //   [
                      //     {text: this.contractCommissionData['agentCommissions'] == '' ? " " : "Foreign Agent: " +  this.contractCommissionData['agentCommissions'].map((row=> row.agentName + " " + row.agentCommission + "%"))   , style : 'heading4'}
                      //   ],
                      // ] }
                      // },
                      {
                        layout:'noBorders',
                        margin: [10 , 10 , 0 , 0],
                        table:{headerRows: 1 , widths:['20%' , '80%'],
                      body: [
                        [{text:'Remarks:'  , style:'heading'} , {text: this.contractRemarksData['contractRemarks'] , style:'heading2'}],] }
                      },
                      {
                        layout:'noBorders',
                        margin: [10 , 10 , 0 , 0],
                        table:{headerRows: 1 , widths:['20%' , '50%'],
                      body: [
                        [{text:'Other Conditions:' , style:'heading'} , {text: this.contractRemarksData['otherConditionRemarks'] , style:'heading2'}],] }
                      },
                      {
                        layout:'noBorders',
                        margin: [10 , 25 , 0 , 0],
                        table:{headerRows: 1 , widths:['30%'],
                      body: [
                        [{text:'Thanks And Regards:'  , style:'heading'}],] }
                      },
                      {
                        layout:'noBorders',
                        margin: [10 , 25 , 0 , 0],
                        table:{headerRows: 1 , widths:['70%'],
                      body: [
                        [{text:'For FabCot International Enterprises'  , style:'heading'}],] }
                      },
                      {
                        layout:'noBorders',
                        margin: [20 , 120 , 0 , 0],
                        table:{headerRows: 1 , widths:[ '100%'],
                      body: [
                        [ {text:'NOTE: This is a system generated Contract and does not require any signature.'  , style:'tableheader' }],] }
                      },
                    ],
                    styles:{
                     heading:{fontSize: 9,
                      bold: true,color: '#4d4b4b' },
                      heading2:{fontSize: 9  , color:'#4d4b4b'
                        },
                        heading5:{fontSize: 8  , color:'#4d4b4b'
                      },
                      
                        heading3:{fontSize: 6  , color:'#4d4b4b'
                      },
                      style1:{
                      margin: [70,7,0,0]
                      },
                      style2:{
                        margin: [0,0,0,0]
                        },
                        tableheader: {
                          fillColor: '#f3f3f4',
                          fontSize: 8,
                          bold: true,
                          color: '#4d4b4b',
                         alignment:'center',
                          margin:8
                        
                         },
                         
                        tableheader2: {
                          // fillColor: '#f3f3f4',
                          fontSize: 8,
                          bold: true,
                          color: '#4d4b4b',
                         alignment:'center',
                          margin:2
                        
                         },
                         heading4:{fontSize: 9,color: '#4d4b4b' },
                         tableheader3: {
                          
                          fontSize: 7,
                         
                          color: '#4d4b4b',
                         alignment:'center',
                          margin:5
                        
                         }

                    },
                    
          
            };
            pdfMake.createPdf(docDefinition).print();
          }

          printSupplierBangla(){


            this.http.get(`${environment.apiUrl}/api/Reports/ContractIndentPrint/`+ this.contractId)
            .subscribe(
              res => {
                this.response = res;
                if (this.response.success == true && this.response.data != null) {
                  this.printData = this.response.data;
              
        
                }
                else if(this.response.success == false) {
                 
                  this.toastr.error(this.response.message, 'Message.');
                }
        
              },(err: HttpErrorResponse) => {
                const messages = this.service.extractErrorMessagesFromErrorResponse(err);
                this.toastr.error(messages.toString(), 'Message.');
                console.log(messages);
              });

            let docDefinition = {
              pageSize: 'A4',
              pageMargins: [ 30, 20, 40, 20 ],
              pageOrientation: 'letter',
                
                    info: {
                      title: 'Contract Seller'
                    },
                 
                    content: [
                   
                      {
                        "image" : this.image2,
                       fit : [130 , 130]
                    
                      },
                      {
                        layout:'noBorders',
                        margin: [290 , -40 , 0 , 0],
                        table:{headerRows: 1 , widths:['100%'],
                      body: [
                        [{text:this.checkR  , style:'heading'} ],] }
                      },
                      {
                        layout:'noBorders',
                        margin: [290 , 0 , 0 , 0],
                        table:{headerRows: 1 , widths:['28%' , '90%'],
                      body: [
                        [{text:'Contract No:'  , style:'heading'} , {text: this.contractData['autoContractNumber'] , style:'heading2'}],] }
                      },
                      {
                        layout:'noBorders',
                        margin: [290 , 0 , 0 , 0],
                        table:{headerRows: 1 , widths:['28%' , '90%'],
                      body: [
                        [{text:'Contract Date:'  , style:'heading'} , {text: this.contractData['createdDateTime'] , style:'heading2'}],] }
                      },
                      {
                        layout:'noBorders',
                        margin: [290 , 0 , 0 , 0],
                        table:{headerRows: 1 , widths:['28%' , '90%'],
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
                        [{text:'Supplier Name:'  , style:'heading'} , {text: this.contractPartiesData['sellerName'] , style:'heading5'}],] }
                      },
                   
                      {
                        layout:'noBorders',
                        margin: [70 , 7 , 0 , 0],
                        table:{headerRows: 1 , widths:['20%' , '80%'],
                      body: [
                        [{text:'Buyer Name:'  , style:'heading'} , {text: this.contractPartiesData['buyerName'], style:'heading5'}],] }
                      },
                      {
                        layout:'noBorders',
                        margin: [70 , 7 , 0 , 0],
                        table:{headerRows: 1 , widths:['20%' , '80%'],
                      body: [
                        [{text:'LC Opner:'  , style:'heading'} , {text: this.contractPartiesData['lcOpner'], style:'heading5'}],] }
                      },
                      {
                        margin: [70 , 10 , 0 , 10],
                       
                        table:{
                          headerRows:1,
                          widths: [ '20%' , '15%' , '10%' , '20%' , '25%' ],
                          body:[
                            [ {text:'Article' , style: 'tableheader2' , }, {text:'Quantity' , style: 'tableheader2'},
                            {text:'Rate' , style: 'tableheader2'},
                            {text:'Fabcot Comm' , style: 'tableheader2'} , 
                             {text:'Foreign Agent Comm' , style: 'tableheader2'}
      
                          ],
                    ...this.contractData['contractArticles'].map((row=>
                      [
                        // row.articleName  , row.contractArticleQuantity, row.contractArticleCommission,
                        // row.contractArticleRate 
                             {text: row.articleName + '\n' + this.contractProductData['construction'] , style: 'tableheader3'} , 
                             {text:   this.contractCostingData['quantityToleranceValue'] != '' &&  this.contractCostingData['quantityToleranceValue'] != 0 ? row.contractArticleQuantity + '\n' +  "+/-" + this.contractCostingData['quantityToleranceValue'] + '%' +' '+ row.uomUnit : row.contractArticleQuantity  , style: 'tableheader3'},
                             {text: row.contractArticleRate == null ? '' : this.contractCostingData['rateCurrencyName'] == 'USD' ?  "$ " + row.contractArticleRate : this.contractCostingData['rateCurrencyName'] == 'PKR' ? "RS " + row.contractArticleRate : this.contractCostingData['rateCurrencyName'] == 'EUR' ?  "€ " + row.contractArticleRate : this.contractCostingData['rateCurrencyName'] == 'GBP' ?  "GBP " + row.contractArticleRate : row.contractArticleRate , style: 'tableheader3'},

                             {text: row.contractArticleCommission == null ? '' : row.contractArticleCommission + "%" , style: 'tableheader3'},
                             {text: row.contractArticleForignAgentCommission == null ? '' : row.contractArticleForignAgentCommission + "%" +'\n'+ row.forignAgentName , style: 'tableheader3'}

                        ]
                      ))
                  
                          ]
                        }
                      },

                      {

                        layout:'noBorders',
                        margin: [70 , 7 , 0 , 0],
                        table:{headerRows: 1 , widths:['20%' , '80%'],
                      body: [
                        [{text:'Packing:'  , style:'heading'} , {text: this.contractPaymentData['packingName'] , style:'heading2'}],] }
                      },
                      // {

                      //   layout:'noBorders',
                      //   margin: [70 , 7 , 0 , 0],
                      //   table:{headerRows: 1 , widths:['20%' , '80%'],
                      // body: [
                      //   [{text:'Construction:'  , style:'heading'} , {text: this.contractProductData['construction'] , style:'heading2'}],] }
                      // },
                     
                      {

                        layout:'noBorders',
                       
                        table:{  headerRows: 1 , widths:['30%' , '80%'],
                      body: [ this.contractProductData['brandName'] !='' ?
                        [{text:this.contractProductData['brandName'] != ""   ?  'Brand Name:' : '' ,  margin: [70 , 5 , 0 , 0]    , style:'heading'} , {text: this.contractProductData['brandName'] != '' ? this.contractProductData['brandName'] : ''  , margin: [8 , 5 , 0 , 0] , style:'heading2'}]: ''  , ] }
                      },
                     
                      {
                        layout:'noBorders',
                        margin: [70 , 7 , 0 , 0],
                        table:{headerRows: 1 , widths:['20%' , '80%'],
                      body: [
                        [{text:'Payment Term:'  , style:'heading'} ,
                         {text: this.contractPaymentData['paymentTermDays'] == 0?this.contractPaymentData['paymentTermName'] :this.contractPaymentData['paymentTermDays'] + "  "+this.contractPaymentData['paymentTermName'] , style:'heading2'}],] }
                      },
                      {
                        layout:'noBorders',
                        margin: [70 , 7 , 0 , 0],
                        table:{headerRows: 1 , widths:['20%' , '80%'],
                      body: [
                        [{text:'Delivery Term:'  , style:'heading'} , {text: this.contractPaymentData['priceTermName'] +" " +this.contractPaymentData['destinationName'] , style:'heading2'}],] }
                      },
                      {

                        layout:'noBorders',
                        margin: [70 , 7 , 0 , 0],
                        table:{headerRows: 1 , widths:['20%' , '80%'],
                      body: [
                        [{text:'Container:'  , style:'heading'} ,
                         {text: this.contractPaymentData['count'] && this.contractPaymentData['containerName'] != null?
                          this.contractPaymentData['count'] + this.contractPaymentData['containerName'] :this.contractPaymentData['count'] + " " +this.contractPaymentData['containerName']  , style:'heading2'}],] }
                      },
                      {
                        layout:'noBorders',
                        margin: [70 , 7 , 0 , 0],
                        table:{headerRows: 1 , widths:['20%' , '80%'],
                      body: [
                          [{text:'Deliveries Date:'  , style:'heading'} , {text: this.deliveryData.map((row=>row.supplierDateDay)) , style:'heading2'}],] }
                      },
                      // {
                      //   layout:'noBorders',
                      //   margin: [70 , 7 , 0 , 0],
                      //   table:{headerRows: 1 , widths:['20%' , '80%'],
                      // body: [
                      //   [{text:'Commission:'  , style:'heading'} ,{text:   "Fabcot International FZE: " + this.contractCostingData['rateCurrencyName']  + " "  + this.contractCommissionData['fabCotCommision'] + "%" , style:'heading2'}],] }
                      // },
                      // {
                      //   layout:'noBorders',
                      //   margin: [165 , 0 , 0 , 3],
                      //   table:{headerRows: 1 , widths:['100%'],
                      // body: [
                      //   [
                      //     {text: this.contractCommissionData['agentCommissions'] == '' ? " " : "Foreign Agent: " +  this.contractCommissionData['agentCommissions'].map((row=> row.agentName + " " + row.agentCommission + "%"))   , style : 'heading4'}
                      //   ],
                      // ] }
                      // },
                      {
                        layout:'noBorders',
                        margin: [70 , 7 , 0 , 0],
                        table:{headerRows: 1 , widths:['20%' , '80%'],
                      body: [
                        [{text:'Remarks:'  , style:'heading'} , {text: this.contractRemarksData['contractRemarks'] , style:'heading2'}],] }
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
                        margin: [20 , 120 , 0 , 0],
                        table:{headerRows: 1 , widths:[ '100%'],
                      body: [
                        [ {text:'NOTE: This is a system generated Contract and does not require any signature.'  , style:'tableheader' }],] }
                      },
                    ],
                    styles:{
                     heading:{fontSize: 9,
                      bold: true,color: '#4d4b4b' },
                      heading2:{fontSize: 9  , color:'#4d4b4b'
                        },
                        heading5:{fontSize: 8  , color:'#4d4b4b'
                      },
                      
                        heading3:{fontSize: 6  , color:'#4d4b4b'
                      },
                      style1:{
                      margin: [70,7,0,0]
                      },
                      style2:{
                        margin: [0,0,0,0]
                        },
                        tableheader: {
                          fillColor: '#f3f3f4',
                          fontSize: 8,
                          bold: true,
                          color: '#4d4b4b',
                         alignment:'center',
                          margin:8
                        
                         },
                         
                        tableheader2: {
                          // fillColor: '#f3f3f4',
                          fontSize: 9,
                          bold: true,
                          color: '#4d4b4b',
                         alignment:'center',
                          margin:5
                        
                         },
                         heading4:{fontSize: 9,color: '#4d4b4b' },
                         tableheader3: {
                          
                          fontSize: 7,
                         
                          color: '#4d4b4b',
                         alignment:'center',
                          margin:5
                        
                         }

                    },
                    
          
            };
            pdfMake.createPdf(docDefinition).print();
          }
          printBuyerComber(){


            this.http.get(`${environment.apiUrl}/api/Reports/ContractIndentPrint/`+ this.contractId)
            .subscribe(
              res => {
                this.response = res;
                if (this.response.success == true && this.response.data != null) {
                  this.printData = this.response.data;
              
        
                }
                else if(this.response.success == false) {
                 
                  this.toastr.error(this.response.message, 'Message.');
                }
        
              },(err: HttpErrorResponse) => {
                const messages = this.service.extractErrorMessagesFromErrorResponse(err);
                this.toastr.error(messages.toString(), 'Message.');
                console.log(messages);
              });

            let docDefinition = {
              pageSize: 'A4',
              pageMargins: [ 25, 20, 40, 20 ],
              pageOrientation: 'letter',
                
                    info: {
                      title: 'Contract Seller'
                    },
                 
                    content: [
                   
                      {
                        "image" : this.image2,
                       fit : [130 , 130]
                    
                      },

                      {
                        layout:'noBorders',
                        margin: [15 , 0 , 0 , 0],
                        table:{headerRows: 1 , widths:['100%'],
                      body: [
                        [{text:'(Buyer Contract)'  , style:'headingname'} ],] }
                      },
                      {
                        layout:'noBorders',
                        margin: [290 , -40 , 0 , 0],
                        table:{headerRows: 1 , widths:['100%'],
                      body: [
                        [{text:this.checkR  , style:'heading'} ],] }
                      },
                      {
                        layout:'noBorders',
                        margin: [310 , 0 , 0 , 0],
                        table:{headerRows: 1 , widths:['28%' , '80%'],
                      body: [
                        [{text:'Contract No:'  , style:'heading'} , {text: this.contractData['autoContractNumber'] , style:'heading2'}],] }
                      },
                      {
                        layout:'noBorders',
                        margin: [310 , 0 , 0 , 0],
                        table:{headerRows: 1 , widths:['28%' , '90%'],
                      body: [
                        [{text:'Contract Date:'  , style:'heading'} , {text: this.contractData['createdDateTime'] , style:'heading2'}],] }
                      },
                      {
                        layout:'noBorders',
                        margin: [310 , 0 , 0 , 0],
                        table:{headerRows: 1 , widths:['28%' , '90%'],
                      body: [
                        [{text:'Purchase No:'  , style:'heading'} , {text: this.contractPartiesData['poNumber'] , style:'heading2'}],] }
                      },
                      {
                        layout:'noBorders',
                        margin: [8 , 10 , 0 , 0],
                        table:{headerRows: 1 , widths:['10%' , '60%'],
                      body: [
                        [{text:'Attn:'  , style:'heading'} , {text: this.contractPartiesData['sellerPOCName'] , margin:[-20,0,0,0] , style:'heading2'}]] }
                      },
                      {
                        layout:'noBorders',
                        margin: [8 , 0 , 0 , 0],
                        table:{headerRows: 1 , widths:['100%'],
                      body: [
                        [{text:' We are please to confirm here the booking as per following term and conditions.' , style:'heading2'}  ],] }
                      },
                     
                      {
                        layout:'noBorders',
                        margin: [10 , 10 , 0 , 0],
                        table:{headerRows: 1 , widths:['20%' , '80%'],
                      body: [
                        [{text:'Supplier Name:'  , style:'heading'} , {text: this.contractPartiesData['sellerName'], style:'heading5'}],] }
                      },
                      {
                        layout:'noBorders',
                        margin: [10 , 10 , 0 , 0],
                        table:{headerRows: 1 , widths:['20%' , '80%'],
                      body: [
                        [{text:'Supplier GST&NTN:'  , style:'heading'} , {text: this.printData['sellerGSTNumber'] , style:'heading5'}],] }
                      },
                   
                      {
                        layout:'noBorders',
                        margin: [10 , 10 , 0 , 0],
                        table:{headerRows: 1 , widths:['20%' , '80%'],
                      body: [
                        [{text:'Buyer Name:'  , style:'heading'} , {text: this.contractPartiesData['buyerName'], style:'heading5'}],] }
                      },

                      {
                        layout:'noBorders',
                        margin: [10 , 10 , 0 , 0],
                        table:{headerRows: 1 , widths:['20%' , '80%'],
                      body: [
                        [{text:'Buyer GST&NTN:'  , style:'heading'} , {text: this.printData['buyerGSTNumber'], style:'heading5'}],] }
                      },
                      // {
                      //   layout:'noBorders',
                      //   margin: [10 , 10  , 0 , 0],
                      //   table:{headerRows: 1 , widths:['20%' , '80%'],
                      // body: [
                      //   [{text:'LC Opner:'  , style:'heading'} , {text: this.contractPartiesData['lcOpner'], style:'heading5'}],] }
                      // },
                      {
                        margin: [10 , 10  , 0 , 10],
                       
                        table:{
                          headerRows:1,
                          widths: [ '20%' , '15%' , '10%' , '20%' , '20%','20%' ],
                          body:[
                            [ {text:'Article' , style: 'tableheader2' , },
                             {text:'Quantity' , style: 'tableheader2'},
                            {text:'Rate' , style: 'tableheader2'},
                            {text:'Amount Excl Gst' , style: 'tableheader2'} , 
                             {text:'18% Gst Amount' , style: 'tableheader2'},
                             {text:'Amount Incl Gst' , style: 'tableheader2'},
      
                          ],
                    ...this.contractData['contractArticles'].map((row=>
                      [
                        // row.articleName  , row.contractArticleQuantity, row.contractArticleCommission,
                        // row.contractArticleRate 
                             {text: row.articleName, style: 'tableheader3'} , 
                             {text:   this.contractCostingData['quantityToleranceValue'] != '' &&  this.contractCostingData['quantityToleranceValue'] != 0 ? row.contractArticleQuantity + '\n' +  "+/-" + this.contractCostingData['quantityToleranceValue'] + '%' +' '+ row.uomUnit : row.contractArticleQuantity  , style: 'tableheader3'},
                             {text: row.contractArticleRate == null ? '' : this.contractCostingData['rateCurrencyName'] == 'USD' ?  "$ " + row.contractArticleRate : this.contractCostingData['rateCurrencyName'] == 'PKR' ? "RS " + row.contractArticleRate : this.contractCostingData['rateCurrencyName'] == 'EUR' ?  "€ " + row.contractArticleRate : this.contractCostingData['rateCurrencyName'] == 'GBP' ?  "GBP " + row.contractArticleRate : row.contractArticleRate , style: 'tableheader3'},

                             {text: row.amountExclGSt , style: 'tableheader3'},
                             {text: row.amountGSt , style: 'tableheader3'},
                             {text: row.amountInclGSt , style: 'tableheader3'}

                        ]
                      ))
                  
                          ]
                        }
                      },

                      {

                        layout:'noBorders',
                        margin: [10 , 10 , 0 , 0],
                        table:{headerRows: 1 , widths:['20%' , '80%'],
                      body: [
                        [{text:'Packing:'  , style:'heading'} , {text: this.contractPaymentData['packingName'] , style:'heading2'}],] }
                      },
                      // {

                      //   layout:'noBorders',
                      //   margin: [70 , 7 , 0 , 0],
                      //   table:{headerRows: 1 , widths:['20%' , '80%'],
                      // body: [
                      //   [{text:'Construction:'  , style:'heading'} , {text: this.contractProductData['construction'] , style:'heading2'}],] }
                      // },
                     
                      // {

                      //   layout:'noBorders',
                       
                      //   table:{  headerRows: 1 , widths:['30%' , '80%'],
                      // body: [ this.contractProductData['brandName'] !='' ?
                      //   [{text:this.contractProductData['brandName'] != ""   ?  'Brand Name:' : '' ,  margin: [70 , 5 , 0 , 0]    , style:'heading'} , {text: this.contractProductData['brandName'] != '' ? this.contractProductData['brandName'] : ''  , margin: [8 , 5 , 0 , 0] , style:'heading2'}]: ''  , ] }
                      // },
                     
                      {
                        layout:'noBorders',
                        margin: [10 , 10 , 0 , 0],
                        table:{headerRows: 1 , widths:['20%' , '80%'],
                      body: [
                        [{text:'Payment Term:'  , style:'heading'} ,
                         {text: this.contractPaymentData['paymentTermDays'] == 0?this.contractPaymentData['paymentTermName'] :this.contractPaymentData['paymentTermDays'] + "  "+this.contractPaymentData['paymentTermName'] , style:'heading2'}],] }
                      },
                      {
                        layout:'noBorders',
                        margin: [10 , 10 , 0 , 0],
                        table:{headerRows: 1 , widths:['20%' , '80%'],
                      body: [
                        [{text:'Delivery Term:'  , style:'heading'} , {text: this.contractPaymentData['priceTermName'] +" " +this.contractPaymentData['destinationName'] , style:'heading2'}],] }
                      },
                      {
                        layout:'noBorders',
                        margin: [10 , 10 , 0 , 0],
                        table:{headerRows: 1 , widths:['20%' , '80%'],
                      body: [
                        [{text:'Commission:'  , style:'heading'} , {text: this.contractCommissionData['buyersideCommision'] +"%" , style:'heading2'}],] }
                      },
                      {

                        layout:'noBorders',
                        margin: [10 , 10 , 0 , 0],
                        table:{headerRows: 1 , widths:['20%' , '80%'],
                      body: [
                        [{text:'Container:'  , style:'heading'} ,
                         {text: this.contractPaymentData['count'] && this.contractPaymentData['containerName'] != null?
                          this.contractPaymentData['count'] + this.contractPaymentData['containerName'] :this.contractPaymentData['count'] + " " +this.contractPaymentData['containerName']  , style:'heading2'}],] }
                      },
                      {
                        layout:'noBorders',
                        margin: [10 , 10 , 0 , 0],
                        table:{headerRows: 1 , widths:['20%' , '80%'],
                      body: [
                          [{text:'Deliveries Date:'  , style:'heading'} , {text: this.deliveryData.map((row=>row.supplierDateDay)) , style:'heading2'}],] }
                      },
                      // {
                      //   layout:'noBorders',
                      //   margin: [70 , 7 , 0 , 0],
                      //   table:{headerRows: 1 , widths:['20%' , '80%'],
                      // body: [
                      //   [{text:'Commission:'  , style:'heading'} ,{text:   "Fabcot International FZE: " + this.contractCostingData['rateCurrencyName']  + " "  + this.contractCommissionData['fabCotCommision'] + "%" , style:'heading2'}],] }
                      // },
                      // {
                      //   layout:'noBorders',
                      //   margin: [165 , 0 , 0 , 3],
                      //   table:{headerRows: 1 , widths:['100%'],
                      // body: [
                      //   [
                      //     {text: this.contractCommissionData['agentCommissions'] == '' ? " " : "Foreign Agent: " +  this.contractCommissionData['agentCommissions'].map((row=> row.agentName + " " + row.agentCommission + "%"))   , style : 'heading4'}
                      //   ],
                      // ] }
                      // },
                      {
                        layout:'noBorders',
                        margin: [10 , 10 , 0 , 0],
                        table:{headerRows: 1 , widths:['20%' , '80%'],
                      body: [
                        [{text:'Remarks:'  , style:'heading'} , {text: this.contractRemarksData['contractRemarks'] , style:'heading2'}],] }
                      },
                      {
                        layout:'noBorders',
                        margin: [10 , 10 , 0 , 0],
                        table:{headerRows: 1 , widths:['20%' , '50%'],
                      body: [
                        [{text:'Other Conditions:' , style:'heading'} , {text: this.contractRemarksData['otherConditionRemarks'] , style:'heading2'}],] }
                      },
                      {
                        layout:'noBorders',
                        margin: [10 , 10 , 0 , 0],
                        table:{headerRows: 1 , widths:['30%'],
                      body: [
                        [{text:'Thanks And Regards:'  , style:'heading'}],] }
                      },
                      {
                        layout:'noBorders',
                        margin: [10 , 50 , 0 , 0],
                        table:{headerRows: 1 , widths:['70%'],
                      body: [
                        [{text:'For FabCot International'  , style:'heading'}],] }
                      },
                      {
                        layout:'noBorders',
                        margin: [20 , 150 , 0 , 0],
                        table:{headerRows: 1 , widths:[ '100%'],
                      body: [
                        [ {text:'NOTE: This is a system generated Contract and does not require any signature.'  , style:'tableheader' }],] }
                      },
                    ],
                    // footer:{
                    //   margin: [20, 0],
                    //   columns: [
                    //     'NOTE: This is a system generated Contract and does not require any signature.',
                    //     { text: '', alignment: 'center' , style:'tableheader'}
                    //   ]
                    // },
                    styles:{
                      headingname:{fontSize: 9,
                        bold: true,color: '#4d4b4b', },
                     heading:{fontSize: 9,
                      bold: true,color: '#4d4b4b' },
                      headingFootrt:{fontSize: 9,
                        bold: true,color: '#4d4b4b' ,alignment:'center',fillColor: '#f3f3f4' },
                      heading2:{fontSize: 9  , color:'#4d4b4b'
                        },
                        heading5:{fontSize: 8  , color:'#4d4b4b'
                      },
                      
                        heading3:{fontSize: 6  , color:'#4d4b4b'
                      },
                      style1:{
                      margin: [70,7,0,0]
                      },
                      style2:{
                        margin: [0,0,0,0]
                        },
                        tableheader: {
                          fillColor: '#f3f3f4',
                          fontSize: 8,
                          bold: true,
                          color: '#4d4b4b',
                         alignment:'center',
                          margin:8
                        
                         },
                         
                        tableheader2: {
                          // fillColor: '#f3f3f4',
                          fontSize: 9,
                          bold: true,
                          color: '#4d4b4b',
                         alignment:'center',
                          margin:5
                        
                         },
                         heading4:{fontSize: 9,color: '#4d4b4b' },
                         tableheader3: {
                          
                          fontSize: 7,
                         
                          color: '#4d4b4b',
                         alignment:'center',
                          margin:5
                        
                         }

                    },
                    
          
            };
            pdfMake.createPdf(docDefinition).print();
          }

          printSupplierComber(){


            this.http.get(`${environment.apiUrl}/api/Reports/ContractIndentPrint/`+ this.contractId)
            .subscribe(
              res => {
                this.response = res;
                if (this.response.success == true && this.response.data != null) {
                  this.printData = this.response.data;
              
        
                }
                else if(this.response.success == false) {
                 
                  this.toastr.error(this.response.message, 'Message.');
                }
        
              },(err: HttpErrorResponse) => {
                const messages = this.service.extractErrorMessagesFromErrorResponse(err);
                this.toastr.error(messages.toString(), 'Message.');
                console.log(messages);
              });

              let docDefinition = {
                pageSize: 'A4',
                pageMargins: [ 25, 20, 40, 20 ],
                pageOrientation: 'letter',
                  
                      info: {
                        title: 'Contract Seller'
                      },
                   
                      content: [
                     
                        {
                          "image" : this.image2,
                         fit : [130 , 130]
                      
                        },
  
                        {
                          layout:'noBorders',
                          margin: [15 , 0 , 0 , 0],
                          table:{headerRows: 1 , widths:['100%'],
                        body: [
                          [{text:'(Seller Contract)'  , style:'headingname'} ],] }
                        },
                        {
                          layout:'noBorders',
                          margin: [290 , -40 , 0 , 0],
                          table:{headerRows: 1 , widths:['100%'],
                        body: [
                          [{text:this.checkR  , style:'heading'} ],] }
                        },
                        {
                          layout:'noBorders',
                          margin: [310 , 0 , 0 , 0],
                          table:{headerRows: 1 , widths:['28%' , '80%'],
                        body: [
                          [{text:'Contract No:'  , style:'heading'} , {text: this.contractData['autoContractNumber'] , style:'heading2'}],] }
                        },
                        {
                          layout:'noBorders',
                          margin: [310 , 0 , 0 , 0],
                          table:{headerRows: 1 , widths:['28%' , '90%'],
                        body: [
                          [{text:'Contract Date:'  , style:'heading'} , {text: this.contractData['createdDateTime'] , style:'heading2'}],] }
                        },
                        {
                          layout:'noBorders',
                          margin: [310 , 0 , 0 , 0],
                          table:{headerRows: 1 , widths:['28%' , '90%'],
                        body: [
                          [{text:'Purchase No:'  , style:'heading'} , {text: this.contractPartiesData['poNumber'] , style:'heading2'}],] }
                        },
                        {
                          layout:'noBorders',
                          margin: [8 , 10 , 0 , 0],
                          table:{headerRows: 1 , widths:['10%' , '60%'],
                        body: [
                          [{text:'Attn:'  , style:'heading'} , {text: this.contractPartiesData['sellerPOCName'] , margin:[-20,0,0,0] , style:'heading2'}]] }
                        },
                        {
                          layout:'noBorders',
                          margin: [8 , 0 , 0 , 0],
                          table:{headerRows: 1 , widths:['100%'],
                        body: [
                          [{text:' We are please to confirm here the booking as per following term and conditions.' , style:'heading2'}  ],] }
                        },
                       
                        {
                          layout:'noBorders',
                          margin: [10 , 10 , 0 , 0],
                          table:{headerRows: 1 , widths:['20%' , '80%'],
                        body: [
                          [{text:'Supplier Name:'  , style:'heading'} , {text: this.contractPartiesData['sellerName'] +'('+ this.printData.sellerGSTNumber  +')', style:'heading5'}],] }
                        },

                        {
                          layout:'noBorders',
                          margin: [10 , 10 , 0 , 0],
                          table:{headerRows: 1 , widths:['20%' , '80%'],
                        body: [
                          [{text:'Supplier GST&NTN:'  , style:'heading'} , {text: this.printData['sellerGSTNumber'] , style:'heading5'}],] }
                        },
                     
                        {
                          layout:'noBorders',
                          margin: [10 , 10 , 0 , 0],
                          table:{headerRows: 1 , widths:['20%' , '80%'],
                        body: [
                          [{text:'Buyer Name:'  , style:'heading'} , {text: this.contractPartiesData['buyerName'] , style:'heading5'}],] }
                        },

                        {
                          layout:'noBorders',
                          margin: [10 , 10 , 0 , 0],
                          table:{headerRows: 1 , widths:['20%' , '80%'],
                        body: [
                          [{text:'Buyer GST&NTN:'  , style:'heading'} , {text: this.printData['buyerGSTNumber'] , style:'heading5'}],] }
                        },
                        // {
                        //   layout:'noBorders',
                        //   margin: [10 , 10  , 0 , 0],
                        //   table:{headerRows: 1 , widths:['20%' , '80%'],
                        // body: [
                        //   [{text:'LC Opner:'  , style:'heading'} , {text: this.contractPartiesData['lcOpner'], style:'heading5'}],] }
                        // },
                        {
                          margin: [10 , 10  , 0 , 10],
                         
                          table:{
                            headerRows:1,
                            widths: [ '20%' , '15%' , '10%' , '20%' , '20%','20%' ],
                            body:[
                              [ {text:'Article' , style: 'tableheader2' , },
                               {text:'Quantity' , style: 'tableheader2'},
                              {text:'Rate' , style: 'tableheader2'},
                              {text:'Amount Excl Gst' , style: 'tableheader2'} , 
                               {text:'18% Gst Amount' , style: 'tableheader2'},
                               {text:'Amount Incl Gst' , style: 'tableheader2'},
        
                            ],
                      ...this.contractData['contractArticles'].map((row=>
                        [
                          // row.articleName  , row.contractArticleQuantity, row.contractArticleCommission,
                          // row.contractArticleRate 
                               {text: row.articleName, style: 'tableheader3'} , 
                               {text:   this.contractCostingData['quantityToleranceValue'] != '' &&  this.contractCostingData['quantityToleranceValue'] != 0 ? row.contractArticleQuantity + '\n' +  "+/-" + this.contractCostingData['quantityToleranceValue'] + '%' +' '+ row.uomUnit : row.contractArticleQuantity  , style: 'tableheader3'},
                               {text: row.contractArticleRate == null ? '' : this.contractCostingData['rateCurrencyName'] == 'USD' ?  "$ " + row.contractArticleRate : this.contractCostingData['rateCurrencyName'] == 'PKR' ? "RS " + row.contractArticleRate : this.contractCostingData['rateCurrencyName'] == 'EUR' ?  "€ " + row.contractArticleRate : this.contractCostingData['rateCurrencyName'] == 'GBP' ?  "GBP " + row.contractArticleRate : row.contractArticleRate , style: 'tableheader3'},
  
                               {text: row.amountExclGSt , style: 'tableheader3'},
                               {text: row.amountGSt , style: 'tableheader3'},
                               {text: row.amountInclGSt , style: 'tableheader3'}
  
                          ]
                        ))
                    
                            ]
                          }
                        },
  
                        {
  
                          layout:'noBorders',
                          margin: [10 , 10 , 0 , 0],
                          table:{headerRows: 1 , widths:['20%' , '80%'],
                        body: [
                          [{text:'Packing:'  , style:'heading'} , {text: this.contractPaymentData['packingName'] , style:'heading2'}],] }
                        },
                        // {
  
                        //   layout:'noBorders',
                        //   margin: [70 , 7 , 0 , 0],
                        //   table:{headerRows: 1 , widths:['20%' , '80%'],
                        // body: [
                        //   [{text:'Construction:'  , style:'heading'} , {text: this.contractProductData['construction'] , style:'heading2'}],] }
                        // },
                       
                        // {
  
                        //   layout:'noBorders',
                         
                        //   table:{  headerRows: 1 , widths:['30%' , '80%'],
                        // body: [ this.contractProductData['brandName'] !='' ?
                        //   [{text:this.contractProductData['brandName'] != ""   ?  'Brand Name:' : '' ,  margin: [70 , 5 , 0 , 0]    , style:'heading'} , {text: this.contractProductData['brandName'] != '' ? this.contractProductData['brandName'] : ''  , margin: [8 , 5 , 0 , 0] , style:'heading2'}]: ''  , ] }
                        // },
                       
                        {
                          layout:'noBorders',
                          margin: [10 , 10 , 0 , 0],
                          table:{headerRows: 1 , widths:['20%' , '80%'],
                        body: [
                          [{text:'Payment Term:'  , style:'heading'} ,
                           {text: this.contractPaymentData['paymentTermDays'] == 0?this.contractPaymentData['paymentTermName'] :this.contractPaymentData['paymentTermDays'] + "  "+this.contractPaymentData['paymentTermName'] , style:'heading2'}],] }
                        },
                        {
                          layout:'noBorders',
                          margin: [10 , 10 , 0 , 0],
                          table:{headerRows: 1 , widths:['20%' , '80%'],
                        body: [
                          [{text:'Delivery Term:'  , style:'heading'} , {text: this.contractPaymentData['priceTermName'] +" " +this.contractPaymentData['destinationName'] , style:'heading2'}],] }
                        },
                        {
                          layout:'noBorders',
                          margin: [10 , 10 , 0 , 0],
                          table:{headerRows: 1 , widths:['20%' , '80%'],
                        body: [
                          [{text:'Commission:'  , style:'heading'} , {text: this.contractCommissionData['fabCotCommision'] +"%", style:'heading2'}],] }
                        },
                        {
  
                          layout:'noBorders',
                          margin: [10 , 10 , 0 , 0],
                          table:{headerRows: 1 , widths:['20%' , '80%'],
                        body: [
                          [{text:'Container:'  , style:'heading'} ,
                           {text: this.contractPaymentData['count'] && this.contractPaymentData['containerName'] != null?
                            this.contractPaymentData['count'] + this.contractPaymentData['containerName'] :this.contractPaymentData['count'] + " " +this.contractPaymentData['containerName']  , style:'heading2'}],] }
                        },
                        {
                          layout:'noBorders',
                          margin: [10 , 10 , 0 , 0],
                          table:{headerRows: 1 , widths:['20%' , '80%'],
                        body: [
                            [{text:'Deliveries Date:'  , style:'heading'} , {text: this.deliveryData.map((row=>row.supplierDateDay)) , style:'heading2'}],] }
                        },
                        // {
                        //   layout:'noBorders',
                        //   margin: [70 , 7 , 0 , 0],
                        //   table:{headerRows: 1 , widths:['20%' , '80%'],
                        // body: [
                        //   [{text:'Commission:'  , style:'heading'} ,{text:   "Fabcot International FZE: " + this.contractCostingData['rateCurrencyName']  + " "  + this.contractCommissionData['fabCotCommision'] + "%" , style:'heading2'}],] }
                        // },
                        // {
                        //   layout:'noBorders',
                        //   margin: [165 , 0 , 0 , 3],
                        //   table:{headerRows: 1 , widths:['100%'],
                        // body: [
                        //   [
                        //     {text: this.contractCommissionData['agentCommissions'] == '' ? " " : "Foreign Agent: " +  this.contractCommissionData['agentCommissions'].map((row=> row.agentName + " " + row.agentCommission + "%"))   , style : 'heading4'}
                        //   ],
                        // ] }
                        // },
                        {
                          layout:'noBorders',
                          margin: [10 , 10 , 0 , 0],
                          table:{headerRows: 1 , widths:['20%' , '80%'],
                        body: [
                          [{text:'Remarks:'  , style:'heading'} , {text: this.contractRemarksData['contractRemarks'] , style:'heading2'}],] }
                        },
                        {
                          layout:'noBorders',
                          margin: [10 , 10 , 0 , 0],
                          table:{headerRows: 1 , widths:['20%' , '50%'],
                        body: [
                          [{text:'Other Conditions:' , style:'heading'} , {text: this.contractRemarksData['otherConditionRemarks'] , style:'heading2'}],] }
                        },
                        {
                          layout:'noBorders',
                          margin: [10 , 10 , 0 , 0],
                          table:{headerRows: 1 , widths:['30%'],
                        body: [
                          [{text:'Thanks And Regards:'  , style:'heading'}],] }
                        },
                        {
                          layout:'noBorders',
                          margin: [10 , 50 , 0 , 0],
                          table:{headerRows: 1 , widths:['70%'],
                        body: [
                          [{text:'For FabCot International'  , style:'heading'}],] }
                        },
                        {
                          layout:'noBorders',
                          margin: [20 , 150 , 0 , 0],
                          table:{headerRows: 1 , widths:[ '100%'],
                        body: [
                          [ {text:'NOTE: This is a system generated Contract and does not require any signature.'  , style:'tableheader' }],] }
                        },
                      ],
                      // footer:{
                      //   margin: [20, 0],
                      //   columns: [
                      //     'NOTE: This is a system generated Contract and does not require any signature.',
                      //     { text: '', alignment: 'center' , style:'tableheader'}
                      //   ]
                      // },
                      styles:{
                        headingname:{fontSize: 9,
                          bold: true,color: '#4d4b4b', },
                       heading:{fontSize: 9,
                        bold: true,color: '#4d4b4b' },
                        headingFootrt:{fontSize: 9,
                          bold: true,color: '#4d4b4b' ,alignment:'center',fillColor: '#f3f3f4' },
                        heading2:{fontSize: 9  , color:'#4d4b4b'
                          },
                          heading5:{fontSize: 8  , color:'#4d4b4b'
                        },
                        
                          heading3:{fontSize: 6  , color:'#4d4b4b'
                        },
                        style1:{
                        margin: [70,7,0,0]
                        },
                        style2:{
                          margin: [0,0,0,0]
                          },
                          tableheader: {
                            fillColor: '#f3f3f4',
                            fontSize: 8,
                            bold: true,
                            color: '#4d4b4b',
                           alignment:'center',
                            margin:8
                          
                           },
                           
                          tableheader2: {
                            // fillColor: '#f3f3f4',
                            fontSize: 9,
                            bold: true,
                            color: '#4d4b4b',
                           alignment:'center',
                            margin:5
                          
                           },
                           heading4:{fontSize: 9,color: '#4d4b4b' },
                           tableheader3: {
                            
                            fontSize: 7,
                           
                            color: '#4d4b4b',
                           alignment:'center',
                            margin:5
                          
                           }
  
                      },
                      
            
              };
            pdfMake.createPdf(docDefinition).print();
          }
          printSupplier2(){


            this.http.get(`${environment.apiUrl}/api/Reports/ContractIndentPrint/`+ this.contractId)
            .subscribe(
              res => {
                this.response = res;
                if (this.response.success == true && this.response.data != null) {
                  this.printData = this.response.data;
              
        
                }
                else if(this.response.success == false) {
                 
                  this.toastr.error(this.response.message, 'Message.');
                }
        
              },(err: HttpErrorResponse) => {
                const messages = this.service.extractErrorMessagesFromErrorResponse(err);
                this.toastr.error(messages.toString(), 'Message.');
                console.log(messages);
              });

            let docDefinition = {
              pageSize: 'A4',
              pageMargins: [ 30, 20, 40, 20 ],
              pageOrientation: 'letter',
                
                    info: {
                      title: 'Contract Seller'
                    },
                 
                    content: [
                   
                      {
                        "image" : this.image2,
                       fit : [130 , 130]
                    
                      },
                      {
                        layout:'noBorders',
                        margin: [290 , -40 , 0 , 0],
                        table:{headerRows: 1 , widths:['100%'],
                      body: [
                        [{text:this.checkR  , style:'heading'} ],] }
                      },
                      {
                        layout:'noBorders',
                        margin: [290 , 0 , 0 , 0],
                        table:{headerRows: 1 , widths:['28%' , '90%'],
                      body: [
                        [{text:'Contract No:'  , style:'heading'} , {text: this.contractData['autoContractNumber'] , style:'heading2'}],] }
                      },
                      {
                        layout:'noBorders',
                        margin: [290 , 0 , 0 , 0],
                        table:{headerRows: 1 , widths:['28%' , '90%'],
                      body: [
                        [{text:'Contract Date:'  , style:'heading'} , {text: this.contractData['createdDateTime'] , style:'heading2'}],] }
                      },
                      {
                        layout:'noBorders',
                        margin: [290 , 0 , 0 , 0],
                        table:{headerRows: 1 , widths:['28%' , '90%'],
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
                        [{text:'Supplier Name:'  , style:'heading'} , {text: this.contractPartiesData['sellerName'] , style:'heading5'}],] }
                      },
                   
                      {
                        layout:'noBorders',
                        margin: [70 , 7 , 0 , 0],
                        table:{headerRows: 1 , widths:['20%' , '80%'],
                      body: [
                        [{text:'Buyer Name:'  , style:'heading'} , {text: this.contractPartiesData['buyerName'], style:'heading5'}],] }
                      },
                      {
                        margin: [70 , 10 , 0 , 10],
                       
                        table:{
                          headerRows:1,
                          widths: [ '30%' , '20%' , '15%' , '20%'  ],
                          body:[
                            [ {text:'Article' , style: 'tableheader2' , }, {text:'Quantity' , style: 'tableheader2'},
                            {text:'Rate' , style: 'tableheader2'},
                            {text:'Fabcot Comm' , style: 'tableheader2'} , 
                            //  {text:'Foreign Agent Comm' , style: 'tableheader2'}
      
                          ],
                    ...this.contractData['contractArticles'].map((row=>
                      [
                        // row.articleName  , row.contractArticleQuantity, row.contractArticleCommission,
                        // row.contractArticleRate 
                             {text: row.articleName + '\n' + this.contractProductData['construction'] , style: 'tableheader3'} , 
                             {text:   this.contractCostingData['quantityToleranceValue'] != '' &&  this.contractCostingData['quantityToleranceValue'] != 0 ? row.contractArticleQuantity + '\n' +  "+/-" + this.contractCostingData['quantityToleranceValue'] + '%' : row.contractArticleQuantity  , style: 'tableheader3'},
                             {text: row.contractArticleRate == null ? '' : this.contractCostingData['rateCurrencyName'] == 'USD' ?  "$ " + row.contractArticleRate : this.contractCostingData['rateCurrencyName'] == 'PKR' ? "RS " + row.contractArticleRate : this.contractCostingData['rateCurrencyName'] == 'EUR' ?  "€ " + row.contractArticleRate : this.contractCostingData['rateCurrencyName'] == 'GBP' ?  "GBP " + row.contractArticleRate : row.contractArticleRate , style: 'tableheader3'},

                             {text: row.contractArticleCommission == null ? '' : row.contractArticleCommission + "%" , style: 'tableheader3'},
                            //  {text: row.contractArticleForignAgentCommission == null ? '' : row.contractArticleForignAgentCommission + "%"  , style: 'tableheader3'}

                        ]
                      ))
                  
                          ]
                        }
                      },

                      {

                        layout:'noBorders',
                        margin: [70 , 7 , 0 , 0],
                        table:{headerRows: 1 , widths:['20%' , '80%'],
                      body: [
                        [{text:'Packing:'  , style:'heading'} , {text: this.contractPaymentData['packingName'] , style:'heading2'}],] }
                      },
                      // {

                      //   layout:'noBorders',
                      //   margin: [70 , 7 , 0 , 0],
                      //   table:{headerRows: 1 , widths:['20%' , '80%'],
                      // body: [
                      //   [{text:'Construction:'  , style:'heading'} , {text: this.contractProductData['construction'] , style:'heading2'}],] }
                      // },
                     
                      {

                        layout:'noBorders',
                       
                        table:{  headerRows: 1 , widths:['30%' , '80%'],
                      body: [ this.contractProductData['brandName'] !='' ?
                        [{text:this.contractProductData['brandName'] != ""   ?  'Brand Name:' : '' ,  margin: [70 , 5 , 0 , 0]    , style:'heading'} , {text: this.contractProductData['brandName'] != '' ? this.contractProductData['brandName'] : ''  , margin: [8 , 5 , 0 , 0] , style:'heading2'}]: ''  , ] }
                      },
                     
                      {
                        layout:'noBorders',
                        margin: [70 , 7 , 0 , 0],
                        table:{headerRows: 1 , widths:['20%' , '80%'],
                      body: [
                        [{text:'Payment Term:'  , style:'heading'} ,
                         {text: this.contractPaymentData['paymentTermDays'] == 0?this.contractPaymentData['paymentTermName'] :this.contractPaymentData['paymentTermDays'] + "  "+this.contractPaymentData['paymentTermName'] , style:'heading2'}],] }
                      },
                      {
                        layout:'noBorders',
                        margin: [70 , 7 , 0 , 0],
                        table:{headerRows: 1 , widths:['20%' , '80%'],
                      body: [
                        [{text:'Delivery Term:'  , style:'heading'} , {text: this.contractPaymentData['priceTermName'] +" " +this.contractPaymentData['destinationName'] , style:'heading2'}],] }
                      },
                      {

                        layout:'noBorders',
                        margin: [70 , 7 , 0 , 0],
                        table:{headerRows: 1 , widths:['20%' , '80%'],
                      body: [
                        [{text:'Container:'  , style:'heading'} ,
                         {text: this.contractPaymentData['count'] && this.contractPaymentData['containerName'] != null?
                          this.contractPaymentData['count'] + " x " +this.contractPaymentData['containerName'] :this.contractPaymentData['count'] + " " +this.contractPaymentData['containerName']  , style:'heading2'}],] }
                      },
                      {
                        layout:'noBorders',
                        margin: [70 , 7 , 0 , 0],
                        table:{headerRows: 1 , widths:['20%' , '80%'],
                      body: [
                          [{text:'Deliveries Date:'  , style:'heading'} , {text: this.deliveryData.map((row=>row.supplierDateDay +''+ row.quantity  +''+ row.quantityUOMName  +' ')) , style:'heading2'}],] }
                      },
                      // {
                      //   layout:'noBorders',
                      //   margin: [70 , 7 , 0 , 0],
                      //   table:{headerRows: 1 , widths:['20%' , '80%'],
                      // body: [
                      //   [{text:'Commission:'  , style:'heading'} ,{text:   "Fabcot International FZE: " + this.contractCostingData['rateCurrencyName']  + " "  + this.contractCommissionData['fabCotCommision'] + "%" , style:'heading2'}],] }
                      // },
                      // {
                      //   layout:'noBorders',
                      //   margin: [165 , 0 , 0 , 3],
                      //   table:{headerRows: 1 , widths:['100%'],
                      // body: [
                      //   [
                      //     {text: this.contractCommissionData['agentCommissions'] == '' ? " " : "Foreign Agent: " +  this.contractCommissionData['agentCommissions'].map((row=> row.agentName + " " + row.agentCommission + "%"))   , style : 'heading4'}
                      //   ],
                      // ] }
                      // },
                      {
                        layout:'noBorders',
                        margin: [70 , 7 , 0 , 0],
                        table:{headerRows: 1 , widths:['20%' , '80%'],
                      body: [
                        [{text:'Remarks:'  , style:'heading'} , {text: this.contractRemarksData['contractRemarks'] , style:'heading2'}],] }
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
                        margin: [20 , 120 , 0 , 0],
                        table:{headerRows: 1 , widths:[ '100%'],
                      body: [
                        [ {text:'NOTE: This is a system generated Contract and does not require any signature.'  , style:'tableheader' }],] }
                      },
                    ],
                    styles:{
                     heading:{fontSize: 9,
                      bold: true,color: '#4d4b4b' },
                      heading2:{fontSize: 9  , color:'#4d4b4b'
                        },
                        heading5:{fontSize: 8  , color:'#4d4b4b'
                      },
                      
                        heading3:{fontSize: 6  , color:'#4d4b4b'
                      },
                      style1:{
                      margin: [70,7,0,0]
                      },
                      style2:{
                        margin: [0,0,0,0]
                        },
                        tableheader: {
                          fillColor: '#f3f3f4',
                          fontSize: 8,
                          bold: true,
                          color: '#4d4b4b',
                         alignment:'center',
                          margin:8
                        
                         },
                         
                        tableheader2: {
                          // fillColor: '#f3f3f4',
                          fontSize: 9,
                          bold: true,
                          color: '#4d4b4b',
                         alignment:'center',
                          margin:5
                        
                         },
                         heading4:{fontSize: 9,color: '#4d4b4b' },
                         tableheader3: {
                          
                          fontSize: 7,
                         
                          color: '#4d4b4b',
                         alignment:'center',
                          margin:5
                        
                         }

                    },
                    
          
            };
            pdfMake.createPdf(docDefinition).print();
          }

}
