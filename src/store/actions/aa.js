import {
	CHANGE_ACTIVE_AA,
	GET_BALANCE_ACTIVE_AA,
	UPDATE_INFO_ACTIVE_AA,
	CLEAR_BALANCE_ACTIVE_AA,
	LOAD_AA_LIST_REQUEST,
	LOAD_AA_LIST_SUCCESS,
	ADD_AA_NOTIFICATION,
	LOADING_NOTIFICATION,
	SUBSCRIBE_AA,
	CLEAR_SUBSCRIBE_AA,
	SUBSCRIBE_BASE_AA,
	ADD_AA_TO_LIST,
	LOADING_FULL_NOTIFICATION,
	CLOSE_NETWORK,
	OPEN_NETWORK,
	ADD_YES_ASSET_RESPONSE,
	ADD_NO_ASSET_RESPONSE,
	ADD_WINNER_RESPONSE
} from "../types/aa";
import { notification } from "antd";
import moment from "moment";
import { isEqual } from "lodash";
import client from "../../socket";
import config from "../../config";
import utils from "../../utils";
import { deployRequest, pendingDeployResponse } from "./deploy";
import { regSymbolRequest } from "./symbolsReg";
import { REG_SYMBOLS_RESPONSE } from "../types/symbolsReg";
import { addRecentStablecoin } from "./recent";
const {
	createObjectNotification,
	isAddressByBase,
	createStringDescrForAa
} = utils;

export const getAasByBase = () => async dispatch => {
	try {
		await dispatch({
			type: LOAD_AA_LIST_REQUEST
		});
		const aaByBase = await client.api.getAasByBaseAas({
			base_aa: config.base_aa
		});
		if (aaByBase && aaByBase !== []) {
			aaByBase.forEach(aa => {
				const {
					feed_name,
					comparison,
					expiry_date,
					feed_value
				} = aa.definition[1].params;
				aa.view = createStringDescrForAa(
					aa.address,
					feed_name,
					comparison,
					expiry_date,
					feed_value
				);
			});
		}
		await dispatch({
			type: LOAD_AA_LIST_SUCCESS,
			payload: aaByBase || []
		});
	} catch (e) {
		console.log("error", e);
	}
};
export const openNetwork = () => ({
	type: OPEN_NETWORK
});

export const closeNetwork = () => ({
	type: CLOSE_NETWORK
});
export const changeActiveAA = address => async (dispatch, getState) => {
	try {
		const store = getState();
		const isValid = await isAddressByBase(address);
		const definitionActive = store.aa.listByBase.filter(
			aa => aa.address === address
		);

		if (isValid || store.deploy.wasIssued) {
			if (definitionActive.length > 0) {
				const params =
					definitionActive && definitionActive[0].definition["1"].params;
				if (store.deploy.wasIssued) {
					await dispatch({
						type: CHANGE_ACTIVE_AA,
						payload: { address, aaVars: {}, params }
					});
					dispatch(addRecentStablecoin(address));
				} else {
					const aaState = await client.api.getAaStateVars({ address });
					let symbol_yes = null;
					let symbol_no = null;
					if ("yes_asset" in aaState) {
						const symbolOrAsset = await client.api.getSymbolByAsset(
							config.TOKEN_REGISTRY_AA_ADDRESS,
							aaState.yes_asset
						);
						if (
							aaState.yes_asset.replace(/[+=]/, "").substr(0, 6) !==
							symbolOrAsset
						) {
							symbol_yes = symbolOrAsset;
						}
					}
					if ("no_asset" in aaState) {
						const symbolOrAsset = await client.api.getSymbolByAsset(
							config.TOKEN_REGISTRY_AA_ADDRESS,
							aaState.no_asset
						);
						if (
							aaState.no_asset.replace(/[+=]/, "").substr(0, 6) !==
							symbolOrAsset
						) {
							symbol_no = symbolOrAsset;
						}
					}
					await dispatch({
						type: CHANGE_ACTIVE_AA,
						payload: { address, aaVars: aaState, symbol_yes, symbol_no, params }
					});
					dispatch(addRecentStablecoin(address));
				}
				const subscriptions = store.aa.subscriptions;
				const isSubscription =
					subscriptions.filter(aa => aa === address).length > 0;
				await dispatch(getAllNotificationAA(address));
				if (!isSubscription) {
					await dispatch(subscribeAA(address));
				}
			}
		} else {
			console.log("Address is not found");
			notification["error"]({
				message: "Address is not found"
			});
		}
	} catch (e) {
		console.log("error", e);
	}
};

