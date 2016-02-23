import ApiSocket from 'airdcpp-apisocket/dist/SocketBase';
import BrowserUtils from 'utils/BrowserUtils';

const options = {
	url: window.location.host + BrowserUtils.getBasePath(),
	secure: window.location.protocol === 'https:',
	autoReconnect: false,
	userSession: true,
	logLevel: 4,
	ignoredConsoleEvents: [
		'transfer_statistics',
		'hash_statistics',
		'hub_counts_updated',
	],
};

let Socket = ApiSocket(options, WebSocket);

export default Socket;