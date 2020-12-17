import createReducer from 'app/lib/createReducer';
import * as types from 'app/store/actions/types';

interface IAppState {
  releaseDate: string;
  lastSuccessfullyFetched: string;
}

const initialState: IAppState = {
  releaseDate: '2020-09-21T04:43:52.000Z',
  lastSuccessfullyFetched: '2020-09-21T04:43:52.000Z',
};

interface IAppLastSyncDate {
  date: string;
}

export const appReducer = createReducer(initialState, {
  [types.APP_UPDATE_LAST_SYNCED](state: IAppState, action: IAppLastSyncDate) {
    return {
      ...state,
      lastSuccessfullyFetched: action.date,
    };
  },
  [types.LOG_OUT](state: any) {
    return {
      ...state,
      lastSuccessfullyFetched: '2020-09-21T04:43:52.000Z',
    };
  },
});
