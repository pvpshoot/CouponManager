import React, { Fragment } from "react";
import s from "./styles/CouponManager/CouponManager.scss";
import { bindMethods } from "./service";
import * as R from "ramda";
import Aside from "./aside.jsx";
import Main from "./main.jsx";
import CopyModal from "./copyModal.jsx";
import { getSoreLang, getCurency } from "./actions/coupon-actions.js";
import { connect } from "react-redux";
import { Layout } from "antd";
import Print from "./print";

import "./App.sass";
import { Trans, withNamespaces } from "react-i18next";

const { Header, Footer, Sider, Content } = Layout;

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: ""
    };
  }
  componentDidMount() {
    this.props.getSoreLang();
    this.props.getCurency();
  }

  renderContent() {
    const { print } = this.props;
    if (print) {
      return <Print />;
    }
    return (
      <Fragment>
        <Content className="container">
          <h1>
            <Trans i18nKey="title" />
          </h1>
          <div style={{ background: "#fff", padding: 24, minHeight: 380 }}>
            <Main />
          </div>
        </Content>
        <Sider theme="light">
          <Aside />
          <CopyModal />
        </Sider>
      </Fragment>
    );
  }
  render() {
    return <Layout>{this.renderContent()}</Layout>;
  }
}

function mapStateToProps(state) {
  return {
    storeLang: state.couponReducer.storeLang,
    print: state.couponReducer.print
  };
}

const enhancedComponent = R.pipe(
  connect(
    mapStateToProps,
    { getSoreLang, getCurency }
  ),
  withNamespaces("translation")
);

export default enhancedComponent(App);
