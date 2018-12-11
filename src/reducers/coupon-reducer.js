import * as types from "../actions/action-types";
import * as R from "ramda";

const initialState = {
  selectedCoupon: "",
  coupons: [],
  isCouponsLoaded: true,
  isCouponsLoading: false,
  aplication: {
    ready: false
  },
  modal: {
    show: false
  },
  storeLang: "",
  currency: ""
};

const couponReducer = function(state = initialState, action) {
  switch (action.type) {
    case types.GET_INIT_COUPONS_FROM_BASE:
      return { ...state, isCouponsLoading: true };
    case types.GET_COUPONS_FROM_BASE:
      const uniqCoupons = R.uniqWith(
        (a, b) => {
          return a.name === b.name && a.id === b.id;
        },
        [...state.coupons, ...action.payload.items]
      );
      // debugger; //eslint-disable-line
      return {
        ...state,
        coupons: uniqCoupons,
        isCouponsLoaded:
          action.payload.total ===
            [...state.coupons, ...action.payload.items].length ||
          action.payload.count === 0,
        isCouponsLoading: false,
        total: action.payload.total
      };

    case types.OPEN_COPY_MODAL:
      return { ...state, modal: { show: action.payload } };

    case types.CLOSE_COPY_MODAL:
      return { ...state, modal: { show: action.payload } };

    case types.SET_APP_READY:
      return { ...state, aplication: { ready: action.payload } };

    case types.SET_ACTIVE_COUPON:
      return { ...state, selectedCoupon: action.payload };
    case types.GET_STORE_LANG:
      return { ...state, storeLang: action.payload };

    default:
      return state;
  }
};

export default couponReducer;
