import { createStore } from "redux";
import AppReducer from "./reducers/app-reducer";

const store = createStore(AppReducer);

export default store;
