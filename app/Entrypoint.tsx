/**
 * React Native App
 * Everything starts from the entrypoint
 */
import React, { useEffect } from 'react';
import { ActivityIndicator } from 'react-native';
import { Provider, useSelector, useDispatch } from 'react-redux';
import { PersistGate } from 'redux-persist/es/integration/react';
import { fetchInspection } from 'app/store/actions/inspectionAction';
import { submitPendingRequest } from 'app/store/actions/fieldReportAction';
import {
  DarkTheme as PaperDarkTheme,
  DefaultTheme as PaperDefaultTheme,
  Provider as PaperProvider,
} from 'react-native-paper';
import {
  DefaultTheme as NavigationDefaultTheme,
  DarkTheme as NavigationDarkTheme,
} from '@react-navigation/native';

import Navigator from 'app/navigation';
import configureStore from 'app/store';
import { ILoginState } from 'app/models/reducers/login';
import setAuthHeader from './utils/setAuthHeader';
import SplashScreen from 'app/screens/SplashScreen/SplashScreen';

const CombinedDefaultTheme = {
  ...PaperDefaultTheme,
  ...NavigationDefaultTheme,
};
const CombinedDarkTheme = {
  ...PaperDarkTheme,
  ...NavigationDarkTheme,
};

const { persistor, store } = configureStore();

interface IState {
  loginReducer: ILoginState;
}
function diff_hours(dt2, dt1) {
  var diff = (dt2.getTime() - dt1.getTime()) / 1000;
  // console.log(diff);
  diff /= 60 * 60;
  return Math.abs(Math.round(diff));
}

const RootNavigation: React.FC = () => {
  const token = useSelector((state: IState) => state.loginReducer.token);
  const isLogedIn = useSelector((state: any) => state.loginReducer.isLoggedIn);
  const lastFetchedAt = useSelector(
    (state: any) => state.appReducer.lastSuccessfullyFetched,
  );
  // get all pending requests
  const pendingAxiosRequest = useSelector(
    (state: any) => state.fieldReportReducer.serverReports,
  );

  setAuthHeader(token);
  const dispatch = useDispatch();
  useEffect(() => {
    if (isLogedIn) {
      // if currentdate is greater than lastFetchedAt by 5 and above fetch data
      const difference = diff_hours(new Date(), new Date(lastFetchedAt));
      if (difference >= 1) {
        dispatch(fetchInspection());
      }
      if (pendingAxiosRequest.length > 0) {
        // dispatch a event SUBMIT_PENDING_AXIOS_REQUEST
        dispatch(submitPendingRequest(pendingAxiosRequest));
      }
    }
  }, []);

  return (
    <PaperProvider theme={PaperDefaultTheme}>
      <Navigator theme={CombinedDefaultTheme} />
    </PaperProvider>
  );
};

const Entrypoint: React.FC = () => {
  return (
    <Provider store={store}>
      <PersistGate
        loading={<SplashScreen />}
        persistor={persistor}
        onBeforeLift={() =>
          new Promise((resolve) => setTimeout(resolve, 2000))
        }>
        <RootNavigation />
      </PersistGate>
    </Provider>
  );
};

export default Entrypoint;
