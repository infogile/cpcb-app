/**
 *  Redux saga class init
 */
import { takeEvery, all } from 'redux-saga/effects';
import * as types from '../actions/types';
import loginSaga from './loginSaga';
import fieldReportSaga from './fieldreportSaga';
import fetchInspectionSaga from './fetchInspectionsSaga';
import submitPendingRequest from './submitPendingAxiosRequest';
export default function* watch() {
  yield all([takeEvery(types.LOGIN_REQUEST, loginSaga)]);
  yield all([takeEvery(types.SUBMIT_TO_SERVER, fieldReportSaga)]);
  yield all([takeEvery(types.FETCH_INSPECTIONS, fetchInspectionSaga)]);
  yield all([
    takeEvery(types.SUBMIT_PENDING_AXIOS_REQUEST, submitPendingRequest),
  ]);
}
