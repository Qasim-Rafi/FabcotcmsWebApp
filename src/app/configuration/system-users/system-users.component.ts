import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
// import { EditCountryComponent } from './edit-country/edit-country.component';
import { GlobalConstants } from '../../Common/global-constants';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { ServiceService } from 'src/app/shared/service.service'
import { ClipboardService } from 'ngx-clipboard';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { AddEditSystemUserComponent } from './add-edit-system-user/add-edit-system-user.component';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-system-users',
  templateUrl: './system-users.component.html',
  styleUrls: ['./system-users.component.css']
})
export class SystemUsersComponent implements OnInit {
  response: any;
  rows: any = [];
  data: any = {};
  columns: any = [];
  copyData: any = [];
  currentDate = Date.now();
  systemUsersFilter: any = [];
  systemUsersUrl = '/api/Users/GetUsers'
  systemUsersCount:number;

  @ViewChild('myTable', { static: false }) table: DatatableComponent;

  constructor(private http: HttpClient,
    private toastr: ToastrService,
    private modalService: NgbModal,
    private service: ServiceService,
    private _clipboardService: ClipboardService) { }

  ngOnInit(): void {
    this.service.fetch((data) => {
      this.systemUsersFilter = [...data];
      this.rows = data;
      this.systemUsersCount = this.rows.length;
    }, this.systemUsersUrl);
  }

    // ------------------- Search function ----------------------------------//
    search(event) {
      const val = event.target.value.toLowerCase();
      const temp = this.systemUsersFilter.filter(function (d) {
        return (d.name.toLowerCase().indexOf(val) !== -1 || !val);
      });
      this.rows = temp;
    }

 //  ----------------------- Add country Form -----------------------//

 addSystemUserForm(check, name) {
  const modalRef = this.modalService.open(AddEditSystemUserComponent, { centered: true });
  modalRef.componentInstance.statusCheck = check;
  modalRef.componentInstance.FormName = name;
  modalRef.result.then((data) => {

    if (data == true) {
      this.service.fetch((data) => {
        this.rows = data;
        this.systemUsersCount = this.rows.length;
      }, this.systemUsersUrl);
    }
  }, (reason) => {
  });
}

// ---------------------- Edit Country Form ----------------------//


editSystemUserForm(row, check, name) {
  const modalRef = this.modalService.open(AddEditSystemUserComponent, { centered: true });
  modalRef.componentInstance.userId = row.id;
  modalRef.componentInstance.statusCheck = check;
  modalRef.componentInstance.FormName = name;
  modalRef.result.then((data) => {
    // on close
    if (data == true) {
      //  this.date = this.myDate;
      this.service.fetch((data) => {
        this.rows = data;
      }, this.systemUsersUrl);

    }
  }, (reason) => {
    // on dismiss
  });
}

 //  --------------------- Delete Country ---------------------------//

 deleteCountry(id) {

  // Swal.fire({
  //   title: GlobalConstants.deleteTitle, //'Are you sure?',
  //   text: GlobalConstants.deleteMessage + ' ' + '"' + id.name + '"',
  //   icon: 'error',
  //   showCancelButton: true,
  //   confirmButtonColor: '#ed5565',
  //   cancelButtonColor: '#dae0e5',
  //   cancelButtonText: 'No',
  //   confirmButtonText: 'Yes',
  //   reverseButtons: true,
  //   position: 'top',
  // }).then((result) => {
  //   if (result.isConfirmed) {

  //     this.http.delete(`${environment.apiUrl}/api/Configs/DeleteCountry/` + id.id)
  //       .subscribe(
  //         res => {
  //           this.response = res;
  //           if (this.response.success == true) {
  //             this.toastr.error(GlobalConstants.deleteSuccess, 'Message.');
  //             this.service.fetch((data) => {
  //               this.rows = data;
  //             }, this.CountryUrl);

  //           }
  //           else {
  //             this.toastr.error(GlobalConstants.exceptionMessage, 'Message.');
  //           }

  //         }, err => {
  //           if (err.status == 400) {
  //             this.toastr.error(this.response.message, 'Message.');
  //           }
  //         });
  //   }
  // })

}

     // --------------------------Export as Excel file----------------------------------//


     systemUserExcelFile(){
    const filtered = this.rows.map(row => ({
      Sno: row.id,
      FullName: row.fullName,
      UserName: row.username,
      Email: row.email,
      Department:row.department,
      UserType:row.role,
      Status: row.active == true ? "Active" : "In-Active",
      CreatedOn: row.createdDateTime + ' | ' + row.createdByName
    }));

    this.service.exportAsExcelFile(filtered, 'Countries');

  }

// -------------------------------- Export as CSV file --------------------------------//

systemUserrCsvFile(){
  const filtered = this.rows.map(row => ({
    Sno: row.id,
    FullName: row.fullName,
    UserName: row.username,
    Email: row.email,
    Department:row.department,
    UserType:row.role,
    Status: row.active == true ? "Active" : "In-Active",
    CreatedOn: row.createdDateTime + ' | ' + row.createdByName
  }));

  this.service.exportAsCsvFile(filtered, 'Countries');

}

