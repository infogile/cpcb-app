export interface IDashboardDataResponse {
  totalAssigned: number;
  totalInspected: number;
  totalClosed: number;
  totalBypass: number;
}

export interface IDashboardDataRequest {
  date: string;
}
