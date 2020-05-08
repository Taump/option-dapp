import {
	CHANGE_TYPE_SYMBOL,
	CHECK_TOKEN_RESPONSE,
	CLEAR_CHECK_TOKEN,
	PENDING_CHECK_TOKEN,
	PENDING_REQUEST,
	REG_NO_SYMBOL_REQUEST,
	REG_YES_SYMBOL_REQUEST,
	SKIP_REG_TOKEN
} from "../types/symbolsReg";
import { CHANGE_ACTIVE_AA } from "../types/aa";

const initialState = {
	skip: false,
	pendingCheck: false,
	wasTaken: null,
	typePendingSymbol: null,
	symbol_yes_req: null,
	symbol_no_req: null
};

export const symbolsRegReducer = (state = initialState, action) => {
	switch (action.type) {
		case CLEAR_CHECK_TOKEN: {
			return {
				...state,
				skip: false,
				pendingCheck: false,
				wasTaken: null
			};
		}
		case SKIP_REG_TOKEN: {
			return {
				...state,
				skip: true
			};
		}
		case CHANGE_ACTIVE_AA: {
			return initialState;
		}
		case CHANGE_TYPE_SYMBOL: {
			return {
				...state,
				typePendingSymbol: action.payload
			};
		}
		case PENDING_CHECK_TOKEN: {
			return {
				...state,
				pendingCheck: true
			};
		}
		case PENDING_REQUEST: {
			return {
				...state,
				pendingSymbol: action.payload
			};
		}
		case CHECK_TOKEN_RESPONSE: {
			return {
				...state,
				pendingCheck: false,
				wasTaken: action.payload
			};
		}
		case REG_YES_SYMBOL_REQUEST: {
			return {
				...state,
				symbol_yes_req: action.payload
			};
		}
		case REG_NO_SYMBOL_REQUEST: {
			return {
				...state,
				symbol_no_req: action.payload
			};
		}
		default: {
			return state;
		}
	}
};
