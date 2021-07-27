import { Component, OnInit, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddPaymentComponent } from './add-payment/add-payment.component';
import { EditPaymentComponent } from './edit-payment/edit-payment.component';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { GlobalConstants } from 'src/app/Common/global-constants';
import { ServiceService } from 'src/app/shared/service.service';
import { listenerCount } from 'events';
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { ClipboardService } from 'ngx-clipboard';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-payment-term',
  templateUrl: './payment-term.component.html',
  styleUrls: ['./payment-term.component.css']
})

export class PaymentTermComponent implements OnInit {

  response: any;
  copyData: any = [];
  rows: any = [];
  data: any = {};
  columns: any = [];
  paymentTermCount: number;
  myDate = Date.now();
  paymentTermFilter: any[];
  inActiveRecord: any = [];
  activeRecord: any = [];
  paymentTermUrl = '/api/Products/GetAllPaymentTerm'

  constructor(private http: HttpClient,
    private toastr: ToastrService,
    private _clipboardService: ClipboardService,
    private service: ServiceService,
    private modalService: NgbModal,) { }


  ngOnInit(): void {
    this.service.fetch((data) => {
      this.rows = data;
      this.paymentTermFilter = [...this.rows];

      this.paymentTermCount = this.rows.length;
    }, this.paymentTermUrl);
  }
  activeInactive(event){
    if(event.target.value == "InActive"){
     this.inActiveRecord = this.paymentTermFilter.filter(x=>x.active == false); 
      this.rows =this.inActiveRecord 
    }
    else if(event.target.value == "Active"){
     this.activeRecord = this.paymentTermFilter.filter(x=>x.active == true); 
      this.rows =this.activeRecord; 
    }
   }
  // ---------------------------------Search Function ------------------------------//

  search(event) {
    const val = event.target.value.toLowerCase();
    const temp = this.paymentTermFilter.filter(function (d) {
      return (d.term.toLowerCase().indexOf(val) !== -1 || !val);
    });
    this.rows = temp;

  }

  // -------------------------------- Delete Payment Term ---------------------------//

