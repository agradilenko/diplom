import {
  CREATE_PART,
  UPDATE_PART,
  DELETE_PART,
  GET_PARTS,
  PARTS_LOADING,
  GET_PART,
  PART_LOADING, GET_PROJECT
} from "../actions/types";

const initialState = {
  parts: [],
  partsLoading: false
};

export default function(state = initialState, action) {
  switch (action.type) {
    case CREATE_PART:
      return {
        ...state,
        parts: [action.payload, ...state.parts]
      };
    case GET_PARTS:
      return {
        ...state,
        parts: action.payload,
        partsLoading: false
      };
    case GET_PART:
      return {
        ...state,
        part: action.payload,
        partLoading: false
      };
    case UPDATE_PART:
      let index = state.parts.findIndex(
        task => task._id === action.payload._id
      );

      state.parts.splice(index, 1);

      return {
        ...state,
        parts: [action.payload, ...state.parts]
      };
    case DELETE_PART:
      return {
        ...state,
        parts: state.parts.filter(task => task._id !== action.payload)
      };
    case PARTS_LOADING:
      return {
        ...state,
        partsLoading: true
      };
    case PART_LOADING:
      return {
        ...state,
        partLoading: true
      };
    default:
      return state;
  }
}
