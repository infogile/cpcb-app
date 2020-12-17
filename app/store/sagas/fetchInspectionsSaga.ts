import { put, call, select } from 'redux-saga/effects';
import * as inspectionAction from 'app/store/actions/inspectionAction';
import * as appAction from 'app/store/actions/appAction';
import { getInspection } from 'app/services/inspection';

export default function* fetchInspectionAsync() {
  const LastSycAt = new Date().toISOString();
  // get last fetched time
  const lastSyncedAt = (state: any) => state.appReducer.lastSuccessfullyFetched;
  const lastSyncDate = yield select(lastSyncedAt);
  // console.log('fetching data...');
  const newInspection = yield call(getInspection, lastSyncDate);
  if (newInspection.data.length > 0 && Array.isArray(newInspection.data)) {
    // update last synced at
    yield put(appAction.updateLastFetched(LastSycAt));
    yield put(inspectionAction.saveNewInspections(newInspection.data));
  }
  if (newInspection.data.length === 0 && Array.isArray(newInspection.data)) {
    yield put(appAction.updateLastFetched(LastSycAt));
  }
}
