import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ServiceService } from 'src/app/shared/service.service';
// import { FilterComponent } from './filter/filter.component';
import {FormBuilder, FormGroup} from '@angular/forms';
import {FormsModule , NgForm, ReactiveFormsModule}  from '@angular/forms'
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-document-upload-pop-up',
  templateUrl: './document-upload-pop-up.component.html',
  styleUrls: ['./document-upload-pop-up.component.css']
})
export class DocumentUploadPopUpComponent implements OnInit {
  @Input() contractId;
  @Input() statusCheck;
  data:any=[];
  department: any = [];
  contracts: any = [];
  type: any = [];
  response:any;
  date:number;
  myDate = Date.now();
  search:any=[];
  error: string;
  file:File;
  @ViewChild('Form') form;
  // profileForm: FormGroup;
  // fileUpload = {status: '', message: '', filePath: ''};
    constructor(
      private _NgbActiveModal: NgbActiveModal,
      private http: HttpClient,
      private service: ServiceService,
      private toastr: ToastrService,
      private modalService: NgbModal,
      private fb: FormBuilder,
  
  
    ) { }
  
    ngOnInit(): void 
   { 
     this.statusCheck=this.statusCheck;
     this.getDepartments();
     this.getContracts();
     this.getDocumentsType();

     if (this.statusCheck == 'Edit') {
      // this.getById();
    }
  //   {
  // this.profileForm=this.fb.group({
  //   name:[''],
  //   profile:['']
  // });
  //   }
    
  }
  get activeModal() {
    return this._NgbActiveModal;
  }
  getDepartments(){
    
      this.service.getDepartments().subscribe(res => {
        this.response = res;
        if (this.response.success == true) {
          this.department = this.response.data;
        }
        else {
          this.toastr.error(this.response.message, 'Message.');
        }
      });
    
  }

  getContracts(){
    
    this.service.getContracts().subscribe(res => {
      this.response = res;
      if (this.response.success == true) {
        this.contracts= this.response.data;
      }
      else {
        this.toastr.error(this.response.message, 'Message.');
      }
    });
  
}
getDocumentsType(){
  
    this.service.getDocumentType().subscribe(res => {
      this.response = res;
      if (this.response.success == true) {
        this.type = this.response.data;
      }
      else {
        this.toastr.error(this.response.message, 'Message.');
      }
    });
}
  onSelectedFile(event) {
    if (event.target.files.length > 0) {
     this.file = event.target.files[0];
     // this.profileForm.get('profile').setValue(this.file);
    }
  }
  
  onSubmit(check) {
    // const formData = new FormData();
    // formData.append('name', this.profileForm.get('name').value);
    // formData.append('profile', this.profileForm.get('profile').value);

    const formData = new FormData();
    formData.append('DepartmentId', this.data.departmentId != undefined? this.data.departmentId:null);
    formData.append('ContractId', this.contractId);
    formData.append('DocumentTypeId', this.data.typeId);
    formData.append('Notes', this.data.note != undefined? this.data.note:null);
    formData.append('File', this.file);

    this.http.
    post(`${environment.apiUrl}/api/Contracts/UploadDocument`, formData)
    .subscribe(
      res => {

        this.response = res;
        if (this.response.success == true) {
          this.toastr.success(this.response.message, 'Message.');
          // this.activeModal.close(true);

        }
        else {
          this.toastr.error(this.response.message, 'Message.');
        }

      },(err: HttpErrorResponse) => {
        const messages = this.service.extractErrorMessagesFromErrorResponse(err);
        this.toastr.error(messages.toString(), 'Message.');
        console.log(messages);
      });
  
    // this.service.upload(formData).subscribe(
    //   res => this.fileUpload = res,
    //   err => this.error = err
    // );
  }
}
