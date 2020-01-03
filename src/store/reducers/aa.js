import {
  ADD_AA,
  ADD_AA_ERR,
  CHANGE_ACTIVE_AA,
  GET_BALANCE_ACTIVE_AA,
  UPDATE_INFO_ACTIVE_AA,
  CLEAR_BALANCE_ACTIVE_AA,
  LOAD_AA_LIST_REQUEST,
  LOAD_AA_LIST_SUCCESS,
  ADD_AA_NOTIFICATION,
  VIEWED_NOTIFICATION
} from "../types/aa";

const initialState = {
  list: [],
  listByBase: [],
  listByBaseLoaded: [],
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
    case ADD_AA: {
      return {
        ...state,
        list: [action.payload, ...state.list]
      };
    }
    case ADD_AA_ERR: {
      return {
        ...state,
        error: true
      };
    }
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
          notifications: [...state.notifications, action.payload],
          activeAssetsRequest: assets,
          isViewedNotifications: false
        };
      } else {
        return {
          ...state,
          notifications: [...state.notifications, action.payload],
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
    default:
      return state;
  }
};
