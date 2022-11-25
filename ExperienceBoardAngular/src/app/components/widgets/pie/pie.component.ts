import { Component, Input, OnInit } from '@angular/core';
import { DashboardService } from 'src/app/service/dashboard.service';

@Component({
  selector: 'app-pie',
  templateUrl: './pie.component.html',
  styleUrls: ['./pie.component.css'],
})
export class PieComponent implements OnInit {
  @Input() title: string = 'Title';
  @Input() data: any[] = [];

  barChartcustomColors: any[] = [];
  constructor(public dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.formatColor();
  }
  formatColor() {
    let data = this.data;
    for (let i = 0; i < data.length; i++) {
      this.barChartcustomColors.push({
        name: data[i].name,
        value: data[i].color,
      });
    }
  }

  setSelectedPie(data: any) {
    const { name, value, label } = data;
    window.location.href = `https://qa3-myaccess.stevensonsystems.com/my-properties?filter=${name}`;
  }
}
