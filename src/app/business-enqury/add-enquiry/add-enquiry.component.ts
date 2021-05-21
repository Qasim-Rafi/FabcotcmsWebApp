import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { HttpClient } from '@angular/common/http';
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
    // const format2 = "dd-MM-yyyy"
    // var date2 = new Date();
    // this.today = moment(date2).format(format2);
    // this.datePickerConfig = Object.assign
    //   ({}, {
    //     containerClass: 'theme-default ',
    //     isAnimated: true,
    //     showWeekNumbers: false,
    //     dateInputFormat: 'DD/MM/YYYY',
    //   }),
    let olddate=new Date();
    let latest_date =this.datepipe.transform(olddate, 'yyyy-MM-dd');
    this.enquiryDateField =this.dateformater.fromModel(latest_date);
    this. getAutoEnquiryNo();
    this.GetBuyersDropdown();
    this.GetArticlesDropdown();
    this.GetPaymentDropdown();
    this.GetPackingDropdown();
    this.GetDesignDropdown();
    this.GetProcessDropdown();
    this.GetProcessTypeDropdown();
    this.GetCertificationDropdown();
    this.GetPriceTermDropdown();
    this.GetCityDropdown();
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

  GetArticlesDropdown() {
    this.service.getArticles().subscribe(res => {
      this.response = res;
      if (this.response.success == true) {
        
        this.article = this.response.data.list;
        this.newArticle = this.response.data.lastId
      }
      else {
        this.toastr.error(this.response.message, 'Message.');
      }
    })
  }


  GetBuyersDropdown() {
    this.service.getBuyers().subscribe(res => {
      this.response = res;
      if (this.response.success == true) {
        this.buyer = this.response.data.list;
        this.newBuyer = this.response.data.lastId
       
      }
      else {
        this.toastr.error(this.response.message, 'Message.');
      }
    })
  }


  GetPaymentDropdown() {
    this.service.getPaymentTerm().subscribe(res => {
      this.response = res;
      if (this.response.success == true) {
        this.payment = this.response.data.list;
        this.newPayment = this.response.data.lastId;
      }
      else {
        this.toastr.error(this.response.message, 'Message.');
      }
    })
  }

  GetPackingDropdown() {
    this.service.getPackaging().subscribe(res => {
      this.response = res;
      if (this.response.success == true) {
        this.packaging = this.response.data.list;
        this.newPacking = this.response.data.lastId
      }
      else {
        this.toastr.error(this.response.message, 'Message.');
      }
    })
  }

  GetDesignDropdown() {
    this.service.getDesignType().subscribe(res => {
      this.response = res;
      if (this.response.success == true) {
        this.design = this.response.data.list;
        this.newDesign = this.response.data.lastId
      }
      else {
        this.toastr.error(this.response.message, 'Message.');
      }
    })
  }

  GetProcessDropdown() {
    this.service.getProcess().subscribe(res => {
      this.response = res;
      if (this.response.success == true) {
        this.process = this.response.data.list;
        this.newProcess = this.response.data.lastId
      }
      else {
        this.toastr.error(this.response.message, 'Message.');
      }
    })
  }

  GetProcessTypeDropdown() {
    this.service.getProcessType().subscribe(res => {
      this.response = res;
      if (this.response.success == true) {
        this.ptype = this.response.data.list;
        this.newProcessType = this.response.data.lastId
      }
      else {
        this.toastr.error(this.response.message, 'Message.');
      }
    })
  }

  GetCertificationDropdown() {
    this.service.getCertification().subscribe(res => {
      this.response = res;
      if (this.response.success == true) {
        this.certification = this.response.data.list;
        this.newCertificate = this.response.data.lastId
      }
      else {
        this.toastr.error(this.response.message, 'Message.');
      }
    })
  }

  GetPriceTermDropdown() {
    this.service.getPriceTerm().subscribe(res => {
      this.response = res;
      if (this.response.success == true) {
        this.priceterm = this.response.data.list;
        this.newPrice = this.response.data.lastId
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


  GetCityDropdown() {
    this.service.getCity().subscribe(res => {
      this.response = res;
      if (this.response.success == true) {
        this.city = this.response.data.list;
        this.newCity = this.response.data.lastId
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
        this.GetCertificationDropdown();
        this.certification.id = this.newCertificate;
        this.data.certificateIds = this.certification.id+1



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
      if (data == true) {
        //  this.date = this.cityDate;
        this.GetCityDropdown();
        this.city.id = this.newCity;
        this.data.destinationId = this.city.id+1
     

      }
    }, (reason) => {
      // on dismiss
    });
  }

  addenquiryBuyerForm() {
    const modalRef = this.modalService.open(AddBuyerComponent, { centered: true });
    modalRef.result.then((data) => {
      // on close
      if (data == true) {
        this.date = this.myDate;
        // this.getenquiryBuyers();
        this.service.getBuyers();
        this.buyer.id = this.newBuyer;
        this.data.buyerId = this.buyer.id+1

      }
    }, (reason) => {
      // on dismiss
    });
  }

  addenquiryArticleForm() {
    const modalRef = this.modalService.open(AddArticleComponent, { centered: true });
    modalRef.result.then((data) => {
      // on close
      if (data == true) {
        //  this.date = this.myDate;
      
        this.GetArticlesDropdown();
        this.article.id = this.newArticle;
        this.data.articleId = this.article.id+1

      }
    }, (reason) => {
      // on dismiss
    });

  }
  addenquiryProcessForm() {
    const modalRef = this.modalService.open(AddProcessComponent, { centered: true });
    modalRef.result.then((data) => {
      // on close
      if (data == true) {
        //  this.date = this.myDate;
        this.GetProcessDropdown();
        this.process.id = this.newProcess;
        this.data.processId = this.process.id+1
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
      if (data == true) {
        //  this.date = this.myDate;
        this.GetPackingDropdown();
        this.packaging.id = this.newPacking;
        this.data.packagingId = this.packaging.id+1



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
      if (data == true) {
        //  this.date = this.myDate;
        this.GetDesignDropdown();
        this.design.id = this.newDesign;
        this.data.designTypeId = this.design.id+1



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
      if (data == true) {
        //  this.date = this.myDate;
        this.GetProcessTypeDropdown();
        this.ptype.id = this.newProcessType;
        this.data.processTypeId = this.ptype.id+1



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
      if (data == true) {
        //  this.date = this.myDate;
        this.GetPaymentDropdown();
        this.payment.id = this.newPayment;
        this.data.paymentTermId = this.payment.id+1



      }
    }, (reason) => {
      // on dismiss
    });
  }

  addPriceForm() {
    const modalRef = this.modalService.open(AddPriceComponent, { centered: true });
    modalRef.result.then((data) => {
      // on close
      if (data == true) {
        //  this.date = this.myDate;
        this.GetPriceTermDropdown();
        this.priceterm.id = this.newPrice;
        this.data.priceTermId = this.priceterm.id+1



      }
    }, (reason) => {
      // on dismiss
    });
  }

  addEnquiry(form:NgForm) {
    if(form.status =="INVALID"){

      this.toastr.error("Invalid Form", 'Message.');
    }
    else{
      this.data.enquiryDate = this.dateformater.toModel(this.enquiryDateField);
  
      let varr = {
  
        "enquiryDate": this.data.enquiryDate,
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
  
          }, err => {
            if (err.status == 400) {
              this.toastr.error(this.response.message, 'Message.');
            }
          });
    }
    
  }







}
