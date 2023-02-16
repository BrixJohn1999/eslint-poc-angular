import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { DashboardService } from "src/app/service/dashboard.service";

@Component({
  selector: "app-notification-bar",
  templateUrl: "./notification-bar.component.html",
  styleUrls: ["./notification-bar.component.css"],
})
export class NotificationBarComponent implements OnInit {
  @Output() onrefresh: EventEmitter<any> = new EventEmitter<any>();
  @Output() onedit: EventEmitter<any> = new EventEmitter<any>();
  @Output() onsave: EventEmitter<any> = new EventEmitter<any>();
  constructor(public dashboardService: DashboardService) {}

  onEdit() {
    this.onedit.emit(true);
    this.dashboardService.setEdit(true);
  }

  onCancel() {
    this.onedit.emit(false);
    this.dashboardService.setEdit(false);
  }

  onRefresh() {
    this.onrefresh.emit();
  }

  onSave() {
    this.onsave.emit(false);
    this.dashboardService.setEdit(false);
  }
}
