import obyte from "./obyte.min";
import config from "./config";

const client = new obyte.Client("wss://obyte.org/bb-test", {
  testnet: config.testnet,
  reconnect: true
});

export default client;
