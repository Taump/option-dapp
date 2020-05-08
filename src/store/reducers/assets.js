import { INIT_ASSET } from "../types/assets";

const initialState = {};

export const assetsReducer = (state = initialState, action) => {
	switch (action.type) {
		case INIT_ASSET: {
			return action.payload;
		}
		default: {
			return state;
		}
	}
};
