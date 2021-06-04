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
    private router: Router,
    public datepipe: DatePipe
 

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
    this.http.get(`${environment.apiUrl}/api/Enquiries/GetNextEnquiryNumber`)
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
        
        this.article = this.response.data.list;
        this.newArticle = this.response.data.lastId

        if(type == "other")
        {
          this.article.id = this.newArticle;
          this.data.articleId = this.article.id
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

        this.buyer = this.response.data.list;
        this.newBuyer = this.response.data.lastId



        if(type == "other")
        {
          this.buyer.id = this.newBuyer;
          this.data.buyerId = this.buyer.id
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
        this.payment = this.response.data.list;
        this.newPayment = this.response.data.lastId;


        if(type == "other")
        {
          this.payment.id = this.newPayment;
          this.data.paymentTermId = this.payment.id
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
        this.packaging = this.response.data.list;
        this.newPacking = this.response.data.lastId


        
        if(type == "other")
        {
          this.packaging.id = this.newPacking;
          this.data.packagingId = this.packaging.id
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
        this.design = this.response.data.list;
        this.newDesign = this.response.data.lastId


        if(type == "other")
        {
          this.design.id = this.newDesign;
          this.data.designTypeId = this.design.id
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
        this.process = this.response.data.list;
        this.newProcess = this.response.data.lastId

        if(type == "other")
        {
          this.process.id = this.newProcess;
          this.data.processId = this.process.id
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
        this.ptype = this.response.data.list;
        this.newProcessType = this.response.data.lastId


        if(type == "other")
        {
          this.ptype.id = this.newProcessType;
          this.data.processTypeId = this.ptype.id
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
        this.certification = this.response.data.list;
        this.newCertificate = this.response.data.lastId



        if(type == "other"){
          this.certification.id = this.newCertificate;
          this.data.certificateIds = this.certification.id
          // this.data.certificateIds.toString();
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
        this.priceterm = this.response.data.list;
        this.newPrice = this.response.data.lastId


        if(type == "other")
        {
          this.priceterm.id = this.newPrice;
          this.data.priceTermId = this.priceterm.id
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
    this.service.getCity().subscribe(res => {
      this.response = res;
      if (this.response.success == true) {
        this.city = this.response.data.list;
        this.newCity = this.response.data.lastId


        if(type == "other"){
             this.city.id = this.newCity;
             this.data.destinationId = this.city.id
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
        //  this.date = this.myDate;
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
      if (data.status == true && data.parent == true) {
        //  this.date = this.cityDate;
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
      if (data.status == true && data.parent == true) {

    
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
      if (data.status == true && data.parent == true) {
     
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
      if (data.status == true && data.parent == true) {
        //  this.date = this.myDate;
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
      if (data.status == true && data.parent == true) {
        //  this.date = this.myDate;
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
      if (data.status == true && data.parent == true) {
        //  this.date = this.myDate;
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
      if (data.status == true && data.parent == true) {
        //  this.date = this.myDate;
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
      if (data.status == true && data.parent == true) {
        //  this.date = this.myDate;
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
      if (data.status == true && data.parent == true) {
        //  this.date = this.myDate;
        this.GetPriceTermDropdown("other");
    



      }
    }, (reason) => {
      // on dismiss
    });
  }

  addEnquiry(form:NgForm) {

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
        "sellerSideCommission": this.data.sellerSideCommission.toString(),
        "sellerSideCommissionUOMId": this.data.sellerSideCommissionUOMId,
        "sellerSideCommissionInfo": this.data.sellerSideCommissionInfo,
        "buyerSideCommission": this.data.buyerSideCommission.toString(),
        "buyerSideCommissionUOMId": this.data.buyerSideCommissionUOMId,
        "buyerSideCommissionInfo": this.data.buyerSideCommissionInfo,
        "certificateIds": this.data.certificateIds != null ? this.data.certificateIds.toString() : null,
        "remarks": this.data.remarks,
        "additionalInfo": this.data.additionalInfo,
        "departmentId": this.data.departmentId,
  
      }
  
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