export const updateInfoActiveAA = () => async (dispatch, getState) => {
	try {
		const store = getState();
		const address = store.aa.active;
		if (address && store.deploy.wasIssued !== address) {
			const aaState = await client.api.getAaStateVars({ address });
			dispatch({
				type: UPDATE_INFO_ACTIVE_AA,
				payload: { address, aaVars: aaState }
			});
		}
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

export const regSymbolsResponse = () => async (dispatch, getState) => {
	const store = getState();
	const activeInfo = store.aa.activeInfo;
	let symbol_yes = null;
	let symbol_no = null;
	if ("yes_asset" in activeInfo) {
		const symbolOrAsset = await client.api.getSymbolByAsset(
			config.TOKEN_REGISTRY_AA_ADDRESS,
			activeInfo.yes_asset
		);
		if (
			activeInfo.yes_asset.replace(/[+=]/, "").substr(0, 6) !== symbolOrAsset
		) {
			symbol_yes = symbolOrAsset;
		}
	}
	if ("no_asset" in activeInfo) {
		const symbolOrAsset = await client.api.getSymbolByAsset(
			config.TOKEN_REGISTRY_AA_ADDRESS,
			activeInfo.no_asset
		);
		if (
			activeInfo.no_asset.replace(/[+=]/, "").substr(0, 6) !== symbolOrAsset
		) {
			symbol_no = symbolOrAsset;
		}
	}

	dispatch({
		type: REG_SYMBOLS_RESPONSE,
		payload: { symbol_yes, symbol_no }
	});
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
				const AA = result[1].body.aa_address;
				const aaVars =
					store.deploy.wasIssued !== AA
						? await client.api.getAaStateVars({ address: AA })
						: {};
				if (
					result[1].body &&
					result[1].body.aa_address &&
					result[1].body.unit.messages &&
					result[1].body.unit.messages[0]
				) {
					const notificationObject = createObjectNotification.req(
						result[1],
						aaVars
					);

					if (result[1].body.aa_address === config.TOKEN_REGISTRY_AA_ADDRESS) {
						const payload = result[1].body.unit.messages[0].payload;
						if (payload) {
							if (
								payload.symbol &&
								payload.asset &&
								store.aa.activeInfo !== null
							) {
								const activeAssetYES =
									"yes_asset" in store.aa.activeInfo
										? store.aa.activeInfo.yes_asset
										: false;
								const activeAssetNO =
									"no_asset" in store.aa.activeInfo
										? store.aa.activeInfo.no_asset
										: false;
								if (activeAssetYES || activeAssetNO) {
									if (
										activeAssetYES === payload.asset ||
										activeAssetNO === payload.asset
									) {
										openNotificationRequest(
											aaActive,
											`Request to register the ${payload.symbol} symbol`
										);
										dispatch(regSymbolRequest(payload.symbol));
										const trigger_unit = result[1].body.unit.unit;
										const time = result[1].body.unit.timestamp;
										dispatch({
											type: ADD_AA_NOTIFICATION,
											payload: {
												AA: aaActive,
												title: `Request to register the ${payload.symbol} symbol`,
												teg: "req_symbol",
												time,
												trigger_unit
											}
										});
									}
								}
							}
						}
					}

					if (
						(notificationObject && notificationObject.AA === aaActive) ||
						(!aaActive && notificationObject)
					) {
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

					if (result[1].body.aa_address === config.TOKEN_REGISTRY_AA_ADDRESS) {
						const res = result[1].body.response;
						if (res.responseVars && store.aa.activeInfo) {
							const activeAssetYES =
								"yes_asset" in store.aa.activeInfo
									? store.aa.activeInfo.yes_asset
									: false;
							const activeAssetNO =
								"no_asset" in store.aa.activeInfo
									? store.aa.activeInfo.no_asset
									: false;
							if (activeAssetYES || activeAssetNO) {
								if (activeAssetYES in res.responseVars) {
									const symbol = res.responseVars[activeAssetYES];
									dispatch(regSymbolsResponse());
									openNotificationRequest(
										aaActive,
										`Symbol ${symbol} was registered`
									);
								} else if (activeAssetNO in res.responseVars) {
									const symbol = res.responseVars[activeAssetNO];
									dispatch(regSymbolsResponse());
									openNotificationRequest(
										aaActive,
										`Symbol ${symbol} was registered`
									);
								}
							}
						}
					}

					if (
						(notificationObject && notificationObject.AA === aaActive) ||
						(!aaActive && notificationObject)
					) {
						openNotificationRequest(
							notificationObject.AA,
							notificationObject.title
						);
						dispatch({
							type: ADD_AA_NOTIFICATION,
							payload: notificationObject
						});
						if (notificationObject && notificationObject.AA === aaActive) {
							if (notificationObject.tag === "res_yes") {
								dispatch(addYesAsset(notificationObject.meta.yes_asset));
							} else if (notificationObject.tag === "res_no") {
								dispatch(addNoAsset(notificationObject.meta.no_asset));
							} else if (notificationObject.tag === "res_winner") {
								dispatch(addWinner(notificationObject.meta.winner));
							}
						}
					}
				}
			} else if (result[1].subject === "light/aa_definition") {
				const address =
					result[1].body.messages[0].payload &&
					result[1].body.messages[0].payload.address;
				if (address) {
					openNotificationRequest(
						"Request to create a new market",
						`Its address is ${address}`
					);
					const params =
						result[1].body.messages[0].payload.definition &&
						result[1].body.messages[0].payload.definition[1] &&
						result[1].body.messages[0].payload.definition[1].params;
					if (
						store.deploy.pending &&
						params &&
						isEqual(store.deploy.deployAaPrams, params)
					) {
						const address = result[1].body.messages[0].payload.address;
						const definition = result[1].body.messages[0].payload.definition;
						if (address && definition) {
							const {
								feed_name,
								comparison,
								expiry_date,
								feed_value
							} = definition[1].params;
							const view = createStringDescrForAa(
								address,
								feed_name,
								comparison,
								expiry_date,
								feed_value
							);
							await dispatch({
								type: ADD_AA_TO_LIST,
								payload: { address, definition, view }
							});
							await dispatch(deployRequest(address));
							await dispatch(changeActiveAA(address));
						}
					}
				}
			} else if (result[1].subject === "light/aa_definition_saved") {
				const address =
					result[1].body.messages[0].payload &&
					result[1].body.messages[0].payload.address;
				const definition =
					result[1].body.messages[0].payload &&
					result[1].body.messages[0].payload.definition;
				if (address && definition) {
					openNotificationRequest(
						"New market created",
						`Its address is ${address}`
					);
					const {
						feed_name,
						comparison,
						expiry_date,
						feed_value
					} = definition[1].params;
					const view = createStringDescrForAa(
						address,
						feed_name,
						comparison,
						expiry_date,
						feed_value
					);
					dispatch({
						type: ADD_AA_TO_LIST,
						payload: { address, definition, view }
					});
					if (address === store.deploy.wasIssued) {
						dispatch(pendingDeployResponse());
					}
				}
			}
		});
	} catch (e) {
		console.log("error", e);
	}
};

