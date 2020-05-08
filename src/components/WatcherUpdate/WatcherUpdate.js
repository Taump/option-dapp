import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
	changeActiveAA,
	watchRequestAas,
	clearSubscribesAA,
	subscribeActualAA,
	getAasByBase,
	subscribeBaseAA,
	openNetwork,
	closeNetwork
} from "../../store/actions/aa";
import client from "../../socket";
import { Result, message } from "antd";
import obyte from "obyte";
import { subscribeTokenRegistry } from "../../store/actions/symbolsReg";
import history from "../../history";
export const WatcherUpdate = props => {
	const dispatch = useDispatch();
	const aaActive = useSelector(state => state.aa.active);
	const network = useSelector(state => state.aa.network);
	const listByBase = useSelector(state => state.aa.listByBase);
	const listByBaseLoaded = useSelector(state => state.aa.listByBaseLoaded);
	useEffect(() => {
		if (aaActive) {
			history.replace({ ...history.location.pathname, hash: `#${aaActive}` });
		}
		const unlisten = history.listen((location, action) => {
			if (action === "PUSH" || action === "PUP") {
				if (aaActive) {
					history.replace({ ...location.pathname, hash: `#${aaActive}` });
				}
			}
		});
		return () => {
			unlisten();
		};
	}, [dispatch, aaActive]);

	useEffect(() => {
		if (history.location.hash !== "") {
			if (listByBaseLoaded) {
				const address = history.location.hash.slice(1);
				if (obyte.utils.isValidAddress(address)) {
					if (!aaActive) {
						const wasFound = listByBase.findIndex(aa => aa.address === address);
						if (wasFound !== -1) {
							dispatch(changeActiveAA(address));
						} else {
							message.error("Address is not found!");
						}
					}
				} else {
					message.error("Address is not valid!");
				}
			}
		}
		// eslint-disable-next-line
	}, [dispatch, listByBaseLoaded]);

	useEffect(() => {
		client.onConnect(async () => {
			dispatch(openNetwork());
			await dispatch(getAasByBase());
			dispatch(subscribeBaseAA());
			dispatch(subscribeTokenRegistry());

			const heartbeat = setInterval(function() {
				client.api.heartbeat();
			}, 10 * 1000);

			client.client.ws.addEventListener("close", () => {
				dispatch(closeNetwork());
				dispatch(clearSubscribesAA());
				clearInterval(heartbeat);
			});

			if (aaActive) {
				dispatch(changeActiveAA(aaActive));
			}

			dispatch(watchRequestAas());
			if (aaActive === null) {
				await dispatch(subscribeActualAA());
			}
		});
		// eslint-disable-next-line
	}, []);
	if (network) {
		return <div>{props.children}</div>;
	} else if (!network) {
		return (
			<Result
				status="500"
				title="Connection is broken"
				subTitle="Wait until the connection is restored or reload the page"
			/>
		);
	}
};
