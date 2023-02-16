import { Component, Input, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { DashboardService } from "src/app/service/dashboard.service";

@Component({
  selector: "app-summary",
  templateUrl: "./summary.component.html",
  styleUrls: ["./summary.component.css"],
})
export class SummaryComponent implements OnInit {
  @Input() title: string = "Title";
  @Input() apiUrl!: string;
  @Input() widgetsValue: any = [];
  constructor(
    public dashboardService: DashboardService,
    private router: Router
  ) {}

  onSelect(data: any) {
    const summary = {
      type: "summary",
      title: this.title,
      data: [data],
    };

    this.dashboardService.setWidgetData(summary);
    this.router.navigate(["dashboard/widgets"]);
  }
}