export const clearBalanceActiveAA = () => ({
	type: CLEAR_BALANCE_ACTIVE_AA
});

export const clearSubscribesAA = () => ({
	type: CLEAR_SUBSCRIBE_AA
});
export const addYesAsset = asset => ({
	type: ADD_YES_ASSET_RESPONSE,
	payload: asset
});
export const addNoAsset = asset => ({
	type: ADD_NO_ASSET_RESPONSE,
	payload: asset
});
export const addWinner = winner => ({
	type: ADD_WINNER_RESPONSE,
	payload: winner
});
export const getAllNotificationAA = address => async (dispatch, getState) => {
	const store = getState();
	if (address !== store.deploy.wasIssued) {
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
	} else {
		await dispatch({
			type: LOADING_NOTIFICATION,
			payload: []
		});
	}
};

export const subscribeAA = address => async (dispatch, getState) => {
	const store = getState();
	const subscriptions = store.aa.subscriptions;
	const isSubscription = subscriptions.filter(aa => aa === address).length > 0;
	if (!isSubscription) {
		await client.justsaying("light/new_aa_to_watch", {
			aa: address
		});

		await dispatch({
			type: SUBSCRIBE_AA,
			payload: address
		});
	}
};

export const subscribeActualAA = () => async (dispatch, getState) => {
	const store = getState();
	const { listByBase } = store.aa;
	if (listByBase) {
		let notificationsList = [];
		for (const aa of listByBase) {
			const params =
				aa.definition && aa.definition[1] && aa.definition[1].params;
			const address = aa.address;
			const { expiry_date } = params;
			const isValid = moment(expiry_date).isValid();
			if (isValid) {
				const expiryDate = moment(expiry_date);
				const isAfter = expiryDate.isAfter(moment().add(-7, "d"));
				if (isAfter) {
					dispatch(subscribeAA(address));
					const notificationsAA = await client.api.getAaResponses({
						aa: address
					});
					const aaVars = await client.api.getAaStateVars({ address });
					for (const notification of notificationsAA) {
						const notificationObject = createObjectNotification.res(
							notification,
							aaVars
						);
						if (notificationObject && store.aa.active === null) {
							notificationsList.push(notificationObject);
						}
					}
				}
			}
		}

		await dispatch({
			type: LOADING_FULL_NOTIFICATION,
			payload: notificationsList
		});
	}
};

export const subscribeBaseAA = () => async dispatch => {
	await client.justsaying("light/new_aa_to_watch", {
		aa: config.base_aa
	});
	await dispatch({
		type: SUBSCRIBE_BASE_AA
	});
};
