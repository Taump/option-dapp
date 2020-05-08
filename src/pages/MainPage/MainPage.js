import React from "react";
import { Row, Col, Form } from "antd";
import { useSelector } from "react-redux";

import { Layout } from "../../components/Layout/Layout";
import { SelectAA } from "../../components/SelectAA/SelectAA";
import NotificationList from "../../components/NotificationList/NotificationList";

import styles from "./MainPage.module.css";
import { Investment } from "../../forms/Investment/Investment";
import { Redemption } from "../../forms/Redemption/Redemption";
import { ChooseWinner } from "../../components/ChooseWinner/ChooseWinner";
import { AssetsIssue } from "../../components/AssetsIssue/AssetsIssue";
import { RegistryToken } from "../../components/RegistryToken/RegistryToken";

export default () => {
	const aaActive = useSelector(state => state.aa.active);
	const aaActiveInfo = useSelector(state => state.aa.activeInfo);
	const symbol_yes = useSelector(state => state.aa.symbol_yes);
	const symbol_no = useSelector(state => state.aa.symbol_no);
	const skip = useSelector(state => state.symbolsReg.skip);
	const symbol_yes_req = useSelector(state => state.symbolsReg.symbol_yes_req);
	const symbol_no_req = useSelector(state => state.symbolsReg.symbol_no_req);
	let screen;
	if (
		aaActiveInfo &&
		!("yes_asset" in aaActiveInfo && "no_asset" in aaActiveInfo)
	) {
		screen = "assets";
	} else if (
		(!(symbol_yes || symbol_yes_req) || !(symbol_no || symbol_no_req)) &&
		!skip
	) {
		screen = "symbols";
	} else {
		screen = "home";
	}
	return (
		<Layout title="Prediction markets" page="home">
			<Form>
				<Row className={styles.SelectAaRow}>
					<Col xs={{ span: 24 }} md={{ span: 12 }}>
						<Form.Item>
							<SelectAA autoFocus={true} />
						</Form.Item>
					</Col>
					<Col xs={{ span: 24, push: 0 }} md={{ span: 11, push: 1 }}>
						<Form.Item>
							{aaActive && !aaActiveInfo.winner && <ChooseWinner />}
						</Form.Item>
					</Col>
				</Row>
			</Form>
			{aaActive && screen === "home" && (
				<Row>
					<Col xs={{ span: 24 }} md={{ span: 10 }}>
						<Investment />
						<Redemption />
					</Col>
					<Col xs={{ span: 24 }} md={{ span: 12, push: 2 }}>
						<NotificationList isFull={false} />
					</Col>
				</Row>
			)}
			{aaActive && screen === "assets" && <AssetsIssue />}
			{aaActive && screen === "symbols" && <RegistryToken />}
			{!aaActive && (
				<Row>
					<Col xs={{ span: 24 }} md={{ span: 24 }}>
						<NotificationList />
					</Col>
				</Row>
			)}
		</Layout>
	);
};
