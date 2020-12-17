import * as types from './types';

export function updateLastFetched(date: string) {
  return { type: types.APP_UPDATE_LAST_SYNCED, date: date };
}
