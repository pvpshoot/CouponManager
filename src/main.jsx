import { createFilter } from "react-search-input";
import {
  getCouponsFromBase,
  setAppReady,
  setActiveCoupon
} from "./actions/coupon-actions.js";

import React from "react";
import _ from "lodash";
import { bindMethods } from "./service";
import { connect } from "react-redux";
import { Table, Tag, Input, Button, Progress } from "antd";
import * as R from "ramda";
import moment from "moment";
import s from "./styles/CouponManager/Main.scss";
import CopyButton from "./CopyButton";
import { Trans, withNamespaces } from "react-i18next";

const KEYS_TO_FILTERS = ["name", "status", "code"];
const Search = Input.Search;

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
  columns = [
    {
      title: <Trans i18nKey="main.name" />,
      dataIndex: "name"
    },
    {
      title: <Trans i18nKey="main.discount_type" />,
      dataIndex: "discountType"
    },
    {
      title: <Trans i18nKey="main.time" />,
      dataIndex: "id",
      render(text, record, index) {
        if (!record.expirationDate) return "until deactivated";
        return moment(record.expirationDate).format("MMM D YYYY");
      }
    },
    {
      title: <Trans i18nKey="main.status" />,
      dataIndex: "status",
      render(_, { status }) {
        return <span className={mapCouponStatus(status)}>{status}</span>;
      }
    },
    {
      title: <Trans i18nKey="main.action" />,
      render: (_, row) => {
        return (
          <CopyButton coupon={row}>
            <Trans i18nKey="main.copy" />
          </CopyButton>
        );
      }
    }
  ];

  constructor(props) {
    super(props);
    this.state = {
      searchTerm: ""
    };
    bindMethods(this, [
      "makeCoupons",
      "mekeCouponsGroups",
      "componentDidMount",
      "searchUpdated"
    ]);

    // this.throttle("resize", "optimizedResize");
  }
  componentDidMount() {
    this.props.getCouponsFromBase();
    if (!this.props.aplication.ready) {
      this.props.setAppReady();
    }
    // const update = this.forceUpdate;
    // window.addEventListener("optimizedResize", () => {
    //   update();
    // });
  }
  componentWillReceiveProps(props) {
    if (!props.isCouponsLoaded) {
      this.props.getCouponsFromBase(props.coupons.length);
    }
    if (props.isCouponsLoaded) {
    }
  }
  throttle = (type, name, obj) => {
    obj = obj || window;
    var running = false;
    var func = function() {
      if (running) {
        return;
      }
      running = true;
      requestAnimationFrame(function() {
        obj.dispatchEvent(new CustomEvent(name));
        running = false;
      });
    };
    obj.addEventListener(type, func);
  };
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
  makeCoupons = couponsArray => {
    if (_.isObject(couponsArray)) {
      const { search } = this.state;

      const sortByDate = R.sort((a, b) => {
        return new Date(b.updateDate) - new Date(a.updateDate);
      });

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
            data: sortByDate(coupons)
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
          rowKey={r => {
            return r.name;
          }}
          scroll={{ x: true }}
          loading={!this.props.isCouponsLoaded}
          columns={this.columns}
          dataSource={couponsForTable(couponsArray)}
          size="small"
          expandedRowRender={
            record => (
              <ul style={{ columnCount: 4 }}>
                {record.data.map(el => (
                  <li key={el.code}>{el.code}</li>
                ))}
              </ul>
            )
            // record.data.map(
            // el =>
            // el.code
            // <Tag color="blue" key={el.code}>
            //   {el.code}
            // </Tag>
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
  };
  searchUpdated(term) {
    this.setState({ searchTerm: term });
  }

  renderProgress = () => {
    const { isCouponsLoaded, total, coupons } = this.props;
    return <Progress percent={Math.floor((coupons.length * 100) / total)} />;
  };
  render() {
    const { t } = this.props;
    const filteredCoupons = this.props.coupons.filter(
      createFilter(this.state.searchTerm, KEYS_TO_FILTERS)
    );
    return (
      <div>
        <Search
          placeholder={t("main.search")}
          onSearch={search => this.setState({ search })}
          onChange={e => this.setState({ search: e.target.value })}
          style={{ width: 300 }}
        />
        <br />
        {this.renderProgress()}
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
    storeLang: state.couponReducer.storeLang,
    total: state.couponReducer.total
  };
}

const enhancedComponent = R.pipe(
  connect(
    mapStateToProps,
    { getCouponsFromBase, setAppReady, setActiveCoupon }
  ),
  withNamespaces("translation")
);
export default enhancedComponent(Main);
