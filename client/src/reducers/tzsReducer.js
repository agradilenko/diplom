import {
  CREATE_TZ,
  UPDATE_TZ,
  DELETE_TZ,
  GET_TZ,
  TZ_LOADING,
  GET_TZS,
  TZS_LOADING
} from "../actions/types";

const initialState = {
  tzs: [],
  tz: [],
  tzLoading: false,
  tzsLoading: false
};

export default function(state = initialState, action) {
  switch (action.type) {
    case CREATE_TZ:
      return {
        ...state,
        tzs: [action.payload, ...state.tzs]
      };
    case UPDATE_TZ:
      let index = state.tzs.findIndex(
        tz => tz._id === action.payload._id
      );

      state.tzs.splice(index, 1);

      return {
        ...state,
        tzs: [action.payload, ...state.tzs]
      };
    case DELETE_TZ:
      return {
        ...state,
        tzs: state.tzs.filter(
          tz => tz._id !== action.payload
        )
      };
    case GET_TZ:
      return {
        ...state,
        tz: action.payload,
        tzLoading: false
      };
    case GET_TZS:
      return {
        ...state,
        tzs: action.payload,
        tzsLoading: false
      };
    case TZ_LOADING:
      return {
        ...state,
        tzLoading: true
      };
    case TZS_LOADING:
      return {
        ...state,
        tzsLoading: true
      };
    default:
      return state;
  }
}
