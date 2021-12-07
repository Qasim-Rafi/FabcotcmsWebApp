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
// import { AddTypeComponent } from 'src/app/configuration/product/fabric-type/add-type/add-type.component';
import { AddWeaveComponent } from '../../yarn-configuration/product/weave/add-weave/add-weave.component';
import { AddEditWarpComponent } from '../../yarn-configuration/product/warp/add-edit-warp/add-edit-warp.component';
import { AddEditSelvedgeComponent } from '../../yarn-configuration/product/selvedge/add-edit-selvedge/add-edit-selvedge.component';
import { AddEditPickInsertionComponent } from '../../yarn-configuration/product/pick-insertion/add-edit-pick-insertion/add-edit-pick-insertion.component';
import { AddEditWeftComponent } from '../../yarn-configuration/product/weft/add-edit-weft/add-edit-weft.component';
import { AddPieceLengthComponent } from '../../yarn-configuration/product/piece-length/add-piece-length/add-piece-length.component';
import { AddPaymentComponent } from 'src/app/configuration/product/payment-term/add-payment/add-payment.component';
import { AddContainerComponent } from '../../yarn-configuration/product/container/add-container/add-container.component';
import { EditCityComponent } from 'src/app/configuration/city/edit-city/edit-city.component';
import { AddTypeComponent } from '../../yarn-configuration/product/fabric-type/add-type/add-type.component';


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
  destination: any = [];
  PieceLength: any = [];
  PickInsertion: any = [];
  paymentMode1: any = [];
  uomList: any = [];
  blendingRatioWarp: any = [];
  blendingRatioWeft: any = [];
  currency: any = [];
  container: any = [];
  paymentMode: any = {};
  newdestination: any;
  newBuyer: any;
  newbuyerPaymentTerm1: any;
  newsellerPaymentTerm1: any;
  newblendingRatioWeft: any;
  newblendingRatioWarp: any;
  newFabric: any;
  newPickInsertion: any;
  newselvedge: any;
  newweave: any;
  newArticle: any;
  newPacking: any;
  newcontainer: any;
  newSeller: number;
  newPieceLength: number;
  counter3: number = 1;
  selvedge: any = [];
  sellerPOC: any = [];
  buyerPOC: any = [];
  new: any = [];
  Article: any = [];
  new2: any = [];
  new3: any = [];
  data1: any = [];
  data2: any = [];
  condition1: string = "We are please to confirm here the booking as per following term and conditions."
  condition: string = "+17% GST AS PER GOVT POLICY";
  fabricCondition:string="(1)Fabric should be A-grad and export mended therefore any pencil or chalk marks will not be accepted.\n(2) Subject to quality approval and 05 mtrs sample to be sent on the start of production for approval.\n(3) Count variation is not acceptable.\n(4) One yarn source will be preferred in entire quantity but in case of problem, maximun two yarn sources are allowed.\n(5) Any sub-standard / rejected goods will be replaced by seller.\n(6) Partial shipment allowed.\n(7) Maximum 2 cutting faults allowed with allowance of 01 mtr against each cutting fault.\n(8) Tag Flag for each cut-able fault."
  exportCondition:string="1- Please mention the loading port on sale contract"
  exportTitle="We are pleased to confirm the contract of  Yarn as per following terms :"
  title:string="We are pleased to confirm the following contract for A Grade Air jet Fabric"
  weave: any = [];
  agents: any = {};
  buyerPayementTerm: any = [];
  PayementTerm: any = [];
  commission: any = [];
  newPrice: any;
  @ViewChild(NgForm) contractForm;
  objEnquiry = 0;
  dateformater: Dateformater = new Dateformater();
  selected: any;
  loggedInDepartmentName: string;
  loggedInDepartmentCode: string;
