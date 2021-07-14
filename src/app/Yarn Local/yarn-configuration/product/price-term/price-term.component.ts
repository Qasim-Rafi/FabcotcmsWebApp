import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddPriceComponent } from './add-price/add-price.component';
import { EditPriceComponent } from './edit-price/edit-price.component';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { GlobalConstants } from 'src/app/Common/global-constants';
import { ServiceService } from 'src/app/shared/service.service';
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { ClipboardService } from 'ngx-clipboard';
import { NgxSpinnerService } from 'ngx-spinner';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-price-term',
  templateUrl: './price-term.component.html',
  styleUrls: ['./price-term.component.css']
})

export class PriceTermComponent implements OnInit {

  response: any;
  rows: any = [];
  copyData: any = [];
  data: any = {};
  columns: any = [];
  priceTermCount: number;
  priceTermFilter: any[];
  PriceTermUrl = '/api/Products/GetAllPriceTerm'

  constructor(private http: HttpClient,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private _clipboardService: ClipboardService,
    private service: ServiceService,
    private modalService: NgbModal,) { }

  ngOnInit(): void {
    this.service.fetch((data) => {
      this.rows = data;
      this.priceTermFilter = [...this.rows];
       
      this.priceTermCount = this.rows.length;
    }, this.PriceTermUrl);
  }

  //--------------------------- Search Function ------------------------//

  search(event) {
    const val = event.target.value.toLowerCase();
    const temp = this.priceTermFilter.filter(function (d) {
      return (d.term.toLowerCase().indexOf(val) !== -1 || !val);
    });
    this.rows = temp;
  }

  // ---------------------------- Delete Price Term ------------------//

  deletePrice(id) {
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
this.spinner.show();
        this.http.delete(`${environment.apiUrl}/api/Products/DeletePriceTerm/` + id.id)
          .subscribe(
            res => {
              this.response = res;
              if (this.response.success == true) {
                this.toastr.error(GlobalConstants.deleteSuccess, 'Message.');
                this.service.fetch((data) => {
                  this.rows = data;
      this.priceTermCount = this.rows.length;

                }, this.PriceTermUrl);
this.spinner.hide();
              }
              else {
                this.toastr.error(GlobalConstants.exceptionMessage, 'Message.');
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

  // ----------------------------- Add Price Term Form -------------------------//

  addPriceForm() {
    const modalRef = this.modalService.open(AddPriceComponent, { centered: true });
    modalRef.result.then((data) => {
      // on close
      if (data == true) {

        


      }
      this.service.fetch((data) => {
        this.rows = data;
      this.priceTermCount = this.rows.length;

    this.priceTermFilter = [...this.rows];

      }, this.PriceTermUrl);
    }, (reason) => {
      // on dismiss
    });
  }

  // --------------------------Edit Price Term Form ------------------------------//

  editPriceForm(row) {
    const modalRef = this.modalService.open(EditPriceComponent, { centered: true });
    modalRef.componentInstance.userId = row.id;
    modalRef.result.then((data) => {
      // on close
      if (data == true) {
      

      }
      this.service.fetch((data) => {
        this.rows = data;
      }, this.PriceTermUrl);
    }, (reason) => {
      // on dismiss
    });
  }

  //-------------------------Export as  excel file --------------------------------//
  priceExcelFile() {
    const filtered = this.rows.map(row => ({
      SNo: row.id,
      PriceTerms: row.term,
      Details: row.description,
      Status: row.active == true ? "Active" : "In-Active",
      LastChange: row.updatedDateTime + '|' + row.updatedByName
    }));

    this.service.exportAsExcelFile(filtered, 'Price Term');

  }
 //-------------------------Export as  CSV file --------------------------------//
 priceCsvFile() {
  const filtered = this.rows.map(row => ({
    SNo: row.id,
    PriceTerms: row.term,
    Details: row.description,
    Status: row.active == true ? "Active" : "In-Active",
    LastChange: row.updatedDateTime + '|' + row.updatedByName
  }));

  this.service.exportAsCsvFile(filtered, 'Price Term');

}

  //---------------------------Export as  pdf --------------------------------------//

  pricePdf() {

    let docDefinition = {
      pageSize: 'A4',
      info: {
        title: 'Price Term List'
      },
      content: [
        {
          text: 'Price Term List',
          style: 'heading',

        },

        {
          layout: 'lightHorizontalLines',
          table: {
            headerRows: 1,
            widths: [30, 100, 80, 50, 150],
            body: [
              ['S.no.', 'Price Term', 'Details', 'Status', 'Update Date Time | Updated By'],
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


    pdfMake.createPdf(docDefinition).download('PriceTerm.pdf');
  }

  // -------------------------------print Price Term List --------------------------//

  printPriceList() {

    let docDefinition = {
      pageSize: 'A4',
      info: {
        title: 'Price Term List'
      },
      content: [
        {
          text: 'Price Term List',
          style: 'heading',

        },

        {
          layout: 'lightHorizontalLines',
          table: {
            headerRows: 1,
            widths: [30, 100, 80, 50, 150],
            body: [
              ['S.no.', 'Price Term', 'Details', 'Status', 'Update Date Time | Updated By'],
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

  copyPriceTermList() {
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
    footer: 'Copied' + '\n' + this.priceTermCount + '\n' + 'rows to clipboard',
    showConfirmButton: false,
    timer: 2000,
  })
}


}

