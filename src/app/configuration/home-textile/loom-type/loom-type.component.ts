import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import { AddLoomTypeComponent } from './add-loom-type/add-loom-type.component';
import { EditLoomTypeComponent } from './edit-loom-type/edit-loom-type.component';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { GlobalConstants } from 'src/app/Common/global-constants';
import { ServiceService } from 'src/app/shared/service.service';
import pdfMake from "pdfmake/build/pdfmake";
@Component({
  selector: 'app-loom-type',
  templateUrl: './loom-type.component.html',
  styleUrls: ['./loom-type.component.css']
})
export class LoomTypeComponent implements OnInit {

  response: any;
  rows: any = [];
  columns: any = [];
  data: any = {};
  loomCount: number;
  loomFilter: any = [];
  loomUrl = '/api/TextileGarments/GetAllLoomType'
  constructor(private http: HttpClient,
    private toastr: ToastrService,
    private service:ServiceService,
    private modalService: NgbModal) { }

  ngOnInit(): void {
    this.service.fetch((data) => {
      this.loomFilter = [...data];
      this.rows = data;
      this.loomCount = this.rows.length;
    } , this.loomUrl);
  }

  updateFilter(event) {
    const val = event.target.value.toLowerCase();

    // filter our data
    const temp = this.loomFilter.filter(function (d) {
      return d.type.toLowerCase().indexOf(val) !== -1 || !val;
    });

    // update the rows
    this.rows = temp;
    // Whenever the filter changes, always go back to the first page
    // this.table.offset = 0;
  }
  deleteLoom(id) {
    Swal.fire({
      title: GlobalConstants.deleteTitle, //'Are you sure?',
      text: GlobalConstants.deleteMessage+' '+'"'+ id.type +'"',
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

        this.http.delete(`${environment.apiUrl}/api/TextileGarments/DeleteLoomType/` + id.id)
          .subscribe(
            res => {
              this.response = res;
              if (this.response.success == true) {
                this.toastr.error(GlobalConstants.deleteSuccess, 'Message.');
                this.service.fetch((data) => {
                  this.rows = data;
                  this.loomCount = this.rows.length;
                } , this.loomUrl);

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



  addLoomForm() {
    const modalRef = this.modalService.open(AddLoomTypeComponent, { centered: true });
    modalRef.result.then((data) => {
      // on close
      if (data == true) {
        //  this.date = this.myDate;
        this.service.fetch((data) => {
          this.rows = data;
          this.loomCount = this.rows.length;
        } , this.loomUrl);


      }
    }, (reason) => {
      // on dismiss
    });
  }


  editLoomForm(row) {
    const modalRef = this.modalService.open(EditLoomTypeComponent, { centered: true });
    modalRef.componentInstance.userId = row.id;
    modalRef.result.then((data) => {
      // on close
      if (data == true) {
        //  this.date = this.myDate;
        this.service.fetch((data) => {
          this.rows = data;
        } , this.loomUrl);

      }
    }, (reason) => {
      // on dismiss
    });
  }
// excel ///
  exportAsXLSX(): void {
    const filtered = this.data.map(row => ({
      SNo:row.id,
    LoomType :row.type,
     Details:row.description,
  Status:row.active == true ? "Active" : "In-Active",
  LastChange :row.updatedDateTime + '|' + row.updatedByName 
   }));
   
    this.service.exportAsExcelFile(filtered, 'Loom Type');
  
  }

  // pdf ////
  generatePDF() {

    let docDefinition = {
      pageSize: 'A4',
      info: {
        title: 'Loom Type List'
      },
      content: [
        {
          text: 'Loom Type List',
          style: 'heading',
  
        },
  
        {
          layout: 'lightHorizontalLines',
          table: {
            headerRows: 1,
            widths: [30, 80, 80, 50, 170 ],
            body: [
              ['S.no.', 'Loom Type', 'Details', 'Status', 'Update Date Time | Updated By' ],
              ...this.data.map(row => (
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
  
  
    pdfMake.createPdf(docDefinition).download('LoomType.pdf');
  }

  // print

  printPdf() {

    let docDefinition = {
      pageSize: 'A4',
      info: {
        title: 'Loom Type List'
      },
      content: [
        {
          text: 'Loom Type List',
          style: 'heading',
  
        },
  
        {
          layout: 'lightHorizontalLines',
          table: {
            headerRows: 1,
            widths: [30, 80, 80, 50, 170 ],
            body: [
              ['S.no.', 'Loom Type', 'Details', 'Status', 'Update Date Time | Updated By' ],
              ...this.data.map(row => (
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

