import * as types from './types';

export function saveSelfie(uri: string, id: string) {
  return {
    type: types.SAVE_SELFIE,
    uri,
    id,
  };
}

export function markEntry(coordinates: [number], id: string) {
  return {
    type: types.MARK_ENTRY,
    coordinates,
    id,
  };
}

// make a saga request;
export function markExit(coordinates: [number], id: string, images: [string]) {
  return {
    type: types.MARK_EXIT,
    coordinates,
    id,
    images,
  };
}

export function saveFieldReport(data: any, id: string) {
  return {
    type: types.SAVE_FIELD_DATA,
    data,
    id,
  };
}

// make sos request;
export function makeSosRequest(data: any, id: string) {
  return {
    type: types.MAKE_SOS_REQUEST,
    data,
    id,
  };
}

// save localfield
export function saveLocalFunction(data: any) {
  return {
    type: types.SAVE_LOCAL_FIELD,
    data,
  };
}

// save serverfields, remove localfield,

export function saveServerData(data: any, setProgress: any) {
  return {
    type: types.SUBMIT_TO_SERVER,
    data,
    setProgress,
  };
}

export function removeFieldReportsById(id: string) {
  return { type: types.FIELD_REPORT_REMOVE_BY_ID, id };
}

export function removeServerReportsById(id: string) {
  return { type: types.SERVER_REPORT_REMOVE_BY_ID, id };
}

export function submitPendingRequest(requests: any) {
  return { type: types.SUBMIT_PENDING_AXIOS_REQUEST, events: requests };
}

