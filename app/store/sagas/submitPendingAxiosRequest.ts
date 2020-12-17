import { put, call, select, all } from 'redux-saga/effects';
import fieldReport from 'app/services/fieldReport';
import * as fieldReportAction from 'app/store/actions/fieldReportAction';
import * as dashboardActions from 'app/store/actions/dashboardAction';
import { getDashboarsStatus } from 'app/services/dashboard';
export default function* submitPendingAxiosRequest(action: any) {
  try {
    const events = action.events;
    //   console.log('evets', events);
    // map all requests
    // let promiseArray = events.map((data) => call(fieldReport, data));
    // const responseData = yield all(promiseArray);
    //   console.log('server response', responseData);
    for (var event of events) {
      const response = yield call(fieldReport, event);
      if (response.data.success) {
        yield put(fieldReportAction.removeServerReportsById(response.data.id));
        // field report reducer removefieldreportsbyid
        yield put(fieldReportAction.removeFieldReportsById(response.data.id));
      }
    }
    const dashboard = yield call(getDashboarsStatus);
    yield put(dashboardActions.onDashboardStatus(dashboard.data));
  } catch (error) {
    // console.log(error);
  }
}
