import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ServiceService } from 'src/app/shared/service.service';

@Component({
  selector: 'app-sale-invoice-item',
  templateUrl: './sale-invoice-item.component.html',
  styleUrls: ['./sale-invoice-item.component.css']
})
export class SaleInvoiceItemComponent implements OnInit {
  @Input() statusCheck;
  constructor(
    private http: HttpClient,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private _NgbActiveModal: NgbActiveModal,
    private service: ServiceService) { }

  ngOnInit(): void {
    this.statusCheck = this.statusCheck;

  }
  get activeModal() {
    return this._NgbActiveModal;
  }
}
