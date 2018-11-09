import Code from "./code.jsx";
import React from "react";
import { bindMethods } from "./service";
import { connect } from "react-redux";
import moment from "moment";
import s from "./styles/CouponManager/Coupon.scss";
import { setActiveCoupon } from "./actions/coupon-actions.js";

class Coupon extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false
    };
    bindMethods(this, [
      "componentDidMount",
      "toggleCoupon",
      "getCouponDate",
      "getCouponStatus",
      "makeCodes",
      "selectCoupon"
    ]);
  }
  componentWillMount() {
    moment.locale(this.props.storeLang);
  }
  componentDidMount() {
    if (this.props.active) {
      this.props.setActiveCoupon(this.props.data);
    }
  }
  toggleCoupon() {
    return this.setState({ open: !this.state.open });
  }
  getCouponDate(date) {
    return moment(date).format("MMM D YYYY");
  }
  getCouponStatus(status) {
    switch (status) {
      case "ACTIVE":
        return "active";
        break;
      case "PAUSED":
        return "paused";
        break;
      case "EXPIRED":
        return "expired";
        break;
      case "USEDUP":
        return "usedup";
        break;
    }
  }
  getCouponStatusText(status) {
    const isRussian = this.props.storeLang === "ru";
    switch (status) {
      case "ACTIVE":
        return isRussian ? "Активный" : "Active";
        break;
      case "PAUSED":
        return isRussian ? "Приостановлен" : "Paused";
        break;
      case "EXPIRED":
        return isRussian ? "Просроченый" : "Expired";
        break;
      case "USEDUP":
        return isRussian ? "Использованый" : "Usedup";
        break;
    }
  }
  makeCodes() {
    return this.props.codes.map((item, key) => {
      return <Code code={item} key={key} />;
    });
  }
  selectCoupon(obj) {
    this.props.setActiveCoupon(obj);
  }
  getDiscountType(type) {
    const isRussian = this.props.storeLang === "ru";
    switch (type) {
      case "ABS":
        return isRussian ? `${this.props.currency} скидки` : "ABS";
        break;
      case "PERCENT":
        return isRussian ? "Скидки в %" : "PERCENT";
        break;
      case "SHIPPING":
        return isRussian ? "Бесплатная доставка" : "SHIPPING";
        break;
      case "ABS_AND_SHIPPING":
        return isRussian
          ? `Бесплатная доставка + ${this.props.currency} скидки`
          : "ABS_AND_SHIPPING";
        break;
      case "PERCENT_AND_SHIPPING":
        return isRussian
          ? "Бесплатная доставка + % скидки"
          : "PERCENT_AND_SHIPPING";
        break;
    }
  }
  getEndTime(time) {
    const isRussian = this.props.storeLang === "ru";
    if (!time) {
      return isRussian ? "Бессрочный" : "until deactivated";
    }
    return this.getCouponDate(this.props.data.expirationDate);
  }
  render() {
    return (
      <div className={s.container}>
        <div className={`${s.Coupon} ${this.state.open ? s.CouponOpen : ""}`}>
          <div className={`${s.checkbox} normalized`}>
            <div className="radio">
              <label>
                <input
                  type="radio"
                  name="coupon"
                  value="9999"
                  defaultChecked={this.props.active}
                  onChange={this.selectCoupon.bind(this, this.props.data)}
                />
                <span className={`radio-label ${s.radioLabel}`} />
              </label>
            </div>
          </div>
          <div className={s.name}>{this.props.data.name}</div>
          <div className={s.discount}>
            {this.getDiscountType(this.props.data.discountType)}
          </div>
          <div className={s.date}>
            <span className={s.disabled}>
              {this.getCouponDate(this.props.data.creationDate)}
            </span>
            -{this.getEndTime(this.props.data.expirationDate)}
          </div>
          <div
            className={`
          ${s.status}
          ${s[this.getCouponStatus(this.props.data.status)]}
        `}
          >
            {this.getCouponStatusText(this.props.data.status)}
          </div>
          <div
            className={`${s.toggler}   ${this.state.open ? s.togglerOpen : ""}`}
            onClick={this.toggleCoupon}
          >
            <span className="icon-arr-down" />
          </div>
        </div>
        <div
          className={`${s.footer} ${
            this.state.open ? s.footerOpen : ""
          } normalized`}
        >
          {this.makeCodes()}
        </div>
      </div>
    );
  }
}
function mapStateToProps(state) {
  return {
    selectedCoupon: state.couponReducer.selectedCoupon,
    storeLang: state.couponReducer.storeLang,
    currency: state.couponReducer.currency
  };
}
export default connect(
  mapStateToProps,
  { setActiveCoupon }
)(Coupon);
