import { Component, OnInit, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddTypeComponent } from './add-type/add-type.component';
import { EditTypeComponent } from './edit-type/edit-type.component';
import { ServiceService } from 'src/app/shared/service.service';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { GlobalConstants } from 'src/app/Common/global-constants';
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { ClipboardService } from 'ngx-clipboard';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-fabric-type',
  templateUrl: './fabric-type.component.html',
  styleUrls: ['./fabric-type.component.css']
})

export class FabricTypeComponent implements OnInit {

  response: any;
  rows: any = [];
  copyData: any = [];
  data: any = {};
  columns: any = [];
  fabricTypeCount: number;
  fabricFilter: any[];
  fabricTypeUrl = '/api/Products/GetAllFabricType'


  constructor(private http: HttpClient,
    private toastr: ToastrService,
    private _clipboardService: ClipboardService,
    private service: ServiceService,
    private modalService: NgbModal,) { }

  ngOnInit(): void {
    this.service.fetch((data) => {
      this.rows = data;
      this.fabricFilter = [...this.rows];

      this.fabricTypeCount = this.rows.length;
    }, this.fabricTypeUrl);
  }

  // --------------------------Search Function --------------------------------//

  search(event) {
    const val = event.target.value.toLowerCase();
    const temp = this.fabricFilter.filter(function (d) {
      return (d.type.toLowerCase().indexOf(val) !== -1 || !val);
    });
    this.rows = temp;
  }

  // ------------------------------ Delete Fabric Type ------------------------//

  deleteType(row) {
    Swal.fire({
      title: GlobalConstants.deleteTitle,
      text: GlobalConstants.deleteMessage + ' ' + '"' + row.type + '"',
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

        this.http.delete(`${environment.apiUrl}/api/Products/DeleteFabricType/` + row.id)
          .subscribe(
            res => {
              this.response = res;
              if (this.response.success == true) {
                this.toastr.error(GlobalConstants.deleteSuccess, 'Message.');
                this.service.fetch((data) => {
                  this.rows = data;
                  this.fabricTypeCount = this.rows.length;
                }, this.fabricTypeUrl);

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


  // --------------------------- Add Fabric Type form ----------------------------//

  addTypeForm() {
    const modalRef = this.modalService.open(AddTypeComponent, { centered: true });
    modalRef.result.then((data) => {
      // on close
      if (data == true) {
        //  this.date = this.myDate;
        this.service.fetch((data) => {
          this.rows = data;
      this.fabricFilter = [...this.rows];

          this.fabricTypeCount = this.rows.length;
        }, this.fabricTypeUrl);


      }
    }, (reason) => {
      // on dismiss
    });
  }

  // ------------------------- Edit Fabric Type Form ------------------------------//

  editTypeForm(row) {
    const modalRef = this.modalService.open(EditTypeComponent, { centered: true });
    modalRef.componentInstance.userId = row.id;
    modalRef.result.then((data) => {
      // on close
      if (data == true) {
        this.service.fetch((data) => {
          this.rows = data;
        }, this.fabricTypeUrl);

      }
    }, (reason) => {
      // on dismiss
    });
  }

  // -----------------------------Export as  excel File ----------------------------//

  fabricExcelFile() {

    const filtered = this.rows.map(row => ({
      SNo: row.id,
      FabricType: row.type,
      Details: row.description,
      Status: row.active == true ? "Active" : "In-Active",
      LastChange: row.createdDateTime + '|' + row.createdByName
    }));

    this.service.exportAsExcelFile(filtered, 'Fabric Type');

  }

    // -----------------------------Export as  CSV File ----------------------------//

    fabricCsvFile() {

      const filtered = this.rows.map(row => ({
        SNo: row.id,
        FabricType: row.type,
        Details: row.description,
        Status: row.active == true ? "Active" : "In-Active",
        LastChange: row.createdDateTime + '|' + row.createdByName
      }));
  
      this.service.exportAsCsvFile(filtered, 'Fabric Type');
  
    }

  //---------------------------------Export as  pdf ---------------------------------//

  fabricPdf() {

    let docDefinition = {
      pageSize: 'A4',
      info: {
        title: 'Fabric Type'
      },
      content: [
        {
          text: 'Fabric Type',
          style: 'heading',

        },

        {
          layout: 'lightHorizontalLines',
          table: {
            headerRows: 1,
            widths: [30, 100, 80, 40, 170],
            body: [
              ['S.no.', 'Fabric Type', 'Details', 'Status', 'Update Date Time | Updated By'],
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


    pdfMake.createPdf(docDefinition).download('FabricType.pdf');
  }

  //---------------------------------- print Fabric Type List--------------------------//

  printFabricList() {

    let docDefinition = {
      pageSize: 'A4',
      info: {
        title: 'Fabric Type'
      },
      content: [
        {
          text: 'Fabric Type',
          style: 'heading',

        },

        {
          layout: 'lightHorizontalLines',
          table: {
            headerRows: 1,
            widths: [30, 100, 80, 40, 170],
            body: [
              ['S.no.', 'Fabric Type', 'Details', 'Status', 'Update Date Time | Updated By'],
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


  copyFabricTypeList() {
      this.copyData.push('S. No.'.padEnd(10) + 'Fabric Type'.padEnd(10) +
      'Details'.padEnd(10)+'Status'.padEnd(10)+ 'Last Changed On' + '|Updated By \n');

    for (let i = 0; i < this.rows.length; i++) {
      let tempData =  this.rows[i].id
        +''.padEnd(5)
      + this.rows[i].type
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
      footer: 'Copied' + '\n' + this.fabricTypeCount + '\n' + 'rows to clipboard',
      showConfirmButton: false,
      timer: 2000,
    })
  }

}
