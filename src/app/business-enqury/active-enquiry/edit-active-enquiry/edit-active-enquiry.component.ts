import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EnquiryItemsComponent } from 'src/app/shared/MODLES/enquiry-items/enquiry-items.component';
import { QuotationComponent } from 'src/app/shared/MODLES/quotation/quotation.component';

@Component({
  selector: 'app-edit-active-enquiry',
  templateUrl: './edit-active-enquiry.component.html',
  styleUrls: ['./edit-active-enquiry.component.css']
})
export class EditActiveEnquiryComponent implements OnInit {
  toggle: boolean = false;

  constructor(
    private modalService: NgbModal,
  ) { }

  ngOnInit(): void {
  }



  addEnquiryItemform(check) {
    const modalRef = this.modalService.open(EnquiryItemsComponent, { centered: true });
    // modalRef.componentInstance.parentBuyerId = popup.id;
    modalRef.componentInstance.statusCheck = check;
    modalRef.result.then((data) => {
      // on close
      if (data == true) {

      }
    }, (reason) => {
      // on dismiss
    });
  }


  EditEnquiryItemform(check) {
    const modalRef = this.modalService.open(EnquiryItemsComponent, { centered: true });
    // modalRef.componentInstance.parentBuyerId = popup.id;
    modalRef.componentInstance.statusCheck = check;
    modalRef.result.then((data) => {
      // on close
      if (data == true) {

      }
    }, (reason) => {
      // on dismiss
    });
  }




  addQuotationform(check) {
    const modalRef = this.modalService.open(QuotationComponent, { centered: true });
    // modalRef.componentInstance.parentBuyerId = popup.id;
    modalRef.componentInstance.statusCheck = check;
    modalRef.result.then((data) => {
      // on close
      if (data == true) {

      }
    }, (reason) => {
      // on dismiss
    });
  }



}
