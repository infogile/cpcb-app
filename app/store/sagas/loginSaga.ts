/* Redux saga class
 * logins the user into the app
 * requires username and password.
 * un - username
 * pwd - password
 */
import { put, call, select, all } from 'redux-saga/effects';
import { Alert, ToastAndroid } from 'react-native';
// import { delay } from 'redux-saga';
// import loginUser from 'app/services/loginUser';
import * as loginActions from 'app/store/actions/loginActions';
import * as dashboardActions from 'app/store/actions/dashboardAction';
import * as inspectionAction from 'app/store/actions/inspectionAction';
import * as appAction from 'app/store/actions/appAction';
import loginUser from 'app/services/loginUser';
import { getDashboarsStatus } from 'app/services/dashboard';
import { getInspection } from 'app/services/inspection';
// Our worker Saga that logins the user

export default function* loginAsync(action: any) {
  try {
    const lastSyncedAt = (state: any) =>
      state.appReducer.lastSuccessfullyFetched;
    yield put(loginActions.enableLoader());
    const response = yield call(loginUser, action.username, action.password);
    // console.log(response.data);

    //mock response
    // const response = { success: true, token: "Bearer ..." };
    if (response.data.success) {
      yield put(loginActions.onLoginResponse(response.data));
      yield put(loginActions.disableLoader());
      // Call App init function
      const LastSycAt = new Date().toISOString();
      const lastSyncDate = yield select(lastSyncedAt);
      // TODO: Register A Scheduled function for fetch data
      // Run a Background service for fetch current data
      // console.log(lastSyncDate);
      //
      //
      // const dashboard = yield call(getDashboarsStatus, lastSyncDate);
      // yield put(dashboardActions.onDashboardStatus(dashboard.data));
      //
      //
      // const Inspection = yield call(getInspection, lastSyncDate);
      // yield put(
      //   inspectionAction.onInspectionData({ inspections: Inspection.data }),
      // );
      // console.log(Inspection.data);
      const [dashboard, Inspection] = yield all([
        call(getDashboarsStatus),
        call(getInspection, lastSyncDate),
      ]);
      // console.log('dashboard', dashboard);
      // console.log('Inspection', Inspection);
      yield put(dashboardActions.onDashboardStatus(dashboard.data));
      yield put(
        inspectionAction.onInspectionData({ inspections: Inspection.data }),
      );
      // update last fetched date
      yield put(appAction.updateLastFetched(LastSycAt));
      // Axios Request for get Data
      // const DashobardAndInspectionsData = yield call();
      // no need to call navigate as this is handled by redux store with SwitchNavigator
      //yield call(navigationActions.navigateToHome);
    } else {
      yield put(loginActions.loginFailed());
      yield put(loginActions.disableLoader());
      ToastAndroid.show('Login Failed', ToastAndroid.LONG);
      Alert.alert('Login Failed');
    }
  } catch (err) {
    // console.log(err);
    yield put(loginActions.loginFailed());
    yield put(loginActions.disableLoader());
    ToastAndroid.show('Login Failed', ToastAndroid.LONG);
    Alert.alert('Login Failed');
  }
}
