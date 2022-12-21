import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, ReplaySubject, take } from 'rxjs';
import { WidgetsArgs } from '../gql/args/widgets.args';
import { Apollo } from 'apollo-angular';
import {
  AccessibleWidgetsResponse,
  UserWidgetsResponse,
} from '../gql/response/widgets.response';
import { environment } from '../../environments/environment';
import { GET_ACCESSIBLE_WIDGETS } from '../gql/query/widgets.query';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private isEdit = new BehaviorSubject<boolean>(false);
  isEditing$ = this.isEdit.asObservable();
  private widgetData = new ReplaySubject<any>(1);
  widgetData$ = this.widgetData.asObservable();

  constructor(private apollo: Apollo, private http: HttpClient) {}

  async getWidgetsData(widgetsArgs: WidgetsArgs, query: any) {
    const result = await this.apollo
      .watchQuery<UserWidgetsResponse>({
        query,
      })
      .refetch(widgetsArgs);
    return result.data.userWidgets.result;
  }

  async getAccessibleWidgets(widgetsArgs: WidgetsArgs) {
    const result = await this.apollo
      .watchQuery<AccessibleWidgetsResponse>({
        query: GET_ACCESSIBLE_WIDGETS,
      })
      .refetch(widgetsArgs);
    return result.data.accessibleWidgets.result;
  }

  saveWidgets(payload: object) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    const options = { headers };
    return this.http.post(
      `${environment.apiDashboard}arrange-widgets`,
      payload,
      options
    );
  }

  setEdit(val: boolean) {
    this.isEdit.next(val);
  }

  getEdit(): Observable<any> {
    return this.isEdit.pipe(take(1));
  }

  setWidgetData(data: any) {
    this.widgetData.next(data);
  }
}
