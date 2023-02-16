import {
  ApplicationRef,
  Component,
  ComponentFactoryResolver,
  ElementRef,
  EmbeddedViewRef,
  HostListener,
  Injector,
  OnInit,
  ViewChild,
} from "@angular/core";
import { DashboardService } from "src/app/service/dashboard.service";
import { Subscription } from "rxjs";
import { GridStack, GridStackNode, GridStackWidget } from "gridstack";

import { StatisticsComponent } from "../widgets/statistics/statistics.component";
import { SummaryComponent } from "../widgets/summary/summary.component";
import { PieComponent } from "../widgets/pie/pie.component";
import { AuthService } from "src/app/service/auth.service";
import { StatisticsService } from "src/app/service/statistics.service";
import { StatisticsArgs } from "src/app/gql/args/statistics.args";
import { SummaryService } from "src/app/service/summary.service";
import { SummaryArgs } from "src/app/gql/args/summary.args";
import { ChartArgs } from "src/app/gql/args/chart.args";
import { ChartService } from "src/app/service/chart.service";
import { WidgetsArgs } from "src/app/gql/args/widgets.args";
import { GET_USER_WIDGETS } from "src/app/gql/query/widgets.query";
import { Widgets } from "src/app/model/widgets.model";
import "gridstack/dist/h5/gridstack-dd-native";
import "gridstack/dist/jq/gridstack-dd-jqueryui";
import "node_modules/gridstack/dist/gridstack.min.css";
import "node_modules/gridstack/dist/gridstack-h5.js";
import { ActivatedRoute, Router } from "@angular/router";
import { ModalDialogComponent } from "src/app/modals/modal-dialog/modal-dialog.component";
import { ConfigureWidgetComponent } from "../widgets/configure-widget/configure-widget.component";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { SpinnerComponent } from "myaccess-storybook";

@Component({
  selector: "app-main-dashboard",
  templateUrl: "./main-dashboard.component.html",
  styleUrls: ["./main-dashboard.component.css"],
})
export class MainDashboardComponent implements OnInit {
  @ViewChild("statisticsModal") statisticsModal!: ModalDialogComponent;
  @ViewChild("removeStatisticsModal")
  removeStatisticsModal!: ModalDialogComponent;
  @ViewChild("chartModal") chartModal!: ModalDialogComponent;
  widgetsContainer!: ElementRef;
  cols: number = 12;
  rowHeight: number = 130;
  layout: any = [];
  resizeSubscription!: Subscription;
  autoResize = true;
  gridStack!: any;
  hideRightPanel: boolean = false;
  openPannel: boolean = false;
  widgetList: GridStackWidget[] = [];
  statisticsList: Widgets[] = [];
  summaryList: any[] = [];
  chartList: any[] = [];
  loadingSpinner: boolean = true;
  loadingCounter: number = 0;
  widgetListData: any[] = [];
  acccessibleWidgetListData: any[] = [];
  widgetsPromises: any[] = [];
  showSidebar: boolean = false;
  saveResponse: any;
  selectedStatisticsOption: any;
  selectedWidgetsDataToRemove: any = {};
  temporaryWidgets: any[] = [];
  isEditingExistingWidget: boolean = false;
  isAddingNewWidgetByDrag: boolean = false;
  editingWidgetsData: any = {};
  addingNewWidgetsData: any = {};

  statisticsConfigurationForm = new FormGroup({
    type: new FormControl("", [Validators.required]),
    region: new FormControl("", [Validators.required]),
    startDate: new FormControl(new Date().toISOString(), [Validators.required]),
    endDate: new FormControl(new Date().toISOString(), [Validators.required]),
  });

  regionList: any[] = [
    { value: "all", title: "All" },
    { value: "western", title: "Western" },
    { value: "southern", title: "Southern" },
    { value: "midwestern", title: "Midwestern" },
    { value: "northeastern", title: "Northeastern" },
  ];

  statisticsArgs: StatisticsArgs = {
    userId: 0,
    region: "all",
    apiUrl:
      "api/dashboard/portfolio/get-user-total-buildings/{userId}/{region}",
    sessionToken: null,
  };

  summaryArgs: SummaryArgs = {
    userId: 0,
    apiUrl: "",
    sessionToken: null,
  };

  chartArgs: ChartArgs = {
    userId: 0,
    apiUrl: "",
    sessionToken: null,
  };

  widgetArgs: WidgetsArgs = {
    sessionToken: null,
  };

