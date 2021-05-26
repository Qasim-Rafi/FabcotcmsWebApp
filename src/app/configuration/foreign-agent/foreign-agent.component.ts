import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddAgentFormComponent } from './add-agent-form/add-agent-form.component';
import { EditAgentFormComponent } from './edit-agent-form/edit-agent-form.component';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { GlobalConstants } from 'src/app/Common/global-constants';
import { ServiceService } from 'src/app/shared/service.service';
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { ClipboardService } from 'ngx-clipboard';
pdfMake.vfs = pdfFonts.pdfMake.vfs;


@Component({
  selector: 'app-foreign-agent',
  templateUrl: './foreign-agent.component.html',
  styleUrls: ['./foreign-agent.component.css']
})

export class ForeignAgentComponent implements OnInit {

  response: any;
  rows: any = [];
  columns: any = [];
  data: any = {};
  agentCount: number;
  copyData: any = [];
  date: number;
  myDate = Date.now();
  agentFilter: any[];
  agentUrl = '/api/Configs/GetAllExternalAgent'

  constructor(private http: HttpClient,
    private toastr: ToastrService,
    private _clipboardService: ClipboardService,
    private service: ServiceService,
    private modalService: NgbModal,) { }

  ngOnInit(): void {
    this.service.fetch((data) => {
      this.rows = data;
      this.agentFilter = [...this.rows];

      this.agentCount = this.rows.length
    }, this.agentUrl);
  }

  // -------------------------- Search Function -------------------------//

  search(event) {
    const val = event.target.value.toLowerCase();

    const temp = this.agentFilter.filter(function (d) {
      return (d.code.toLowerCase().indexOf(val) !== -1 ||

        d.name.toLowerCase().indexOf(val) !== -1 || !val);
    });

    this.rows = temp;

  }

  // ------------------------------- Delete Agent -------------------------//

  deleteAgent(id) {
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

        this.http.delete(`${environment.apiUrl}/api/Configs/DeleteExternalAgent/` + id.id)
          .subscribe(
            res => {
              this.response = res;
              if (this.response.success == true) {
                this.toastr.error(GlobalConstants.deleteSuccess, 'Message.');
                this.service.fetch((data) => {
                  this.rows = data;

                  this.agentCount = this.rows.length;
                }, this.agentUrl);

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

  // ---------------------------- Add Agent Form --------------------------------//

  addAgentForm() {
    const modalRef = this.modalService.open(AddAgentFormComponent, { centered: true });
    modalRef.result.then((data) => {
      // on close
      if (data == true) {
        this.date = this.myDate;
        this.service.fetch((data) => {
          this.rows = data;
          this.agentFilter = [...this.rows];

          this.agentCount = this.rows.length;
        }, this.agentUrl);


      }
    }, (reason) => {
      // on dismiss
    });
  }

  // ------------------------------ Edit Agent Form ---------------------------//

  editAgentForm(row) {
    const modalRef = this.modalService.open(EditAgentFormComponent, { centered: true });
    modalRef.componentInstance.userId = row.id;
    modalRef.result.then((data) => {
      // on close
      if (data == true) {
        this.date = this.myDate;
        this.service.fetch((data) => {
          this.rows = data;
        }, this.agentUrl);


      }
    }, (reason) => {
      // on dismiss
    });
  }

  //---------------------- Export as  excel File ----------------------------//

  agentExcelFile() {

    const filtered = this.rows.map(row => ({

      AgentCode: row.code,
      AgentName: row.name,
      AgentType: row.agentTypeId,
      Address: row.address,
      ContactNum: row.cellNumber,
      Email: row.emailAddress,
      Status: row.active == true ? "Active" : "In-Active",
      Side: row.agentSideId,
      LastChangedOn: row.updatedDateTime + '|' + row.createdByName

    }));

    this.service.exportAsExcelFile(filtered, 'Agent');

  }
 //---------------------- Export as  CSV File ----------------------------//

 agentCsvFile() {

  const filtered = this.rows.map(row => ({

    AgentCode: row.code,
    AgentName: row.name,
    AgentType: row.agentTypeId,
    Address: row.address,
    ContactNum: row.cellNumber,
    Email: row.emailAddress,
    Status: row.active == true ? "Active" : "In-Active",
    Side: row.agentSideId,
    LastChangedOn: row.updatedDateTime + '|' + row.createdByName

  }));

  this.service.exportAsCsvFile(filtered, 'Agent');

}

  //-------------------------- Export as Pdf-----------------------//

  agentPdf() {

    let docDefinition = {
      pageSize: 'A4',
      info: {
        title: 'Agent List'
      },
      content: [
        {
          text: 'Agent List',
          style: 'heading',

        },

        {
          layout: 'lightHorizontalLines',
          table: {
            headerRows: 1,
            widths: [30, 50, 40, 50, 50, 60, 40, 30, 70],
            body: [
              ['Agent Code', 'Agent Name', 'Agent Type', 'Address', 'Cell number', 'Email'
                , 'Status', 'Side', 'Last Update On'],
              ...this.rows.map(row => (
                [row.code, row.name, row.agentTypeId, row.address, row.cellNumber
                  , row.emailAddress, row.active == true ? "Active" : "In-Active",
                row.agentSideId,
                row.updatedDateTime + '|' + row.createdByName
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


    pdfMake.createPdf(docDefinition).download('AgentsList.pdf');
  }

  // ----------------------------------- print Agent List -------------------------------//

  printAgentList() {

    let docDefinition = {
      pageSize: 'A4',
      info: {
        title: 'Agent List'
      },
      content: [
        {
          text: 'Agent List',
          style: 'heading',

        },

        {
          layout: 'lightHorizontalLines',
          table: {
            headerRows: 1,
            widths: [30, 50, 40, 50, 50, 60, 40, 30, 70],
            body: [
              ['Agent Code', 'Agent Name', 'Agent Type', 'Address', 'Cell number', 'Email'
                , 'Status', 'Side', 'Last Update On'],
              ...this.rows.map(row => (
                [row.code, row.name, row.agentTypeId, row.address, row.cellNumber
                  , row.emailAddress, row.active == true ? "Active" : "In-Active",
                row.agentSideId,
                row.updatedDateTime + '|' + row.createdByName
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
  copyAgentList() {
   

    this.copyData.push('Agent Code'.padEnd(10) + 'Agent Name'.padEnd(10) +
      'Agent Type'.padEnd(10) + 'Address'.padEnd(10) + 'Email'.padEnd(10) + 'Contact No.'.padEnd(10)+'Status'.padEnd(10)+ 'Side'.padEnd(10) + 'Last Updated On' + '|By \n');

    for (let i = 0; i < this.rows.length; i++) {
      let tempData =  this.rows[i].code
        +''.padEnd(5)
      + this.rows[i].name
      +''.padEnd(5)
      + this.rows[i].agentTypeId
      +''.padEnd(5)
      + this.rows[i].address
      +''.padEnd(5)
      + this.rows[i].emailAddress
      +''.padEnd(5)
      + this.rows[i].cellNumber
      +''.padEnd(5)
      + this.rows[i].active
      +''.padEnd(5)
      + this.rows[i].agentSideId
      +''.padEnd(5)
      + this.rows[i].updatedDateTime
      +''.padEnd(5)
      + this.rows[i].createdByName+
       '\n';
      this.copyData.push(tempData);
    }
    this._clipboardService.copy(this.copyData)

    Swal.fire({
      title: GlobalConstants.copySuccess,
      footer: 'Copied' + '\n' + this.agentCount + '\n' + 'rows to clipboard',
      showConfirmButton: false,
      timer: 2000,
    })
  }

}
