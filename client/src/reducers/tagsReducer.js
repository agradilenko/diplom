import {CREATE_TAG, GET_TAGS} from "../actions/types";

const initialState = {};

export default function(state = initialState, action) {
  switch (action.type) {
    case GET_TAGS:
      return action.payload;
    case (CREATE_TAG):
      return {
        ...state,
        tags: [action.payload, ...state.tags]
      }
    default:
      return state;
  }
}
