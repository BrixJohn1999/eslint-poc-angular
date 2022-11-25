import { Widgets } from 'src/app/model/widgets.model';

export interface UserWidgetsResponse {
  userWidgets: WidgetsData;
}

export interface AccessibleWidgetsResponse {
  accessibleWidgets: WidgetsData;
}

interface WidgetsData {
  message: string;
  statusCode: number;
  result: Widgets[];
}
