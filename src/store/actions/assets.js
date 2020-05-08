import { INIT_ASSET } from "../types/assets";
import client from "../../socket";

export const initAssets = () => async (dispatch, getState) => {
	const store = getState();
	const aas = store.aa.listByBase.map(aa => aa.address);
	const assets = store.assets;
	const getExtendAssets = aas.map(address => {
		const assetsByAddress = assets[address];
		if (
			!assetsByAddress ||
			!assetsByAddress.yes_asset ||
			!assetsByAddress.no_asset
		) {
			return client.api
				.getAaStateVars({
					address
				})
				.then(data => {
					const assets = {};
					if ("yes_asset" in data) {
						assets.yes_asset = data.yes_asset;
					}
					if ("no_asset" in data) {
						assets.no_asset = data.no_asset;
					}
					return { address, ...assets };
				});
		} else {
			return null;
		}
	});

	const extendAssets = await Promise.all(getExtendAssets).then(data => {
		const extendAssetsObj = {};
		if (data.length > 0) {
			data.forEach(aa => {
				if (aa) {
					const address = aa.address;
					delete aa.address;
					extendAssetsObj[address] = { ...aa };
				}
			});
		}
		return extendAssetsObj;
	});

	const initAssets = { ...assets, ...extendAssets };

	dispatch({
		type: INIT_ASSET,
		payload: initAssets
	});
};
