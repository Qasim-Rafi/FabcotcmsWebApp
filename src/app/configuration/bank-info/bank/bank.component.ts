import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddBankComponent } from './add-bank/add-bank.component';
import { EditBankComponent } from './edit-bank/edit-bank.component';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { GlobalConstants } from 'src/app/Common/global-constants';
import { ServiceService } from 'src/app/shared/service.service';
import pdfMake from "pdfmake/build/pdfmake";
@Component({
  selector: 'app-bank',
  templateUrl: './bank.component.html',
  styleUrls: ['./bank.component.css']
})
export class BankComponent implements OnInit {
  listCount: number;
  response: any;
  rows: any = [];
  columns: any = [];
  data: any = {};
  myDate = Date.now();
  temp: any[];
 
  constructor(private http: HttpClient,
    private toastr: ToastrService,
    private service:ServiceService,
    private modalService: NgbModal,) { }

  ngOnInit(): void {
    this.fetch((data) => {
      this.temp = [...data];
      this.rows = data;
    });

  }


  updateFilter(event) {
    const val = event.target.value.toLowerCase();

    // filter our data
    const temp = this.temp.filter(function (d) {
      return (d.name.toLowerCase().indexOf(val) !== -1 ||
      d.branchName.toLowerCase().indexOf(val) !== -1 || !val);
    });

    // update the rows
    this.rows = temp;
    // Whenever the filter changes, always go back to the first page
    // this.table.offset = 0;
  }



  fetch(cb) {
    let that = this;
    that.http
      .get(`${environment.apiUrl}/api/Configs/GetAllBank`)
      .subscribe(res => {
        this.response = res;

        if (this.response.success == true) {
          that.data = this.response.data;
          this.listCount = this.response.data.length;
          cb(this.data);
        }
        else {
          this.toastr.error(this.response.message, 'Message.');
        }
        // this.spinner.hide();
      }, err => {
        if (err.status == 400) {
          this.toastr.error(err.error.message, 'Message.');;
        }
        //  this.spinner.hide();
      });
  }



  deleteBank(id) {
    Swal.fire({
      title: GlobalConstants.deleteTitle, //'Are you sure?',
      text: GlobalConstants.deleteMessage+' '+'"'+ id.name +'"',
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

        this.http.delete(`${environment.apiUrl}/api/Configs/DeleteBank/` + id.id)
          .subscribe(
            res => {
              this.response = res;
              if (this.response.success == true) {
                this.toastr.error(this.response.message, 'Message.');
                this.fetch((data) => {
                  this.rows = data;
                });

              }
              else {
                this.toastr.error('Something went Worng', 'Message.');
              }

            }, err => {
              if (err.status == 400) {
                this.toastr.error(this.response.message, 'Message.');
              }
            });

        // Swal.fire(
        //   'Record',
        //   'Deleted Successfully.',
        //   'success'
        // )
      }
    })

  }

  addBankForm() {
    const modalRef = this.modalService.open(AddBankComponent, { centered: true });
    modalRef.result.then((data) => {
      // on close
      if (data == true) {
        //  this.date = this.myDate;
        this.fetch((data) => {
          this.temp = [...data];
          this.rows = data;
          this.listCount = this.rows.length;
        });


      }
    }, (reason) => {
      // on dismiss
    });
  }


  editEditForm(row) {
    const modalRef = this.modalService.open(EditBankComponent, { centered: true });
    modalRef.componentInstance.userId = row.id;
    modalRef.result.then((data) => {
      // on close
      if (data == true) {
        //  this.date = this.myDate;
        this.fetch((data) => {
          this.rows = data;

        });

      }
    }, (reason) => {
      // on dismiss
    });
  }

// excel /////////

  exportAsXLSX(): void {
    const filtered = this.data.map(row => ({
      SNo:row.id,
    BankName :row.name,
    BranchCode :row.branchCode,
    BranchName :row.branchName,
    Location :row.location,
    Address :row.address,
     Details:row.details 
   }));
   
    this.service.exportAsExcelFile(filtered, 'Bank');
  
  }

  // pdf //////////
  generatePDF() {
   
        let docDefinition = {
          pageSize: 'A4',
          info: {
            title: 'Bank List'
          },
          content: [
            {
              text: 'Bank List',
              style: 'heading',
    
            },
    
            {
              layout: 'lightHorizontalLines',
              table: {
                headerRows: 1,
                widths: [30, 70, 70, 70, 50 , 60 , 60 ],
                body: [
                  ['S.no.', 'Bank Name', 'Branch Code', 'Branch Name', 'Location' , 'Address' , 'Details'],
                  ...this.data.map(row => (
                    [row.id, row.name, row.branchCode, row.branchName, 
                      row.location,row.address , 
                      row.details] 
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
        pdfMake.createPdf(docDefinition).download('BankList.pdf');
      }
    
//  print 
printPdf() {
   
  let docDefinition = {
    pageSize: 'A4',
    info: {
      title: 'Bank List'
    },
    content: [
      {
        text: 'Bank List',
        style: 'heading',

      },

      {
        layout: 'lightHorizontalLines',
        table: {
          headerRows: 1,
          widths: [30, 70, 70, 70, 50 , 60 , 60 ],
          body: [
            ['S.no.', 'Bank Name', 'Branch Code', 'Branch Name', 'Location' , 'Address' , 'Details'],
            ...this.data.map(row => (
              [row.id, row.name, row.branchCode, row.branchName, 
                row.location,row.address , 
                row.details] 
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

