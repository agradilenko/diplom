import axios from "axios";

import {
  CREATE_TZ,
  UPDATE_TZ,
  DELETE_TZ,
  GET_TZ,
  TZ_LOADING,
  GET_TZS,
  TZS_LOADING
} from "./types";

// Create Tz
export const createTz = tzData => dispatch => {
  axios
    .post("/api/tzs/create", tzData)
    .then(res =>
      dispatch({
        type: CREATE_TZ,
        payload: res.data
      })
    )
    .catch(err => console.log(err));
};

// Update Tz
export const updateTz = tzData => dispatch => {
  axios
    .patch("/api/tzs/update", tzData)
    .then(res =>
      dispatch({
        type: UPDATE_TZ,
        payload: res.data
      })
    )
    .catch(err => console.log(err));
};

// Delete Tz
export const deleteTz = (id, history) => dispatch => {
  axios
    .delete(`/api/tzs/delete/${id}`)
    .then(res =>
      dispatch({
        type: DELETE_TZ,
        payload: id
      })
    )
    .then(res => history.push("/dashboard"))
    .catch(err => console.log(err));
};

// Get specific tz by id
export const getTz = id => dispatch => {
  dispatch(setTzLoading());
  axios
    .get(`/api/tzs/${id}`)
    .then(res =>
      dispatch({
        type: GET_TZ,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_TZ,
        payload: null
      })
    );
};

// Get all tzs for specific user
export const getTzs = () => dispatch => {
  dispatch(setTzsLoading());
  axios
    .get("/api/tzs")
    .then(res =>
      dispatch({
        type: GET_TZS,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_TZS,
        payload: null
      })
    );
};

// Tz loading
export const setTzLoading = () => {
  return {
    type: TZ_LOADING
  };
};

// Tzs loading
export const setTzsLoading = () => {
  return {
    type: TZS_LOADING
  };
};
