import { createStore, applyMiddleware } from "redux";
// import { createLogger } from "redux-logger";
import thunk from "redux-thunk";
import reducers from "./reducers/index.js";
import promiseMiddleware from "redux-promise";

// const logger = createLogger();

const deVstore = createStore(
  reducers,
  applyMiddleware(thunk, promiseMiddleware)
);
const prodStore = createStore(
  reducers,
  applyMiddleware(thunk, promiseMiddleware)
);

const store = process.env.NODE_ENV === "production" ? prodStore : deVstore;

export default store;
