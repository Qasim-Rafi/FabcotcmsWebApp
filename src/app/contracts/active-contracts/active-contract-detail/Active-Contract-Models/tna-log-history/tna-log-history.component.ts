import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ServiceService } from 'src/app/shared/service.service';

@Component({
  selector: 'app-tna-log-history',
  templateUrl: './tna-log-history.component.html',
  styleUrls: ['./tna-log-history.component.css']
})


export class TnaLogHistoryComponent implements OnInit {
  columns: any = [];
  rows: any = [];

  constructor(
    private _NgbActiveModal: NgbActiveModal,
    private route: ActivatedRoute,
    private modalService: NgbModal,
    private http: HttpClient,
    private service: ServiceService,
    private toastr: ToastrService,

  ) { }

  ngOnInit(): void {
  }
  get activeModal() {
    return this._NgbActiveModal;
  }
}
