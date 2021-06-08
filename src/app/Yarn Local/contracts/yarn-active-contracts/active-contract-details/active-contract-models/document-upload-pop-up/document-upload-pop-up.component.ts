import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ServiceService } from 'src/app/shared/service.service';
// import { FilterComponent } from './filter/filter.component';
import {FormBuilder, FormGroup} from '@angular/forms';
import {FormsModule , NgForm, ReactiveFormsModule}  from '@angular/forms'

@Component({
  selector: 'app-document-upload-pop-up',
  templateUrl: './document-upload-pop-up.component.html',
  styleUrls: ['./document-upload-pop-up.component.css']
})
export class DocumentUploadPopUpComponent implements OnInit {

  data:any=[];
  department: any = [];
  contracts: any = [];
  type: any = [];
  response:any;
  date:number;
  myDate = Date.now();
  search:any=[];
  error: string;
  profileForm: FormGroup;
  fileUpload = {status: '', message: '', filePath: ''};
    constructor(
      private service: ServiceService,
      private toastr: ToastrService,
      private modalService: NgbModal,
      private fb: FormBuilder,
  
  
    ) { }
  
    ngOnInit(): void 
   { 
     
    {
  this.profileForm=this.fb.group({
    name:[''],
    profile:['']
  });
    }
    
    {
      this.service.getDepartments().subscribe(res => {
        this.response = res;
        if (this.response.success == true) {
          this.department = this.response.data;
        }
        else {
          this.toastr.error(this.response.message, 'Message.');
        }
      })
    }
    {
      this.service.getContracts().subscribe(res => {
        this.response = res;
        if (this.response.success == true) {
          this.contracts= this.response.data;
        }
        else {
          this.toastr.error(this.response.message, 'Message.');
        }
      })
    }
    {
      this.service.getDocumentType().subscribe(res => {
        this.response = res;
        if (this.response.success == true) {
          this.type = this.response.data;
        }
        else {
          this.toastr.error(this.response.message, 'Message.');
        }
      })
    }
  }
  
  // SearchModalForm() {
  //   const modalRef = this.modalService.open(FilterComponent , { centered: true });
  //   modalRef.result.then((data) => {
  //     // on close
  //     if (data == true) {
  //       this.date = this.myDate;
  //       // this.getBuyers();
  
  //     }
  //   }, (reason) => {
  //     // on dismiss
  //   });
  // }
  onSelectedFile(event) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.profileForm.get('profile').setValue(file);
    }
  }
  
  onSubmit() {
    const formData = new FormData();
    formData.append('name', this.profileForm.get('name').value);
    formData.append('profile', this.profileForm.get('profile').value);
  
    this.service.upload(formData).subscribe(
      res => this.fileUpload = res,
      err => this.error = err
    );
  }
}
