import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { GlobalConstants } from 'src/app/Common/global-constants';
import { EnquiryItemsComponent } from 'src/app/shared/MODLES/enquiry-items/enquiry-items.component';
import { EnquiryNotesComponent } from 'src/app/shared/MODLES/enquiry-notes/enquiry-notes.component';
import { QuotationComponent } from 'src/app/shared/MODLES/quotation/quotation.component';
import { ServiceService } from 'src/app/shared/service.service';
import { environment } from 'src/environments/environment';
import { Dateformater } from 'src/app/shared/dateformater';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-edit-active-enquiry',
  templateUrl: './edit-active-enquiry.component.html',
  styleUrls: ['./edit-active-enquiry.component.css']
})
export class EditActiveEnquiryComponent implements OnInit {
  dateformater: Dateformater = new Dateformater();
  enquiryToggle: boolean = false;
  currencyToggle: boolean = false;
  vendorToggle: boolean = false;
  orderToggle: boolean = false;
  remarksToggle: boolean = false;
  reminderToggle: boolean = false;
  queryParems: any = {};
  objEnquiry: any = {};
  // enquiryId: any = {};
  data: any = {};
  response: any;
  enquiryData: any = [];
  temp: any[];
  article: any = [];
  buyer: any = [];
  process: any = [];
  ptype: any = [];
  design: any = [];
  packing: any = [];
  uom: any = [];
  currency: any = [];
  payment: any = [];
  price: any = [];
  city: any = [];
  buyerDetails: any = [];
  vendorSeller: any = [];
  certificate: any = [];




  constructor(

    private route: ActivatedRoute,
    private modalService: NgbModal,
    private http: HttpClient,
    private service: ServiceService,
    private toastr: ToastrService,

  ) { }

  ngOnInit(): void {

      this.queryParems = this.route.snapshot.queryParams;
      this.objEnquiry = this.queryParems.id;
      // this.enquiryId = this.objEnquiry;
      this.GetArticlesDropdown();
      this.GetBuyersDropdown();
      this.GetProcessDropdown();
      this.GetProcessTypeDropdown();
      this.GetDesignDropdown();
      this.GetPackingDropdown();
      this.GetUOMDropdown();
      this.GetCurrencyDropdown();
      this.GetPaymentDropdown();
      this.GetPriceDropdown();
      this.GetCityDropdown();
      this.GetCertificateDropdown();
      this.GetVendorSellerDropdown();
      this.getEnquiryData(this.objEnquiry);
      // this.editEnquiryBuyerDetails(this.objEnquiry);
      // this.editEnquiryPaymentDetails(this.objEnquiry);
      // this.editEnquirySupplierDetails(this.objEnquiry);
      // this.editEnquiryConfirmationDetails(this.objEnquiry);
      // this.editEnquiryAdditionalInformation(this.objEnquiry);
      

    // this.getAllEnquiryItems();
  }



