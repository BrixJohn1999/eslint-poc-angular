import { Component, OnInit } from '@angular/core';
import { DashboardService } from 'src/app/service/dashboard.service';

@Component({
  selector: 'app-redirect-page',
  templateUrl: './redirect-page.component.html',
  styleUrls: ['./redirect-page.component.css'],
})
export class RedirectPageComponent implements OnInit {
  myColors: any = [
    '#007BFF',
    '#C4354F',
    '#DEEB47',
    '#15a31c',
    '#c110e0',
    '#271c33',
  ];

  constructor(public dashboardService: DashboardService) {}

  ngOnInit(): void {}

  setData(data: any) {}

  setItem(item: any) {}
}
