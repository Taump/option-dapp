export default {
	testnet: process.env.REACT_APP_TESTNET === "true",
	base_aa: process.env.REACT_APP_BASE_AA,
	TOKEN_REGISTRY_AA_ADDRESS: process.env.REACT_APP_TOKEN_REGISTRY_AA_ADDRESS,
	LINK_TO_ODEX: process.env.REACT_APP_LINK_TO_ODEX
};
