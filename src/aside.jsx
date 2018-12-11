import { bindMethods, exportToCsv, openDataPage } from "./service";

import React from "react";
import _ from "lodash";
import { connect } from "react-redux";
import { Parser } from "json2csv";
import { openCopyModal } from "./actions/coupon-actions.js";
import s from "./styles/CouponManager/Aside.scss";
import { Button } from "antd";
import * as R from "ramda";
import { showPrint } from "./actions/coupon-actions";

class Aside extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      lang: ""
    };
    bindMethods(this, [
      "openModal",
      "printCoupons",
      "getActiveSetCoupons",
      "getTranslate"
    ]);
  }
  componentDidMount() {
    this.setState({ lang: this.props.storeLang });
  }
  componentWillReceiveProps() {
    this.setState({ lang: this.props.storeLang });
  }
  openModal() {
    this.props.openCopyModal();
  }
  printCoupons() {
    const couponSet = this.getActiveSetCoupons();
    const name = this.props.selectedCoupon.name;
    openDataPage(couponSet, name);
  }

  downloadCsv = () => {
    const data = this.getActiveSetCoupons();
    const fields = [];
    for (let key in data[0]) {
      if (data[0].hasOwnProperty(key) && key.length > 0) {
        fields.push(key);
      }
    }
    try {
      const json2csvParser = new Parser({ fields });
      let result = json2csvParser.parse(data);
      const filename = "coupons.csv";
      if (!result.match(/^data:text\/csv/i)) {
        result = "data:text/csv;charset=utf-8," + result;
      }
      result = encodeURI(result);
      const link = document.createElement("a");
      link.setAttribute("href", result);
      link.setAttribute("download", filename);
      link.click();
    } catch (err) {
      console.error(err);
    }
  };
  getActiveSetCoupons() {
    const selectedCoupons = [];
    this.props.coupons.forEach((el, key) => {
      if (el.name === this.props.selectedCoupon.name) {
        selectedCoupons.push(el);
      }
    });
    return selectedCoupons;
  }

  getTranslate(item) {
    const lang = {
      en: {
        title: "Please select coupon you want to manage",
        copy: "Copy coupon",
        print: "Print coupon",
        downloadCsv: "Download CSV"
      },
      ru: {
        title: "Выберите купон",
        copy: "Копировать купоны",
        print: "Распечатать купоны",
        downloadCsv: "Скачать CSV"
      }
    };
    let isActiveLangRussian = this.state.lang === "ru";
    let useLang = isActiveLangRussian ? "ru" : "en";
    return lang[useLang][item];
  }
  render() {
    return (
      <aside className={s.Aside} style={{ paddingTop: 100 }}>
        <div style={{ padding: 10, background: "#fff" }}>
          <h2>{this.getTranslate("title")}</h2>
          <div>
            <Button
              onClick={this.openModal}
              disabled={R.isEmpty(this.props.selectedCoupon)}
            >
              {this.getTranslate("copy")}
            </Button>
          </div>
          <br />
          <div>
            <Button
              onClick={this.props.showPrint}
              disabled={R.isEmpty(this.props.selectedCoupon)}
            >
              {this.getTranslate("print")}
            </Button>
          </div>
          <br />
          <div>
            <Button
              onClick={this.downloadCsv}
              disabled={R.isEmpty(this.props.selectedCoupon)}
            >
              {this.getTranslate("downloadCsv")}
            </Button>
          </div>
        </div>
      </aside>
    );
  }
}
function mapStateToProps(state) {
  return {
    modal: state.couponReducer.modal,
    selectedCoupon: state.couponReducer.selectedCoupon,
    coupons: state.couponReducer.coupons,
    storeLang: state.couponReducer.storeLang
  };
}
export default connect(
  mapStateToProps,
  { openCopyModal, showPrint }
)(Aside);
