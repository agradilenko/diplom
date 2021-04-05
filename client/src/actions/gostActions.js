// Get all projects for specific user
import axios from "axios";
import {GET_GOSTS} from "./types";

export const getGosts = () => dispatch => {
  axios
    .get("/api/gosts")
    .then(res =>
      dispatch({
        type: GET_GOSTS,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_GOSTS,
        payload: null
      })
    );
};