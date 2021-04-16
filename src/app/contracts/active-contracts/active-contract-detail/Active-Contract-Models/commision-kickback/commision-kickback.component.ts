import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-commision-kickback',
  templateUrl: './commision-kickback.component.html',
  styleUrls: ['./commision-kickback.component.css']
})
export class CommisionKickbackComponent implements OnInit {
  public data: any[] = [{
    id: 0
  }];
  i:number;
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
  remove(i) {
    this.data.splice(i, 1);
  }
}
