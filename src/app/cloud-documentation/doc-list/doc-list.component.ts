import { Component, OnInit, ViewChild } from '@angular/core';
import { DatatableComponent, id } from '@swimlane/ngx-datatable';
import { RouterModule, Routes } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { SearchmodalComponent } from './searchmodal/searchmodal.component';
const appRoutes: Routes = []
@Component({
  selector: 'app-doc-list',
  templateUrl: './doc-list.component.html',
  styleUrls: ['./doc-list.component.css']
})

export class DocListComponent implements OnInit {
  @ViewChild('myTable') table: DatatableComponent;
  rows: any = [];
  columns: any = [];
  date: number;
  myDate = Date.now();
  constructor(
    private modalService: NgbModal,
    private http: HttpClient,
    private toaster:ToastrService
  ) { }

  ngOnInit(): void {
  }

  SearchModalForm() {
    const modalRef = this.modalService.open(SearchmodalComponent , { centered: true });
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
