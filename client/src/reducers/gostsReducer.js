import { GET_GOSTS } from "../actions/types";

const initialState = {};

export default function(state = initialState, action) {
  switch (action.type) {
    case GET_GOSTS:
      return {
        ...state,
        gosts: action.payload,
      };
    default:
      return state;
  }
}
