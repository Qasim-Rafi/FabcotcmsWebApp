import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ServiceService } from 'src/app/shared/service.service';
import { FilterComponent } from './filter/filter.component';

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
date:number;
myDate = Date.now();
search:any=[];
  constructor(
    private service: ServiceService,
    private toastr: ToastrService,
    private modalService: NgbModal,

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

SearchModalForm() {
  const modalRef = this.modalService.open(FilterComponent , { centered: true });
  modalRef.result.then((data) => {
    // on close
    if (data == true) {
      this.date = this.myDate;
      // this.getBuyers();

    }
  }, (reason) => {
    // on dismiss
  });
}


}
