import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { DashboardService } from 'src/app/service/dashboard.service';

@Component({
  selector: 'app-configure-widget',
  templateUrl: './configure-widget.component.html',
  styleUrls: ['./configure-widget.component.css'],
})
export class ConfigureWidgetComponent implements OnInit {
  constructor(
    public dashboardService: DashboardService,
    private elRef: ElementRef
  ) {}

  @Input() configureData = {
    element: this.elRef,
    widgetsTitle: 'empty',
    widgetId: 0,
  };
  @Output() onclick = new EventEmitter<any>();
  @Output() onclickdelete = new EventEmitter<any>();
  @ViewChild('configureWidget', { read: ElementRef, static: true })
  configureWidget!: ElementRef;

  ngOnInit(): void {}

  setConfiguration() {
    this.onclick.emit({ element: this.elRef });
  }

  deleteEmptyWidget() {
    this.onclickdelete.emit({
      element: this.elRef,
      widgetsTitle: 'empty',
      widgetsId: 0,
    });
  }
}
