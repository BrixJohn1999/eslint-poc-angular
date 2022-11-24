import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModalModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { NotificationBarComponent } from '../../components/notification-bar/notification-bar.component';
import { SideBarComponent } from '../../components/side-bar/side-bar.component';
import { MainDashboardComponent } from '../../components/main-dashboard/main-dashboard.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { JwtInterceptor } from 'src/app/interceptors/jwt.interceptor';
import { SummaryComponent } from 'src/app/components/widgets/summary/summary.component';
import { StatisticsComponent } from 'src/app/components/widgets/statistics/statistics.component';
import { PieComponent } from 'src/app/components/widgets/pie/pie.component';
import { ApolloModule, APOLLO_FLAGS, APOLLO_OPTIONS } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { InMemoryCache } from '@apollo/client/cache';
import { environment } from 'src/environments/environment';
import { AuthService } from 'src/app/service/auth.service';
import { StatisticsService } from 'src/app/service/statistics.service';
import { SummaryService } from 'src/app/service/summary.service';
import { CookieService } from 'ngx-cookie-service';
import { ChartService } from 'src/app/service/chart.service';
import { NavigationComponent } from 'src/app/components/navigation/navigation.component';
import { FooterComponent } from 'src/app/components/footer/footer.component';
import { RedirectPageComponent } from 'src/app/components/redirect-page/redirect-page.component';
import { MyLibModule } from 'myaccess-storybook';
import { ModalDialogComponent } from 'src/app/modals/modal-dialog/modal-dialog.component';
import { ConfigureWidgetComponent } from 'src/app/components/widgets/configure-widget/configure-widget.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    NotificationBarComponent,
    SideBarComponent,
    MainDashboardComponent,
    SummaryComponent,
    StatisticsComponent,
    PieComponent,
    NavigationComponent,
    FooterComponent,
    RedirectPageComponent,
    ModalDialogComponent,
    ConfigureWidgetComponent,
  ],
  imports: [
    CommonModule,
    MyLibModule,
    FontAwesomeModule,
    ReactiveFormsModule,
    FormsModule,
    NgbModalModule,
    NgbModule,
    DashboardRoutingModule,
    NgxChartsModule,
    HttpClientModule,
    ApolloModule,
  ],
  providers: [
    AuthService,
    StatisticsService,
    SummaryService,
    ChartService,
    CookieService,
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    {
      provide: APOLLO_FLAGS,
      useValue: {
        useInitialLoading: true, // enable it here
      },
    },
    {
      provide: APOLLO_OPTIONS,
      useFactory: (httpLink: HttpLink) => {
        return {
          cache: new InMemoryCache(),
          link: httpLink.create({
            uri: environment.authGqlUrl,
          }),
        };
      },
      deps: [HttpLink],
    },
  ],
})
export class DashboardAdmin {}
