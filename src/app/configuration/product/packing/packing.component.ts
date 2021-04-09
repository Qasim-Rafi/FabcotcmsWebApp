import { Component, OnInit, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddPackingComponent } from './add-packing/add-packing.component';
import { EditPackingComponent } from './edit-packing/edit-packing.component';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { GlobalConstants } from 'src/app/Common/global-constants';
import { ServiceService } from 'src/app/shared/service.service';
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-packing',
  templateUrl: './packing.component.html',
  styleUrls: ['./packing.component.css']
})

export class PackingComponent implements OnInit {

  response: any;
  rows: any = [];
  data: any = {};
  columns: any = [];
  packingCount: number;
  myDate = Date.now();
  packingFilter: any[];
  packingUrl = '/api/Products/GetAllPacking'

  constructor(private http: HttpClient,
    private toastr: ToastrService,
    private service: ServiceService,
    private modalService: NgbModal,) { }


  ngOnInit(): void {
    this.service.fetch((data) => {
      this.packingFilter = [...data];
      this.rows = data;
      this.packingCount = this.rows.length;
    }, this.packingUrl);
  }

  // ------------------------search Function ----------------------------//

  search(event) {
    const val = event.target.value.toLowerCase();
    const temp = this.packingFilter.filter(function (d) {
      return (d.name.toLowerCase().indexOf(val) !== -1 || !val);
    });
    this.rows = temp;
  }

  // --------------------------------- Delete Packing --------------------//

  deletePacking(id) {
    Swal.fire({
      title: GlobalConstants.deleteTitle, //'Are you sure?',
      text: GlobalConstants.deleteMessage + ' ' + '"' + id.name + '"',
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

        this.http.delete(`${environment.apiUrl}/api/Products/DeletePacking/` + id.id)
          .subscribe(
            res => {
              this.response = res;
              if (this.response.success == true) {
                this.toastr.error(GlobalConstants.deleteSuccess, 'Message.');
                this.service.fetch((data) => {
                  this.rows = data;

                  this.packingCount = this.rows.length;
                }, this.packingUrl);

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

  // -------------------------------- Add Packing Form --------------------------//

  addPackingForm() {
    const modalRef = this.modalService.open(AddPackingComponent, { centered: true });
    modalRef.result.then((data) => {
      // on close
      if (data == true) {
        //  this.date = this.myDate;
        this.service.fetch((data) => {
          this.rows = data;

          this.packingCount = this.rows.length;
        }, this.packingUrl);


      }
    }, (reason) => {
      // on dismiss
    });
  }

  // ------------------------------- Edit Packing Form ----------------------------------//

  editPackingForm(row) {
    const modalRef = this.modalService.open(EditPackingComponent, { centered: true });
    modalRef.componentInstance.userId = row.id;
    modalRef.result.then((data) => {
      // on close
      if (data == true) {

        this.service.fetch((data) => {
          this.rows = data;
        }, this.packingUrl);

      }
    }, (reason) => {
      // on dismiss
    });
  }

  // ----------------------------- Export as Excel File ---------------------------------//

  packingExcelFile() {

    const filtered = this.rows.map(row => ({
      SNo: row.id,
      PackingName: row.name,
      Details: row.description,
      Status: row.active == true ? "Active" : "In-Active",
      LastChange: row.updatedDateTime + '|' + row.updatedByName
    }));

    this.service.exportAsExcelFile(filtered, 'Packing');

  }

   // ----------------------------- Export as CSV File ---------------------------------//

   packingCsvFile() {

    const filtered = this.rows.map(row => ({
      SNo: row.id,
      PackingName: row.name,
      Details: row.description,
      Status: row.active == true ? "Active" : "In-Active",
      LastChange: row.updatedDateTime + '|' + row.updatedByName
    }));

    this.service.exportAsCsvFile(filtered, 'Packing');

  }


  //----------------------------------Export as  pdf -------------------------------------//

  packingPdf() {

    let docDefinition = {
      pageSize: 'A4',
      info: {
        title: 'Packing List'
      },
      content: [
        {
          text: 'Packing List',
          style: 'heading',

        },

        {
          layout: 'lightHorizontalLines',
          table: {
            headerRows: 1,
            widths: [30, 80, 80, 50, 170],
            body: [
              ['S.no.', 'Packing Name', 'Details', 'Status', 'Update Date Time | Updated By'],
              ...this.rows.map(row => (
                [row.id, row.name, row.description, row.active == true ? "Active" : "In-Active",
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


    pdfMake.createPdf(docDefinition).download('PackingList.pdf');
  }

  //------------------------------------- print Packing List -------------------------//

  printPackingList() {

    let docDefinition = {
      pageSize: 'A4',
      info: {
        title: 'Packing List'
      },
      content: [
        {
          text: 'Packing List',
          style: 'heading',

        },

        {
          layout: 'lightHorizontalLines',
          table: {
            headerRows: 1,
            widths: [30, 80, 80, 50, 170],
            body: [
              ['S.no.', 'Packing Name', 'Details', 'Status', 'Update Date Time | Updated By'],
              ...this.data.map(row => (
                [row.id, row.name, row.description, row.active == true ? "Active" : "In-Active",
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