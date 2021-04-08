import {
  GET_GOST_PARTS,
  GOST_PARTS_LOADING
} from "../actions/types";

const initialState = {
  parts_by_gost: [],
  partsByGostLoading: false
};

export default function(state = initialState, action) {
  switch (action.type) {
    case GET_GOST_PARTS:
      return {
        ...state,
        parts_by_gost: action.payload,
        partsByGostLoading: false
      };
    case GOST_PARTS_LOADING:
      return {
        ...state,
        partsByGostLoading: true
      };
    default:
      return state;
  }
}