  deletePayment(id) {
    Swal.fire({
      title: GlobalConstants.deleteTitle, //'Are you sure?',
      text: GlobalConstants.deleteMessage + ' ' + '"' + id.term + '"',
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

        this.http.delete(`${environment.apiUrl}/api/Products/DeletePaymentTerm/` + id.id)
          .subscribe(
            res => {
              this.response = res;
              if (this.response.success == true) {
                this.toastr.error(this.response.message, 'Message.');
                this.service.fetch((data) => {
                  this.rows = data;
                  this.paymentTermFilter = [...this.rows];
            
                  this.paymentTermCount = this.rows.length;
                }, this.paymentTermUrl);

              }
              else {
                this.toastr.error(GlobalConstants.exceptionMessage, 'Message.');
              }

            }, err => {
              if (err.status == 400) {
                this.toastr.error(this.response.message, 'Message.');
              }
            });
      }
    })

  }

  // ---------------------------- Add Payment Term Form --------------------------------//

  addPaymentForm() {
    const modalRef = this.modalService.open(AddPaymentComponent, { centered: true });
    modalRef.result.then((data) => {
      // on close
      if (data == true) {
       
      }
      this.service.fetch((data) => {
        this.rows = data;
    this.paymentTermFilter = [...this.rows];

        this.paymentTermCount = this.rows.length;
      }, this.paymentTermUrl);
    }, (reason) => {
      // on dismiss
    });
  }

  // -------------------------------- Edit Payment Term Form ------------------------//

  editPaymentForm(row) {
    const modalRef = this.modalService.open(EditPaymentComponent, { centered: true });
    modalRef.componentInstance.userId = row.id;
    modalRef.result.then((data) => {
      // on close
      if (data == true) {
       

      }
      this.service.fetch((data) => {
        this.rows = data;
      }, this.paymentTermUrl);
    }, (reason) => {
      // on dismiss
    });
  }

  // ----------------------------------Export as Excel File --------------------------//

  paymentExcelFile() {

    const filtered = this.rows.map(row => ({
      SNo: row.id,
      PaymentTerm: row.term,
      Details: row.description,
      Status: row.active == true ? "Active" : "In-Active",
      LastChange: row.updatedDateTime + '|' + row.updatedByName
    }));

    this.service.exportAsExcelFile(filtered, 'Payment Term');

  }

  // ----------------------------------Export as CSV File --------------------------//

  paymentCsvFile() {

    const filtered = this.rows.map(row => ({
      SNo: row.id,
      PaymentTerm: row.term,
      Details: row.description,
      Status: row.active == true ? "Active" : "In-Active",
      LastChange: row.updatedDateTime + '|' + row.updatedByName
    }));

    this.service.exportAsCsvFile(filtered, 'Payment Term');

  }

  //------------------------------------Export as Pdf -------------------------------//

  paymentPdf() {

    let docDefinition = {
      pageSize: 'A4',
      info: {
        title: 'Payment Term List'
      },
      content: [
        {
          text: 'Payment Term List',
          style: 'heading',

        },

        {
          layout: 'lightHorizontalLines',
          table: {
            headerRows: 1,
            widths: [30, 80, 80, 50, 170],
            body: [
              ['S.no.', 'Payment Term', 'Details', 'Status', 'Update Date Time | Updated By'],
              ...this.rows.map(row => (
                [row.id, row.term, row.description, row.active == true ? "Active" : "In-Active",
                row.updatedDateTime + '|' + row.updatedByName
                ]
              ))
            ]
          }
        }
      ],
      styles: {
        heading: {
          fontSize: 18,
          alignment: 'center',
          margin: [0, 15, 0, 30]
        }
      }

    };


    pdfMake.createPdf(docDefinition).download('PaymentTerm.pdf');
  }

  //--------------------------------  print Payment Term List --------------------------//

  printPaymentList() {

    let docDefinition = {
      pageSize: 'A4',
      info: {
        title: 'Payment Term List'
      },
      content: [
        {
          text: 'Payment Term List',
          style: 'heading',

        },

        {
          layout: 'lightHorizontalLines',
          table: {
            headerRows: 1,
            widths: [30, 80, 80, 50, 170],
            body: [
              ['S.no.', 'Price Terms', 'Details', 'Status', 'Last Changed On | Updated By'],
              ...this.rows.map(row => (
                [row.id, row.term, row.description, row.active == true ? "Active" : "In-Active",
                row.updatedDateTime + '|' + row.updatedByName
                ]
              ))
            ]
          }
        }
      ],
      styles: {
        heading: {
          fontSize: 18,
          alignment: 'center',
          margin: [0, 15, 0, 30]
        }
      }

    };


    pdfMake.createPdf(docDefinition).print();
  }


  copyPaymentTermList() {
    this.copyData.push('S. No.'.padEnd(10) + 'Price Terms'.padEnd(10) +
    'Details'.padEnd(10)+'Status'.padEnd(10)+ 'Last Changed On' + '|Updated By \n');

  for (let i = 0; i < this.rows.length; i++) {
    let tempData =  this.rows[i].id
      +''.padEnd(5)
    + this.rows[i].term
    +''.padEnd(5)
    + this.rows[i].description
    +''.padEnd(5)
    + this.rows[i].active
    +''.padEnd(5)
    + this.rows[i].updatedDateTime
    +''.padEnd(5)
    + this.rows[i].updatedByName+
     '\n';
    this.copyData.push(tempData);
  }
  this._clipboardService.copy(this.copyData)

  Swal.fire({
    title: GlobalConstants.copySuccess,
    footer: 'Copied' + '\n' + this.paymentTermCount + '\n' + 'rows to clipboard',
    showConfirmButton: false,
    timer: 2000,
  })
}



}