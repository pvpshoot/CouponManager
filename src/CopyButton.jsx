import React from "react";
import { Button } from "antd";
import { connect } from "react-redux";
import { setActiveCoupon, openCopyModal } from "./actions/coupon-actions";

function CopyButton(props) {
  return (
    <Button
      onClick={() => {
        props.setActiveCoupon(props.coupon);
        props.openCopyModal();
      }}
    >
      {props.children}
    </Button>
  );
}

CopyButton.defaultProps = {
  children: "Copy"
};

export default connect(
  null,
  { setActiveCoupon, openCopyModal }
)(CopyButton);
