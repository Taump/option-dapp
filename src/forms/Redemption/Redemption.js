import React, { useEffect, useState } from "react";
import { Button, Col, Form, Input, Row, Typography } from "antd";
import styles from "../../pages/MainPage/MainPage.module.css";
import config from "../../config";
import { useDispatch, useSelector } from "react-redux";
import obyte from "obyte";
import {
	clearBalanceActiveAA,
	getBalanceActiveAA,
	updateInfoActiveAA
} from "../../store/actions/aa";

const { Title } = Typography;
export const Redemption = () => {
	const aaActive = useSelector(state => state.aa.active);
	const aaActiveInfo = useSelector(state => state.aa.activeInfo);
	const aaActiveBalance = useSelector(state => state.aa.activeBalance);
	const dispatch = useDispatch();
	const [statusAddress, setStatusAddress] = useState({
		value: "",
		status: "",
		help: "",
		valid: false
	});

	useEffect(() => {
		dispatch(clearBalanceActiveAA());
	}, [statusAddress, dispatch]);

	const handleChangeAddress = ev => {
		const address = ev.target.value;
		if (!obyte.utils.isValidAddress(address)) {
			setStatusAddress({
				value: address,
				status: "error",
				help: "Address is not valid",
				valid: false
			});
		} else {
			setStatusAddress({
				value: address,
				status: "success",
				help: "",
				valid: true
			});
		}
	};
	const handleClick = () => {
		dispatch(getBalanceActiveAA(statusAddress.value));
		dispatch(updateInfoActiveAA(aaActive));
	};
	return (
		<Row style={{ marginTop: 30 }}>
			<Title level={2}>Redemption</Title>
			<p>Redeem the winning asset (Yes or No) for Bytes</p>
			<Form>
				<Row>
					<Col xs={{ span: 24 }} lg={{ span: 16 }}>
						<Form.Item
							hasFeedback
							validateStatus={statusAddress.status}
							help={statusAddress.help}
						>
							<Input
								placeholder="Your address"
								onChange={handleChangeAddress}
								value={statusAddress.value}
								style={{ width: "100%" }}
								min={100000}
								size="large"
								onKeyPress={target => {
									if (target.key === "Enter") {
										if (statusAddress.valid && !!aaActive) {
											handleClick();
										}
									}
								}}
							/>
						</Form.Item>
					</Col>
					<Col xs={{ span: 24, push: 0 }} lg={{ span: 7, push: 1 }}>
						<Form.Item>
							<Button
								type="primary"
								size="large"
								disabled={!(statusAddress.valid && !!aaActive)}
								onClick={handleClick}
							>
								Search
							</Button>
						</Form.Item>
					</Col>
				</Row>
			</Form>
			<Row>
				{statusAddress.valid && aaActiveBalance.loading && (
					<div className={styles.activeBalance}>
						<Row>
							<b>Winner: </b>
							{aaActiveInfo.winner
								? aaActiveInfo.winner + "_asset"
								: "The winner is not known yet"}
						</Row>
						<Row>
							<b>No asset: </b>
							{aaActiveInfo.no_asset
								? aaActiveInfo.no_asset
								: "No asset has not been created"}
						</Row>
						<Row>
							<b>Yes asset: </b>
							{aaActiveInfo.yes_asset
								? aaActiveInfo.yes_asset
								: "Yes asset has not been created"}
						</Row>
						<Row>
							<b>your balance of Yes asset: </b>
							{aaActiveBalance.yes_asset ? aaActiveBalance.yes_asset : "0"}
						</Row>
						<Row>
							<b>your balance of No asset: </b>
							{aaActiveBalance.no_asset ? aaActiveBalance.no_asset : "0"}
						</Row>
						<Row style={{ marginTop: 15 }}>
							{aaActiveInfo.winner &&
								aaActiveBalance[aaActiveInfo.winner + "_asset"] > 0 && (
									<a
										type="primary"
										href={`obyte${
											config.testnet ? "-tn" : ""
										}:${aaActive}?amount=${
											aaActiveBalance[aaActiveInfo.winner + "_asset"]
										}&amp;&asset=${encodeURIComponent(
											aaActiveInfo[aaActiveInfo.winner + "_asset"]
										)}&from_address=${statusAddress.value}`}
										className="ant-btn ant-btn-lg"
									>
										Exchange for bytes
									</a>
								)}
						</Row>
					</div>
				)}
			</Row>
		</Row>
	);
};
