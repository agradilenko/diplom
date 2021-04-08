import axios from "axios";

import {
  CREATE_PART,
  UPDATE_PART,
  DELETE_PART,
  GET_PARTS,
  PARTS_LOADING, GET_PART, PART_LOADING
} from "./types";

// Create Task
export const createPart = partData => dispatch => {
  axios
    .post("/api/tz_parts/create", partData)
    .then(res =>
      dispatch({
        type: CREATE_PART,
        payload: res.data
      })
    )
    .catch(err => console.log(err));
};

// Get tz_parts by tz id
export const getParts = id => dispatch => {
  dispatch(setPartsLoading());
  axios
    .get(`/api/tz_parts/${id}`)
    .then(res =>
      dispatch({
        type: GET_PARTS,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_PARTS,
        payload: null
      })
    );
};

// Get tz_parts by tz id
export const getPart = (tzid, partbygostid) => dispatch => {
  dispatch(setPartLoading());
  axios
    .get(`/api/tz_parts/${tzid}/${partbygostid}`)
    .then(res =>
      dispatch({
        type: GET_PART,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_PART,
        payload: null
      })
    );
};

// Delete Part
export const deletePart = id => dispatch => {
  axios
    .delete(`/api/tz_parts/delete/${id}`)
    .then(res =>
      dispatch({
        type: DELETE_PART,
        payload: id
      })
    )
    .catch(err => console.log(err));
};

// Update Part
export const updatePart = partData => dispatch => {
  axios
    .patch("/api/tz_parts/update", partData)
    .then(res =>
      dispatch({
        type: UPDATE_PART,
        payload: res.data
      })
    )
    .catch(err => console.log(err));
};

// Parts loading
export const setPartsLoading = () => {
  return {
    type: PARTS_LOADING
  };
};

// Part loading
export const setPartLoading = () => {
  return {
    type: PART_LOADING
  };
};
