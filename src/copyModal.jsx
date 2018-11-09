import React from "react";
import { bindMethods } from "./service";
import { connect } from "react-redux";
import {
  closeCopyModal,
  generateCoupons,
  getCouponsFromBase
} from "./actions/coupon-actions.js";
import s from "./styles/CouponManager/Popup.scss";
import Chance from "chance";
import axios from "axios";
import { storeId, accessToken } from "./ecwidConfig";
import { Modal, Input, Form, Button, Checkbox } from "antd";
import * as R from "ramda";
const chance = new Chance();

class CopyModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      show: true,
      copyConfig: {
        amount: 0,
        prefix: "myStore--",
        random: true,
        valid: false
      }
    };
    bindMethods(this, [
      "closeModal",
      "handleChangeNumber",
      "handleChangeprefix",
      "handleChangeRandom",
      "submitGenerator",
      "getRandomCode",
      "getTranslate"
    ]);
  }
  componentDidMount() {}
  closeModal() {
    this.props.closeCopyModal();
  }
  handleChangeNumber(event) {
    const count =
      Math.abs(event.target.value) < 50 ? Math.abs(event.target.value) : 50;
    this.setState(s => {
      s.copyConfig.amount = count;
      return s;
    });
  }
  handleChangeprefix(event) {
    const value = event.target.value;
    this.setState(s => {
      s.copyConfig.prefix = value;
      return s;
    });
  }
  handleChangeRandom() {
    this.setState(s => {
      s.copyConfig.random = !s.copyConfig.random;
      return s;
    });
  }
  getRandomCode(length) {
    return chance.hash({ length });
  }
  submitGenerator() {
    if (
      this.state.copyConfig.amount == 0 ||
      this.state.copyConfig.prefix.length == 0
    ) {
      return alert("Please insert correct form data");
    }
    let promises = [];
    for (var i = 1; i <= this.state.copyConfig.amount; i++) {
      let code = "";
      if (this.state.copyConfig.random) {
        code = this.getRandomCode(12);
      } else {
        code = `${this.state.copyConfig.prefix}-${this.getRandomCode(5)}`;
      }
      promises.push(
        axios.post(
          `https://app.ecwid.com/api/v3/${storeId}/discount_coupons?token=${accessToken}`,
          { ...this.props.selectedCoupon, code }
        )
      );
    }
    axios
      .all(promises)
      .then(result => {
        this.props.getCouponsFromBase();
      })
      .then(this.closeModal())
      .catch(error => console.error(error));
  }
  getTranslate(item) {
    const lang = {
      en: {
        title: "Choose the coupon code prefix and the number of codes",
        random: "Random code:",
        prefix: "Prefix:",
        amount: "Amount:",
        button: "Generate coupons"
      },
      ru: {
        title: "Выберите префикс для кода и их количество",
        random: "Случайный код:",
        prefix: "Префикс:",
        amount: "Количество:",
        button: "Сгенерировать"
      }
    };
    let isActiveLangRussian = this.props.storeLang === "ru";
    let useLang = isActiveLangRussian ? "ru" : "en";
    return lang[useLang][item];
  }
  render() {
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 4 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 8 }
      }
    };
    return (
      <Modal
        visible={this.props.modal.show}
        onCancel={this.closeModal}
        footer={null}
      >
        <div className={`${s.mainPopup} ${s.mainPopup_center}`}>
          <div className={s.mainPopup__container}>
            <h3 className={s.mainPopup__title}>{this.getTranslate("title")}</h3>
            <Form.Item
              label={this.getTranslate("random") + " "}
              {...formItemLayout}
            >
              <Checkbox
                checked={this.state.copyConfig.random}
                onChange={this.handleChangeRandom}
              />
            </Form.Item>
            {!this.state.copyConfig.random ? (
              <Form.Item
                label={this.getTranslate("prefix")}
                {...formItemLayout}
              >
                <Input
                  type="string"
                  className="form-control input-medium"
                  placeholder="MyCoupon-$$$"
                  value={this.state.copyConfig.prefix}
                  onChange={this.handleChangeprefix}
                  disabled={this.state.copyConfig.random}
                />
              </Form.Item>
            ) : (
              ""
            )}

            <Form.Item label={this.getTranslate("amount")} {...formItemLayout}>
              <Input
                type="number"
                className="form-control input-medium"
                placeholder="0"
                value={this.state.copyConfig.amount}
                onChange={this.handleChangeNumber}
                max="50"
              />
            </Form.Item>
            <div className={s.mainPopup__buttons}>
              <Button
                className="btn btn-primary btn-medium"
                onClick={this.submitGenerator}
                disabled={R.isEmpty(this.props.selectedCoupon)}
              >
                {this.getTranslate("button")}
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    );
  }
}
function mapStateToProps(state) {
  return {
    modal: state.couponReducer.modal,
    selectedCoupon: state.couponReducer.selectedCoupon,
    storeLang: state.couponReducer.storeLang
  };
}
export default connect(
  mapStateToProps,
  { closeCopyModal, generateCoupons, getCouponsFromBase }
)(CopyModal);
