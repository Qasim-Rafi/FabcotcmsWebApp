import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';
import * as AdminLte from 'admin-lte';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    // $('[data-widget="treeview"]').each(function() {
    //   AdminLte.Treeview._jQueryInterface.call($(this), 'init');
    // });
  }

}
