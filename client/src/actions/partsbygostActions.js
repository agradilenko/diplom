import axios from "axios";

import {
  GET_GOST_PARTS,
  GOST_PARTS_LOADING,
} from "./types";

// Get tz_parts by gost id
export const getPartsByGost = (id) => (dispatch) => {
  dispatch(setPartsLoading());
  axios
    .get(`/api/tz_parts_by_gosts/${id}`)
    .then((res) =>
      dispatch({
        type: GET_GOST_PARTS,
        payload: res.data,
      })
    )
    .catch((err) =>
      dispatch({
        type: GET_GOST_PARTS,
        payload: null,
      })
    );
};

// Gost Parts loading
export const setPartsLoading = () => {
  return {
    type: GOST_PARTS_LOADING,
  };
};
