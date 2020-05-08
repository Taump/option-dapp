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

import config from "../../config";

import client from "../../socket";

export const clearCheckToken = () => ({
	type: CLEAR_CHECK_TOKEN
});

export const skipRegToken = () => ({
	type: SKIP_REG_TOKEN
});

export const checkToken = symbol => async dispatch => {
	dispatch({
		type: PENDING_CHECK_TOKEN
	});
	const asset = await client.api.getAssetBySymbol(
		config.TOKEN_REGISTRY_AA_ADDRESS,
		symbol
	);
	await dispatch({
		type: CHECK_TOKEN_RESPONSE,
		payload: !!asset
	});
};

export const subscribeTokenRegistry = () => async dispatch => {
	try {
		await client.justsaying("light/new_aa_to_watch", {
			aa: config.TOKEN_REGISTRY_AA_ADDRESS
		});
	} catch (e) {
		console.log("error", e);
	}
};
export const changeTypeSymbol = type => ({
	type: CHANGE_TYPE_SYMBOL,
	payload: type
});
export const regSymbolRequest = symbol => async (dispatch, getState) => {
	const store = getState();
	const { symbol_yes, symbol_no } = store.aa;
	const type = store.symbolsReg.typePendingSymbol;
	console.log("type", type);
	if (type === "yes") {
		if (symbol_yes === null) {
			dispatch({
				type: REG_YES_SYMBOL_REQUEST,
				payload: symbol
			});
		}
	} else if (type === "no") {
		if (symbol_no === null) {
			dispatch({
				type: REG_NO_SYMBOL_REQUEST,
				payload: symbol
			});
		}
	}
};
