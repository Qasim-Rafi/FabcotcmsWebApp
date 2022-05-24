import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ServiceService } from 'src/app/shared/service.service';
import { AddArticleComponent } from 'src/app/configuration/articles/add-article/add-article.component';
import { AddBuyerComponent } from 'src/app/configuration/buyer/add-buyer/add-buyer.component';
import { AddProcessComponent } from 'src/app/configuration/home-textile/process/add-process/add-process.component';
import { AddPackingComponent } from 'src/app/configuration/product/packing/add-packing/add-packing.component';
import { AddDesignTypeComponent } from 'src/app/configuration/home-textile/design-type/add-design-type/add-design-type.component';
import { AddProcessTypeComponent } from 'src/app/configuration/home-textile/process-type/add-process-type/add-process-type.component';
import { AddPaymentComponent } from 'src/app/configuration/product/payment-term/add-payment/add-payment.component';
import { AddPriceComponent } from 'src/app/configuration/product/price-term/add-price/add-price.component';
import { EditCityComponent } from 'src/app/configuration/city/edit-city/edit-city.component';
import { EditCertificateComponent } from 'src/app/configuration/home-textile/certificate/edit-certificate/edit-certificate.component';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { Dateformater } from 'src/app/shared/dateformater';
import { Router } from '@angular/router';


import * as moment from 'moment';
import { DatePipe } from '@angular/common';
import { NgxSpinnerService } from 'ngx-spinner';
@Component({
  selector: 'app-add-enquiry',
  templateUrl: './add-enquiry.component.html',
  styleUrls: ['./add-enquiry.component.css']
})
export class AddEnquiryComponent implements OnInit {
  
    newArticle : any;
    newBuyer : any;
    newPayment: any;
    newPacking: any;
    newDesign: any;
    newProcess: any;
    newProcessType: any;
    newCertificate: any;
    newCity: any;
    newPrice: any;


  enquiryDateField:any;
  datePickerConfig: Partial<BsDatepickerConfig>;
  listCount: number;
  myDate = Date.now();
  response: any;
  data: any = {};
  country: any = [];
  buyer: any = [];
  designId: null;
  packageId: null;
  article: any = [];
  uomList: any = [];
  type: any[];
  package: any[];
  city: any={};
  certificateId: any[];
  paymentId: any[];
  term: any[];
  priceId: any[];
  myDates = new Date();
  rows: any = [];
  columns: any = [];
  // country1: any = [];
  // countryId: null; 
  processtypeId: null;
  @ViewChild(NgForm) enquiryForm;
  date: number;
  payment: any = [];
  packaging: any = [];
  design: any = [];
  process: any = {};
  ptype: any = {};
  certification: any = {};
  priceterm: any = {};
  autoEnquiryNo: number;
  dateformater: Dateformater = new Dateformater();
  today:any;
  
  
  constructor(private http: HttpClient,
    private toastr: ToastrService,
    private modalService: NgbModal,
    private service: ServiceService,
    private spinner: NgxSpinnerService,
    private router: Router,
    public datepipe: DatePipe,
 


  ) {
    // this.today = this.datePipe.transform(this.myDates, 'dd-MM-yyyy');
   }

  navigate() {
    this.router.navigateByUrl('/enquiry/active-enquiries');
  };

  ngOnInit() {
 
    let olddate=new Date();
    let latest_date =this.datepipe.transform(olddate, 'yyyy-MM-dd');
    this.enquiryDateField =this.dateformater.fromModel(latest_date);
    this. getAutoEnquiryNo();
    this.GetBuyersDropdown("start");
    this.GetArticlesDropdown("start");
    this.GetPaymentDropdown("start");
    this.GetPackingDropdown("start");
    this.GetDesignDropdown("start");
    this.GetProcessDropdown("start");
    this.GetProcessTypeDropdown("start");
    this.GetCertificationDropdown("start");
    this.GetPriceTermDropdown("start");
    this.GetCityDropdown("start");
    this.GetUOMDropdown();
  }


  getAutoEnquiryNo() {
    this.http.get(`${environment.apiUrl}/api/Enquiries/GetNextEnquiryNumber/`+false)
      .subscribe(
        res => {

          this.response = res;
          if (this.response.success == true) {
            this.autoEnquiryNo = this.response.data;
          }
          else {
            this.toastr.error('Something went Worng', 'Message.');
          }

        }, err => {
          if (err.status == 400) {
            this.toastr.error('Something went Worng', 'Message.');
          }
        });
  }

  GetArticlesDropdown(type:string) {
    this.service.getArticles().subscribe(res => {
      this.response = res;
      if (this.response.success == true) {
        
        this.article = this.response.data

        if(type == "other")
        {
         
          this.data.articleId = this.newArticle;
        }

      }
      else {
        this.toastr.error(this.response.message, 'Message.');
      }
    })
  }