  getEnquiryData(row) {
    this.http.get(`${environment.apiUrl}/api/Enquiries/GetEnquiryById/` + row)
      .subscribe(
        res => {
          this.response = res;
          if (this.response.success == true) {
            this.enquiryData = this.response.data;
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



  GetBuyersDropdown() {
    this.service.getBuyers().subscribe(res => {
      this.response = res;
      if (this.response.success == true) {
        this.buyer = this.response.data;
      }
      else {
        this.toastr.error(this.response.message, 'Message.');
      }
    })
  }




  GetArticlesDropdown() {
    this.service.getArticles().subscribe(res => {
      this.response = res;
      if (this.response.success == true) {
        this.article = this.response.data;
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
        this.process = this.response.data;
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
        this.ptype = this.response.data;
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
        this.design = this.response.data;
      }
      else {
        this.toastr.error(this.response.message, 'Message.');
      }
    })
  }

  GetPackingDropdown() {
    this.service. getPackaging().subscribe(res => {
      this.response = res;
      if (this.response.success == true) {
        this.packing = this.response.data;
      }
      else {
        this.toastr.error(this.response.message, 'Message.');
      }
    })
  }

  GetUOMDropdown() {
    this.service. getUOM().subscribe(res => {
      this.response = res;
      if (this.response.success == true) {
        this.uom = this.response.data;
      }
      else {
        this.toastr.error(this.response.message, 'Message.');
      }
    })
  }

  GetCurrencyDropdown() {
    this.service. getCurrency().subscribe(res => {
      this.response = res;
      if (this.response.success == true) {
        this.currency = this.response.data;
      }
      else {
        this.toastr.error(this.response.message, 'Message.');
      }
    })
  }


  GetPaymentDropdown() {
    this.service. getPaymentTerm().subscribe(res => {
      this.response = res;
      if (this.response.success == true) {
        this.payment = this.response.data;
      }
      else {
        this.toastr.error(this.response.message, 'Message.');
      }
    })
  }

  GetPriceDropdown() {
    this.service. getPriceTerm().subscribe(res => {
      this.response = res;
      if (this.response.success == true) {
        this.price = this.response.data;
      }
      else {
        this.toastr.error(this.response.message, 'Message.');
      }
    })
  }

  GetCityDropdown() {
    this.service. getCity().subscribe(res => {
      this.response = res;
      if (this.response.success == true) {
        this.city = this.response.data;
      }
      else {
        this.toastr.error(this.response.message, 'Message.');
      }
    })
  }

  GetVendorSellerDropdown() {
    this.service. getVendorSeller(this.objEnquiry).subscribe(res => {
      this.response = res;
      if (this.response.success == true) {
        this.vendorSeller = this.response.data;
      }
      else {
        this.toastr.error(this.response.message, 'Message.');
      }
    })
  }

  GetCertificateDropdown() {
    this.service. getCertification().subscribe(res => {
      this.response = res;
      if (this.response.success == true) {
        this.certificate = this.response.data;
      }
      else {
        this.toastr.error(this.response.message, 'Message.');
      }
    })
  }



  // editEnquiryBuyerDetails(enquiryId) {
  //   this.http.get(`${environment.apiUrl}/api/Enquiries/GetEnquiryBuyerDetailById/` + enquiryId)
  //     .subscribe(
  //       res => {
  //         this.response = res;
  //         if (this.response.success == true) {
  //           this.buyerDetails = this.response.data;

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


  // editEnquiryPaymentDetails(enquiryId) {
  //   this.http.get(`${environment.apiUrl}/api/Enquiries/GetEnquiryPaymentDetailById/` + enquiryId)
  //     .subscribe(
  //       res => {
  //         this.response = res;
  //         if (this.response.success == true) {
  //           this.data = this.response.data;

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


  // editEnquirySupplierDetails(enquiryId) {
  //   this.http.get(`${environment.apiUrl}/api/Enquiries/EnquirySupplierDetailGetById/` + enquiryId)
  //     .subscribe(
  //       res => {
  //         this.response = res;
  //         if (this.response.success == true) {
  //           this.data = this.response.data;

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


  // editEnquiryConfirmationDetails(enquiryId) {
  //   this.http.get(`${environment.apiUrl}/api/Enquiries/EnquiryConfirmationDetailGetById/` + enquiryId)
  //     .subscribe(
  //       res => {
  //         this.response = res;
  //         if (this.response.success == true) {
  //           this.data = this.response.data;

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


  // editEnquiryAdditionalInformation(enquiryId) {
  //   this.http.get(`${environment.apiUrl}/api/Enquiries/GetEnquiryAdditionalInfomationById/` + enquiryId)
  //     .subscribe(
  //       res => {
  //         this.response = res;
  //         if (this.response.success == true) {
  //           this.data = this.response.data;

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








  addEnquiryBuyerDetails() {
    // this.data.enquiryDate = this.dateformater.toModel(this.data.enquiryDate);
    let varr = {

      "enquiryId": this.objEnquiry,
      "buyerId": this.enquiryData.buyerId,
      "articleId": this.enquiryData.articleId,
      "processId": this.enquiryData.processId,
      "processTypeId": this.enquiryData.processTypeId,
      "designTypeId": this.enquiryData.designTypeId,
      "packagingId": this.enquiryData.packagingId,
      "shipmentdates": this.enquiryData.shipmentdates
    }

    this.http.
      post(`${environment.apiUrl}/api/Enquiries/AddEnquiryBuyerDetail`, varr)
      .subscribe(
        res => {

          this.response = res;
          if (this.response.success == true) {
            this.toastr.success(this.response.message, 'Message.');
            this.getEnquiryData(this.objEnquiry);
            // this.enquiryForm.reset();
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

  addEnquiryPaymentDetails() {
    let varr = {

      "enquiryId": this.objEnquiry,
      "currencyRateId": this.enquiryData.currencyRateId,
      "totalQuantity":this.enquiryData.totalQuantity,
      "uomId": this.enquiryData.uomId,
      "paymentTermId": this.enquiryData.paymentTermId,
      "paymentTermDays": this.enquiryData.paymentTermDays,
      "paymentTermInfo": this.enquiryData.paymentTermInfo,
      "priceTermId": this.enquiryData.priceTermId,
      "destinationId":this.enquiryData.destinationId,
      "sellerSideCommission":this.enquiryData.sellerSideCommission,
      "sellerSideCommissionUOMId": this.enquiryData.sellerSideCommissionUOMId,
      "sellerSideCommissionInfo": this.enquiryData.sellerSideCommissionInfo,
      "buyerSideCommission": this.enquiryData.buyerSideCommission,
      "buyerSideCommissionUOMId": this.enquiryData.buyerSideCommissionUOMId,
      "buyerSideCommissionInfo": this.enquiryData.buyerSideCommissionInfo,
    }

    this.http.
      post(`${environment.apiUrl}/api/Enquiries/AddEnquiryPaymentDetail`, varr)
      .subscribe(
        res => {

          this.response = res;
          if (this.response.success == true) {
            this.toastr.success(this.response.message, 'Message.');
            this.getEnquiryData(this.objEnquiry);
            // this.enquiryForm.reset();
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



  addEnquiryVendorDetails() {
    let varr = {

      "enquiryId": this.objEnquiry,
      "sellerId": this.enquiryData.sellerId,
      "costingDetail":this.enquiryData.costingDetail,
    
    }

    this.http.
      post(`${environment.apiUrl}/api/Enquiries/AddEnquirySupplierDetail`, varr)
      .subscribe(
        res => {

          this.response = res;
          if (this.response.success == true) {
            this.toastr.success(this.response.message, 'Message.');
            this.getEnquiryData(this.objEnquiry);
            // this.enquiryForm.reset();
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






  addEnquiryOrderDetails() {

    this.enquiryData.confirmationDate = this.dateformater.toModel(this.enquiryData.confirmationDate);
    let varr = {
      "enquiryId": this.objEnquiry,
      "confirmationDate": this.enquiryData.confirmationDate,
      "confirmationDetails": this.enquiryData.confirmationDetails,
    
    }

    this.http.
      post(`${environment.apiUrl}/api/Enquiries/AddEnquiryConfirmationDetail`, varr)
      .subscribe(
        res => {

          this.response = res;
          if (this.response.success == true) {
            this.toastr.success(this.response.message, 'Message.');
            this.getEnquiryData(this.objEnquiry);
            // this.enquiryForm.reset();
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





  addEnquiryRemarks() {
    let varr = {

      "enquiryId": this.objEnquiry,
      "enquiryRemarks":this.enquiryData.enquiryRemarks,
      "enquiryOtherCondition": this.enquiryData.enquiryOtherCondition,
      "certificateId": this.enquiryData.certificateId,
    
    }

    this.http.
      post(`${environment.apiUrl}​/api​/Enquiries​/AddEnquiryAdditionalInfomation`, varr)
      .subscribe(
        res => {

          this.response = res;
          if (this.response.success == true) {
            this.toastr.success(this.response.message, 'Message.');
            this.getEnquiryData(this.objEnquiry);
            // this.enquiryForm.reset();
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




  addQuotationform(check) {
    const modalRef = this.modalService.open(QuotationComponent, { centered: true });
    // modalRef.componentInstance.parentBuyerId = popup.id;
    modalRef.componentInstance.statusCheck = check;
    modalRef.componentInstance.enquiryId = this.objEnquiry;

    modalRef.result.then((data) => {
      // on close
      if (data == true) {
        this.getEnquiryData(this.objEnquiry);

      }
    }, (reason) => {
      // on dismiss
    });
  }


  editQuotationform(check, obj) {
    const modalRef = this.modalService.open(QuotationComponent, { centered: true });
    modalRef.componentInstance.quotationId = obj.id;
    modalRef.componentInstance.statusCheck = check;

    modalRef.result.then((data) => {
      // on close
      if (data == true) {
        this.getEnquiryData(this.objEnquiry);

      }
    }, (reason) => {
      // on dismiss
    });
  }



  addEnquiryItemform(check, enquiryObj) {
    const modalRef = this.modalService.open(EnquiryItemsComponent, { centered: true });
    modalRef.componentInstance.EnquiryId = enquiryObj;
    modalRef.componentInstance.statusCheck = check;
    modalRef.result.then((data) => {
      // on close
      if (data == true) {
        // this.getAllEnquiryItems();
        this.getEnquiryData(this.objEnquiry);


      }
    }, (reason) => {
      // on dismiss
    });
  }


  EditEnquiryItemform(check, enquiryObj) {
    const modalRef = this.modalService.open(EnquiryItemsComponent, { centered: true });
    modalRef.componentInstance.EnquiryItemId = enquiryObj.id;
    modalRef.componentInstance.statusCheck = check;
    modalRef.result.then((data) => {
      // on close
      if (data == true) {
        // this.getAllEnquiryItems();
        this.getEnquiryData(this.objEnquiry);


      }
    }, (reason) => {
      // on dismiss
    });
  }




  
  addNoteform(check,enquiryObj ) {
    const modalRef = this.modalService.open(EnquiryNotesComponent, { centered: true });
    // modalRef.componentInstance.parentBuyerId = popup.id;
    modalRef.componentInstance.EnquiryId = enquiryObj;
    modalRef.componentInstance.statusCheck = check;
    modalRef.result.then((data) => {
      // on close
      if (data == true) {
        this.getEnquiryData(this.objEnquiry);

      }
    }, (reason) => {
      // on dismiss
    });
  }


  editNoteform(check, noteObj ,enquiryObj ) {
    const modalRef = this.modalService.open(EnquiryNotesComponent, { centered: true });
    // modalRef.componentInstance.parentBuyerId = popup.id;
    modalRef.componentInstance.NoteId = noteObj.id;
    modalRef.componentInstance.EnquiryId = enquiryObj;
    modalRef.componentInstance.statusCheck = check;
    modalRef.result.then((data) => {
      // on close
      if (data == true) {
        this.getEnquiryData(this.objEnquiry);

      }
    }, (reason) => {
      // on dismiss
    });
  }


  // getAllEnquiryItems() {
  //   this.http.get(`${environment.apiUrl}/api/Enquiries/GetAllEnquiryItem`)
  //     .subscribe(
  //       res => {

  //         this.response = res;
  //         if (this.response.success == true) {
  //           this.enquiryItem = this.response.data;
  //           this.temp = [...this.enquiryItem];
  //           // this.listCount = this.response.data.length;
  //           // this.getTotalPOCs();
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


  deleteEnquiryItem(obj) {
    Swal.fire({
      title: GlobalConstants.deleteTitle, //'Are you sure?',
      text: GlobalConstants.deleteMessage + ' ' + '"' + obj.description + '"',
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

        this.http.delete(`${environment.apiUrl}/api/Enquiries/DeleteEnquiryItem/` + obj.id)
          .subscribe(
            res => {
              this.response = res;
              if (this.response.success == true) {
                this.toastr.error(this.response.message, 'Message.');
                // this.getAllEnquiryItems();
                this.getEnquiryData(this.objEnquiry);

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



  deleteQuotation(obj) {
    Swal.fire({
      title: GlobalConstants.deleteTitle, //'Are you sure?',
      text: GlobalConstants.deleteMessage + ' ' + '"' + obj.remarks + '"',
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

        this.http.delete(`${environment.apiUrl}/api/Enquiries/DeleteVendorQuotation/` + obj.id)
          .subscribe(
            res => {
              this.response = res;
              if (this.response.success == true) {
                this.toastr.error(this.response.message, 'Message.');
                // this.getAllEnquiryItems();
                this.getEnquiryData(this.objEnquiry);

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


  deleteNote(obj) {
    Swal.fire({
      title: GlobalConstants.deleteTitle, //'Are you sure?',
      text: GlobalConstants.deleteMessage + ' ' + '"' + obj.description + '"',
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
        this.http.delete(`${environment.apiUrl}/api/Enquiries/DeleteEnquiryNote/` + obj.id)
          .subscribe(
            res => {
              this.response = res;
              if (this.response.success == true) {
                this.toastr.error(this.response.message, 'Message.');
                this.getEnquiryData(this.objEnquiry);

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
    }