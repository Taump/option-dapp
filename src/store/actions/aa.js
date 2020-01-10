import {
  CHANGE_ACTIVE_AA,
  GET_BALANCE_ACTIVE_AA,
  UPDATE_INFO_ACTIVE_AA,
  CLEAR_BALANCE_ACTIVE_AA,
  LOAD_AA_LIST_REQUEST,
  LOAD_AA_LIST_SUCCESS,
  ADD_AA_NOTIFICATION,
  VIEWED_NOTIFICATION,
  LOADING_NOTIFICATION,
  SUBSCRIBE_AA,
  CLEAR_SUBSCRIBE_AA
} from "../types/aa";
import { notification } from "antd";

import client from "../../socket";
import config from "../../config";
import utils from "../../utils";

const { createObjectNotification } = utils;
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

export const changeActiveAA = address => async (dispatch, getState) => {
  try {
    const aaState = await client.api.getAaStateVars({ address });
    await dispatch({
      type: CHANGE_ACTIVE_AA,
      payload: { address, aaVars: aaState }
    });
    const store = getState();
    const subscriptions = store.aa.subscriptions;
    const isSubscription =
      subscriptions.filter(aa => aa === address).length > 0;
    await dispatch(getAllNotificationAA(address));
    if (!isSubscription) {
      await dispatch(subscribeAA(address));
    }
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
export const watchRequestAas = () => (dispatch, getState) => {
  try {
    client.subscribe(async (err, result) => {
      const store = getState();
      const aaActive = store.aa.active;
      if (result[1].subject === "light/aa_request") {
        if (
          result[1].body &&
          result[1].body.messages &&
          result[1].body.messages[0] &&
          result[1].body.messages[1]
        ) {
          const notificationObject = createObjectNotification.req(result[1]);
          if (notificationObject && notificationObject.AA === aaActive) {
            openNotificationRequest(
              notificationObject.AA,
              notificationObject.title
            );
            dispatch({
              type: ADD_AA_NOTIFICATION,
              payload: notificationObject
            });
          }
        }
      } else if (result[1].subject === "light/aa_response") {
        const AA = result[1].body.aa_address;
        const aaVars = await client.api.getAaStateVars({ address: AA });
        if (
          result[1].body &&
          result[1].body.response &&
          result[1].body.response
        ) {
          const notificationObject = createObjectNotification.res(
            result[1].body,
            aaVars
          );
          if (notificationObject && notificationObject.AA === aaActive) {
            openNotificationRequest(
              notificationObject.AA,
              notificationObject.title
            );
            dispatch({
              type: ADD_AA_NOTIFICATION,
              payload: notificationObject
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
export const clearSubscribesAA = () => ({
  type: CLEAR_SUBSCRIBE_AA
});

export const getAllNotificationAA = address => async dispatch => {
  const notifications = await client.api.getAaResponses({
    aa: address
  });
  const aaVars = await client.api.getAaStateVars({ address });

  let notificationsList = [];
  await notifications.forEach(n => {
    const notificationObject = createObjectNotification.res(n, aaVars);
    if (notificationObject) {
      notificationsList.push(notificationObject);
    }
  });
  await dispatch({
    type: LOADING_NOTIFICATION,
    payload: notificationsList
  });
};

export const subscribeAA = address => async dispatch => {
  await client.justsaying("light/new_aa_to_watch", {
    aa: address
  });

  await dispatch({
    type: SUBSCRIBE_AA,
    payload: address
  });
};