  constructor(
    private factoryResolver: ComponentFactoryResolver,
    private injector: Injector,
    private applicationRef: ApplicationRef,
    public dashboardService: DashboardService,
    private authService: AuthService,
    private statisticsService: StatisticsService,
    private summaryService: SummaryService,
    private chartService: ChartService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  async ngOnInit() {
    if (this.authService.getCookie("SID") === null) {
      this.authService.setCookie(
        "SID",
        "U2FsdGVkX18l43TGq8PrxWFUZ9QrpPvcg37BAsH65dGh0oF1shrA98m33bDYFLJW0iqAe5QPO0nApfs694AFjA=="
      );
    }
    this.statisticsArgs.sessionToken = this.authService.getCookie("SID");
    this.summaryArgs.sessionToken = this.authService.getCookie("SID");
    this.chartArgs.sessionToken = this.authService.getCookie("SID");
    this.widgetArgs.sessionToken = this.authService.getCookie("SID");

    await this.getWidgetsData(this.widgetArgs, GET_USER_WIDGETS);
    this.widgetListData = await this.getWidgetsDataInPromise();
    await this.setAccessibleWidgets();

    this.initializeGridStack();
    this.loadingSpinner = false;
  }

  async setAccessibleWidgets() {
    const result = this.dashboardService.getAccessibleWidgets(this.widgetArgs);
    const accessibleWidgets = await result;
    this.acccessibleWidgetListData = accessibleWidgets;
    for (const aw of accessibleWidgets) {
      const existed = this.widgetListData.some(
        (el) => el.widgetsId === aw.widgetsId
      );
      if (!existed) {
        switch (aw.widgetsType) {
          case "Statistics":
            this.statisticsList.push(aw);
            break;
          case "Summary":
            this.summaryList.push(aw);
            break;
          case "Pie":
            this.chartList.push(aw);
            break;
          default:
            break;
        }
      }
    }
  }

  hasDateSearch() {
    if (this.statisticsConfigurationForm.value.type) {
      const id = parseInt(this.statisticsConfigurationForm.value.type);
      for (const aw of this.acccessibleWidgetListData) {
        if (aw.widgetsId === id && aw.showDate === true) return true;
      }
    }
    return false;
  }

  resetPage() {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = "reload";
    this.router.navigate(["./"], { relativeTo: this.route });
  }

  deleteSelectedWidget(data: any): void {
    this.selectedWidgetsDataToRemove = data;
    this.removeStatisticsModal.open();
  }

  cancelDeletingSelectedWidget() {
    this.selectedWidgetsDataToRemove = {};
    this.removeStatisticsModal.close();
  }

  confirmDeleteSelectedWidget() {
    const { element, widgetsId } = this.selectedWidgetsDataToRemove;
    let el: any;
    if (widgetsId === 0) {
      this.temporaryWidgets = [];
    } else {
      this.widgetListData = this.widgetListData.filter(
        (widget) => widget.widgetsId !== parseInt(widgetsId)
      );
    }
    el = element.nativeElement.parentElement.parentElement.parentElement;
    el.remove();
    this.gridStack.removeWidget(el);
    this.removeStatisticsModal.close();
  }

  prepareWidgetsPayload() {
    let payload: any = {
      sessionToken: this.authService.getCookie("SID"),
      UserId: 0,
      WidgetOrderIds: [],
      Email: "ZavantiAdmin@stevensonsystems.com",
      WidgetsLocation: [],
      WidgetsIds: [],
      StartDates: [],
      EndDates: [],
      Regions: [],
      IsDateSearches: [],
    };
    let tempOrderIds = [];
    let widgetLength = 0;

    for (let widget of this.widgetListData) {
      widgetLength += 1;
      tempOrderIds.unshift(widget.widgetsOrderId);
      payload.WidgetsLocation.unshift(widget.widgetsLocation);
      payload.WidgetsIds.unshift(widget.widgetsId);
      payload.StartDates.unshift(widget.startDate);
      payload.EndDates.unshift(widget.endDate);
      payload.Regions.unshift(widget.region);
      payload.IsDateSearches.unshift(widget.isDateSearch);
    }
    let lastOrderId = tempOrderIds[0];
    for (let x = 0; x < widgetLength; x++) {
      payload.WidgetOrderIds.unshift((lastOrderId += 1));
    }
    return payload;
  }

  setupAddNewWidget(data: any) {
    this.addingNewWidgetsData = data;
    this.isAddingNewWidgetByDrag = true;
    this.statisticsModal.open();
  }

  async saveStatistics() {
    if (
      this.temporaryWidgets.length === 1 &&
      !this.isEditingExistingWidget &&
      this.isAddingNewWidgetByDrag
    ) {
      let widgetsLocation = "";
      const { element } = this.addingNewWidgetsData;
      const elToAdd = element.nativeElement.parentElement.parentElement;
      const template = document.createElement("template");
      template.innerHTML =
        `<div id='widget-temporary-item' style="position: absolute; left: 40%; top:30%;"></div>`.trim();
      const widgetElement = template.content.firstChild;
      widgetElement?.appendChild(this.renderLoadingStorybook());
      elToAdd.appendChild(widgetElement);
      this.closeStatisticsModal();

      for (let item of this.temporaryWidgets) {
        widgetsLocation = `${item.w / 2}-${item.h}-${item.x / 2}-${item.y}`;
      }
      const res = await this.prepareStatisticsDataBeforeSave(widgetsLocation);
      if (res) this.widgetListData.unshift(res);
      widgetElement?.remove();
      this.renderStatisticsComponents(
        res.widgetsId,
        res.widgetsTitle,
        res.widgetsValue,
        res.widgetsStatus,
        widgetsLocation
      );
      this.addingNewWidgetsData = {};
      this.temporaryWidgets = [];
      this.isAddingNewWidgetByDrag = false;
    } else if (this.isEditingExistingWidget) {
      const { widgetsId, widgetsLocation, element } = this.editingWidgetsData;

      const elToAdd = element.nativeElement.parentElement.parentElement;
      const template = document.createElement("template");
      template.innerHTML =
        `<div id='widget-${widgetsId}' style="position: absolute; left: 40%; top:30%;"></div>`.trim();
      const widgetElement = template.content.firstChild;
      widgetElement?.appendChild(this.renderLoadingStorybook());
      elToAdd.appendChild(widgetElement);
      this.closeStatisticsModal();

      const res = await this.prepareStatisticsDataBeforeSave(widgetsLocation);
      this.widgetListData = this.widgetListData.filter(
        (widget) => widget.widgetsId !== parseInt(widgetsId)
      );
      if (res) this.widgetListData.unshift(res);
      widgetElement?.remove();
      this.renderStatisticsComponents(
        res.widgetsId,
        res.widgetsTitle,
        res.widgetsValue,
        res.widgetsStatus,
        widgetsLocation,
        widgetsId
      );
      this.isEditingExistingWidget = false;
    } else {
      console.error("Please fill in the empty widget first!");
    }
  }

  async prepareStatisticsDataBeforeSave(widgetsLocation: string) {
    let { startDate, endDate, type } = this.statisticsConfigurationForm.value;

    let statistics!: Widgets;
    for (let stats of this.statisticsList) {
      if (stats.widgetsId.toString() === type?.toString()) {
        statistics = stats;
        break;
      }
    }

    if (statistics) {
      const {
        widgetsId,
        widgetsTitle,
        widgetsType,
        widgetsOrderId,
        isDateSearch,
        apiUrl,
      } = statistics;
      startDate = startDate === "" ? new Date().toISOString() : startDate;
      endDate = endDate === "" ? new Date().toISOString() : endDate;
      const initialStatistics = {
        widgetsId,
        widgetsTitle,
        widgetsType,
        widgetsLocation,
        widgetsOrderId,
        startDate,
        endDate,
        isDateSearch,
      };

      let statisticsArgs: StatisticsArgs = {
        ...this.statisticsArgs,
        apiUrl,
      };

      if (widgetsId === 4) statisticsArgs.reportStatusId = 2;
      if (widgetsId === 5) {
        const start = new Date(startDate || Date.now());
        const end = new Date(endDate || Date.now());
        statisticsArgs.startMonth = start.getMonth() + 1;
        statisticsArgs.endMonth = end.getMonth() + 1;
        statisticsArgs.startYear = start.getFullYear();
        statisticsArgs.endYear = end.getFullYear();
        statisticsArgs.isDateSearch = isDateSearch;
      }
      const res = await this.getStatisticsData(
        statisticsArgs,
        initialStatistics
      );
      return res;
    } else {
      console.error("Statistics not found!");
      return null;
    }
  }

  submitUpdatedWidgets() {
    const payload = this.prepareWidgetsPayload();
    this.dashboardService.saveWidgets(payload).subscribe(() => {
      this.resetPage();
    });
  }

  setOnGridstackChanged(items: GridStackNode[]) {
    for (let item of items) {
      const newWidgetsLocation = `${item.w ? item.w / 2 : item.w}-${item.h}-${
        item.x ? item.x / 2 : item.x
      }-${item.y}`;
      this.widgetListData.map((widget) => {
        return widget.widgetsId === item.id
          ? (widget.widgetsLocation = newWidgetsLocation)
          : widget;
      });
    }
  }

  initializeGridStack() {
    this.gridStack = GridStack.init({
      cellHeight: 150,
      disableResize: true,
      disableDrag: true,
      float: true,
      acceptWidgets: true,
      dragIn: ".drag-widget",
      dragInOptions: { appendTo: "body", helper: "clone" },
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    this.gridStack.on("added", (event: Event, items: GridStackNode[]) => {
      this.dashboardService.isEditing$.subscribe((editing) => {
        if (editing && this.showSidebar) {
          /* empty */
        }
      });
    });

    this.gridStack.on(
      "dropped",
      (
        event: Event,
        previousWidget: GridStackNode,
        newWidget: GridStackNode
      ) => {
        if (newWidget) {
          this.temporaryWidgets.push(newWidget);
          const elToAdd: any = newWidget.el?.firstElementChild;
          const elToRemove = newWidget.el?.firstElementChild?.firstElementChild;
          elToRemove?.remove();
          const template = document.createElement("template");
          template.innerHTML =
            `<div id='widget-temporary-item' style="height: 100%;"></div>`.trim();
          const widgetElement = template.content.firstChild;
          widgetElement?.appendChild(this.renderConfigureComponent());
          elToAdd?.appendChild(widgetElement);
          this.setupAddNewWidget(this.addingNewWidgetsData);
        }
      }
    );

    this.gridStack.on("change", (event: Event, items: GridStackNode[]) => {
      this.setOnGridstackChanged(items);
    });

    this.setGridstackData();
    this.gridStack.load(this.widgetList);

    this.renderWidgetsComponents();
    if (window.innerWidth < 1329) {
      this.hideRightPanel = true;
    } else {
      this.hideRightPanel = false;
    }
  }

  myClone(event: any) {
    return event.target.cloneNode(true);
  }

  async getWidgetsDataInPromise() {
    return Promise.all(this.widgetsPromises);
  }

  async getWidgetsData(widgetsArgs: WidgetsArgs, queryType: any) {
    const widgets = await this.dashboardService.getWidgetsData(
      widgetsArgs,
      queryType
    );
    for (let widget of widgets) {
      const {
        widgetsOrderId,
        widgetsLocation,
        region,
        startDate,
        endDate,
        isDateSearch,
        widgetsId,
        widgetsTitle,
        apiUrl,
        widgetsType,
      } = widget;
      switch (widgetsType) {
        case "Summary": {
          this.summaryArgs.apiUrl = apiUrl;
          const initialSummary = {
            widgetsId,
            widgetsLocation,
            widgetsTitle,
            widgetsType,
            widgetsOrderId,
            startDate,
            endDate,
            region,
            isDateSearch,
          };
          const summary = this.getSummaryData(this.summaryArgs, initialSummary);
          this.widgetsPromises.push(summary);
          break;
        }
        case "Statistics": {
          let statisticsArgs: StatisticsArgs = {
            ...this.statisticsArgs,
            apiUrl,
          };
          if (widgetsId === 4) statisticsArgs.reportStatusId = 2;
          if (widgetsId === 5) {
            const start = new Date(startDate);
            const end = new Date(endDate);
            statisticsArgs.startMonth = start.getMonth() + 1;
            statisticsArgs.endMonth = end.getMonth() + 1;
            statisticsArgs.startYear = start.getFullYear();
            statisticsArgs.endYear = end.getFullYear();
            statisticsArgs.isDateSearch = isDateSearch;
          }

          const initialStatistics = {
            widgetsId,
            widgetsTitle,
            widgetsType,
            widgetsLocation,
            widgetsOrderId,
            startDate,
            endDate,
            region,
            isDateSearch,
          };
          const statistics = this.getStatisticsData(
            statisticsArgs,
            initialStatistics
          );
          this.widgetsPromises.push(statistics);

          break;
        }
        case "Pie": {
          this.chartArgs.apiUrl = apiUrl;
          const initialChart = {
            widgetsId,
            widgetsTitle,
            widgetsType,
            widgetsLocation,
            widgetsOrderId,
            startDate,
            endDate,
            region,
            isDateSearch,
          };
          const chart = this.getChartData(
            this.chartArgs,
            widgetsId,
            initialChart
          );
          this.widgetsPromises.push(chart);
          break;
        }
        default:
          break;
      }
    }
  }

  async getChartData(
    chartArgs: ChartArgs,
    widgetsId: number,
    initialChart: object
  ) {
    const response = await this.chartService.getChartData(chartArgs, widgetsId);
    const { values } = response;
    const statusList = Object.entries(values[0].status);
    const colors = [
      "#C4354F",
      "#007BFF",
      "#DEEB47",
      "#15a31c",
      "#c110e0",
      "#271c33",
    ];
    let newValues = [];
    for (let x = 1; x < statusList.length; x++) {
      newValues.push({
        name: statusList[x][0],
        value: statusList[x][1],
        color: colors[x - 1],
      });
    }
    const chart = {
      ...initialChart,
      widgetsValue: newValues,
    };
    return chart;
  }

  async getSummaryData(summaryArgs: SummaryArgs, initialSummary: object) {
    const response = await this.summaryService.getSummaryData(summaryArgs);
    const { values } = response;
    const summary = {
      ...initialSummary,
      widgetsValue: values,
    };
    return summary;
  }

  async getStatisticsData(
    statisticsArgs: StatisticsArgs,
    initialStatistics: object
  ) {
    const response = await this.statisticsService.getStatisticsData(
      statisticsArgs
    );
    const { value, status, region } = response;
    const stats: any = {
      ...initialStatistics,
      widgetsValue: value,
      widgetsStatus: status || "none",
      region,
    };
    return stats;
  }

  setGridstackData() {
    if (this.widgetListData.length !== 0) {
      this.widgetListData.map((d: any) => {
        const { widgetsLocation, widgetsId } = d;
        let loc = widgetsLocation.split("-");
        this.widgetList.push({
          id: widgetsId,
          w: Number(loc[0]) * 2,
          h: Number(loc[1]),
          x: Number(loc[2]) * 2,
          y: Number(loc[3]),
          minH: 1,
          minW: 2,
          content: `<div id='widget-${widgetsId}' style="height: 100%"></div>`,
        });
      });
    }
  }

  openStatisticsModal() {
    this.statisticsModal.open();
  }

  editWidgetsContent(data: any) {
    this.isEditingExistingWidget = true;
    this.editingWidgetsData = data;
    this.statisticsModal.open();
  }

  isValidStatisticsForm(): boolean {
    if (this.statisticsConfigurationForm.valid) {
      return true;
    }
    return false;
  }

  closeStatisticsModal() {
    this.statisticsModal.close();
  }

  onSubmit(val: boolean) {
    if (!val) {
      this.submitUpdatedWidgets();
    }
    this.gridStack.enableResize(val);
    this.gridStack.enableMove(val);
  }

  onEdit(val: boolean) {
    this.showSidebar = val;
    this.resetPage();
    this.gridStack.enableResize(val);
    this.gridStack.enableMove(val);
  }

  private async renderWidgetsComponents() {
    for (let widget of this.widgetListData) {
      const {
        widgetsId,
        widgetsTitle,
        widgetsValue,
        widgetsType,
        widgetsLocation,
      } = widget;
      switch (widgetsType) {
        case "Summary":
          this.renderSummaryComponents(widgetsId, widgetsTitle, widgetsValue);
          break;
        case "Statistics":
          this.renderStatisticsComponents(
            widgetsId,
            widgetsTitle,
            widgetsValue,
            widget.widgetsStatus,
            widgetsLocation
          );
          break;
        case "Pie":
          this.renderPieComponents(widgetsId, widgetsTitle, widgetsValue);
          break;
        default:
          break;
      }
    }
  }

  private renderPieComponents(
    widgetsId: number,
    widgetsTitle: string,
    data: any
  ) {
    const statsFactory =
      this.factoryResolver.resolveComponentFactory(PieComponent);

    const componentStat = statsFactory.create(this.injector);

    componentStat.instance.title = widgetsTitle;
    componentStat.instance.data = data;

    this.applicationRef.attachView(componentStat.hostView);

    const renderedHtml = (componentStat.hostView as EmbeddedViewRef<any>)
      .rootNodes[0] as HTMLElement;

    document
      .getElementById("widget-" + widgetsId.toString())
      ?.appendChild(renderedHtml);
  }

  private renderSummaryComponents(
    widgetsId: number,
    widgetsTitle: string,
    widgetsValue: string
  ) {
    const statsFactory =
      this.factoryResolver.resolveComponentFactory(SummaryComponent);

    const componentSummary = statsFactory.create(this.injector);

    componentSummary.instance.title = widgetsTitle;
    componentSummary.instance.widgetsValue = Object.entries(
      JSON.parse(widgetsValue)
    );

    this.applicationRef.attachView(componentSummary.hostView);

    const renderedHtml = (componentSummary.hostView as EmbeddedViewRef<any>)
      .rootNodes[0] as HTMLElement;

    document
      .getElementById("widget-" + widgetsId.toString())
      ?.appendChild(renderedHtml);
  }

  private renderConfigureComponent() {
    const configureFactory = this.factoryResolver.resolveComponentFactory(
      ConfigureWidgetComponent
    );

    const componentConf = configureFactory.create(this.injector);

    componentConf.instance.onclick.subscribe((data) =>
      this.setupAddNewWidget(data)
    );
    componentConf.instance.onclickdelete.subscribe((data) => {
      this.deleteSelectedWidget(data);
    });
    this.addingNewWidgetsData = componentConf.instance.configureData;
    this.applicationRef.attachView(componentConf.hostView);

    const renderedHtml = (componentConf.hostView as EmbeddedViewRef<any>)
      .rootNodes[0] as HTMLElement;
    return renderedHtml;
  }

  private renderLoadingStorybook(): HTMLElement {
    const loadingFactory =
      this.factoryResolver.resolveComponentFactory(SpinnerComponent);
    const componentLoading = loadingFactory.create(this.injector);
    componentLoading.instance.size = "sm";
    componentLoading.instance.message = "";
    this.applicationRef.attachView(componentLoading.hostView);
    const renderedHtml = (componentLoading.hostView as EmbeddedViewRef<any>)
      .rootNodes[0] as HTMLElement;
    return renderedHtml;
  }

  private renderStatisticsComponents(
    widgetsId: number,
    widgetsTitle: string,
    widgetsValue: string,
    widgetsStatus: string,
    widgetsLocation: string,
    oldWidgetsId: number = 0
  ) {
    const statsFactory =
      this.factoryResolver.resolveComponentFactory(StatisticsComponent);

    const componentStat = statsFactory.create(this.injector);

    componentStat.instance.title = widgetsTitle;
    componentStat.instance.value = widgetsValue;
    componentStat.instance.status = widgetsStatus;
    componentStat.instance.widgetsId = widgetsId;
    componentStat.instance.widgetsLocation = widgetsLocation;
    componentStat.instance.onclick.subscribe((data) =>
      this.editWidgetsContent(data)
    );
    componentStat.instance.onclickdelete.subscribe((data) =>
      this.deleteSelectedWidget(data)
    );
    this.applicationRef.attachView(componentStat.hostView);

    const renderedHtml = (componentStat.hostView as EmbeddedViewRef<any>)
      .rootNodes[0] as HTMLElement;

    if (this.isEditingExistingWidget && oldWidgetsId !== 0) {
      const { element } = this.editingWidgetsData;
      const elToRemove = element.nativeElement.parentElement;
      const elToAdd = element.nativeElement.parentElement.parentElement;

      elToRemove.remove();
      this.gridStack.removeWidget(elToRemove);
      const template = document.createElement("template");
      template.innerHTML =
        `<div id='widget-${widgetsId}' style="height: 100%"></div>`.trim();
      const widgetElement = template.content.firstChild;
      widgetElement?.appendChild(renderedHtml);
      elToAdd.appendChild(widgetElement);
      this.editingWidgetsData = {};
    } else if (
      this.isAddingNewWidgetByDrag &&
      this.temporaryWidgets.length === 1
    ) {
      const { element } = this.addingNewWidgetsData;
      const elToAdd = element.nativeElement.parentElement.parentElement;
      const elToRemove = element.nativeElement.parentElement;
      elToRemove.remove();
      this.gridStack.removeWidget(elToRemove);
      const template = document.createElement("template");
      template.innerHTML =
        `<div id='widget-${widgetsId}' style="height: 100%"></div>`.trim();
      const widgetElement = template.content.firstChild;
      widgetElement?.appendChild(renderedHtml);
      elToAdd.appendChild(widgetElement);
    } else {
      document
        .getElementById("widget-" + widgetsId.toString())
        ?.appendChild(renderedHtml);
    }
  }

  @HostListener("window:resize", ["$event"])
  onResize(event: any) {
    if (event.target.innerWidth < 1329) {
      this.hideRightPanel = true;
    } else {
      this.hideRightPanel = false;
    }
  }

  onToggle() {
    this.openPannel = !this.openPannel;
  }
}
