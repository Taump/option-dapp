// import obyte from 'obyte';
import obyte from "./obyte.min";

const client = new obyte.Client("wss://obyte.org/bb-test", { testnet: true });

setInterval(function() {
  client.api.heartbeat();
}, 10 * 1000);
export default client;
