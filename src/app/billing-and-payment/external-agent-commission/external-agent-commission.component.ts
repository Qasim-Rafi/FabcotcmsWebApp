import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-external-agent-commission',
  templateUrl: './external-agent-commission.component.html',
  styleUrls: ['./external-agent-commission.component.css']
})
export class ExternalAgentCommissionComponent implements OnInit {

  rows: any = [];
  columns: any = [];

  constructor() { }

  ngOnInit(): void {
  }

}
