import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import { AddColorComponent } from './add-color/add-color.component';
import { EditColorComponent } from './edit-color/edit-color.component';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { GlobalConstants } from 'src/app/Common/global-constants';
import { ServiceService } from 'src/app/shared/service.service';
import pdfMake from "pdfmake/build/pdfmake";
@Component({
  selector: 'app-color',
  templateUrl: './color.component.html',
  styleUrls: ['./color.component.css']
})
export class ColorComponent implements OnInit {
  response:any;
  rows:any=[];
  columns:any=[];
  data:any={};
  clrCount: number;
  clrFilter: any=[];
  clrUrl = '/api/TextileGarments/GetAllColor'
  constructor(private http:HttpClient,
              private toastr: ToastrService,
              private service:ServiceService,
              private modalService: NgbModal) { }

  ngOnInit(): void {
    this.service.fetch((data) => {
      this.clrFilter = [...data];
      this.rows = data;
      this.clrCount = this.rows.length;
    } , this.clrUrl);
  }



  updateFilter(event) {
    const val = event.target.value.toLowerCase();

    // filter our data
    const temp = this.clrFilter.filter(function (d) {
      return d.name.toLowerCase().indexOf(val) !== -1  || !val;
    });
 
    // update the rows
    this.rows = temp;
    // Whenever the filter changes, always go back to the first page
    // this.table.offset = 0;
  }

  
  deleteColor(id){
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
    
        this.http.delete(`${environment.apiUrl}/api/TextileGarments/DeleteColor/`+id.id )
        .subscribe(
          res=> { 
            this.response = res;
            if (this.response.success == true){
             this.toastr.error(this.response.message, 'Message.');
             this.service.fetch((data) => {
              this.rows = data;
              this.clrCount = this.rows.length;
            } , this.clrUrl);
              
            }
            else {
              this.toastr.error(this.response.message, 'Message.');
                }
     
          }, err => {
            if (err.status == 400) {
              this.toastr.error(this.response.message, 'Message.');
            }
          });
      }
    })
    
    }
  addColorForm(){
    const modalRef = this.modalService.open(AddColorComponent, { centered: true });
          modalRef.result.then((data) => {
         // on close
          if(data ==true){
          //  this.date = this.myDate;
           this.service.fetch((data) => {
            this.rows = data;
            this.clrCount = this.rows.length;
          } , this.clrUrl);
           
  
         }
       }, (reason) => {
         // on dismiss
       });
  } 
  

  editColorForm(row){
    const modalRef = this.modalService.open(EditColorComponent, { centered: true });
    modalRef.componentInstance.userId =row.id;
          modalRef.result.then((data) => {
         // on close
          if(data ==true){
          //  this.date = this.myDate;
           this.service.fetch((data) => {
            this.rows = data;
          } , this.clrUrl);
           
         }
       }, (reason) => {
         // on dismiss
       });
  } 
  // excel
  exportAsXLSX(): void {
    const filtered = this.data.map(row => ({
      SNo:row.id,
    ColorName :row.name,
     Details:row.description,
  Status:row.active == true ? "Active" : "In-Active",
  LastChange :row.updatedDateTime + '|' + row.updatedByName 
   }));
   
    this.service.exportAsExcelFile(filtered, 'Color');
  
  }

  // pdf //
  generatePDF() {

    let docDefinition = {
      pageSize: 'A4',
      info: {
        title: 'Color List'
      },
      content: [
        {
          text: 'Color List',
          style: 'heading',

        },

        {
          layout: 'lightHorizontalLines',
          table: {
            headerRows: 1,
            widths: [30, 80, 80, 50, 170 ],
            body: [
              ['S.no.', 'Color Name', 'Details', 'Status', 'Update Date Time | Updated By' ],
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


    pdfMake.createPdf(docDefinition).download('ColorList.pdf');
  }

// print

printPdf() {

  let docDefinition = {
    pageSize: 'A4',
    info: {
      title: 'Color List'
    },
    content: [
      {
        text: 'Color List',
        style: 'heading',

      },

      {
        layout: 'lightHorizontalLines',
        table: {
          headerRows: 1,
          widths: [30, 80, 80, 50, 170 ],
          body: [
            ['S.no.', 'Color Name', 'Details', 'Status', 'Update Date Time | Updated By' ],
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

