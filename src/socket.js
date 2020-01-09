import obyte from "obyte";

const client = new obyte.Client("wss://obyte.org/bb-test", {
  testnet: true,
  reconnect: true
});

setInterval(function() {
  client.api.heartbeat();
}, 10 * 1000);
export default client;