brand : boolean;
data3: any = {}
data4: any = {}
data5: any = {}
articleArray: any = []
brandId : any;

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
    this.loggedInDepartmentCode = localStorage.getItem('loggedInDepartmentCode');
    if (this.loggedInDepartmentName == 'Yarn Local') {
      this.data.currencyId = 1,
        this.data.quantityUOMId = 8,
      this.data.rateUOMId = 7,
      this.data.otherConditionRemarks=this.condition;
      this.data.title =this.condition1;
    } else if (this.loggedInDepartmentName == 'Fabric Local') {
      this.data.quantityUOMId;
      this.data.currencyId = 1;
      this.data.rateUOMId;
      this.data.otherConditionRemarks=this.fabricCondition;
      this.data.title=this.title;
    }else if(this.loggedInDepartmentName=='Yarn Export'){
      this.data.otherConditionRemarks=this.exportCondition;
      this.data.title=this.exportTitle;
      this.data.currencyId = 2;
    }else if(this.loggedInDepartmentName=='Yarn Import'){
      this.data.otherConditionRemarks=this.exportCondition;
      this.data.title=this.exportTitle;
      this.data.currencyId = 2;
    }
    else if(this.loggedInDepartmentName=='Fabric Export'){
      this.data.otherConditionRemarks="(1) Subject to sample and quality approval.\n(2) Goods will be exported therefore any pencil or chalk marks will not be accepted.\n(3) Fabric should be A-graded export mended.\n(4) Fabric should be under 4 point American inspection system and not more than 12 demerit points per 100 sq. yard.";
      this.data.title="We are pleased to confirm the contract of fabric as per following terms :";
       this.data.currencyId = 2;
    }

    let olddate = new Date();
    let latest_date = this.datepipe.transform(olddate, 'yyyy-MM-dd');
    this.data.enquiryDate = this.dateformater.fromModel(latest_date);
    this.getBrand();
    this.GetWarpDropdown("start");
    this.GetWeftDropdown("start");
    this.GetBuyersDropdown("start");
    this.GetSellerDropdown("start");
    this.GetSellerDropdownbydepartment("start")
    // this.getSellersPOC();
    this.getPieceLength("start");
    this.GetContainerDropdown("start");
    this.GetweavesDropdown("start");
    // this.getBuyerPOC();
    this.GetPaymentModeDropdown();
    this.GetUOMDropdown();
    this.GetSelvedgeDropdown("start");
    this.getPickInsertion("start");
    this.GetCitiesDropdown("start");
    this.GetArticleDropdown("start");
    this.GetCurrencyDropdown();
    this.GetpackingDropdown("start");
    this.GetPriceTermDropdown("start");
    this.GetBuyerPaymentTerm("start");
    this.GetSellerPaymentTerm("start");
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
  addArticle() {
    this.Article.push({ id: this.Article.length });
    // this.Article.push({ id: 0 });

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
  removeArticle(i: number) {
    this.Article.splice(i, 1);
  }
  remove3(i: number) {
    this.new3.splice(i, 1);
    // this.counter3-- ;
  }
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
  getBuyerPOC(event) {
    let id = event;
    this.service.getBuyersPOC(id).subscribe(res => {
      this.response = res;
      if (this.response.success == true) {
        this.buyerPOC = this.response.data;
        if (this.buyerPOC.length == 0) {

          this.data.buyerPOCId = null
        }
        else {
          this.data.buyerPOCId = this.buyerPOC[0].id
        }
        // this.data.beneficiaryCriteriaId = 2; 

      }
      else {
        this.toastr.error(this.response.message, 'Message.');
      }
    })
  }
  getSellersPOC(event) {
    let id = event;
    this.service.getSellersPOC(id).subscribe(res => {
      this.response = res;
      if (this.response.success == true) {
        this.sellerPOC = this.response.data;
        if (this.sellerPOC.length == 0) {

          this.data.sellerPOCId = null
        }
        else {
          this.data.sellerPOCId = this.sellerPOC[0].id
        }
        // this.data.beneficiaryCriteriaId = 2; 

      }
      else {
        this.toastr.error(this.response.message, 'Message.');
      }
    })
  }
  GetCitiesDropdown(type: string) {
    this.service.getCity().subscribe(res => {
      this.response = res;
      if (this.response.success == true) {

        this.destination = this.response.data;
        // this.newBuyer = this.response.data.lastId



        if (type == "other") {
          // this.buyer.id = this.newBuyer;
          this.data.destinationId = this.newdestination;
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
  GetSellerDropdownbydepartment(type: string) {
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
  GetPaymentModeDropdown() {
    this.service.getPaymentMode().subscribe(res => {
      this.response = res;
      if (this.response.success == true) {
        this.paymentMode = this.response.data;
      }
      else {
        this.toastr.error(this.response.message, 'Message.');
      }
    })
  }
  GetSellerPaymentTerm(type: string) {
    this.service.getPaymentTerm().subscribe(res => {
      this.response = res;
      if (this.response.success == true) {

        this.PayementTerm = this.response.data;
        // this.newSeller = this.response.data



        if (type == "other") {
          // this.seller.id = this.newSeller;
          this.data.sellerPaymentTermId = this.newsellerPaymentTerm1
        }

      }
      else {
        this.toastr.error(this.response.message, 'Message.');
      }
    })
  }
  GetBuyerPaymentTerm(type: string) {
    this.service.getPaymentTerm().subscribe(res => {
      this.response = res;
      if (this.response.success == true) {

        this.buyerPayementTerm = this.response.data;
        // this.newSeller = this.response.data



        if (type == "other") {
          // this.seller.id = this.newSeller;
          this.data.buyerPaymentTermId = this.newbuyerPaymentTerm1
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
  GetContainerDropdown(type: string) {
    this.service.getContainer().subscribe(res => {
      this.response = res;
      if (this.response.success == true) {
        this.container = this.response.data;
        if (type == "other") {
          // this.seller.id = this.newSeller;
          this.data.containerId = this.newcontainer
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
          this.data.packingId = this.newPacking
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
  GetWarpDropdown(type: string) {
    this.service.getBrWarp().subscribe(res => {
      this.response = res;
      if (this.response.success == true) {

        this.blendingRatioWarp = this.response.data;
        // this.newSeller = this.response.data



        if (type == "other") {
          // this.seller.id = this.newSeller;
          this.data.blendingRatioWarpId = this.newblendingRatioWarp
        }

      }
      else {
        this.toastr.error(this.response.message, 'Message.');
      }
    })
  }
  GetWeftDropdown(type: string) {
    this.service.getBrWeft().subscribe(res => {
      this.response = res;
      if (this.response.success == true) {

        this.blendingRatioWeft = this.response.data;
        // this.newSeller = this.response.data



        if (type == "other") {
          // this.seller.id = this.newSeller;
          this.data.blendingRatioWeftId = this.newblendingRatioWeft
        }

      }
      else {
        this.toastr.error(this.response.message, 'Message.');
      }
    })
  }
  getPieceLength(type: string) {
    this.service.getPieceLength().subscribe(res => {
      this.response = res;
      if (this.response.success == true) {
        this.PieceLength = this.response.data;
        if (type == "other") {
          // this.seller.id = this.newSeller;
          this.data.pieceLengthId = this.newPieceLength
        }
      }
      else {
        this.toastr.error(this.response.message, 'Message.');
      }
    })
  }
  getPickInsertion(type: string) {
    this.service.getPickInsertion().subscribe(res => {
      this.response = res;
      if (this.response.success == true) {
        this.PickInsertion = this.response.data;
        if (type == "other") {
          // this.seller.id = this.newSeller;
          this.data.pickInsertionId = this.newPickInsertion
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

        this.newFabric = data.id

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

        this.GetweavesDropdown("other");





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

        this.newPieceLength = data.id

        this.getPieceLength("other");




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

        this.newblendingRatioWarp = data.id

        this.GetWarpDropdown("other");




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

        this.newblendingRatioWeft = data.id

        this.GetWeftDropdown("other");




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

        this.newPickInsertion = data.id

        this.getPickInsertion("other");




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

        this.newsellerPaymentTerm1 = data.id

        this.GetSellerPaymentTerm("other");




      }
    }, (reason) => {
      // on dismiss
    });
  }
  addbuyerpayemntForm() {
    const modalRef = this.modalService.open(AddPaymentComponent, { centered: true });
    modalRef.result.then((data) => {
      // on close
      if (data.parent == true) {

        this.newbuyerPaymentTerm1 = data.id

        this.GetBuyerPaymentTerm("other");




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

        this.newcontainer = data.id

        this.GetContainerDropdown("other");




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

        this.newdestination = data.id

        this.GetCitiesDropdown("other");




      }
    }, (reason) => {
      // on dismiss
    });
  }
  navigate() {
    this.router.navigateByUrl('/FabCot/active-contract-details');
  };
  click(event){
  console.log(event);
  if(event.type == 'click'){
    this.brand = true;
  }
 
  

  }
  cross(event){
    console.log(event);
    if(event.type == 'click'){
      this.brand = false;
    }
  }
  getBrand() {

    this.http
      .get(`${environment.apiUrl}/api/ExportConfigs/GetAllBrand`)
      .subscribe(res => {
        this.response = res;
  
        if (this.response.success == true) {
          this.data4 = this.response.data;
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
  addBrand(event) {
    let departmentId = parseInt(localStorage.getItem('loggedInDepartmentId'))

    let varr = {
      "brandName": this.data3.brandName,
   
      "departmentId": departmentId,
      "active": true
    }
    this.spinner.show();
    this.http.
      post(`${environment.apiUrl}/api/ExportConfigs/AddBrand` , varr)
      .subscribe(
        res => {

          this.response = res;
          if (this.response.success == true) {
            this.toastr.success(this.response.message, 'Message.');
            this.spinner.hide();
        // this.data4.brandName = this.response.data.brandName;
            
          this.getBrand();
           if(event.type == 'click'){
             this.brand = false
             this.data3 = ""
           }
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
  addContract() {
    let departmentId = parseInt(localStorage.getItem('loggedInDepartmentId'))
    // statusCheck = check;

    if (this.data2.agentId != null) {
      this.commission.push({ ['agentId']: this.data2.agentId, ["agentCommission"]: this.data2.agentCommission })

    }
    for (let i = 0; i < this.data1.length; i++) {

      this.commission.push({ ['agentId']: this.data1[i].agentId, ["agentCommission"]: this.data1[i].agentCommission })
    }
    if (this.data5.contractArticleName != '') {
      this.articleArray.push({ ['articleId']: this.data5.articleId , ['contractArticleQuantity']: this.data5.contractArticleQuantity , ['contractArticleRate']: this.data5.contractArticleRate , ['contractArticleCommission']: this.data5.contractArticleCommission
      , ['contractArticleForignAgentCommission']: this.data5.contractArticleForignAgentCommission
    })

    }
    for (let i = 0; i < this.Article.length; i++) {

      
      this.articleArray.push({ ['articleId']: this.Article[i].articleId , ['contractArticleQuantity']: this.Article[i].contractArticleQuantity , ['contractArticleRate']: this.Article[i].contractArticleRate , ['contractArticleCommission']: this.Article[i].contractArticleCommission
       , ['contractArticleForignAgentCommission']: this.Article[i].contractArticleForignAgentCommission})
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
      "brandId": this.data.brandId,
      "pecenetAge" : this.data.pecenetAge,
      "rate": this.data.rate,
      "contractArticles" : this.loggedInDepartmentName == 'Yarn Export' ?  this.articleArray : this.loggedInDepartmentName == 'Yarn Import' ? this.articleArray : null,
      "currencyId": this.data.currencyId,
      "rateUOMId": this.data.rateUOMId,
      "sellerPaymentTerm": this.data.sellerPaymentTerm,
      "buyerPaymentTerm": this.data.buyerPaymentTerm,
      "packingId": this.data.packingId,
      "priceautoContractNoTermId": this.data.priceTermId,
      "contractRemarks": this.data.contractRemarks,
      "buyerRemarks": this.data.buyerRemarks,
      "otherConditionRemarks": this.data.otherConditionRemarks,
      "title": this.data.title,
      "kickbackPercentage": this.data.kickbackPercentage == null ? 0 : this.data.kickbackPercentage  ,
      "kickbackUOMId": this.data.kickbackUOMId,
      "beneficiary": this.data.beneficiary,
      "fabCotCommision": this.data.fabCotCommision == null ? 0 : this.data.fabCotCommision,
      "fabCotCommisionUOMId": this.data.fabCotCommisionUOMId,
      "fabcotSideCommAdditionalInfo": this.data.fabcotSideCommAdditionalInfo,
      "buyersideCommision": this.data.buyersideCommision == null ? 0 : this.data.buyersideCommision,
      "buyersideCommisionUOMId": this.data.buyersideCommisionUOMId,
      "buyerSideCommAdditionalInfo": this.data.buyerSideCommAdditionalInfo,
      "agentCommissions": this.commission,
      "fabricTypeId": this.data.fabricTypeId,
      "contractNumber": this.data.contractNumber,
      "contractDate":this.dateformater.toModel(this.data.enquiryDate),
      "buyerPOCId": this.data.buyerPOCId,
      "sellerPOCId": this.data.sellerPOCId,
      "constructionAdditionalInfo": this.data.constructionAdditionalInfo,
      "gsm": this.data.gsm,
      "tolerance": this.data.tolerance,
      "weaveId": this.data.weaveId,
      "selvedgeId": this.data.selvedgeId,
      "pieceLengthId": this.data.pieceLengthId,
      "SellerPieceLengthId" : this.data.SellerPieceLengthId,
      "pickInsertionId": this.data.pickInsertionId,
      "widthInInch": this.data.widthInInch,
      "blendingRatioWarpId": this.data.blendingRatioWarpId,
      "blendingRatioWeftId": this.data.blendingRatioWeftId,
      "buyerSidePaymentTermInfo": this.data.buyerSidePaymentTermInfo,
      "sellerPaymentTermInfo": this.data.sellerPaymentTermInfo,
      "gst": this.data.gst,
      "wiTax": this.data.wiTax,
      "priceTermId": this.data.priceTermId,
      "sellerPaymentTermId": this.data.sellerPaymentTermId,
      "paymentTermId":this.data.paymentTermId,
      "buyerPaymentTermId": this.data.buyerPaymentTermId,
      "paymentMode": this.data.paymentMode,
      "sellerPaymentTermDays": this.data.sellerPaymentTermDays == null ?  0 : this.data.sellerPaymentTermDays,
       "paymentTermDays":this.data.paymentTermDays ==null ?0 :this.data.paymentTermDays,
      "paymentTermInfo":this.data.paymentTermInfo,
      "buyerPaymentTermDays": this.data.buyerPaymentTermDays,
      "destinationId": this.data.destinationId,
      "containerId": this.data.containerId,
      "count": this.data.count,
      "contractDeliveryDates":[{
      "sellerDeliveryDateDay":this.data.sellerDeliveryDateDay == undefined? "" : this.data.sellerDeliveryDateDay,
      "sellerDeliveryDateMonth":this.data.sellerDeliveryDateMonth == undefined? "" :  this.data.sellerDeliveryDateMonth,
      "sellerDeliveryDateYear":this.data.sellerDeliveryDateYear == undefined? "" :  this.data.sellerDeliveryDateYear,
      "buyerDeliveryDateDay":this.data.buyerDeliveryDateDay == undefined? "" : this.data.buyerDeliveryDateDay,
      "buyerDeliveryDateMonth":this.data.buyerDeliveryDateMonth == undefined? "" :  this.data.buyerDeliveryDateMonth,
      "buyerDeliveryDateYear":this.data.buyerDeliveryDateYear == undefined? "" : this.data.buyerDeliveryDateYear,
      }
    ]
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
            this.router.navigate(['/FabCot/active-contract-details'], { queryParams: { id: this.response.data } });
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
