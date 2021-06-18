import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { StatusComponent } from 'src/app/shared/MODLES/status/status.component';
import {NgxSpinnerService} from 'ngx-spinner'
pdfMake.vfs = pdfFonts.pdfMake.vfs;
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
  rows: any = [];
  rows1: any = [];
  columns: any = [];
  queryParems: any = {};
  objEnquiry: any = {};
  // enquiryId: any = {};
  data: any = {};
  response: any;
  enquiryData: any = [];
  temp: any[];
  // temp2: any[];
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
  confirmOn: string;
  showConfirmOn: string;
  noteFilter: any = [];
  noteList: any = {};
  totalComplete: any;
  userName: any;
  // entries: any = [];



  constructor(

    private route: ActivatedRoute,
    private modalService: NgbModal,
    private http: HttpClient,
    private service: ServiceService,
    private toastr: ToastrService,
    private spinner:NgxSpinnerService,
    private router: Router,


  ) { }

  ngOnInit(): void {


    this.userName = localStorage.getItem('loggedInUserName');
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


    this.fetch((NotesData) => {
      this.rows1 = NotesData;
      this.noteFilter = [...NotesData];
      // this.listCount= this.rows.length;
    });

  }


  itemSearch(event) {
    const val = event.target.value.toLowerCase();

    const temp = this.temp.filter(function (d) {
      return (
        d.description.toLowerCase().indexOf(val) !== -1 || !val);
    });
    this.enquiryData.enquiryItemList = temp;

  }



  noteSearch(event) {
    const val = event.target.value.toLowerCase();

    const temp = this.noteFilter.filter(function (d) {
      return (
        d.description.toLowerCase().indexOf(val) !== -1 ||
        d.createdByName.toLowerCase().indexOf(val) !== -1 ||
        d.createdDateTime.toLowerCase().indexOf(val) !== -1 ||
        d.title.toLowerCase().indexOf(val) !== -1 ||
        !val);
    });
    this.rows1 = temp;

  }


  getEnquiryData(row) {
    this.http.get(`${environment.apiUrl}/api/Enquiries/GetEnquiryById/` + row)
      .subscribe(
        res => {
          this.response = res;
          if (this.response.success == true) {
            this.enquiryData = this.response.data;
            this.showConfirmOn = this.enquiryData.confirmationDateToDisplay;

            this.enquiryData.confirmationDate = this.dateformater.fromModel(this.enquiryData.confirmationDate);
            // this.enquiryData.enquiryDate = this.dateformater.fromModel(this.enquiryData.enquiryDate);

            if (this.enquiryData.confirmationDate.year == 1) {
              this.confirmOn = "";
              this.showConfirmOn = "";
            }
            else {
              this.confirmOn = this.enquiryData.confirmationDate;
            }



            if (this.enquiryData.totalQuantity == 0) {
              this.enquiryData.totalQuantity = null;
            }

            //  console.log("enquiry Data" , this.enquiryData)
            if (this.enquiryData.totalQuantity == 0) {
              this.enquiryData.totalQuantity = "";
            }
            this.temp = [...this.enquiryData.enquiryItemList];

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


  fetch(cb) {

    this.http
      .get(`${environment.apiUrl}/api/Enquiries/GetAllEnquiryNote/` + this.objEnquiry)
      .subscribe(res => {
        this.response = res;

        if (this.response.success == true) {
          this.noteList = this.response.data;
          this.noteFilter = [this.noteList];
          cb(this.noteList);
        }
        else {
          this.toastr.error(this.response.message, 'Message.');
        }
        // this.spinner.hide();
      }, err => {
        if (err.status == 400) {
          this.toastr.error(err.error.message, 'Message.');
        }
        //  this.spinner.hide();
      });
  }


  fetch2(obj) {

    this.http
      .get(`${environment.apiUrl}/api/Enquiries/GetAllVendorQuotation/` + obj.id)
      .subscribe(res => {
        this.response = res;

        if (this.response.success == true) {
          this.data = this.response.data;
          this.rows = this.data
        }
        else {
          this.toastr.error(this.response.message, 'Message.');
        }
        // this.spinner.hide();
      }, err => {
        if (err.status == 400) {
          this.toastr.error(err.error.message, 'Message.');
        }
        //  this.spinner.hide();
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
    this.service.getPackaging().subscribe(res => {
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
    this.service.getUOM().subscribe(res => {
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


  GetPaymentDropdown() {
    this.service.getPaymentTerm().subscribe(res => {
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
    this.service.getPriceTerm().subscribe(res => {
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
    this.service.getCity().subscribe(res => {
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
    this.service.getVendorSeller(this.objEnquiry).subscribe(res => {
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
    this.service.getCertification().subscribe(res => {
      this.response = res;
      if (this.response.success == true) {
        this.certificate = this.response.data;
      }
      else {
        this.toastr.error(this.response.message, 'Message.');
      }
    })
  }





  addEnquiryBuyerDetails() {
    this.spinner.show();
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
this.spinner.show();
    this.http.
      post(`${environment.apiUrl}/api/Enquiries/AddEnquiryBuyerDetail`, varr)
      .subscribe(
        res => {

          this.response = res;
          if (this.response.success == true) {
            this.toastr.success(this.response.message, 'Message.');
            this.enquiryToggle = !this.enquiryToggle
            this.getEnquiryData(this.objEnquiry);
            // this.enquiryForm.reset();
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

  addEnquiryPaymentDetails() {
    this.spinner.show();
    let varr = {

      "enquiryId": this.objEnquiry,
      "currencyId": this.enquiryData.currencyId,
      "totalQuantity": this.enquiryData.totalQuantity,
      "uomId": this.enquiryData.uomId,
      "paymentTermId": this.enquiryData.paymentTermId,
      "paymentTermDays": this.enquiryData.paymentTermDays,
      "paymentTermInfo": this.enquiryData.paymentTermInfo,
      "priceTermId": this.enquiryData.priceTermId,
      "destinationId": this.enquiryData.destinationId,
      "sellerSideCommission": this.enquiryData.sellerSideCommission,
      "sellerSideCommissionUOMId": this.enquiryData.sellerSideCommissionUOMId,
      "sellerSideCommissionInfo": this.enquiryData.sellerSideCommissionInfo,
      "buyerSideCommission": this.enquiryData.buyerSideCommission,
      "buyerSideCommissionUOMId": this.enquiryData.buyerSideCommissionUOMId,
      "buyerSideCommissionInfo": this.enquiryData.buyerSideCommissionInfo,
    }
    this.spinner.show();

    this.http.
      post(`${environment.apiUrl}/api/Enquiries/AddEnquiryPaymentDetail`, varr)
      .subscribe(
        res => {

          this.response = res;
          if (this.response.success == true) {
            // this.currencyToggle = !this.currencyToggle
            this.toastr.success(this.response.message, 'Message.');
            this.currencyToggle = !this.currencyToggle
            this.getEnquiryData(this.objEnquiry);
            // this.enquiryForm.reset();
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



  addEnquiryVendorDetails() {
    this.spinner.show();
    let varr = {

      "enquiryId": this.objEnquiry,
      "sellerId": this.enquiryData.sellerId,
      "costingDetail": this.enquiryData.costingDetail,

    }
    this.spinner.show();

    this.http.
      post(`${environment.apiUrl}/api/Enquiries/AddEnquirySupplierDetail`, varr)
      .subscribe(
        res => {

          this.response = res;
          if (this.response.success == true) {
            this.toastr.success(this.response.message, 'Message.');
            this.vendorToggle = !this.vendorToggle;
            this.getEnquiryData(this.objEnquiry);
            // this.enquiryForm.reset();
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






  addEnquiryOrderDetails() {
    this.spinner.show();
    this.confirmOn = this.dateformater.toModel(this.confirmOn);

    if (this.confirmOn == "undefined-undefined-undefined") {
      this.confirmOn = ""
    }
    if (this.confirmOn == "0-NaN-NaN") {
      this.confirmOn = ""
    }

    let varr = {
      "enquiryId": this.objEnquiry,
      "confirmationDate": this.confirmOn,
      "confirmationDetails": this.enquiryData.confirmationDetails,

    }
    this.spinner.show();

    this.http.
      post(`${environment.apiUrl}/api/Enquiries/AddEnquiryConfirmationDetail`, varr)
      .subscribe(
        res => {

          this.response = res;
          if (this.response.success == true) {
            this.toastr.success(this.response.message, 'Message.');
            this.getEnquiryData(this.objEnquiry);
            this.orderToggle = !this.orderToggle;
            // this.enquiryForm.reset();
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





  addEnquiryRemarks() {
    this.spinner.show();
    let varr = {

      "enquiryId": this.objEnquiry,
      "enquiryRemarks": this.enquiryData.enquiryRemarks,
      "enquiryOtherCondition": this.enquiryData.enquiryOtherCondition,
      "certificateIds": this.enquiryData.certificateIds != null ? this.enquiryData.certificateIds.toString() : null,

    }
    this.spinner.show();

    this.http.
      post(`${environment.apiUrl}/api/Enquiries/AddEnquiryAdditionalInfomation`, varr)
      .subscribe(
        res => {

          this.response = res;
          if (this.response.success == true) {
            this.toastr.success(this.response.message, 'Message.');
            this.getEnquiryData(this.objEnquiry);
            // this.enquiryForm.reset();
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




  addQuotationform(check, obj) {
    const modalRef = this.modalService.open(QuotationComponent, { centered: true });
    // modalRef.componentInstance.parentBuyerId = popup.id;
    modalRef.componentInstance.statusCheck = check;
    modalRef.componentInstance.enquiryId = this.objEnquiry;
    modalRef.componentInstance.EnquiryItemId = obj.id;
    modalRef.componentInstance.EnquiryItemName = obj.description;

    modalRef.result.then((data) => {
      // on close
      if (data == true) {
        this.getEnquiryData(this.objEnquiry);
        this.GetVendorSellerDropdown();
      }
    }, (reason) => {
      // on dismiss
    });
  }


  editQuotationform(check, objQuotation, objEnquiry) {
    const modalRef = this.modalService.open(QuotationComponent, { centered: true });
    modalRef.componentInstance.quotationId = objQuotation.id;
    modalRef.componentInstance.statusCheck = check;
    modalRef.componentInstance.EnquiryItemName = objEnquiry.description;

    modalRef.result.then((data) => {
      // on close
      if (data == true) {
        this.getEnquiryData(this.objEnquiry);
        this.GetVendorSellerDropdown();
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





  addNoteform(check, enquiryObj) {
    const modalRef = this.modalService.open(EnquiryNotesComponent, { centered: true });
    // modalRef.componentInstance.parentBuyerId = popup.id;
    modalRef.componentInstance.EnquiryId = enquiryObj;
    modalRef.componentInstance.statusCheck = check;
    modalRef.result.then((data) => {
      // on close
      if (data == true) {
        this.fetch((NotesData) => {
          this.rows1 = NotesData;
          this.noteFilter = [...NotesData];
          // this.listCount= this.rows.length;
        });
        this.getEnquiryData(this.objEnquiry);

      }
    }, (reason) => {
      // on dismiss
    });
  }


  editNoteform(check, noteObj, enquiryObj) {
    const modalRef = this.modalService.open(EnquiryNotesComponent, { centered: true });
    // modalRef.componentInstance.parentBuyerId = popup.id;
    modalRef.componentInstance.NoteId = noteObj.id;
    modalRef.componentInstance.EnquiryId = enquiryObj;
    modalRef.componentInstance.statusCheck = check;
    modalRef.result.then((data) => {
      // on close
      if (data == true) {
        this.fetch((NotesData) => {
          this.rows1 = NotesData;
          this.noteFilter = [...NotesData];
          // this.listCount= this.rows.length;
        });


      }
    }, (reason) => {
      // on dismiss
    });
  }

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
        this.spinner.show();

        this.http.delete(`${environment.apiUrl}/api/Enquiries/DeleteEnquiryItem/` + obj.id)
          .subscribe(
            res => {
              this.response = res;
              if (this.response.success == true) {
                this.toastr.error(this.response.message, 'Message.');
                // this.getAllEnquiryItems();
                this.getEnquiryData(this.objEnquiry);
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



  deleteQuotation(obj) {
    Swal.fire({
      title: GlobalConstants.deleteTitle, //'Are you sure?',
      text: GlobalConstants.deleteMessage + ' ' + '"' + obj.sellerName + '"',
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
        this.spinner.hide();

        this.http.delete(`${environment.apiUrl}/api/Enquiries/DeleteVendorQuotation/` + obj.id)
          .subscribe(
            res => {
              this.response = res;
              if (this.response.success == true) {
                this.toastr.error(this.response.message, 'Message.');
                // this.getAllEnquiryItems();
                this.getEnquiryData(this.objEnquiry);
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
    this.spinner.show();

        this.http.delete(`${environment.apiUrl}/api/Enquiries/DeleteEnquiryNote/` + obj.id)
          .subscribe(
            res => {
              this.response = res;
              if (this.response.success == true) {
                this.toastr.error(this.response.message, 'Message.');
                this.fetch((NotesData) => {
                  this.rows1 = NotesData;
                  this.noteFilter = [...NotesData];
                  // this.listCount= this.rows.length;
                });
                this.getEnquiryData(this.objEnquiry);
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

  printPreviewWithCustomer() {
    let docDefinition = {
      pageSize: 'A4',
      pageOrientation: 'landscape',
      pageMargins: [10, 40, 10, 0],
      info: {
        title: 'Enquiry Preview'
      },
      content: [
        {

          table: {
            headerRows: 1,
            widths: ['100%'],
            body: [
              [{
                style: 'heading',
                text: 'FABCOT ENQUIRY SHEET'
              }],
            ]

          }

        },

        {
          style: 'commonTable',
          table: {
            headerRows: 1,
            widths: ['13%', '20%', '13%', '20%', '13%', '21%'],
            body: [
              [
                { style: 'propertyName', text: 'Date' },
                { style: 'propertyValue', text: this.enquiryData['enquiryDate'] },
                { style: 'propertyName', text: 'Enquiry#' },
                { style: 'propertyValue', text: this.enquiryData['autoEnquiryNumber'] },
                { style: 'propertyName', text: 'Customer' },
                { style: 'propertyValue', text: this.enquiryData['buyerName'] },
              ]
            ]
          }
        },

        {
          style: 'commonTable',
          table: {
            headerRows: 1,
            widths: ['13%', '20%', '13%', '20%', '13%', '21%'],
            body: [
              [
                { style: 'propertyName', text: 'Article' },
                { style: 'propertyValue', text: this.enquiryData['articleName'] },
                { style: 'propertyName', text: 'Process' },
                { style: 'propertyValue', text: this.enquiryData['processName'] },
                { style: 'propertyName', text: 'Process Type' },
                { style: 'propertyValue', text: this.enquiryData['processTypeName'] },
              ]
            ]
          }
        },
        {
          style: 'commonTable',
          table: {
            headerRows: 1,
            widths: ['20%', '30%', '20%', '30%'],
            body: [
              [
                { style: 'propertyName', text: 'Design Type' },
                { style: 'propertyValue', text: this.enquiryData['designTypeName'] },
                { style: 'propertyName', text: 'Packaging' },
                { style: 'propertyValue', text: this.enquiryData['packagingName'] },
              ]
            ]
          }
        },
        {
          style: 'commonTable',
          table: {
            headerRows: 1,
            widths: ['20%', '30%', '20%', '30%'],
            body: [
              [
                { style: 'propertyName', text: 'Shipment' },
                { style: 'propertyValue', text: this.enquiryData['shipmentdates'] },
                { style: 'propertyName', text: 'Payment Terms' },
                { style: 'propertyValue', text: this.enquiryData['paymentTermName'] },
              ]
            ]
          }
        },
        {
          style: 'commonTable',
          table: {
            headerRows: 1,
            widths: ['20%', '15%', '20%', '45%'],
            body: [

              { style: 'propertyName', text: 'Shipment' },
              { style: 'propertyValue', text: this.enquiryData['paymentTermDays'] },
              { style: 'propertyName', text: 'Payment Terms' },
              { style: 'propertyValue', text: this.enquiryData['paymentTermName'] },

            ]
          }
        },

        {
          margin: [0, -10, 0, 0],
          table: {
            headerRows: 1,
            widths: ['15%', '30%', '15%', '10%', '5%', '5%', '10%', '10%'],
            body: [
              [{ text: 'Description', style: 'tableheader', }, { text: 'Composition & Construction', style: 'tableheader' },
              { text: 'Color', style: 'tableheader' }, { text: 'Quantity', style: 'tableheader' }
                , { text: 'Gsm', style: 'tableheader' }, { text: 'Size', style: 'tableheader' },
              { text: 'Loom Type', style: 'tableheader' }, { text: 'Seller', style: 'tableheader' }
              ],
              // [ 'Value 1', 'Value 2', 'Value 3', 'Value 4' , '5' , '6' , '7' , '8' ]
              ...this.enquiryData['enquiryItemList'].map((row =>
                [row.description, row.construction, row.colorName,
                row.itemQuantity, row.weight, row.size, row.loomTypeName, row.createdByName]
              ))

            ]
          }
        }

      ],
      styles: {
        heading: {
          fillColor: '#f3f3f4',
          fontSize: 20,
          bold: true,
          color: '#4d4b4b',
          alignment: 'center',
          margin: 4
        },
        commonTable: {
          margin: [0, 25, 0, 0]
        },
        propertyName: {
          alignment: 'center',
          bold: true,
          fontSize: 10,
          margin: 2
        },
        propertyValue: {
          alignment: 'center',
          fontSize: 10,
          margin: 2

        },
        tableheader: {
          fillColor: '#f3f3f4',
          fontSize: 10,
          bold: true,
          color: '#4d4b4b',
          alignment: 'center',
          margin: 8

        }
      }
    };
    pdfMake.createPdf(docDefinition).print();

  }

  printPreview() {
    let docDefinition = {
      pageSize: 'A4',
      pageOrientation: 'landscape',
      pageMargins: [ 10, 40, 10, 0 ],
      info: {
        title: 'Enquiry Preview'
      },
      content: [
             {
         
          table: {
            headerRows: 1,
            widths: ['100%'],
            body: [
            [{
              style: 'heading',
              text: 'FABCOT ENQUIRY SHEET'
            }],
              ]
           
          }

        },

        {
          style: 'commonTable',
          table: {
            headerRows: 1,
            widths: ['25%' , '25%' , '25%' , '25%' ],
            body: [
           [
              { style:'propertyName' ,text: 'Date' } , 
          {  style:'propertyValue', text : this.enquiryData['enquiryDate']},
          {  style:'propertyName',text: 'Enquiry#' } , 
          {  style:'propertyValue', text : this.enquiryData['autoEnquiryNumber']},
           ]
          ]
            }
        },

        {
          style: 'commonTable',
          table: {
            headerRows: 1,
            widths: ['13%' , '20%' , '13%' , '20%' , '13%', '21%'],
            body: [
           [
              { style:'propertyName' ,text: 'Article' } , 
          {  style:'propertyValue', text : this.enquiryData['articleName']},
          {  style:'propertyName',text: 'Process' } , 
          {  style:'propertyValue', text : this.enquiryData['processName']},
          {  style:'propertyName',text: 'Process Type' } , 
          {  style:'propertyValue', text : this.enquiryData['processTypeName']},
           ]
          ]
            }
        },
        {
          style: 'commonTable',
          table: {
            headerRows: 1,
            widths: ['20%' , '30%' , '20%' , '30%' ],
            body: [
           [
              { style:'propertyName' ,text: 'Design Type' } , 
          {  style:'propertyValue', text : this.enquiryData['designTypeName']},
          {  style:'propertyName',text: 'Packaging' } , 
          {  style:'propertyValue', text : this.enquiryData['packagingName']},
           ]
          ]
            }
        },
        {
          style: 'commonTable',
          table: {
            headerRows: 1,
            widths: ['20%' , '30%' , '20%' , '30%' ],
            body: [
           [
              { style:'propertyName' ,text: 'Shipment' } , 
          {  style:'propertyValue', text : this.enquiryData['shipmentdates']},
          {  style:'propertyName',text: 'Payment Terms' } , 
          {  style:'propertyValue', text : this.enquiryData['paymentTermName']},
           ]
          ]
            }
        },
        {
          style: 'commonTable',
          table: {
            headerRows: 1,
            widths: ['20%' , '15%' , '20%' , '45%' ],
            body: [
           
              { style:'propertyName' ,text: 'Shipment' } , 
          {  style:'propertyValue', text : this.enquiryData['paymentTermDays']},
          {  style:'propertyName',text: 'Payment Terms' } , 
          {  style:'propertyValue', text : this.enquiryData['paymentTermName']},
           
          ]
            }
        },
        
        {
          margin: [0 , -10 , 0 , 0],
          table:{
            headerRows:1,
            widths: [ '15%' , '30%' , '15%' , '10%' , '5%' , '5%' , '10%' , '10%' ],
            body:[
              [ {text:'Description' , style: 'tableheader' , }, {text:'Composition & Construction' , style: 'tableheader'},
               {text:'Color' , style: 'tableheader'}, {text:'Quantity' , style: 'tableheader'} 
              ,{text:'Gsm' , style: 'tableheader'} , {text:'Size' , style: 'tableheader'}, 
              {text:'Loom Type' , style: 'tableheader'}, {text:'Seller', style: 'tableheader'}
            ],
      // [ 'Value 1', 'Value 2', 'Value 3', 'Value 4' , '5' , '6' , '7' , '8' ]
      ...this.enquiryData['enquiryItemList'].map((row=>
        [row.description, row.construction, row.colorName,
          row.itemQuantity, row.weight , row.size , row.loomTypeName , row.createdByName]
        ))
    
            ]
          }
        }
        
      ],
      styles: {
        heading: {
          fillColor: '#f3f3f4',
          fontSize: 20,
          bold: true,
          color: '#4d4b4b',
          alignment: 'center',
          margin : 4
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
          fontSize: 10,
          margin:2

        },
        tableheader: {
          fillColor: '#f3f3f4',
          fontSize: 10,
          bold: true,
          color: '#4d4b4b',
          alignment: 'center',
          margin:8
        
         }
      }
    };
    pdfMake.createPdf(docDefinition).print();

  }



  AddReminder() {
    // Swal.fire({
    //   title: 'Reminder', //'Are you sure?',
    //   text: 'Your Reminder has been set for the Enquiry no. '+ this.enquiryData.autoEnquiryNumber ,
    //   icon: 'success',
    //   showCancelButton: false,
    //   confirmButtonColor: '#1ab394  ',
    //   cancelButtonColor: '#dae0e5',
    //   cancelButtonText: 'No',
    //   confirmButtonText: 'OK',
    //   reverseButtons: true,
    //   position: 'top',
    // }).then((result) => {
    //   if (result.isConfirmed) {
        this.enquiryData.followUpDate = this.dateformater.toModel(this.enquiryData.followUpDate);

        let varr = {

          "enquiryId": this.objEnquiry,
          "followUpDate":this.enquiryData.followUpDate,
        
        }
this.spinner.show();
    
        this.http.
          post(`${environment.apiUrl}/api/Enquiries/AddEnquiryFollowUp`, varr)
          .subscribe(
            res => {
    
              this.response = res;
              if (this.response.success == true) {
                this.toastr.success(this.response.message, 'Message.');
                this.getEnquiryData(this.objEnquiry);
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
    // }
    // )

  // }


  

  deleteReminder(objReminder) {
    Swal.fire({
      title: GlobalConstants.deleteTitle, //'Are you sure?',
      text: GlobalConstants.deleteMessage + 'reminder of' + '"' + objReminder.followUpDate + '"',
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
          delete(`${environment.apiUrl}/api/Enquiries/DeleteEnquiryFollowUp/`+ objReminder.id )
          .subscribe(
            res => {
    
              this.response = res;
              if (this.response.success == true) {
                this.toastr.error(this.response.message, 'Message.');
                this.getEnquiryData(this.objEnquiry);
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


  GenerateContract() {
    let departmentId=localStorage.getItem('loggedInDepartmentId')
    let varr = {
      // "enquiryId": this.objEnquiry,

    }
this.spinner.show();

    this.http.
      post(`${environment.apiUrl}/api/Contracts/AddContract?`+'enquiryId='+this.objEnquiry+'&'+'departmentId ='+departmentId, varr)
      .subscribe(
        res => {

          this.response = res;
          if (this.response.success == true) {
            this.toastr.success(this.response.message, 'Message.');
            // this.router.navigate(['/contract/active-contract']);
           this.router.navigate(['/contract/active-contract-details'], { queryParams: {id: this.response.data} });
            
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





  statusform(status,action,component) {
    const modalRef = this.modalService.open(StatusComponent, { centered: true });
    // modalRef.componentInstance.parentBuyerId = popup.id;
    modalRef.componentInstance.EnquiryId = this.objEnquiry;
    modalRef.componentInstance.statusCheck = status;
    modalRef.componentInstance.action = action;
    modalRef.componentInstance.component = component;
    modalRef.result.then((data) => {
      // on close
      if (data == true) {
        this.getEnquiryData(this.objEnquiry);

      }
    }, (reason) => {
      // on dismiss
    });
  }





  statusOpen()
  { 
    let varr = {
    
      "reason":"Open",
      "enquiryId": this.objEnquiry,
      "status": "Open"
    }
this.spinner.show();
    
    this.http.
    put(`${environment.apiUrl}/api/Enquiries/UpdateEnquiryStatus`, varr)
    .subscribe(
      res=> { 
  
        this.response = res;
        if (this.response.success == true){
          this.toastr.success(this.response.message, 'Message.');
        this.getEnquiryData(this.objEnquiry);
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


}