  GetBuyersDropdown(type:string) {
    this.service.getBuyers().subscribe(res => {
      this.response = res;
      if (this.response.success == true) {

        this.buyer = this.response.data;


        if(type == "other")
        {
          // this.buyer.id = this.newBuyer;
          this.data.buyerId = this.newBuyer;
        }
       
      }
      else {
        this.toastr.error(this.response.message, 'Message.');
      }
    })
  }


  GetPaymentDropdown(type:string) {
    this.service.getPaymentTerm().subscribe(res => {
      this.response = res;
      if (this.response.success == true) {
        this.payment = this.response.data


        if(type == "other")
        {
          
          this.data.paymentTermId = this.newPayment;
        }



      }
      else {
        this.toastr.error(this.response.message, 'Message.');
      }
    })
  }

  GetPackingDropdown(type:string) {
    this.service.getPackaging().subscribe(res => {
      this.response = res;
      if (this.response.success == true) {

        this.packaging = this.response.data


        
        if(type == "other")
        {
          
          this.data.packagingId = this.newPacking;
        }

      }
      else {
        this.toastr.error(this.response.message, 'Message.');
      }
    })
  }

  GetDesignDropdown(type:string) {
    this.service.getDesignType().subscribe(res => {
      this.response = res;
      if (this.response.success == true) {
        
        this.design = this.response.data


        if(type == "other")
        {
          
          this.data.designTypeId = this.newDesign
        }
      }
      else {
        this.toastr.error(this.response.message, 'Message.');
      }
    })
  }

  GetProcessDropdown(type:string) {
    this.service.getProcess().subscribe(res => {
      this.response = res;
      if (this.response.success == true) {

        this.process = this.response.data

        if(type == "other")
        {
          
          this.data.processId = this.newProcess
        }
      }
      else {
        this.toastr.error(this.response.message, 'Message.');
      }
    })
  }

  GetProcessTypeDropdown(type:string) {
    this.service.getProcessType().subscribe(res => {
      this.response = res;
      if (this.response.success == true) {

        this.ptype = this.response.data


        if(type == "other")
        {
          
          this.data.processTypeId =  this.newProcessType;
        }
      }
      else {
        this.toastr.error(this.response.message, 'Message.');
      }
    })
  }

  GetCertificationDropdown(type:string) {
    this.service.getCertification().subscribe(res => {
      this.response = res;
      if (this.response.success == true) {
        this.certification = this.response.data



        if(type == "other"){
          
          this.data.certificateIds = this.newCertificate;
         
          this.data.certificateIds != null ? this.data.certificateIds.toString() : null

     }

      }
      else {
        this.toastr.error(this.response.message, 'Message.');
      }
    })
  }

  GetPriceTermDropdown(type:string) {
    this.service.getPriceTerm().subscribe(res => {
      this.response = res;
      if (this.response.success == true) {
        this.priceterm = this.response.data


        if(type == "other")
        {
          
          this.data.priceTermId =  this.newPrice;
        }
      }
      else {
        this.toastr.error(this.response.message, 'Message.');
      }
    })
  }

  GetUOMDropdown() {
    this.service.getUOM().subscribe(res => {
      this.response = res;
      if (this.response.success == true) {
        this.uomList = this.response.data;
      }
      else {
        this.toastr.error(this.response.message, 'Message.');
      }
    })
  }


  GetCityDropdown(type:string) {
    this.service.getDestination().subscribe(res => {
      this.response = res;
      if (this.response.success == true) {
        
        this.city = this.response.data

        if(type == "other"){
             
             this.data.destinationId = this.newCity;
        }
      }
      else {
        this.toastr.error(this.response.message, 'Message.');
      }
    })
  }

  addenquiryCertificateForm(check) {
    const modalRef = this.modalService.open(EditCertificateComponent, { centered: true });
    modalRef.componentInstance.statusCheck = check;
    modalRef.result.then((data) => {

      // on close
      if (data == true) {
       
        this.GetCertificationDropdown("other");
      
      }
    }, (reason) => {
      // on dismiss
    });
  }

  addenquiryCity(check, name) {
    const modalRef = this.modalService.open(EditCityComponent, { centered: true });
    modalRef.componentInstance.statusCheck = check;
    modalRef.componentInstance.FormName = name;

    //  modalRef.componentInstance.name =componentName;

    modalRef.result.then((data) => {
      // on close
      if (data.parent == true) {
        
        this.newCity = data.id
        this.GetCityDropdown("other");
        
     
 
      }
    }, (reason) => {
      // on dismiss
    });
  }

