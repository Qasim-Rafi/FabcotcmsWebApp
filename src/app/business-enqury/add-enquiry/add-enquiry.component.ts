import { Component, OnInit, ViewChild } from '@angular/core';
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

@Component({
  selector: 'app-add-enquiry',
  templateUrl: './add-enquiry.component.html',
  styleUrls: ['./add-enquiry.component.css']
})
export class AddEnquiryComponent implements OnInit {
  listCount: number;
  myDate = Date.now();
  response: any; data: any = {}; country: any = []; buyer: any[]; designId: null; packageId: null; article: any = []; articleId: null;
  type: any[]; package: any[]; buyerId: null; city: any[]; certificateId: any[]; paymentId: any[]; term: any[]; priceId: any[];
  processId: null; cityId: any[]; rows: any = []; temp: any = []; columns: any = []; countryId: null; processtypeId: null;
  @ViewChild(NgForm) buyerForm;
  date: number;
  payment: any = []; packaging: any = []; design: any = []; process: any = {}; ptype: any = {}; certification: any = {}; priceterm: any = {};
  country1: any = [];
  CityCount: number;

  constructor(private http: HttpClient,
    private toastr: ToastrService,
    private modalService: NgbModal,
    private service: ServiceService
  ) { }
  ngOnInit() {

    {
      this.service.getCountry().subscribe(res => {
        this.response = res;
        if (this.response.success == true) {
          this.country1 = this.response.data;
        }
        else {
          this.toastr.error('Something went Worng', 'Message.');
        }
      })
    }
    {
      this.service.getBuyers().subscribe(res => {
        this.response = res;
        if (this.response.success == true) {
          this.data = this.response.data;
        }
        else {
          this.toastr.error('Something went Worng', 'Message.');
        }
      })
    }
    {
      this.service.getArticles().subscribe(res => {
        this.response = res;
        if (this.response.success == true) {
          this.article = this.response.data;
        }
        else {
          this.toastr.error('Something went Worng', 'Message.');
        }
      })
    }
    {
      this.service.getPaymentTerm().subscribe(res => {
        this.response = res;
        if (this.response.success == true) {
          this.payment = this.response.data;
        }
        else {
          this.toastr.error('Something went Worng', 'Message.');
        }
      })
    }
    {
      this.service.getPackaging().subscribe(res => {
        this.response = res;
        if (this.response.success == true) {
          this.packaging = this.response.data;
        }
        else {
          this.toastr.error('Something went Worng', 'Message.');
        }
      })
    }
    {
      this.service.getDesignType().subscribe(res => {
        this.response = res;
        if (this.response.success == true) {
          this.design = this.response.data;
        }
        else {
          this.toastr.error('Something went Worng', 'Message.');
        }
      })
    }

    {
      this.service.getProcess().subscribe(res => {
        this.response = res;
        if (this.response.success == true) {
          this.process = this.response.data;
        }
        else {
          this.toastr.error('Something went Worng', 'Message.');
        }
      })
    }
    {
      this.service.getProcessType().subscribe(res => {
        this.response = res;
        if (this.response.success == true) {
          this.ptype = this.response.data;
        }
        else {
          this.toastr.error('Something went Worng', 'Message.');
        }
      })
    }
    {
      this.service.getCertification().subscribe(res => {
        this.response = res;
        if (this.response.success == true) {
          this.certification = this.response.data;
        }
        else {
          this.toastr.error('Something went Worng', 'Message.');
        }
      })
    }
    {
      this.service.getPriceTerm().subscribe(res => {
        this.response = res;
        if (this.response.success == true) {
          this.priceterm = this.response.data;
        }
        else {
          this.toastr.error('Something went Worng', 'Message.');
        }
      })
    }



    {
      this.service.getCity().subscribe(res => {
        this.response = res;
        if (this.response.success == true) {
          this.city = this.response.data;
        }
        else {
          this.toastr.error('Something went Worng', 'Message.');
        }
      })
    }



    this.getenquiryCountry();
    this.getenquiryBuyers();


  }


  fetch(arg0: (data: any) => void) {
    throw new Error('Method not implemented.');
  }

  getenquiryCountry() {
    this.http.get(`${environment.apiUrl}/api/Lookups/Countries`)
      .subscribe(
        res => {
          this.response = res;
          if (this.response.success == true) {
            this.country = this.response.data;
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

  addenquiryCertificateForm() {
    const modalRef = this.modalService.open(EditCertificateComponent, { centered: true });
    modalRef.result.then((data) => {
      // on close
      if (data == true) {
        //  this.date = this.myDate;
        this.fetch((data) => {
          this.rows = data;
        });


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
        this.fetch((data) => {
          this.rows = data;
          this.CityCount = this.rows.length;
        });


      }
    }, (reason) => {
      // on dismiss
    });
  }


  getenquiryBuyers() {
    this.http.get(`${environment.apiUrl}/api/Buyers/GetBuyers`)
      .subscribe(
        res => {

          this.response = res;
          if (this.response.success == true) {
            this.buyer = this.response.data;
            this.listCount = this.buyer.length;

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



  addenquiryBuyerForm() {
    const modalRef = this.modalService.open(AddBuyerComponent, { centered: true });
    modalRef.result.then((data) => {
      // on close
      if (data == true) {
        this.date = this.myDate;
        this.getenquiryBuyers();

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
        this.fetch((data) => {
          this.rows = data;
          this.listCount = this.rows.length;
        });


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
        this.fetch((data) => {
          this.rows = data;
        });


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
        this.fetch((data) => {
          this.rows = data;

          this.listCount = this.rows.length;
        });


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
        this.fetch((data) => {
          this.rows = data;
        });


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
        this.fetch((data) => {
          this.rows = data;
        });


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
        this.fetch((data) => {
          this.rows = data;
        });


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
        this.fetch((data) => {
          this.rows = data;
        });


      }
    }, (reason) => {
      // on dismiss
    });
  }



}
