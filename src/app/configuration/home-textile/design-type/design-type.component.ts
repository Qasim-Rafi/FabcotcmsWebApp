import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddDesignTypeComponent } from './add-design-type/add-design-type.component';
import { EditDesignTypeComponent } from './edit-design-type/edit-design-type.component';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { GlobalConstants } from 'src/app/Common/global-constants';
import { ServiceService } from 'src/app/shared/service.service';
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-design-type',
  templateUrl: './design-type.component.html',
  styleUrls: ['./design-type.component.css']
})

export class DesignTypeComponent implements OnInit {

  response: any;
  rows: any = [];
  columns: any = [];
  data: any = {};
  designCount: number;
  designFilter: any = [];
  designUrl = '/api/TextileGarments/GetAllDesignType'

  constructor(private http: HttpClient,
    private toastr: ToastrService,
    private service: ServiceService,
    private modalService: NgbModal) { }

  ngOnInit(): void {
    this.service.fetch((data) => {
      this.designFilter = [...data];
      this.rows = data;
      this.designCount = this.rows.length;
    }, this.designUrl);
  }

  // ----------------------------- Search Function ------------------------//

  search(event) {
    const val = event.target.value.toLowerCase();
    const temp = this.designFilter.filter(function (d) {
      return (d.type.toLowerCase().indexOf(val) !== -1 || !val);
    });

    this.rows = temp;
  }

  // ----------------------------- Delete Design Type ----------------------------//

  deleteDesignType(id) {
    Swal.fire({
      title: GlobalConstants.deleteTitle, //'Are you sure?',
      text: GlobalConstants.deleteMessage + ' ' + '"' + id.type + '"',
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

        this.http.delete(`${environment.apiUrl}/api/TextileGarments/DeleteDesignType/` + id.id)
          .subscribe(
            res => {
              this.response = res;
              if (this.response.success == true) {
                this.toastr.error(GlobalConstants.deleteSuccess, 'Message.');
                this.service.fetch((data) => {
                  this.rows = data;
                  this.designCount = this.rows.length;
                }, this.designUrl);

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

  // ---------------------------- Add Design Type Form -----------------------------//

  addDesignTypeForm() {
    const modalRef = this.modalService.open(AddDesignTypeComponent, { centered: true });
    modalRef.result.then((data) => {
      // on close
      if (data == true) {
        this.service.fetch((data) => {
          this.rows = data;
          this.designCount = this.rows.length;
        }, this.designUrl);


      }
    }, (reason) => {
      // on dismiss
    });
  }

  // ------------------------------ Edit Design Type Form ------------------------//

  editDesignTypeForm(row) {
    const modalRef = this.modalService.open(EditDesignTypeComponent, { centered: true });
    modalRef.componentInstance.userId = row.id;
    modalRef.result.then((data) => {
      // on close
      if (data == true) {
        this.service.fetch((data) => {
          this.rows = data;

        }, this.designUrl);

      }
    }, (reason) => {
      // on dismiss
    });
  }

  //-----------------------------Export As Excel file ------------------------------//

  designExcelFile() {

    const filtered = this.rows.map(row => ({
      SNo: row.id,
      DesignType: row.type,
      Details: row.description,
      Status: row.active == true ? "Active" : "In-Active",
      LastChange: row.updatedDateTime + '|' + row.updatedByName
    }));

    this.service.exportAsExcelFile(filtered, 'Design Type');

  }

  //-----------------------------Export As CSV file ------------------------------//

  designCsvFile() {

    const filtered = this.rows.map(row => ({
      SNo: row.id,
      DesignType: row.type,
      Details: row.description,
      Status: row.active == true ? "Active" : "In-Active",
      LastChange: row.updatedDateTime + '|' + row.updatedByName
    }));

    this.service.exportAsCsvFile(filtered, 'Design Type');

  }


  //---------------------Export as pdf----------------------------------------------- //

  designPdf() {

    let docDefinition = {
      pageSize: 'A4',
      info: {
        title: 'Design Type List'
      },
      content: [
        {
          text: 'Design Type List',
          style: 'heading',

        },

        {
          layout: 'lightHorizontalLines',
          table: {
            headerRows: 1,
            widths: [30, 80, 80, 50, 170],
            body: [
              ['S.no.', 'Design Type', 'Details', 'Status', 'Update Date Time | Updated By'],
              ...this.rows.map(row => (
                [row.id, row.type, row.description, row.active == true ? "Active" : "In-Active",
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


    pdfMake.createPdf(docDefinition).download('DesignType.pdf');
  }

  //----------------------------------------- print Design Type List --------------------//

  printDesignList() {

    let docDefinition = {
      pageSize: 'A4',
      info: {
        title: 'Design Type List'
      },
      content: [
        {
          text: 'Design Type List',
          style: 'heading',

        },

        {
          layout: 'lightHorizontalLines',
          table: {
            headerRows: 1,
            widths: [30, 80, 80, 50, 170],
            body: [
              ['S.no.', 'Design Type', 'Details', 'Status', 'Update Date Time | Updated By'],
              ...this.rows.map(row => (
                [row.id, row.type, row.description, row.active == true ? "Active" : "In-Active",
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


}

