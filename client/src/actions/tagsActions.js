import axios from "axios";
import { CREATE_TAG, GET_TAGS } from "./types";

export const getTags = () => (dispatch) => {
  axios
    .get("/api/tags")
    .then((res) =>
      dispatch({
        type: GET_TAGS,
        payload: res.data,
      })
    )
    .catch((err) =>
      dispatch({
        type: GET_TAGS,
        payload: null,
      })
    );
};

// Create Task
export const createTag = (tagData) => (dispatch) => {
  axios
    .post("/api/tags/create", tagData)
    .then((res) =>
      dispatch({
        type: CREATE_TAG,
        payload: res.data,
      })
    )
    .catch((err) => console.log(err));
};