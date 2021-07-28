import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EditCurrencyComponent } from './edit-currency/edit-currency.component';
import { AddCurrencyComponent } from './add-currency/add-currency.component';
import Swal from 'sweetalert2/dist/sweetalert2.js'; 
import { GlobalConstants } from 'src/app/Common/global-constants';
import { ClipboardService } from 'ngx-clipboard';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-currency',
  templateUrl: './currency.component.html',
  styleUrls: ['./currency.component.css']
})
export class CurrencyComponent implements OnInit {

  listCount: number;
  response:any;
  rows:any=[];
  copyData:any=[];
  columns:any=[];
  currencyFilter: any = [];
  data:any={};
  myDate=Date.now();
  inActiveRecord: any = [];
  activeRecord: any = [];
  constructor(private http:HttpClient,
    private _clipboardService: ClipboardService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private modalService: NgbModal,) { }

  ngOnInit(): void {
    this.fetch((data) => {
      this.rows = data;
      this.currencyFilter = [...this.rows];
  
      this.listCount= this.rows.length;
    });
  }
  searchcurrency(event) {
    const val = event.target.value.toLowerCase();
    const temp = this.currencyFilter.filter(function (d) {
      return (
      // d.id.toLowerCase().indexOf(val) !== -1 ||
      // d.validFrom.toLowerCase().indexOf(val) !== -1 ||
      d.currencyCode.toLowerCase().indexOf(val) !== -1 ||
      // d.rate.toLowerCase().indexOf(val) !== -1 ||
      d.details.toLowerCase().indexOf(val) !== -1 ||
      !val);
    });
    this.rows = temp;
  }
   activeInactive(event){
    if(event.target.value == "InActive"){
     this.inActiveRecord = this.currencyFilter.filter(x=>x.active == false); 
      this.rows =this.inActiveRecord 
    }
    else if(event.target.value == "Active"){
     this.activeRecord = this.currencyFilter.filter(x=>x.active == true); 
      this.rows =this.activeRecord; 
    }
   }
  fetch(cb) {
    let that = this;
    that.http
    .get(`${environment.apiUrl}/api/Configs/GetAllCurrencyRate`)
    .subscribe(res => {
      this.response = res;
     
    if(this.response.success==true)
    {
    that.data =this.response.data;
    cb(this.data);
    }
    else{
      this.toastr.error(this.response.message, 'Message.');
    }
      // this.spinner.hide();
    }, err => {
      if ( err.status == 400) {
 this.toastr.error(err.error.message, 'Message.');;
      }
    //  this.spinner.hide();
    });
  }




  deleteCurrency(id){
    Swal.fire({
      title: GlobalConstants.deleteTitle, //'Are you sure?',
      text: GlobalConstants.deleteMessage+' '+'"'+ id.currencyCode +'"',
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
    this.spinner.show();
        this.http.delete(`${environment.apiUrl}/api/Configs/DeleteCurrencyRate/`+id.id )
        .subscribe(
          res=> { 
            this.response = res;
            if (this.response.success == true){
             this.toastr.error(this.response.message, 'Message.');
             this.fetch((data) => {
              this.rows = data;
              this.spinner.hide();
            });
              
            }
            else {
              this.toastr.error(this.response.message, 'Message.');
            this.spinner.hide();   
            }
     
          }, err => {
            if (err.status == 400) {
              this.toastr.error(this.response.message, 'Message.');
            this.spinner.hide();
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











  
  addCurrencyForm(){
    const modalRef = this.modalService.open(AddCurrencyComponent, { centered: true });
          modalRef.result.then((data) => {
         // on close
          if(data ==true){
          //  this.date = this.myDate;
           this.fetch((data) => {
            this.rows = data;
      this.currencyFilter = [...this.rows];
        
          });
         
        }
       }, (reason) => {
         // on dismiss
       });
  } 
  

  editCurrencyForm(row){
    const modalRef = this.modalService.open(EditCurrencyComponent, { centered: true });
    modalRef.componentInstance.userId =row.id;
          modalRef.result.then((data) => {
         // on close
          if(data ==true){
          //  this.date = this.myDate;
           this.fetch((data) => {
            this.rows = data;
            
          });
           
         }
       }, (reason) => {
         // on dismiss
       });
  } 
  
  copyCurrencyList() {
    this.copyData.push('S. No.'.padEnd(10) + 'Valid Form'.padEnd(10) +
    'Currency'.padEnd(10) +'Rate'.padEnd(10)+ 'Details'.padEnd(10)+ 'Updated By'.padEnd(10) + 'Updated Onn \n');
  
  for (let i = 0; i < this.rows.length; i++) {
    let tempData =  this.rows[i].id
      +''.padEnd(5)
    + this.rows[i].validFrom
    +''.padEnd(5)
    + this.rows[i].currencyCode
    +''.padEnd(5)
    + this.rows[i].rate
    +''.padEnd(5)
    + this.rows[i].details
    +''.padEnd(5)
    + this.rows[i].createdByName
    +''.padEnd(5)
    + this.rows[i].updatedDateTime
    +'\n';
    this.copyData.push(tempData);
  }
  this._clipboardService.copy(this.copyData)
  
  Swal.fire({
    title: GlobalConstants.copySuccess,
    footer: 'Copied' + '\n' + this.listCount + '\n' + 'row/s to clipboard',
    showConfirmButton: false,
    timer: 2000,
  })
  }

}

