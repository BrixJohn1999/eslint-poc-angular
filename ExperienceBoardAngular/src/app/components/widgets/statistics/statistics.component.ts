import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { faUpLong, faDownLong } from '@fortawesome/free-solid-svg-icons';
import { DashboardService } from 'src/app/service/dashboard.service';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.css'],
})
export class StatisticsComponent implements OnInit {
  constructor(
    public dashboardService: DashboardService,
    private elRef: ElementRef
  ) {}
  faUpLong = faUpLong;
  faDownLong = faDownLong;

  @Input() title: string = 'Total Buildings';
  @Input() value: string = '694';
  @Input() status: string = 'none';
  @Input() widgetsId: number = 0;
  @Input() widgetsLocation: string = '';
  @Input() icon = '';
  @Input() iconOnly = false;
  @Output() onclick = new EventEmitter<any>();
  @Output() onclickdelete = new EventEmitter<any>();
  @ViewChild('statsWidget', { read: ElementRef, static: true })
  statsWidget!: ElementRef;
  parentWidth: number = 202;

  ngOnInit(): void {
    this.setOnresize();
  }


  setStatistics() {}

  deleteStatistics() {
    this.onclickdelete.emit({
      element: this.elRef,
      widgetsId: this.widgetsId,
      widgetsTitle: this.title,
    });
  }

  setConfiguration() {
    this.onclick.emit({
      element: this.elRef,
      widgetsTitle: this.title,
      widgetsValue: this.value,
      widgetsStatus: this.status,
      widgetsId: this.widgetsId,
      widgetsLocation: this.widgetsLocation,
    });
  }

  onResize(dom_elem: Element, callback: CallableFunction) {
    const resizeObserver = new ResizeObserver(() => callback());
    resizeObserver.observe(dom_elem);
  }

  setOnresize() {
    this.onResize(this.statsWidget.nativeElement, () => {
      this.parentWidth = this.statsWidget.nativeElement.offsetWidth;
    });
  }
}
