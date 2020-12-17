import createReducer from 'app/lib/createReducer';
import * as types from 'app/store/actions/types';

const initialState = {
  fieldReports: [],
  serverReports: [],
};
export const fieldReportReducer = createReducer(initialState, {
  [types.SAVE_LOCAL_FIELD](state: any, action: any) {
    let myFieldIndex = state.fieldReports.findIndex(
      (e) => e.id === action.data.id,
    );
    if (myFieldIndex > -1) {
      let myField = state.fieldReports.splice(myFieldIndex, 1);
      // make changes
      let fieldReports = state.fieldReports.push(action.data);
    } else {
      let fieldReports = state.fieldReports.push(action.data);
    }
    return {
      ...state,
    };
  },
  [types.SUBMIT_TO_SERVER](state: any, action: any) {
    let myFieldIndex = state.serverReports.findIndex(
      (e) => e.id === action.data.id,
    );
    if (myFieldIndex > -1) {
      let myField = state.serverReports.splice(myFieldIndex, 1);
      // make changes
      let fieldReports = state.serverReports.push(action.data);
    } else {
      let fieldReports = state.serverReports.push(action.data);
    }
    return {
      ...state,
    };
  },
  [types.FIELD_REPORT_REMOVE_BY_ID](state: any, action: any) {
    let myFieldIndex = state.fieldReports.findIndex((e) => e.id === action.id);
    if (myFieldIndex > -1) {
      let myField = state.fieldReports.splice(myFieldIndex, 1);
    }
    return {
      ...state,
    };
  },
  [types.SERVER_REPORT_REMOVE_BY_ID](state: any, action: any) {
    let myFieldIndex = state.serverReports.findIndex((e) => e.id === action.id);
    if (myFieldIndex > -1) {
      let myField = state.serverReports.splice(myFieldIndex, 1);
    }
    return {
      ...state,
    };
  },
  [types.LOG_OUT](state: any) {
    return {
      ...state,
      fieldReports: [],
      serverReports: [],
    };
  },
});
