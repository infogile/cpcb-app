import * as types from './types';

export function onInspectionData(response: any) {
  return { type: types.INSPECTIONS_DATA_RESPONSE, response };
}

export function removeInspectionById(id: any) {
  return { type: types.INSPECTIONS_REMOVE_BY_ID, id };
}
export function saveNewInspections(newInspection: any) {
  return {
    type: types.SAVE_NEW_FETCHED_INSPECTIONS,
    newInspection: newInspection,
  };
}
export function fetchInspection() {
  return { type: types.FETCH_INSPECTIONS };
}
