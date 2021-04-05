import { combineReducers } from "redux";
import authReducer from "./authReducer";
import errorReducer from "./errorReducer";
import projectsReducer from "./projectsReducer";
import tasksReducer from "./tasksReducer";
import tzsReducer from "./tzsReducer";
import gostsReducer from "./gostsReducer";
import tagsReducer from "./tagsReducer";

export default combineReducers({
  auth: authReducer,
  errors: errorReducer,
  projects: projectsReducer,
  tasks: tasksReducer,
  tzs: tzsReducer,
  gosts: gostsReducer,
  tags: tagsReducer
});
