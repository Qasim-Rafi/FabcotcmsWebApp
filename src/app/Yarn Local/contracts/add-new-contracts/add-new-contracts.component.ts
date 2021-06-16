import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ServiceService } from 'src/app/shared/service.service';
// import { ArticleComponent } from '../Modals/article/article.component';
import { BuyerComponent } from '../Modals/buyer/buyer.component';
import { NgForm } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { AddSellerFormComponent } from '../../yarn-configuration/seller/add-seller-form/add-seller-form.component';
import { Dateformater } from 'src/app/shared/dateformater';
import { NgxSpinnerService } from 'ngx-spinner';

import { AddBuyerComponent } from '../../yarn-configuration/buyer/add-buyer/add-buyer.component';
import { AddArticleComponent } from '../../yarn-configuration/articles/add-article/add-article.component';
import { AddPackingComponent } from '../../yarn-configuration/product/packing/add-packing/add-packing.component';
import { AddPriceComponent } from '../../yarn-configuration/product/price-term/add-price/add-price.component';
import { DatePipe } from '@angular/common';
import { AddTypeComponent } from 'src/app/configuration/product/fabric-type/add-type/add-type.component';
import { AddWeaveComponent } from '../../yarn-configuration/product/weave/add-weave/add-weave.component';
import { AddEditWarpComponent } from '../../yarn-configuration/product/warp/add-edit-warp/add-edit-warp.component';
import { AddEditSelvedgeComponent } from '../../yarn-configuration/product/selvedge/add-edit-selvedge/add-edit-selvedge.component';
import { AddEditPickInsertionComponent } from '../../yarn-configuration/product/pick-insertion/add-edit-pick-insertion/add-edit-pick-insertion.component';
import { AddEditWeftComponent } from '../../yarn-configuration/product/weft/add-edit-weft/add-edit-weft.component';
import { AddPieceLengthComponent } from '../../yarn-configuration/product/piece-length/add-piece-length/add-piece-length.component';
import { AddPaymentComponent } from 'src/app/configuration/product/payment-term/add-payment/add-payment.component';
import { AddContainerComponent } from '../../yarn-configuration/product/container/add-container/add-container.component';
import { EditCityComponent } from 'src/app/configuration/city/edit-city/edit-city.component';


@Component({
  selector: 'app-add-new-contracts',
  templateUrl: './add-new-contracts.component.html',
  styleUrls: ['./add-new-contracts.component.css']
})
export class AddNewContractsComponent implements OnInit {

  response: any;
  data: any = {};
  buyer: any = [];
  seller: any = [];
  article: any = [];
  packing: any = [];
  priceterm: any = [];
  fabricType: any = [];
  uomList: any = [];
  currency: any = [];
  newBuyer: any;
  newFabric: any;
  newselvedge: any;
  newweave: any;
  newArticle: any;
  newPacking: any;
  newSeller: number;
  counter3: number = 1;
  selvedge: any = [];
  sellerPOC: any = [];
  buyerPOC: any = [];
  new: any = [];
  new2: any = [];
  new3: any = [];
  data1: any = [];
  data2: any = [];
  // @Input() loggedInDepartmentName;
  // @Input() isFabricLocal;
  weave: any = [];
  agents: any = {};
  commission: any = [];
  newPrice: any;
  @ViewChild(NgForm) contractForm;
  objEnquiry = 0;
  dateformater: Dateformater = new Dateformater();
  selected: any;
  loggedInDepartmentName: string;
  // FabricLocal:boolean;
  sensorTypes: any;
  selectedAttributes: any;
  constructor(
    private service: ServiceService,
    private toastr: ToastrService,
    private modalService: NgbModal,
    private spinner: NgxSpinnerService,
    private router: Router,
    private http: HttpClient,
    public datepipe: DatePipe,
  ) { }

  ngOnInit(): void {
    this.loggedInDepartmentName = localStorage.getItem('loggedInDepartmentName');
    this.data.quantityUOMId = 8
    this.data.rateUOMId = 7
    let olddate = new Date();
    let latest_date = this.datepipe.transform(olddate, 'yyyy-MM-dd');
    this.data.enquiryDate = this.dateformater.fromModel(latest_date);
    this.GetBuyersDropdown("start");
    this.GetSellerDropdown("start");
    this.getSellersPOC();
    this.GetweavesDropdown("start");
    this.getBuyerPOC();
    this.GetUOMDropdown();
    this.GetSelvedgeDropdown("start");
    this.GetArticleDropdown("start");
    this.GetCurrencyDropdown();
    this.GetpackingDropdown("start");
    this.GetPriceTermDropdown("start");
    this.getFabricType("start");
    this.GetAgentDropdown();
    this.getAutoEnquiryNo();
    this.selected = this.uomList[0].name;

  }

