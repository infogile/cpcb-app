import createReducer from 'app/lib/createReducer';
import * as types from 'app/store/actions/types';

const initialState = {
  inspections: [],
};

// {
//   "_id": "5f928c445147573a1a2d280c",
//   "factory": {
//       "location": {
//           "coordinates": []
//       },
//       "_id": "5f8fe83e8675327a17952afd",
//       "name": "N.I.F. PVT LTD (Namastey India Food), VILL-BRAHAMPUR SHIVRAJPUR, KANPUR",
//       "sector": {
//           "_id": "5f8faebb8675327a17952364",
//           "name": "food & beverages"
//       },
//       "unitcode": 357,
//       "state": {
//           "_id": "5f8eeba238bc0f72d39ccaa2",
//           "name": "Uttar Pradesh"
//       },
//       "district": {
//           "_id": "5f8eefab38bc0f72d39ccb79",
//           "name": "Kanpur Nagar"
//       },
//       "region": "KANPUR NAGAR",
//       "basin": {
//           "_id": "5f8ef9ba38bc0f72d39ccba8",
//           "name": "ganga"
//       }
//   }
// },

export const inspectionReducer = createReducer(initialState, {
  [types.INSPECTIONS_DATA_RESPONSE](state: any, action: any) {
    return {
      ...state,
      ...action.response,
    };
  },
  [types.INSPECTIONS_REMOVE_BY_ID](state: any, action: any) {
    let myInspectionsIndex = state.inspections.findIndex(
      (e) => e._id === action.id,
    );
    if (myInspectionsIndex > -1) {
      let myField = state.inspections.splice(myInspectionsIndex, 1);
    }
    return {
      ...state,
    };
  },
  [types.SAVE_NEW_FETCHED_INSPECTIONS](state: any, action: any) {
    state.inspections.push(...action.newInspection);
    return {
      ...state,
    };
  },
  [types.LOG_OUT](state: any) {
    return {
      ...state,
      inspections: [],
    };
  },
});
