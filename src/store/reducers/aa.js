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

const initialState = {
  list: [],
  listByBase: [],
  listByBaseLoaded: [],
  subscriptions: [],
  active: null,
  activeInfo: null,
  activeBalance: {
    loading: false
  },
  activeAssetsRequest: {},
  notifications: [],
  isViewedNotifications: true,
  error: null
};

export const aaReducer = (state = initialState, action) => {
  switch (action.type) {
    case CHANGE_ACTIVE_AA: {
      return {
        ...state,
        active: action.payload.address,
        activeInfo: action.payload.aaVars,
        activeBalance: {
          loading: false
        },
        activeAssetsRequest: {}
      };
    }
    case UPDATE_INFO_ACTIVE_AA: {
      return {
        ...state,
        activeInfo: action.payload.aaVars
      };
    }
    case GET_BALANCE_ACTIVE_AA: {
      const { balance } = action.payload;
      return {
        ...state,
        activeBalance: {
          loading: true,
          yes_asset:
            state.activeInfo.yes_asset && balance[state.activeInfo.yes_asset]
              ? balance[state.activeInfo.yes_asset].stable
              : 0,
          no_asset:
            state.activeInfo.no_asset && balance[state.activeInfo.no_asset]
              ? balance[state.activeInfo.no_asset].stable
              : 0
        }
      };
    }
    case CLEAR_BALANCE_ACTIVE_AA: {
      return {
        ...state,
        activeBalance: {
          loading: false
        }
      };
    }
    case LOAD_AA_LIST_REQUEST: {
      return {
        ...state,
        listByBaseLoaded: false
      };
    }
    case LOAD_AA_LIST_SUCCESS: {
      return {
        ...state,
        listByBase: action.payload,
        listByBaseLoaded: true
      };
    }
    case ADD_AA_NOTIFICATION: {
      if (action.payload.AA === state.active) {
        let assets = {};
        if (action.payload.tag === "req_yes") {
          assets.yes_asset = true;
        } else if (action.payload.tag === "req_no") {
          assets.no_asset = true;
        }
        return {
          ...state,
          notifications: [action.payload, ...state.notifications],
          activeAssetsRequest: { ...state.activeAssetsRequest, ...assets },
          isViewedNotifications: false
        };
      } else {
        return {
          ...state,
          notifications: [action.payload, ...state.notifications],
          isViewedNotifications: false
        };
      }
    }
    case VIEWED_NOTIFICATION: {
      return {
        ...state,
        isViewedNotifications: true
      };
    }
    case LOADING_NOTIFICATION: {
      return {
        ...state,
        notifications: action.payload
      };
    }
    case SUBSCRIBE_AA: {
      return {
        ...state,
        subscriptions: [...state.subscriptions, action.payload]
      };
    }
    case CLEAR_SUBSCRIBE_AA: {
      return {
        ...state,
        subscriptions: []
      };
    }
    default:
      return state;
  }
};
