import React from "react";
import s from "./styles/CouponManager/CouponManager.scss";
import { bindMethods } from "./service";
import Aside from "./aside.jsx";
import Main from "./main.jsx";
import CopyModal from "./copyModal.jsx";
import { getSoreLang, getCurency } from "./actions/coupon-actions.js";
import { connect } from "react-redux";
import { Layout } from "antd";

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
  render() {
    return (
      <Layout style={{ minHeight: "100vh" }}>
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
      </Layout>
    );
  }
}

function mapStateToProps(state) {
  return {
    storeLang: state.couponReducer.storeLang
  };
}
export default connect(
  mapStateToProps,
  { getSoreLang, getCurency }
)(App);
