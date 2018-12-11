import { connect } from "react-redux";
import { JSONToCSVConvertor } from "./service";
import tableify from "tableify";
import React from "react";
import { Button } from "antd";
import { hidePrint } from "./actions/coupon-actions";

export function openDataPage(json, title) {
  const container = function(title, data) {
    return `<div>
          <h1>${title}</h1>
            <div style="padding: 20px;
                        background: rgba(0,0,0,.1);
                        border-radius: 8px;
                        margin-bottom: 40px;"
            >
              ${data}
            </div>
        </div>
        `;
  };
  const _JSON_ = container(`JSON: ${title}`, JSON.stringify(json));
  const _CSV_ = container(`CSV: ${title}`, JSONToCSVConvertor(json, title));
  const _TABLE_ = container(`TABLE: ${title}`, tableify(json));

  const html = `
          ${_JSON_}
          ${_CSV_}
          ${_TABLE_}
    `;

  return html;
}

class Print extends React.Component {
  getActiveSetCoupons = () => {
    const selectedCoupons = [];
    this.props.coupons.forEach((el, key) => {
      if (el.name === this.props.selectedCoupon.name) {
        selectedCoupons.push(el);
      }
    });
    return selectedCoupons;
  };
  render() {
    const { name } = this.props.selectedCoupon;
    const couponSet = this.getActiveSetCoupons();

    return (
      <div>
        <Button onClick={this.props.hidePrint}>Go back</Button>
        <div
          dangerouslySetInnerHTML={{ __html: openDataPage(couponSet, name) }}
        />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  selectedCoupon: state.couponReducer.selectedCoupon,
  coupons: state.couponReducer.coupons
});

export default connect(
  mapStateToProps,
  { hidePrint }
)(Print);
