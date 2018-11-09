
import React from "react";
import { bindMethods } from "./service";
import s from "./styles/CouponManager/Code.scss";

export default class Code extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    // bindMethods(this, ['']);
  }
  componentDidMount() {}
  render() {
    return (
      <input
        className={`${s.Code} form-control`}
        type="text"
        disabled
        value={this.props.code}
      />
    );
  }
}
