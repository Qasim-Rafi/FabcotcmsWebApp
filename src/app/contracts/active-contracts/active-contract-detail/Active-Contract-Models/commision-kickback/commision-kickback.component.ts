import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-commision-kickback',
  templateUrl: './commision-kickback.component.html',
  styleUrls: ['./commision-kickback.component.css']
})
export class CommisionKickbackComponent implements OnInit {
 data: any=[];
  constructor(
    private _NgbActiveModal: NgbActiveModal

  ) { }

  ngOnInit(): void {
  }
  get activeModal() {
    return this._NgbActiveModal;
  }
  addMore() {
    this.data.push({
      id: this.data.length,
    });
  }
  remove(i: number) {
    this.data.splice(i, 1);
  }
}
