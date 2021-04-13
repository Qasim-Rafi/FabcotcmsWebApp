import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ServiceService } from 'src/app/shared/service.service';

@Component({
  selector: 'app-doc-upload',
  templateUrl: './doc-upload.component.html',
  styleUrls: ['./doc-upload.component.css']
})
export class DocUploadComponent implements OnInit {
data:any=[];
department: any = [];
contracts: any = [];
type: any = [];
response:any;
  constructor(
    private service: ServiceService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void 
 { {
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
}