  addenquiryBuyerForm() {
    const modalRef = this.modalService.open(AddBuyerComponent, { centered: true });
    modalRef.result.then((data) => {
      // on close
      if (data.parent == true) {

        this.newBuyer = data.id
        this.GetBuyersDropdown("other");
     

      }
    }, (reason) => {
      // on dismiss
    });
  } 

  
  addenquiryArticleForm() {
    const modalRef = this.modalService.open(AddArticleComponent, { centered: true });
    modalRef.result.then((data) => {
      // on close
      if (data.parent == true) {
        
        this.newArticle = data.id
        this.GetArticlesDropdown("other");
       

      }
    }, (reason) => {
      // on dismiss
    });

  }

  addenquiryProcessForm() {
    const modalRef = this.modalService.open(AddProcessComponent, { centered: true });
    modalRef.result.then((data) => {
      // on close
      if ( data.parent == true) {
        
        this.newProcess = data.id
        this.GetProcessDropdown("other");
      
      }
      
    }, (reason) => {
      // on dismiss
    });
  }

  // packaging form

  addPackingForm() {
    const modalRef = this.modalService.open(AddPackingComponent, { centered: true });
    modalRef.result.then((data) => {
      // on close
      if ( data.parent == true) {
        
        this.newPacking = data.id
        this.GetPackingDropdown("other");
    



      }
    }, (reason) => {
      // on dismiss
    });
  }
  // design form
  addDesignTypeForm() {
    const modalRef = this.modalService.open(AddDesignTypeComponent, { centered: true });
    modalRef.result.then((data) => {
      // on close
      if (data.parent == true) {
        
        this.newDesign = data.id
        this.GetDesignDropdown("other");
      



      }
    }, (reason) => {
      // on dismiss
    });
  }

  // process type form

  addProcessTypeForm() {
    const modalRef = this.modalService.open(AddProcessTypeComponent, { centered: true });
    modalRef.result.then((data) => {
      // on close
      if (data.parent == true) {
        
        this.newProcessType = data.id

        this.GetProcessTypeDropdown("other");
       
      }
    }, (reason) => {
      // on dismiss
    });
  }

  // payment Term form 

  addPaymentForm() {
    const modalRef = this.modalService.open(AddPaymentComponent, { centered: true });
    modalRef.result.then((data) => {
      // on close
      if (data.parent == true) {
        
        this.newPayment = data.id
        
        this.GetPaymentDropdown("other");
       



      }
    }, (reason) => {
      // on dismiss
    });
  }

  addPriceForm() {
    const modalRef = this.modalService.open(AddPriceComponent, { centered: true });
    modalRef.result.then((data) => {
      // on close
      if (data.parent == true) {
        
        this.newPrice = data.id

        this.GetPriceTermDropdown("other");
    



      }
    }, (reason) => {
      // on dismiss
    });
  }

  addEnquiry(form:NgForm) {
    this.spinner.show();
    this.enquiryDateField =this.dateformater.toModel(this.enquiryDateField);
      let varr = {
  
        "enquiryDate": this.enquiryDateField,
        "buyerId": this.data.buyerId,
        "articleId": this.data.articleId,
        "processId": this.data.processId,
        "processTypeId": this.data.processTypeId,
        "designTypeId": this.data.designTypeId,
        "packagingId": this.data.packagingId,
        "paymentTermId": this.data.paymentTermId,
        "paymentTermDays": this.data.paymentTermDays  == undefined ? 0 : this.data.paymentTermDays ,
        "paymentTermInfo": this.data.paymentTermInfo,
        "priceTermId": this.data.priceTermId,
        "destinationId": this.data.destinationId,
        "sellerSideCommission": this.data.sellerSideCommission,
        "sellerSideCommissionUOMId": this.data.sellerSideCommissionUOMId,
        "sellerSideCommissionInfo": this.data.sellerSideCommissionInfo,
        "buyerSideCommission": this.data.buyerSideCommission,
        "buyerSideCommissionUOMId": this.data.buyerSideCommissionUOMId,
        "buyerSideCommissionInfo": this.data.buyerSideCommissionInfo,
        "certificateIds": this.data.certificateIds != null ? this.data.certificateIds.toString() : null,
        "remarks": this.data.remarks,
        "additionalInfo": this.data.additionalInfo,
        "departmentId": this.data.departmentId,
  
      }
  this.spinner.show();
      this.http.
        post(`${environment.apiUrl}/api/Enquiries/AddEnquiry`, varr)
        .subscribe(
          res => {
  
            this.response = res;
            if (this.response.success == true) {
              this.toastr.success(this.response.message, 'Message.');
              this.enquiryForm.reset();
               this.router.navigate(['/enquiry/edit-active-enquiries'], { queryParams: {id: this.response.data} });
              // this.router.navigate(['/enquiry/active-enquiries']);
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
    
  







}
