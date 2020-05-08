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
	CLEAR_SUBSCRIBE_AA,
	SUBSCRIBE_BASE_AA,
	ADD_AA_TO_LIST,
	LOADING_NOTIFICATION_REQUEST,
	LOADING_FULL_NOTIFICATION,
	OPEN_NETWORK,
	CLOSE_NETWORK,
	ADD_YES_ASSET_RESPONSE,
	ADD_NO_ASSET_RESPONSE,
	ADD_WINNER_RESPONSE
} from "../types/aa";
import {
	REG_NO_SYMBOL_REQUEST,
	REG_SYMBOLS_RESPONSE,
	REG_YES_SYMBOL_REQUEST
} from "../types/symbolsReg";

const initialState = {
	network: true,
	listByBase: [],
	listByBaseLoaded: false,
	subscriptions: [],
	subscribeBase: false,
	active: null,
	activeInfo: null,
	activeParams: {},
	activeBalance: {
		loading: false
	},
	activeAssetsRequest: {},
	notifications: [],
	fullNotifications: [],
	notificationsLoaded: false,
	symbol_yes: null,
	symbol_no: null,
	error: null
};

export const aaReducer = (state = initialState, action) => {
	switch (action.type) {
		case OPEN_NETWORK: {
			return {
				...state,
				network: true
			};
		}
		case CLOSE_NETWORK: {
			return {
				...state,
				network: false
			};
		}
		case CHANGE_ACTIVE_AA: {
			return {
				...state,
				active: action.payload.address,
				activeInfo: action.payload.aaVars || null,
				activeBalance: {
					loading: false
				},
				activeAssetsRequest: {},
				symbol_yes: action.payload.symbol_yes,
				symbol_no: action.payload.symbol_no,
				activeParams: action.payload.params
			};
		}
		case ADD_YES_ASSET_RESPONSE: {
			return {
				...state,
				activeInfo: {
					...state.activeInfo,
					yes_asset: action.payload
				}
			};
		}
		case ADD_WINNER_RESPONSE: {
			return {
				...state,
				activeInfo: {
					...state.activeInfo,
					winner: action.payload
				}
			};
		}
		case REG_SYMBOLS_RESPONSE: {
			return {
				...state,
				symbol_yes: action.payload.symbol_yes,
				symbol_no: action.payload.symbol_no
			};
		}

		case ADD_NO_ASSET_RESPONSE: {
			return {
				...state,
				activeInfo: {
					...state.activeInfo,
					no_asset: action.payload
				}
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
		case ADD_AA_TO_LIST: {
			const newListByBase = state.listByBase.filter(
				aa => aa.address !== action.payload.address
			);
			return {
				...state,
				listByBase: [...newListByBase, action.payload]
			};
		}
		case ADD_AA_NOTIFICATION: {
			if (state.active) {
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
			} else {
				return {
					...state,
					fullNotifications: [action.payload, ...state.fullNotifications],
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
				notifications: action.payload,
				notificationsLoaded: true
			};
		}
		case LOADING_FULL_NOTIFICATION: {
			return {
				...state,
				fullNotifications: action.payload
			};
		}

		case LOADING_NOTIFICATION_REQUEST: {
			return {
				...state,
				notificationsLoaded: false
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
		case SUBSCRIBE_BASE_AA: {
			return {
				...state,
				subscribeBase: true
			};
		}
		default:
			return state;
	}
};
