import React from "react";
import ReactDOM from "react-dom";
import { Provider, connect } from "react-redux";
import store from "./store";
import App from "./App.jsx";
import "./ecwidConfig";
import * as serviceWorker from "./serviceWorker";
import i18n from "i18next";
import { withI18n, reactI18nextModule } from "react-i18next";
import Backend from "i18next-xhr-backend";

i18n
  .use(Backend)
  .use(reactI18nextModule)
  .init({
    fallbackLng: "en",
    debug: true,
    interpolation: {
      escapeValue: false // not needed for react as it escapes by default
    },
    react: {
      wait: true
    }
  });

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