  // -------------------------------Export as Pdf  ------------------------------------//

  systemUserPdf() {

    let docDefinition = {
      pageSize: 'A4',
      pageOrientation: 'landscape',
      info: {
        title: 'User List'
      },
      content: [
        {
          text: 'User List',
          style: 'heading',

        },

        {
          layout: 'lightHorizontalLines',
          table: {
            headerRows: 1,
            widths: [30, 90,90, 130, 90,90,40, 140],
            body: [
              ['S.no.', 'FullName', 'UserName', 'Email', 'Department', 'UserType', 'Status', 'Created On| Created By'],
              ...this.rows.map(row => (
                [row.id, row.fullName,
                   row.username,
                   row.email,
                   row.department,
                   row.role,
                row.active == true ? "Active" : "In-Active", row.createdDateTime + '|' + row.createdByName]
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


    pdfMake.createPdf(docDefinition).download('UserList.pdf');
  }

  //-------------------------------------- Print country List ------------------------- ///

  printSystemUserList() {

    let docDefinition = {
      pageSize: 'A4',
      pageOrientation: 'landscape',
      info: {
        title: 'User List'
      },
      content: [
        {
          text: 'User List',
          style: 'heading',

        },

        {
          layout: 'lightHorizontalLines',
          table: {
            headerRows: 1,
            widths: [30, 90,90, 130, 90,90,40, 140],
            body: [
              ['S.no.', 'FullName', 'UserName', 'Email', 'Department', 'UserType', 'Status', 'Created On| Created By'],
              ...this.rows.map(row => (
                [row.id,  row.fullName,
                  row.username,
                  row.email,
                  row.department,
                  row.role,
                row.active == true ? "Active" : "In-Active", row.createdDateTime + '|' + row.createdByName]
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

    // const win = window.open('', "tempWinForPdf");
    pdfMake.createPdf(docDefinition).print();

  }


  //------------------------------------ Copy Country list --------------------///

  copySystemUserList() {
    let count1 = this.rows.map(x => x.fullName.length);
    let max1 = count1.reduce((a, b) => Math.max(a, b));
    let count3 = this.rows.map(x => x.username.length);
    let max3 = count3.reduce((a, b) => Math.max(a, b));
    let count4 = this.rows.map(x => x.email.length);
    let max4 = count4.reduce((a, b) => Math.max(a, b));
    let count5 = this.rows.map(x => x.department.length);
    let max5 = count5.reduce((a, b) => Math.max(a, b));
    let count6 = this.rows.map(x => x.role.length);
    let max6 = count6.reduce((a, b) => Math.max(a, b));
    let count7 = this.rows.map(x => x.active == true ? "Active".length : "In-Active".length);
    let max7 = count7.reduce((a, b) => Math.max(a, b));
    max1 = max1 + 10;
    max3 = max3 + 10;
    max4 = max4 + 10;
    max5 = max5 + 10;
    max6 = max6 + 10;
    max7 = max7 + 10;

    // ................................................ headings replace yours............................

    this.copyData.push('S No.' + 'Full Name'.padEnd(max1) + 'User Name'.padEnd(max3) + 'Email'.padEnd(max4) +
     'Department'.padEnd(max5) + 'role'.padEnd(max6) +
    'Changed On' + '| Changed By \n');
    // ................................................ headings............................

    // ................................................ coloum data...........replace your coloum names.................
    for (let i = 0; i < this.rows.length; i++) {
      let tempData = this.rows[i].id + this.rows[i].fullName.padEnd(max1) + this.rows[i].username.padEnd(max3)
        + this.rows[i].email
        + this.rows[i].department
        + this.rows[i].role
        + this.rows[i].active
        + this.rows[i].createdDateTime + this.rows[i].createdByName + '\n';
      this.copyData.push(tempData);
    }
    this._clipboardService.copy(this.copyData)
    // ............................row.active == true ? "Active" : "In-Active".................... coloum this.data............................

    Swal.fire({
      title: GlobalConstants.copySuccess,
      footer: 'Copied' + '\n' + this.systemUsersCount + '\n' + 'rows to clipboard',
      showConfirmButton: false,
      timer: 2000,
    })
  }
}
// row.fullName,
// row.username,
// row.email,
// row.department,
// row.role,