import {
  ADD_AA,
  CHANGE_ACTIVE_AA,
  GET_BALANCE_ACTIVE_AA,
  UPDATE_INFO_ACTIVE_AA,
  CLEAR_BALANCE_ACTIVE_AA,
  LOAD_AA_LIST_REQUEST,
  LOAD_AA_LIST_SUCCESS,
  ADD_AA_NOTIFICATION,
  VIEWED_NOTIFICATION
} from "../types/aa";
import { notification } from "antd";

import client from "../../socket";
import config from "../../config";

export const getAasByBase = () => async dispatch => {
  try {
    await dispatch({
      type: LOAD_AA_LIST_REQUEST
    });
    const aaByBase = await client.api.getAasByBaseAas({
      base_aa: config.base_aa
    });
    await dispatch({
      type: LOAD_AA_LIST_SUCCESS,
      payload: aaByBase || []
    });
  } catch (e) {
    console.log("error", e);
  }
};
export const addAA = address => async dispatch => {
  await client.justsaying("light/new_aa_to_watch", {
    aa: address
  });
  await dispatch({
    type: ADD_AA,
    payload: address
  });
  await dispatch(changeActiveAA(address));
};

export const changeActiveAA = address => async dispatch => {
  try {
    const aaState = await client.api.getAaStateVars({ address });
    dispatch({
      type: CHANGE_ACTIVE_AA,
      payload: { address, aaVars: aaState }
    });
  } catch (e) {
    console.log("error", e);
  }
};

export const updateInfoActiveAA = address => async dispatch => {
  try {
    const aaState = await client.api.getAaStateVars({ address });
    dispatch({
      type: UPDATE_INFO_ACTIVE_AA,
      payload: { address, aaVars: aaState }
    });
  } catch (e) {
    console.log("error", e);
  }
};

export const getBalanceActiveAA = address => async dispatch => {
  try {
    const balance = await client.api.getBalances([address]);
    dispatch({
      type: GET_BALANCE_ACTIVE_AA,
      payload: { balance: balance[address], address }
    });
  } catch (e) {
    console.log("error", e);
  }
};
const openNotificationRequest = (address, event) => {
  notification.open({
    message: address,
    description: event,
    style: { minWidth: 350 }
  });
};
export const watchRequestAas = () => dispatch => {
  try {
    client.subscribe((err, result) => {
      if (result[1].subject === "light/aa_request") {
        if (
          result[1].body &&
          result[1].body.messages &&
          result[1].body.messages[0] &&
          result[1].body.messages[0].payload
        ) {
          const payload = result[1].body.messages[0].payload;
          const AA =
            result[1].body.messages[1] &&
            result[1].body.messages[1].payload &&
            result[1].body.messages[1].payload.outputs[1].address;
          if ("define_yes" in payload) {
            openNotificationRequest(AA, "Request for issue yes_asset");
            dispatch({
              type: ADD_AA_NOTIFICATION,
              payload: {
                AA,
                title: "Request for issue yes_asset",
                tag: "req_yes"
              }
            });
          } else if ("define_no" in payload) {
            openNotificationRequest(AA, "Request for issue no_asset");
            dispatch({
              type: ADD_AA_NOTIFICATION,
              payload: {
                AA,
                title: "Request for issue no_asset",
                tag: "req_no"
              }
            });
          } else if ("winner" in payload) {
            openNotificationRequest(AA, "Request to select a winner");
            dispatch({
              type: ADD_AA_NOTIFICATION,
              payload: {
                AA,
                title: "Request to select a winner",
                tag: "req_winner"
              }
            });
          }
        }
      } else if (result[1].subject === "light/aa_response") {
        if (
          result[1].body &&
          result[1].body.response &&
          result[1].body.response.responseVars
        ) {
          const res = result[1].body.response.responseVars;
          const AA = result[1].body.aa_address;
          if ("yes_asset" in res) {
            openNotificationRequest(AA, "Yes_asset was issued");
            dispatch({
              type: ADD_AA_NOTIFICATION,
              payload: { AA, title: "Yes_asset was issued", tag: "res_yes" }
            });
          } else if ("no_asset" in res) {
            openNotificationRequest(AA, "No_asset was issued");
            dispatch({
              type: ADD_AA_NOTIFICATION,
              payload: { AA, title: "No_asset was issued", tag: "res_no" }
            });
          } else if ("winner" in res) {
            openNotificationRequest(
              AA,
              `${res.winner}_asset was chosen as the winner`
            );
            dispatch({
              type: ADD_AA_NOTIFICATION,
              payload: {
                AA,
                title: `${res.winner}_asset was chosen as the winner`,
                tag: "res_winner"
              }
            });
          }
        }
      }
    });
  } catch (e) {
    console.log("error", e);
  }
};

export const viewedNotification = () => ({
  type: VIEWED_NOTIFICATION
});
export const clearBalanceActiveAA = () => ({
  type: CLEAR_BALANCE_ACTIVE_AA
});