  addfield() {
    this.data1.push({ id: this.data1.length });
  }
  removefield(i: number) {
    this.data1.splice(i, 1);
  }
  addMore() {
    this.new.push({ id: this.new.length });
  }
  add() {
    this.new2.push({ id: this.new2.length });
  }
  add3() {
    this.new3.push({ id: this.new3.length });
    // this.counter3++
  }
  remove(i: number) {
    this.new.splice(i, 1);
  }
  remove2(i: number) {
    this.new2.splice(i, 1);
  }
  remove3(i: number) {
    this.new3.splice(i, 1);
    // this.counter3-- ;
  }
  // addMore() {
  //   this.data.push({id: this.data.length});
  // }

  GetAgentDropdown() {
    this.service.getAgents().subscribe(res => {
      this.response = res;
      if (this.response.success == true) {
        this.agents = this.response.data;
      }
      else {
        this.toastr.error(this.response.message, 'Message.');
      }
    })
  }
  GetweavesDropdown(type: string) {
    this.service.getWeave().subscribe(res => {
      this.response = res;
      if (this.response.success == true) {

        this.weave = this.response.data;
        // this.newBuyer = this.response.data.lastId



        if (type == "other") {
          // this.buyer.id = this.newBuyer;
          this.data.weaveId = this.newweave;
        }

      }
      else {
        this.toastr.error(this.response.message, 'Message.');
      }
    })
  }

  GetBuyersDropdown(type: string) {
    this.service.getBuyers().subscribe(res => {
      this.response = res;
      if (this.response.success == true) {

        this.buyer = this.response.data;
        // this.newBuyer = this.response.data.lastId



        if (type == "other") {
          // this.buyer.id = this.newBuyer;
          this.data.buyerId = this.newBuyer;
        }

      }
      else {
        this.toastr.error(this.response.message, 'Message.');
      }
    })
  }


