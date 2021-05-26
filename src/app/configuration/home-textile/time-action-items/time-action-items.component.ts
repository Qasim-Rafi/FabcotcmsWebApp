import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import { AddTimeActionComponent } from './add-time-action/add-time-action.component';
import { EditTimeActionComponent } from './edit-time-action/edit-time-action.component';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { GlobalConstants } from 'src/app/Common/global-constants';
import { ServiceService } from 'src/app/shared/service.service';
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { ClipboardService } from 'ngx-clipboard';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-time-action-items',
  templateUrl: './time-action-items.component.html',
  styleUrls: ['./time-action-items.component.css']
})

export class TimeActionItemsComponent implements OnInit {

  response: any;
  rows: any = [];
  copyData: any = [];
  columns: any = [];
  data: any = {};
  TnaCount: number;
  TnaFilter: any = [];
  TnaUrl = '/api/TextileGarments/GetAllTnaAction'

  constructor(private http: HttpClient,
    private toastr: ToastrService,
    private _clipboardService: ClipboardService,
    private service: ServiceService,
    private modalService: NgbModal) { }

  ngOnInit(): void {
    this.service.fetch((data) => {
      this.rows = data;
      this.TnaFilter = [...this.rows];
      this.TnaCount = this.rows.length;
    } , this.TnaUrl);
  }

// ------------------------------ Search Function -------------------------//

  search(event) {
    const val = event.target.value.toLowerCase();

    const temp = this.TnaFilter.filter(function (d) {
      return d.name.toLowerCase().indexOf(val) !== -1 || !val;
    });

    this.rows = temp;
  }

  // ------------------------- Delete Action --------------------------------//

  deleteAction(id) {
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

        this.http.delete(`${environment.apiUrl}/api/TextileGarments/DeleteTnaAction/` + id.id)
          .subscribe(
            res => {
              this.response = res;
              if (this.response.success == true) {
                this.toastr.error(GlobalConstants.deleteSuccess, 'Message.');
                this.service.fetch((data) => {
                  this.rows = data;
                  this.TnaCount = this.rows.length;
                } , this.TnaUrl);

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

// --------------------------- Add Action Form---------------------------//

  addActionForm() {
    const modalRef = this.modalService.open(AddTimeActionComponent, { centered: true });
    modalRef.result.then((data) => {
      // on close
      if (data == true) {
        this.service.fetch((data) => {
          this.rows = data;
      this.TnaFilter = [...this.rows];

          this.TnaCount = this.rows.length;
        } , this.TnaUrl);


      }
    }, (reason) => {
      // on dismiss
    });
  }

  // ------------------------ Edit Action Form --------------------------//

  editActionForm(row) {
    const modalRef = this.modalService.open(EditTimeActionComponent, { centered: true });
    modalRef.componentInstance.userId = row.id;
    modalRef.result.then((data) => {
      // on close
      if (data == true) {
        this.service.fetch((data) => {
          this.rows = data;
        } , this.TnaUrl);

      }
    }, (reason) => {
      // on dismiss
    });
  }
// ------------------------------ Export as Excel File--------------------------//
 
tnaExcelFile(){
    const filtered = this.rows.map(row => ({
      SNo: row.id,
      ActionName: row.name,
      Details: row.description,
      LastChange: row.updatedDateTime + '|' + row.updatedByName
    }));

    this.service.exportAsExcelFile(filtered, 'TnA Actions');

  }


// -------------------------- Export as Csv File ----------------------------------//

tnaCsvFile(){
  const filtered = this.rows.map(row => ({
    SNo: row.id,
    ActionName: row.name,
    Details: row.description,
    LastChange: row.updatedDateTime + '|' + row.updatedByName
  }));

  this.service.exportAsCsvFile(filtered, 'TnA Actions');

}




// ------------------------ Export as PDF ------------------------------------//

tnaPdf() {
   
  let docDefinition = {
    pageSize: 'A4',
    info: {
      title: 'TnA List'
    },
    content: [
      {
        text: 'TnA List',
        style: 'heading',

      },

      {
        layout: 'lightHorizontalLines',
        table: {
          headerRows: 1,
          widths: [30, 100, 100, 170  ],
          body: [
            ['S.no.', 'Action Name', 'Details', 'Update Date Time | Update By '],
            ...this.rows.map(row => (
              [row.id, row.name, row.description, 
              row.updatedDateTime + '|' + row.updatedByName] 
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
  pdfMake.createPdf(docDefinition).download('TnA.pdf');
}

//----------------------------- print Tna List -----------------------------------// 

printTnaList() {
   
  let docDefinition = {
    pageSize: 'A4',
    info: {
      title: 'TnA List'
    },
    content: [
      {
        text: 'TnA List',
        style: 'heading',

      },

      {
        layout: 'lightHorizontalLines',
        table: {
          headerRows: 1,
          widths: [30, 100, 100, 170  ],
          body: [
            ['S.no.', 'Action Name', 'Details', 'Update Date Time | Update By '],
            ...this.rows.map(row => (
              [row.id, row.name, row.description, 
              row.updatedDateTime + '|' + row.updatedByName] 
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
copyTnAList() {
  this.copyData.push('S. No.'.padEnd(10) + 'Action Name'.padEnd(10) +
  'Details'.padEnd(10)+'Status'.padEnd(10)+ 'Last Changed On' + '|Updated By \n');

for (let i = 0; i < this.rows.length; i++) {
  let tempData =  this.rows[i].id
    +''.padEnd(5)
  + this.rows[i].name
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
  footer: 'Copied' + '\n' + this.TnaCount + '\n' + 'rows to clipboard',
  showConfirmButton: false,
  timer: 2000,
})
}


}

