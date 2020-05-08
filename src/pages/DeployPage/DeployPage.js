import React, { useEffect } from "react";
import { Row, Col, notification, Result, Icon, Button } from "antd";

import obyte from "obyte";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import { useLocation, useHistory } from "react-router-dom";

import { Layout } from "../../components/Layout/Layout";
import { DeployAaForm } from "../../forms";
import { clearBalanceActiveAA } from "../../store/actions/aa";
import { CancelPendingDeployRequest } from "../../store/actions/deploy";
export default () => {
	const location = useLocation();
	let history = useHistory();
	let params = {};

	if (location.search) {
		const queryParams = location.search.slice(1).split("&");
		queryParams.forEach(param => {
			const p = param.split("=");
			params[p[0]] = decodeURIComponent(p[1]).slice(0, 64);
		});
		if ("oracle" in params) {
			params.oracle_valid = obyte.utils.isValidAddress(params.oracle);
		}
		if ("expire_date" in params) {
			if (!moment(params.expire_date, "YYYY-MM-DD").isValid()) {
				notification["error"]({
					message: "Date expiry is not valid!"
				});
				params.valid_date = false;
			} else {
				params.valid_date = true;
			}
		}
		if (params.oracle && !params.oracle_valid) {
			notification["error"]({
				message: "Oracle address is not valid!"
			});
		}
	}
	const pending = useSelector(state => state.deploy.pending);
	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(clearBalanceActiveAA());
	}, [dispatch]);

	useEffect(() => {
		if (location && location.search) {
			history.push("/deploy");
		}
	});

	// useEffect(() => {
	//   if (wasIssued && deployAaPrams) {
	//     history.push("/issuing_assets");
	//   }
	// }, [wasIssued, history, deployAaPrams]);

	return (
		<Layout title="Create a new prediction market" page="deploy">
			<Row>
				<p>
					Create a market for a future event that has only two resolutions: Yes
					and No.
				</p>
				<p>
					Examples: Will Chelsea win in their next play against Liverpool? Will
					Trump be re-elected in 2020 US presidential elections? Will BTC go
					over $20,000 before the end of 2020?
				</p>
				<p>
					Indicate below the conditions for Yes answer to win. The outcome
					should be posted by an oracle in a specific data feed, for example,
					for BTC to go over $20,000, the price oracle should post a data feed
					BTC_USD greater than 20000.
				</p>
				<p>
					After you create the market, you’ll also issue Yes and No assets that
					represent the two outcomes of the event. Users will be able to trade
					these assets to make bets on either outcome.
				</p>
			</Row>
			<Row>
				<Col span={24}>
					{!pending ? (
						<DeployAaForm params={params} />
					) : (
						<Result
							icon={<Icon type="loading" />}
							title="Waiting for your deployment request"
							subTitle="After that, you will be redirected to the asset issue page"
							extra={
								<Button
									type="danger"
									onClick={() => dispatch(CancelPendingDeployRequest())}
								>
									Cancel
								</Button>
							}
						/>
					)}
				</Col>
			</Row>
		</Layout>
	);
};
