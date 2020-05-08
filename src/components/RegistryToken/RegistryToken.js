import React, { useEffect, useState } from "react";
import { Button, Row, Steps } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { RegistryTokenForm } from "../../forms/RegistryTokenForm/RegistryTokenForm";
import { skipRegToken } from "../../store/actions/symbolsReg";
const { Step } = Steps;
export const RegistryToken = () => {
	const dispatch = useDispatch();
	const symbol_yes = useSelector(state => state.aa.symbol_yes);
	const symbol_yes_req = useSelector(state => state.symbolsReg.symbol_yes_req);
	const symbol_no_req = useSelector(state => state.symbolsReg.symbol_no_req);
	const symbol_no = useSelector(state => state.aa.symbol_no);
	const [current, setCurrent] = useState(symbol_yes || symbol_yes_req ? 1 : 0);
	const currentBlock = [];
	currentBlock[0] = <RegistryTokenForm type="yes" />;
	currentBlock[1] = <RegistryTokenForm type="no" />;
	const handleSkip = () => {
		dispatch(skipRegToken());
	};
	useEffect(() => {
		console.log("symbol_yes", symbol_yes, "symbol_yes_req", symbol_yes_req);
		setCurrent(symbol_yes || symbol_yes_req ? 1 : 0);
	}, [symbol_no, symbol_yes, symbol_yes_req, symbol_no_req]);

	console.log("current", current);
	return (
		<>
			<Steps current={current} style={{ marginBottom: 10 }}>
				<Step title="Register Yes symbol" description="" />
				<Step title="Register No symbol" description="" />
			</Steps>
			{currentBlock[current]}
			<Row>
				{current === 0 ? (
					<Button onClick={() => setCurrent(1)}>Go to NO asset</Button>
				) : (
					<Button onClick={() => setCurrent(0)}>Go to YES asset</Button>
				)}
				<Button type="link" onClick={handleSkip}>
					Skip
				</Button>
			</Row>
		</>
	);
};
