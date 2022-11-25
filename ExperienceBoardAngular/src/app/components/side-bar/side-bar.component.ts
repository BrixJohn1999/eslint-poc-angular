import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { GridStack } from 'gridstack';

import 'gridstack/dist/h5/gridstack-dd-native';
import 'gridstack/dist/jq/gridstack-dd-jqueryui';
import 'node_modules/gridstack/dist/gridstack.min.css';
import 'node_modules/gridstack/dist/gridstack-h5.js';
import { DashboardService } from 'src/app/service/dashboard.service';

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.css'],
})
export class SideBarComponent implements OnInit {
  path: string = environment.urlPath;

  constructor(public dashboardService: DashboardService) {}

  ngOnInit(): void {
    GridStack.init({
      cellHeight: 150,
      acceptWidgets: true,
      float: true,
      dragIn: '.drag-widget',
      dragInOptions: { appendTo: 'body', helper: 'clone' },
    });
  }

  test() {
    alert('hey');
  }

  showHideConfig() {}
}
