import { put, call, select } from 'redux-saga/effects';
// import * as fieldReportAction from 'app/store/actions/fieldReportAction';
import * as inspectionReportAction from 'app/store/actions/inspectionAction';
import * as fieldReportAction from 'app/store/actions/fieldReportAction';
import * as dashboardActions from 'app/store/actions/dashboardAction';
import fieldReport from 'app/services/fieldReport';
import { getDashboarsStatus } from 'app/services/dashboard';
import { navigateToSectors } from 'app/store/actions/navigationActions';
import { Alert, ToastAndroid } from 'react-native';
export default function* fieldReportSubmissionAsync(action: any) {
  console.log('Making Request');
  console.log('ddddddddddddddddddddddddddddddddddddddd',action.data.id)
  try {
    // Remove this inspection after submit
    yield put(inspectionReportAction.removeInspectionById(action.data.id));
    // // field report reducer removefieldreportsbyid
    yield put(fieldReportAction.removeFieldReportsById(action.data.id));
    // Make Axios Request
    let response = yield call(fieldReport, action.data, action.setProgress);
    // response['data'] = {'success':'true'}
    // console.log(response);
    // if response success - true
    // console.log('form data', action.data);
    // console.log(response);
    console.log('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',response.data)
    if (response.data.payload.success) {
      console.log("chal gaya bro nice wwwwwwwwwwwwww")
      // Navigate to sectors
      yield call(navigateToSectors);
      // field report reducer removefieldreportsbyid
      yield put(fieldReportAction.removeFieldReportsById(action.data.id));
      // update dashboard and update inspections
      const dashboard = yield call(getDashboarsStatus);
      yield put(dashboardActions.onDashboardStatus(dashboard.data));
      // field report reducer removeserverreportsbyid
      yield put(fieldReportAction.removeServerReportsById(action.data.id));
    }
  } catch (error) {
    // console.log(error);
    // console.log(error);
    // Alert.alert('Unable to complete your request');
    console.log(error);
    Alert.alert(JSON.stringify(error));
    ToastAndroid.show('Unable to Submit data super cool', ToastAndroid.LONG);
  }
}
