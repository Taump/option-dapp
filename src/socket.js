import obyte from "obytenewfork";
import config from "./config";

const client = new obyte.Client(
	`wss://obyte.org/bb${config.testnet ? "-test" : ""}`,
	{
		testnet: config.testnet,
		reconnect: true
	}
);

export default client;
