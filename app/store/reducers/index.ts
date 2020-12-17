/*
 * combines all th existing reducers
 */
import * as loadingReducer from './loadingReducer';
import * as loginReducer from './loginReducer';
import * as themeReducer from './themeReducer';
import * as dashboard from './dashboardReducer';
import * as inspection from './inspectionReducer';
import * as appReducer from './appReducer';
import * as fieldReportReducer from './fieldReportReducer';
export default Object.assign(
  loginReducer,
  loadingReducer,
  themeReducer,
  dashboard,
  inspection,
  appReducer,
  fieldReportReducer,
);
