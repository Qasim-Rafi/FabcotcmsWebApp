import { Component, OnInit, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EditCityComponent } from './edit-city/edit-city.component';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { GlobalConstants } from 'src/app/Common/global-constants';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { ServiceService } from 'src/app/shared/service.service';
import pdfMake from "pdfmake/build/pdfmake";  
import pdfFonts from "pdfmake/build/vfs_fonts";  
pdfMake.vfs = pdfFonts.pdfMake.vfs;  

@Component({
  selector: 'app-city',
  templateUrl: './city.component.html',
  styleUrls: ['./city.component.css']
})
export class CityComponent implements OnInit {
  CityCount: number;
  response: any;
  rows: any = [];
  // countryId= null;
  columns: any = [];
  data: any = [];
  data1: any =[];
  cityDate = Date.now();
   temp:any=[];
  @ViewChild('myTable') table: DatatableComponent;
  copydata: any;
  clipboardService: any=[];

  constructor(private http: HttpClient,
    private toastr: ToastrService,
    private service:ServiceService,
    private modalService: NgbModal) { }

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
      return ( d.name.toLowerCase().indexOf(val) !== -1  ||
      d.country.toLowerCase().indexOf(val) !== -1  || !val);
    });
 
    // update the rows
    this.rows = temp;
    // Whenever the filter changes, always go back to the first page
    // this.table.offset = 0;
  }


  fetch(cb) {
    let that = this;
    that.http
      .get(`${environment.apiUrl}/api/Configs/GetAllCity`)
      .subscribe(res => {
        this.response = res;

        if (this.response.success == true) {
          this.CityCount = this.response.data.length;
          that.data = this.response.data;
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




  deleteCity(id) {
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

        this.http.delete(`${environment.apiUrl}/api/Configs/DeleteCity/` + id.id)
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
                this.toastr.error(this.response.message, 'Message.');
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
  addCity(check,name) {
    const modalRef = this.modalService.open(EditCityComponent, { centered: true });
    modalRef.componentInstance.statusCheck =check;
    modalRef.componentInstance.FormName = name;

   //  modalRef.componentInstance.name =componentName;

       modalRef.result.then((data) => {
      // on close
       if(data ==true){
       //  this.date = this.cityDate;
        this.fetch((data) => {
         this.rows = data;
         this.CityCount = this.rows.length;
       });
        

      }
    }, (reason) => {
      // on dismiss
    });
  }


  editCity(row,check,name){
    const modalRef = this.modalService.open(EditCityComponent, { centered: true });
    modalRef.componentInstance.cityId =row.id; //just for edit.. to access the needed row
    modalRef.componentInstance.statusCheck = check;
    modalRef.componentInstance.FormName = name;

          modalRef.result.then((data) => {
         // on close
          if(data ==true){
          //  this.date = this.cityDate;
           this.fetch((data) => {
            this.rows = data;
          });
         }
       }, (reason) => {
         // on dismiss
       });
  } 

// excell
exportAsXLSX(): void {
  const filtered = this.data.map(row => ({
Sno :row.id,
City:row.name,
CountryName:row.country,
Details:row.details,
Status:row.active == true ? "Active" : "In-Active",
CreatedOn :row.createdDateTime + '|' + row.createdByName 

  }));
 
  this.service.exportAsExcelFile(filtered, 'City Location');

}
// pdf generation

generatePDF() {

  let docDefinition = {
    pageSize: 'A4',
    info: {
      title: 'City List'
    },
    content: [
      {
        text: 'City List',
        style: 'heading',

      },

      {
        layout: 'lightHorizontalLines',
        table: {
          headerRows: 1,
          widths: [30, 90, 130, 50, 150],
          body: [
            ['S.no.', 'City', 'Details', 'Status', 'Created On| Created By'],
            ...this.data.map(row => (
              [row.id, row.name, row.details, 
                row.active == true ? "Active" : "In-Active", row.createdDateTime+ '|'+ row.createdByName]
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


  pdfMake.createPdf(docDefinition).download('CityList.pdf');
}



  //   copyContent() {
    copy() {
      // let count = this.rows.map(x => x.id.length);
      // let max = count.reduce((a, b) => Math.max(a, b));

      let count1 = this.rows.map(x => x.name.length);
      let max1 = count1.reduce((a, b) => Math.max(a, b));
  
      let count2 = this.rows.map(x => x.country.length);
      let max2= count2.reduce((a, b) => Math.max(a, b));

      let count3 = this.rows.map(x => x.details.length);
      let max3 = count3.reduce((a, b) => Math.max(a, b));
      // max = max + 10;
      max1 = max1 + 10;
      max2 = max2 + 10;
      max3 = max3 + 10;
      // ................................................ headings replace yours............................
  
      this.data1.push('S No.' +'City Name'.padEnd(max1) +
      'Country'.padEnd(max2) + 'Details'.padEnd(max3)+ 'Changed On | Changed By \n');
      // ................................................ headings............................
  
      // ................................................ coloum data...........replace your coloum names.................
      for (let i = 0; i < this.rows.length; i++) {
        let data1 = this.rows[i].id+this.rows[i].name.padEnd(max1)+this.rows[i].country.padEnd(max2) 
        + this.rows[i].details.padEnd(max3)+ this.rows[i].updatedDateTime+'\n';
        this.data1.push(data1);
      }
      this.clipboardService.copy(this.data1)
      // ................................................ coloum this.data............................
  
    }
}

