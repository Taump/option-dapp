import { Col, Form, InputNumber, Row, Typography } from "antd";
import config from "../../config";
import React, { useRef, useState } from "react";
import { useSelector } from "react-redux";
const { Title } = Typography;

export const Investment = () => {
	const aaActive = useSelector(state => state.aa.active);
	const aaActiveInfo = useSelector(state => state.aa.activeInfo);
	const symbol_yes = useSelector(state => state.aa.symbol_yes);
	const symbol_no = useSelector(state => state.aa.symbol_no);
	const [statusAmount, setStatusAmount] = useState({
		value: "",
		status: "",
		help: "",
		valid: false
	});

	const handleKeyDownAmount = e => {
		if (e.keyCode === 13) {
			if (statusAmount.valid) {
				investmentLink.current.click();
			}
		}
	};
	const investmentLink = useRef(null);
	const handleAmount = amount => {
		if (amount < 100000) {
			setStatusAmount({
				value: amount,
				status: "error",
				help: "The minimum amount is 100,000 bytes",
				valid: false
			});
		} else {
			if (!aaActiveInfo.winner) {
				if (aaActiveInfo.yes_asset) {
					if (aaActiveInfo.no_asset) {
						setStatusAmount({
							value: amount,
							status: "success",
							help: "",
							valid: true
						});
					} else {
						setStatusAmount({
							value: amount,
							status: "error",
							help: "no_asset has not been created",
							valid: false
						});
					}
				} else {
					setStatusAmount({
						value: amount,
						status: "error",
						help: "yes_asset has not been created",
						valid: false
					});
				}
			} else {
				setStatusAmount({
					value: amount,
					status: "error",
					help: "the winner has been chosen",
					valid: false
				});
			}
		}
	};

	return (
		<Form>
			<Title level={2}>Investment</Title>
			<p>
				Send Bytes and receive both Yes and No assets in exchange. Then, you’ll
				be able to sell one of the assets and keep the one you want to bet on.
			</p>

			<Row>
				<Col xs={{ span: 24 }} lg={{ span: 16 }}>
					<Form.Item
						hasFeedback
						validateStatus={statusAmount.status}
						help={statusAmount.help}
					>
						<InputNumber
							placeholder="Amount byte (>100k)"
							onChange={handleAmount}
							value={statusAmount.value}
							style={{ width: "100%" }}
							min={100000}
							size="large"
							onKeyDown={handleKeyDownAmount}
						/>
					</Form.Item>
				</Col>
				<Col xs={{ span: 24, push: 0 }} lg={{ span: 7, push: 1 }}>
					<Form.Item>
						<a
							type="primary"
							disabled={!(statusAmount.valid && !!aaActive)}
							href={`obyte${config.testnet ? "-tn" : ""}:${aaActive}?amount=${
								statusAmount.value
							}&amp;asset=base`}
							className="ant-btn ant-btn-primary ant-btn-lg"
							ref={investmentLink}
						>
							Send
						</a>
					</Form.Item>
				</Col>
			</Row>
			<Row>
				<p>
					{symbol_yes && (
						<a
							href={config.LINK_TO_ODEX + "GBYTE/" + symbol_yes}
							target="_blank"
							rel="noopener"
						>
							Trade {symbol_yes} on ODEX
						</a>
					)}
				</p>
				<p>
					{symbol_no && (
						<a
							href={config.LINK_TO_ODEX + "GBYTE/" + symbol_no}
							target="_blank"
							rel="noopener"
						>
							Trade {symbol_no} on ODEX
						</a>
					)}
				</p>
			</Row>
		</Form>
	);
};
