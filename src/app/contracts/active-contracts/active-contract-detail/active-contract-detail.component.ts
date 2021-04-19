import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EnquiryNotesComponent } from 'src/app/shared/MODLES/enquiry-notes/enquiry-notes.component';
import { CommisionKickbackComponent } from './Active-Contract-Models/commision-kickback/commision-kickback.component';
import { DeliveryTimelineComponent } from './Active-Contract-Models/delivery-timeline/delivery-timeline.component';
import { EmployeeCommissionComponent } from './Active-Contract-Models/employee-commission/employee-commission.component';
import { LOCComponent } from './Active-Contract-Models/loc/loc.component';
import { PartiesComponent } from './Active-Contract-Models/parties/parties.component';
import { PaymentDeliveryComponent } from './Active-Contract-Models/payment-delivery/payment-delivery.component';
import { ProductAndSpecificationComponent } from './Active-Contract-Models/product-and-specification/product-and-specification.component';
import { PRODUCTPLANComponent } from './Active-Contract-Models/product-plan/product-plan.component';
import { QualityCostingComponent } from './Active-Contract-Models/quality-costing/quality-costing.component';
import { QuantityCostingComponent } from './Active-Contract-Models/quantity-costing/quantity-costing.component';
import { RemarksComponent } from './Active-Contract-Models/remarks/remarks.component';
import { SALEINVOICEComponent } from './Active-Contract-Models/sale-invoice/sale-invoice.component';

@Component({
  selector: 'app-active-contract-detail',
  templateUrl: './active-contract-detail.component.html',
  styleUrls: ['./active-contract-detail.component.css']
})
export class ActiveContractDetailComponent implements OnInit {

  constructor(
    private modalService: NgbModal,
  ) { }

  ngOnInit(): void {
  }


  
PartiesForm() {
  const modalRef = this.modalService.open(PartiesComponent, { centered: true });
  modalRef.result.then((data) => {
    // on close
    if (data == true) {

    }
  }, (reason) => {
    // on dismiss
  });
}


ProductANDSpecificationForm() {
  const modalRef = this.modalService.open(ProductAndSpecificationComponent, { centered: true });
  modalRef.result.then((data) => {
    // on close
    if (data == true) {

    }
  }, (reason) => {
    // on dismiss
  });
}

QuantityCosting() {
  const modalRef = this.modalService.open(QuantityCostingComponent, { centered: true });
  modalRef.result.then((data) => {
    // on close
    if (data == true) {

    }
  }, (reason) => {
    // on dismiss
  });
}


PaymentDelivery() {
  const modalRef = this.modalService.open(PaymentDeliveryComponent, { centered: true });
  modalRef.result.then((data) => {
    // on close
    if (data == true) {

    }
  }, (reason) => {
    // on dismiss
  });
}

DeliveryTimeline() {
  const modalRef = this.modalService.open(DeliveryTimelineComponent, { centered: true });
  modalRef.result.then((data) => {
    // on close
    if (data == true) {

    }
  }, (reason) => {
    // on dismiss
  });
}


CommissionKickback() {
  const modalRef = this.modalService.open(CommisionKickbackComponent, { centered: true });
  modalRef.result.then((data) => {
    // on close
    if (data == true) {

    }
  }, (reason) => {
    // on dismiss
  });
}


EmployeeCommission() {
  const modalRef = this.modalService.open(EmployeeCommissionComponent, { centered: true });
  modalRef.result.then((data) => {
    // on close
    if (data == true) {

    }
  }, (reason) => {
    // on dismiss
  });
}


Remarks() {
  const modalRef = this.modalService.open(RemarksComponent, { centered: true });
  modalRef.result.then((data) => {
    // on close
    if (data == true) {

    }
  }, (reason) => {
    // on dismiss
  });
}


//Forms in Different Tabs


LOCform() {
  const modalRef = this.modalService.open(LOCComponent, { centered: true });
  modalRef.result.then((data) => {
    // on close
    if (data == true) {

    }
  }, (reason) => {
    // on dismiss
  });
}


ProductionPlanform() {
  const modalRef = this.modalService.open(PRODUCTPLANComponent, { centered: true });
  modalRef.result.then((data) => {
    // on close
    if (data == true) {

    }
  }, (reason) => {
    // on dismiss
  });
}

saleInvoice() {
  const modalRef = this.modalService.open(SALEINVOICEComponent, { centered: true });
  modalRef.result.then((data) => {
    // on close
    if (data == true) {

    }
  }, (reason) => {
    // on dismiss
  });
}

Note() {
  const modalRef = this.modalService.open(EnquiryNotesComponent, { centered: true });
  modalRef.result.then((data) => {
    // on close
    if (data == true) {

    }
  }, (reason) => {
    // on dismiss
  });
}





}
