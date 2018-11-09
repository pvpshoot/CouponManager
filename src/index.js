import React from "react";
import ReactDOM from "react-dom";
import { Provider, connect } from "react-redux";
import store from "./store";
import App from "./App.jsx";
import "./ecwidConfig";
import * as serviceWorker from "./serviceWorker";

class CouponManager extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <Provider store={store}>
        <App />
      </Provider>
    );
  }
}

ReactDOM.render(<CouponManager />, document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
