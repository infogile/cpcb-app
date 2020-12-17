import * as types from './types';

export function onDashboardStatus(response: any) {
  return { type: types.DASHBOARD_DATA_RESPONSE, response };
}
