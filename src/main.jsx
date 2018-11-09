import SearchInput, { createFilter } from "react-search-input";
import {
  getCouponsFromBase,
  setAppReady,
  setActiveCoupon
} from "./actions/coupon-actions.js";

import React from "react";
import _ from "lodash";
import { bindMethods } from "./service";
import { connect } from "react-redux";
import { Table, Tag, Input } from "antd";
import * as R from "ramda";
import moment from "moment";
import s from "./styles/CouponManager/Main.scss";

const KEYS_TO_FILTERS = ["name", "status", "code"];
const Search = Input.Search;

const columns = [
  {
    title: "Name",
    dataIndex: "name"
  },
  {
    title: "Discount Type",
    dataIndex: "discountType"
  },
  {
    title: "Time",
    dataIndex: "id",
    render(text, record, index) {
      if (!record.expirationDate) return "until deactivated";
      return moment(record.expirationDate).format("MMM D YYYY");
    }
  },
  {
    title: "Status",
    dataIndex: "status",
    render(_, { status }) {
      return <span className={mapCouponStatus(status)}>{status}</span>;
    }
  }
];

function mapCouponStatus(status) {
  switch (status) {
    case "ACTIVE":
      return "active";
    case "PAUSED":
      return "paused";
    case "EXPIRED":
      return "expired";
    case "USEDUP":
      return "usedup";
    default:
      return;
  }
}

class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchTerm: ""
    };
    bindMethods(this, [
      "makeCoupons",
      "mekeCouponsGroups",
      "componentDidMount",
      "searchUpdated",
      "getSearchPlaceholder"
    ]);
  }
  componentDidMount() {
    this.props.getCouponsFromBase();
    if (!this.props.aplication.ready) {
      this.props.setAppReady();
    }
  }
  componentWillReceiveProps(props) {
    if (!props.isCouponsLoaded) {
      this.props.getCouponsFromBase(props.coupons.length);
    }
    if (props.isCouponsLoaded) {
    }
  }
  mekeCouponsGroups(data) {
    const sortByDate = (a, b) => {
      const d1 = new Date(a.updateDate);
      const d2 = new Date(b.updateDate);
      return d2 - d1;
    };
    const couponGroupObj = {};
    data.sort(sortByDate).forEach((obj, id) => {
      if (!couponGroupObj[obj.name]) {
        couponGroupObj[obj.name] = [];
      }
      couponGroupObj[obj.name].push(obj);
    });
    return couponGroupObj;
  }
  makeCoupons(couponsArray) {
    if (_.isObject(couponsArray)) {
      const { search } = this.state;

      const couponsForTable = R.pipe(
        R.groupBy(R.prop("name")),
        R.values,
        R.filter(coupons => {
          if (!search || search.length === 0) return true;
          return R.any(k => {
            return R.any(c => {
              return _.includes(R.toLower(c[k]), R.toLower(search));
            }, coupons);
          }, KEYS_TO_FILTERS);
        }),
        R.map(coupons => {
          return {
            name: coupons[0].name,
            discountType: coupons[0].discountType,
            id: coupons[0].id,
            status: coupons[0].status,
            data: coupons
          };
        })
      );

      const rowSelection = {
        selectedRowKeys: this.props.selectedCoupon.name,
        type: "radio",
        onChange: (selectedRowKeys, selectedRows) => {
          this.props.setActiveCoupon(R.head(selectedRows));
        }
      };

      return (
        <Table
          rowSelection={rowSelection}
          rowKey={r => r.name}
          loading={!this.props.isCouponsLoaded}
          columns={columns}
          dataSource={couponsForTable(couponsArray)}
          size="small"
          expandedRowRender={record =>
            record.data.map(el => (
              <Tag color="blue" key={el.code}>
                {el.code}
              </Tag>
            ))
          }
          pagination={{
            defaultPageSize: 30
          }}
          onRow={record => ({
            onClick: () => {
              this.props.setActiveCoupon(record);
            }
          })}
        />
      );
    }
  }
  searchUpdated(term) {
    this.setState({ searchTerm: term });
  }
  getSearchPlaceholder() {
    return this.props.storeLang === "ru" ? "Поиск" : "Search";
  }
  render() {
    const filteredCoupons = this.props.coupons.filter(
      createFilter(this.state.searchTerm, KEYS_TO_FILTERS)
    );
    return (
      <div>
        <Search
          placeholder={this.getSearchPlaceholder()}
          onSearch={search => this.setState({ search })}
          onChange={e => this.setState({ search: e.target.value })}
          style={{ width: 300 }}
        />
        <br />
        <br />
        {this.makeCoupons(filteredCoupons)}
      </div>
    );
  }
}
function mapStateToProps(state) {
  return {
    coupons: state.couponReducer.coupons,
    aplication: state.couponReducer.aplication,
    selectedCoupon: state.couponReducer.selectedCoupon,
    isCouponsLoaded: state.couponReducer.isCouponsLoaded,
    storeLang: state.couponReducer.storeLang
  };
}
export default connect(
  mapStateToProps,
  { getCouponsFromBase, setAppReady, setActiveCoupon }
)(Main);