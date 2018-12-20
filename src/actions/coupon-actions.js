import * as types from "../actions/action-types";
import axios from "axios";
import { storeId, accessToken } from "../ecwidConfig";
import i18n from "i18next";
const devHash =
  "#7b2273746f72655f6964223a353533363031372c226163636573735f746f6b656e223a223446317a644c74486a716231616569616262726b786a5458396b444e42547242222c226c616e67223a227275227d";

const EcwidApp = window.EcwidApp;

export function getCouponsFromBase(offset = 0) {
  return dispatch => {
    dispatch({
      type: types.GET_INIT_COUPONS_FROM_BASE
    });
    axios
      .get(
        `https://app.ecwid.com/api/v3/${storeId}/discount_coupons?token=${accessToken}&offset=${offset}`
      )
      .then(response => {
        dispatch({
          type: types.GET_COUPONS_FROM_BASE,
          payload: response.data
        });
      });
  };
}

export function getSoreLang() {
  const response = EcwidApp.getPayload();
  i18n.changeLanguage(response.lang);
  return {
    type: types.GET_STORE_LANG,
    payload: response.lang
  };
}
export function getCurency() {
  return dispatch =>
    axios(
      `https://app.ecwid.com/api/v3/${storeId}/profile?token=${accessToken}`
    ).then(value => {
      return dispatch({
        type: types.GET_CURRENCY,
        payload: value.data.formatsAndUnits.currency
      });
    });
}

export function generateCoupons(amount, pattern) {
  return function(dispatch) {
    axios
      .post(
        `https://app.ecwid.com/api/v3/${storeId}/discount_coupons?token=${accessToken}`,
        {}
      )
      .then(response => {
        dispatch({
          type: types.GET_COUPONS_FROM_BASE,
          payload: response
        });
      });
  };
}

export function openCopyModal() {
  return {
    type: types.OPEN_COPY_MODAL,
    payload: true
  };
}
export function setActiveCoupon(obj) {
  return {
    type: types.SET_ACTIVE_COUPON,
    payload: obj
  };
}
export function closeCopyModal() {
  return {
    type: types.CLOSE_COPY_MODAL,
    payload: false
  };
}

export function setAppReady() {
  return {
    type: types.SET_APP_READY,
    payload: true
  };
}

export function showPrint() {
  return {
    type: types.SHOW_PRINT
  };
}

export function hidePrint() {
  return {
    type: types.HIDE_PRINT
  };
}
