import React, { Fragment } from "react";
import s from "./styles/CouponManager/CouponManager.scss";
import { bindMethods } from "./service";
import Aside from "./aside.jsx";
import Main from "./main.jsx";
import CopyModal from "./copyModal.jsx";
import { getSoreLang, getCurency } from "./actions/coupon-actions.js";
import { connect } from "react-redux";
import { Layout } from "antd";
import Print from "./print";

import "./App.sass";

const { Header, Footer, Sider, Content } = Layout;

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: ""
    };
    bindMethods(this, ["getTranslate"]);
  }
  componentDidMount() {
    this.props.getSoreLang();
    this.props.getCurency();
  }
  getTranslate(item) {
    const lang = {
      en: {
        title: "Coupon Manager"
      },
      ru: {
        title: "Менеджер Купонов"
      }
    };
    let isActiveLangRussian = this.props.storeLang === "ru";
    let useLang = isActiveLangRussian ? "ru" : "en";
    return lang[useLang][item];
  }
  renderContent() {
    const { print } = this.props;
    if (print) {
      return <Print />;
    }
    return (
      <Fragment>
        <Content className="container">
          <h1>{this.getTranslate("title")}</h1>
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
    return (
      <Layout style={{ minHeight: "100vh" }}>{this.renderContent()}</Layout>
    );
  }
}

function mapStateToProps(state) {
  return {
    storeLang: state.couponReducer.storeLang,
    print: state.couponReducer.print
  };
}
export default connect(
  mapStateToProps,
  { getSoreLang, getCurency }
)(App);
