import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { GlobalConstants } from 'src/app/Common/global-constants';
import { EnquiryItemsComponent } from 'src/app/shared/MODLES/enquiry-items/enquiry-items.component';
import { QuotationComponent } from 'src/app/shared/MODLES/quotation/quotation.component';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-edit-active-enquiry',
  templateUrl: './edit-active-enquiry.component.html',
  styleUrls: ['./edit-active-enquiry.component.css']
})
export class EditActiveEnquiryComponent implements OnInit {
  enquiryToggle: boolean = false;
  currencyToggle: boolean = false;
  vendorToggle: boolean = false;
  orderToggle: boolean = false;
  remarksToggle: boolean = false;
  queryParems: any = {};
  objEnquiry: any = {};
  data: any = {};
  response: any;
  enquiryItem: any = [];
  temp: any[];

  obj: any;
  x: any;


  constructor(

    private route: ActivatedRoute,
    private modalService: NgbModal,
    private http: HttpClient,
    private toastr: ToastrService,

  ) { }

  ngOnInit(): void {

    this.queryParems = this.route.snapshot.queryParams;
    this.objEnquiry = this.queryParems;
    this.editEnquiry(this.objEnquiry)

    // this.getAllEnquiryItems();
  }




  editEnquiry(row) {
    this.http.get(`${environment.apiUrl}/api/Enquiries/GetEnquiryById/` + row.id)
      .subscribe(
        res => {
          this.response = res;
          if (this.response.success == true) {
            this.enquiryItem = this.response.data;
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
    modalRef.result.then((data) => {
      // on close
      if (data == true) {

      }
    }, (reason) => {
      // on dismiss
    });
  }


  editQuotationform(check) {
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





  addEnquiryItemform(check, enquiryObj) {
    const modalRef = this.modalService.open(EnquiryItemsComponent, { centered: true });
    modalRef.componentInstance.EnquiryId = enquiryObj.id;
    modalRef.componentInstance.statusCheck = check;
    modalRef.result.then((data) => {
      // on close
      if (data == true) {
        // this.getAllEnquiryItems();

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