  GetSellerDropdown(type: string) {
    this.service.getSellerLookup().subscribe(res => {
      this.response = res;
      if (this.response.success == true) {

        this.seller = this.response.data;
        // this.newSeller = this.response.data



        if (type == "other") {
          // this.seller.id = this.newSeller;
          this.data.sellerId = this.newSeller
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
  getBuyerPOC() {
    this.service.getBuyersPOC().subscribe(res => {
      this.response = res;
      if (this.response.success == true) {
        this.buyerPOC = this.response.data;
      }
      else {
        this.toastr.error(this.response.message, 'Message.');
      }
    })
  }
  getSellersPOC() {
    this.service.getBuyersPOC().subscribe(res => {
      this.response = res;
      if (this.response.success == true) {
        this.sellerPOC = this.response.data;
      }
      else {
        this.toastr.error(this.response.message, 'Message.');
      }
    })
  }
  GetPriceTermDropdown(type: string) {
    this.service.getPriceTerm().subscribe(res => {
      this.response = res;
      if (this.response.success == true) {
        this.priceterm = this.response.data;
        if (type == "other") {
          // this.seller.id = this.newSeller;
          this.data.priceTermId = this.newPrice
        }
      }
      else {
        this.toastr.error(this.response.message, 'Message.');
      }
    })
  }

  GetpackingDropdown(type: string) {
    this.service.getPackaging().subscribe(res => {
      this.response = res;
      if (this.response.success == true) {
        this.packing = this.response.data;
        if (type == "other") {
          // this.seller.id = this.newSeller;
          this.data.packingIds = this.newPacking
        }

      }
      else {
        this.toastr.error(this.response.message, 'Message.');
      }
    })
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


  getAutoEnquiryNo() {
    this.http.get(`${environment.apiUrl}/api/Enquiries/GetNextEnquiryNumber`)
      .subscribe(
        res => {

          this.response = res;
          if (this.response.success == true) {
            this.data.autoContractNo = this.response.data;
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


  addBuyerForm() {
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




  addArticleForm() {
    const modalRef = this.modalService.open(AddArticleComponent, { centered: true });
    modalRef.result.then((data) => {
      // on close
      if (data.parent == true) {

        this.newArticle = data.id
        this.GetArticleDropdown("other");


      }
    }, (reason) => {
      // on dismiss
    });

  }





  addSellerForm() {
    const modalRef = this.modalService.open(AddSellerFormComponent, { centered: true });
    modalRef.result.then((data) => {
      // on close
      if (data.parent == true) {

        this.newSeller = data.id
        this.GetSellerDropdown("other");


      }
    }, (reason) => {
      // on dismiss
    });

  }
  addYarnPackingForm() {
    const modalRef = this.modalService.open(AddPackingComponent, { centered: true });
    modalRef.result.then((data) => {
      // on close
      if (data.parent == true) {

        this.newPacking = data.id
        this.GetpackingDropdown("other");




      }
    }, (reason) => {
      // on dismiss
    });
  }
  addYarnPriceForm() {
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
  getFabricType(type: string) {
    this.service.getFabricType().subscribe(res => {
      this.response = res;
      if (this.response.success == true) {
        this.fabricType = this.response.data;
        if (type == "other") {
          // this.seller.id = this.newSeller;
          this.data.fabricTypeId = this.newFabric
        }
      }
      else {
        this.toastr.error(this.response.message, 'Message.');
      }
    })
  }
  addFabricTypeForm() {
    const modalRef = this.modalService.open(AddTypeComponent, { centered: true });
    modalRef.result.then((data) => {
      // on close
      if (data.parent == true) {

        this.newPrice = data.id

        this.getFabricType("other");




      }
    }, (reason) => {
      // on dismiss
    });
  }
  addWeaveForm(check, form) {
    const modalRef = this.modalService.open(AddWeaveComponent, { centered: true });
    modalRef.componentInstance.statusCheck = check;
    modalRef.componentInstance.FormName = form;

    modalRef.result.then((data) => {
      // on close
      if (data.parent == true) {

        this.newweave = data.id

        this.GetweavesDropdown("start");





      }
    }, (reason) => {
      // on dismiss
    });
  }

  addpiecelengthForm(check, form) {
    const modalRef = this.modalService.open(AddPieceLengthComponent, { centered: true });
    modalRef.componentInstance.statusCheck = check;
    modalRef.componentInstance.FormName = form;
    modalRef.result.then((data) => {
      // on close
      if (data.parent == true) {

        this.newPrice = data.id

        this.getFabricType("other");




      }
    }, (reason) => {
      // on dismiss
    });
  }
  addwarpForm(check, form) {
    const modalRef = this.modalService.open(AddEditWarpComponent, { centered: true });
    modalRef.componentInstance.statusCheck = check;
    modalRef.componentInstance.FormName = form;
    modalRef.result.then((data) => {
      // on close
      if (data.parent == true) {

        this.newPrice = data.id

        this.getFabricType("other");




      }
    }, (reason) => {
      // on dismiss
    });
  }
  addweftForm(check, form) {
    const modalRef = this.modalService.open(AddEditWeftComponent, { centered: true });
    modalRef.componentInstance.statusCheck = check;
    modalRef.componentInstance.FormName = form;
    modalRef.result.then((data) => {
      // on close
      if (data.parent == true) {

        this.newPrice = data.id

        this.getFabricType("other");




      }
    }, (reason) => {
      // on dismiss
    });
  }
  addpickinsertionForm(check, form) {
    const modalRef = this.modalService.open(AddEditPickInsertionComponent, { centered: true });
    modalRef.componentInstance.statusCheck = check;
    modalRef.componentInstance.FormName = form;
    modalRef.result.then((data) => {
      // on close
      if (data.parent == true) {

        this.newPrice = data.id

        this.getFabricType("other");




      }
    }, (reason) => {
      // on dismiss
    });
  }
  addselvedgeForm(check, form) {
    const modalRef = this.modalService.open(AddEditSelvedgeComponent, { centered: true });
    modalRef.componentInstance.statusCheck = check;
    modalRef.componentInstance.FormName = form;
    modalRef.result.then((data) => {
      // on close
      if (data.parent == true) {

        this.newselvedge = data.id

        this.GetSelvedgeDropdown("other");




      }
    }, (reason) => {
      // on dismiss
    });
  }

  GetSelvedgeDropdown(type: string) {
    this.service.getSelvedge().subscribe(res => {
      this.response = res;
      if (this.response.success == true) {

        this.selvedge = this.response.data;
        // this.newSeller = this.response.data



        if (type == "other") {
          // this.seller.id = this.newSeller;
          this.data.selvedgeId = this.newselvedge
        }

      }
      else {
        this.toastr.error(this.response.message, 'Message.');
      }
    })
  }
  addsellerpayemntForm() {
    const modalRef = this.modalService.open(AddPaymentComponent, { centered: true });
    modalRef.result.then((data) => {
      // on close
      if (data.parent == true) {

        this.newPrice = data.id

        this.getFabricType("other");




      }
    }, (reason) => {
      // on dismiss
    });
  }


  addContainerForm(check, form) {
    const modalRef = this.modalService.open(AddContainerComponent, { centered: true });
    modalRef.componentInstance.statusCheck = check;
    modalRef.componentInstance.FormName = form;
    modalRef.result.then((data) => {
      // on close
      if (data.parent == true) {

        this.newPrice = data.id

        this.getFabricType("other");




      }
    }, (reason) => {
      // on dismiss
    });
  }

  addcityForm(check, form) {
    const modalRef = this.modalService.open(EditCityComponent, { centered: true });
    modalRef.componentInstance.statusCheck = check;
    modalRef.componentInstance.FormName = form;
    modalRef.result.then((data) => {
      // on close
      if (data.parent == true) {

        this.newPrice = data.id

        this.getFabricType("other");




      }
    }, (reason) => {
      // on dismiss
    });
  }






  navigate() {
    this.router.navigateByUrl('/FabCot/active-contract');
  };


  addContract() {
    let departmentId = parseInt(localStorage.getItem('loggedInDepartmentId'))
    // statusCheck = check;

    if (this.data2.agentId != null) {
      this.commission.push({ ['agentId']: this.data2.agentId, ["agentCommission"]: this.data2.agentCommission })

    }
    for (let i = 0; i < this.data1.length; i++) {

      this.commission.push({ ['agentId']: this.data1[i].agentId, ["agentCommission"]: this.data1[i].agentCommission })
    }

    let varr = {
      // "enquiryDate": this.dateformater.toModel(this.data.enquiryDate),
      "autoContractNo": this.data.autoContractNo,
      "contractNo": this.data.contractNo,
      "poNumber": this.data.poNumber,
      "sellerId": this.data.sellerId,
      "buyerId": this.data.buyerId,
      "articleId": this.data.articleId,
      "construction": this.data.construction,
      "quantity": this.data.quantity,
      "quantityUOMId": this.data.quantityUOMId,
      "toleranceValue": this.data.toleranceValue,
      "rate": this.data.rate,
      "currencyId": this.data.currencyId,
      "rateUOMId": this.data.rateUOMId,
      "sellerPaymentTerm": this.data.sellerPaymentTerm,
      "buyerPaymentTerm": this.data.buyerPaymentTerm,
      "packingId": this.data.packingId,
      "priceautoContractNoTermId": this.data.priceTermId,
      "sellerDeliveryDate": this.dateformater.toModel(this.data.sellerDeliveryDate),
      "buyerDeliveryDate": this.dateformater.toModel(this.data.buyerDeliveryDate),
      "contractRemarks": this.data.contractRemarks,
      "buyerRemarks": this.data.buyerRemarks,
      "otherConditionRemarks": this.data.otherConditionRemarks,
      "title": this.data.title,
      "kickbackPercentage": this.data.kickbackPercentage,
      "kickbackUOMId": this.data.kickbackUOMId,
      "beneficiary": this.data.beneficiary,
      "fabCotCommision": this.data.fabCotCommision,
      "fabCotCommisionUOMId": this.data.fabCotCommisionUOMId,
      "fabcotSideCommAdditionalInfo": this.data.fabcotSideCommAdditionalInfo,
      "buyersideCommision": this.data.buyersideCommision,
      "buyersideCommisionUOMId": this.data.buyersideCommisionUOMId,
      "buyerSideCommAdditionalInfo": this.data.buyerSideCommAdditionalInfo,
      "agentCommission": this.commission,
      "fabricTypeId": this.data.fabricTypeId,
      "contractNumber": this.data.contractNumber,
      "contractDate": this.data.contractDate,
      "buyerPOCId": this.data.buyerPOCId,
      "sellerPOCId": this.data.sellerPOCId,
      "constructionAdditionalInfo":this.data.constructionAdditionalInfo,
      "gsm": this.data.gsm,
      "tolerance": this.data.tolerance,
      "weaveId": this.data.weaveId,
      "selvedgeId":this.data.selvedgeId,
      "pieceLengthId":this.data.pieceLengthId,
      "pickInsertionId":this.data.pickInsertionId,
      "widthInInch": this.data.widthInInch,
      "blendingRatioWarpId":this.data.blendingRatioWarpId,
      "blendingRatioWeftId": this.data.blendingRatioWeftId,
      "gst":this.data.gst,
      "wiTax": this.data.wiTax,
      "priceTermId": this.data.priceTermId,
      "sellerPaymentTermId": this.data.sellerPaymentTermId,
      "buyerPaymentTermId": this.data.buyerPaymentTermId,
      "paymentMode": this.data.paymentMode,
      "sellerPaymentTermDays":this.data.sellerPaymentTermDays,
      "buyerPaymentTermDays":this.data.buyerPaymentTermDays,
      "destinationId":this.data.destinationId,
      "containerId": this.data.containerId,
      "count": this.data.count,

    }
    this.spinner.show();
    this.http.
      post(`${environment.apiUrl}/api/Contracts/AddContract?` + 'enquiryId=' + this.objEnquiry + '&' + 'departmentId=' + departmentId, varr)
      .subscribe(
        res => {

          this.response = res;
          if (this.response.success == true) {
            this.toastr.success(this.response.message, 'Message.');
            this.contractForm.reset();
            this.router.navigate(['/FabCot/active-contract'], { queryParams: { id: this.response.data } });
            // this.router.navigate(['/enquiry/active-enquiries']);
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








}
