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
@Component({
  selector: 'app-price-term',
  templateUrl: './price-term.component.html',
  styleUrls: ['./price-term.component.css']
})
export class PriceTermComponent implements OnInit {
  response: any;
  rows: any = [];
  data: any = {};
  columns: any = [];
  listCount: number;
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
      return (d.term.toLowerCase().indexOf(val) !== -1 || !val);
    });

    // update the rows
    this.rows = temp;
    // Whenever the filter changes, always go back to the first page
    // this.table.offset = 0;
  }

  fetch(cb) {
    let that = this;
    that.http
      .get(`${environment.apiUrl}/api/Products/GetAllPriceTerm`)
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







  deletePrice(id) {
    Swal.fire({
      title: GlobalConstants.deleteTitle, //'Are you sure?',
      text: GlobalConstants.deleteMessage+' '+'"'+ id.term +'"',
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

        this.http.delete(`${environment.apiUrl}/api/Products/DeletePriceTerm/` + id.id)
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

  addPriceForm() {
    const modalRef = this.modalService.open(AddPriceComponent, { centered: true });
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


  editPriceForm(row) {
    const modalRef = this.modalService.open(EditPriceComponent, { centered: true });
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

  exportAsXLSX(): void {
    const filtered = this.data.map(row => ({
      SNo:row.id,
    PriceTerms :row.term,
     Details:row.description,
  Status:row.active == true ? "Active" : "In-Active",
  LastChange :row.updatedDateTime + '|' + row.updatedByName 
  
  
    }));
   
    this.service.exportAsExcelFile(filtered, 'Price Term');
  
  }

// pdf ///

generatePDF() {

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
          widths: [30, 100, 80, 50, 150 ],
          body: [
            ['S.no.', 'Price Term', 'Details', 'Status', 'Update Date Time | Updated By' ],
            ...this.data.map(row => (
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

// print
printPdf() {

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
          widths: [30, 100, 80, 50, 150 ],
          body: [
            ['S.no.', 'Price Term', 'Details', 'Status', 'Update Date Time | Updated By' ],
            ...this.data.map(row => (
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



}

