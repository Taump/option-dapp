import React, { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Row, Form, Input, Button } from "antd";
import {
	changeTypeSymbol,
	checkToken,
	clearCheckToken
} from "../../store/actions/symbolsReg";
import config from "../../config";
import base64url from "base64url";
const reservedTokens = ["GBYTE", "MBYTE", "KBYTE", "BYTE"];

export const RegistryTokenForm = ({ type }) => {
	const dispatch = useDispatch();
	const active = useSelector(state => state.aa.active);
	const pendingCheck = useSelector(state => state.symbolsReg.pendingCheck);
	const wasTaken = useSelector(state => state.symbolsReg.wasTaken);
	const symbol = useSelector(state => state.aa["symbol_" + type]);
	const { feed_name, expiry_date, comparison, feed_value } = useSelector(
		state => state.aa.activeParams
	);
	const asset = useSelector(state => state.aa.activeInfo[type + "_asset"]);

	const checkBtn = useRef(null);
	const regBtn = useRef(null);

	const [token, setToken] = useState({ value: "", valid: false });
	const [tokenSupport, setTokenSupport] = useState({
		value: 0.1,
		valid: true
	});
	const [descr, setDescr] = useState({
		value: "",
		valid: false
	});

	useEffect(() => {
		dispatch(changeTypeSymbol(type));
	}, [type, active, dispatch]);

	useEffect(() => {
		if (wasTaken !== null) {
			dispatch(clearCheckToken());
		}
	}, [dispatch, type, active, token]);

	useEffect(() => {
		if (feed_name && expiry_date) {
			setToken({
				value: `${feed_name
					.split("_", 1)[0]
					.toUpperCase()}_${expiry_date.replace(
					/-/g,
					""
				)}_${type.toUpperCase()}`,
				valid: true
			});
			setDescr({
				value: `${
					feed_name.split("_", 1)[0]
				} ${comparison} ${feed_value} on ${expiry_date} - ${type.toUpperCase()}`,
				valid: true
			});
		}
	}, [feed_name, expiry_date, comparison, type, feed_value]);

	let validateStatusSymbol;
	let helpSymbol;
	if (!token.valid) {
		if (token.value.length > 40) {
			validateStatusSymbol = "error";
			helpSymbol = "The symbol must be less than 40 characters";
		} else if (reservedTokens.find(t => token.value === t)) {
			validateStatusSymbol = "error";
			helpSymbol = "This symbol name is reserved";
		} else {
			validateStatusSymbol = null;
			helpSymbol = null;
		}
	} else if (token.valid) {
		if (wasTaken === true) {
			if (symbol && symbol === token.value) {
				validateStatusSymbol = "warning";
				helpSymbol = `Symbol name ${token.value} is already assigned to this prediction, you can add support to this symbol.`;
			} else {
				validateStatusSymbol = "warning";
				helpSymbol =
					"This token name is already taken. This will start a dispute";
			}
		} else if (wasTaken === false) {
			validateStatusSymbol = "success";
			helpSymbol = (
				<span
					style={{ color: "#52c41a" }}
				>{`Symbol name ${token.value} is available, you can register it.`}</span>
			);
		}
	}

	let disabled;
	if (!tokenSupport.valid) {
		disabled = true;
	} else {
		if (wasTaken) {
			disabled = false;
		} else {
			if (descr) {
				if (descr.valid) {
					disabled = false;
				} else {
					disabled = true;
				}
			} else {
				disabled = false;
			}
		}
	}

	let data = { symbol: token.value, asset };
	if (!wasTaken && !symbol) {
		data = { ...data, decimals: 9 };
		if (descr && descr.value.length > 0) {
			data = { ...data, description: String(descr.value) };
		}
	}
	const dataString = JSON.stringify(data);
	const dataBase64 = base64url(dataString);

	const handleChangeSymbol = ev => {
		const targetToken = ev.target.value.toUpperCase();
		// eslint-disable-next-line no-useless-escape
		const reg = /^[0-9A-Z_\-]+$/;
		if (reg.test(targetToken) || !targetToken) {
			if (targetToken.length > 0) {
				if (targetToken.length <= 40) {
					if (reservedTokens.find(t => targetToken === t)) {
						setToken({ ...token, value: targetToken, valid: false });
					} else {
						setToken({ ...token, value: targetToken, valid: true });
					}
				} else {
					setToken({
						...token,
						value: targetToken,
						valid: false
					});
				}
			} else {
				setToken({ ...token, value: targetToken, valid: false });
			}
		}
	};
	const handleChangeSupport = ev => {
		const support = ev.target.value;
		const reg = /^[0-9.]+$/;
		const f = x => (~(x + "").indexOf(".") ? (x + "").split(".")[1].length : 0);
		if (support) {
			if (reg.test(support) && f(support) <= 9) {
				if (Number(support) >= 0.1) {
					setTokenSupport({ ...token, value: support, valid: true });
				} else {
					setTokenSupport({ ...token, value: support, valid: false });
				}
			}
		} else {
			setTokenSupport({ ...token, value: "", valid: false });
		}
	};

	const handleChangeDescr = ev => {
		const { value } = ev.target;
		if (value.length < 140) {
			setDescr({ value, valid: true });
		} else {
			setDescr({ value, valid: false });
		}
	};

	const handleSubmit = ev => {
		ev.preventDefault();
		if (wasTaken === null) {
			checkBtn.current.click();
		} else {
			regBtn.current.click();
		}
	};

	return (
		<Row>
			{symbol && (
				<p style={{ paddingTop: 15, fontWeight: "bold" }}>
					This prediction already has a symbol {symbol} assigned to it.
					Attempting to assign a new symbol will start a dispute process which
					can take more than 30 days. The symbol that gets more support (in
					terms of GBYTE deposits) eventually wins.
				</p>
			)}
			<Form layout="horizontal" onSubmit={handleSubmit}>
				<Form.Item
					hasFeedback
					validateStatus={validateStatusSymbol}
					help={helpSymbol}
					label="Symbol"
				>
					<Input
						value={token.value}
						size="large"
						onChange={ev => {
							handleChangeSymbol(ev);
						}}
						disabled={pendingCheck}
					/>
				</Form.Item>
				<Form.Item
					hasFeedback
					validateStatus={tokenSupport.valid ? "success" : "error"}
					help={!tokenSupport.valid && "Minimum support 0.1 GBYTEs"}
					label="Your deposit in support of this symbol (in GBYTEs)"
					extra="You can withdraw your deposit at any time. However, if there are several competing names, the name with the largest support wins."
				>
					<Input
						value={tokenSupport.value}
						size="large"
						onChange={handleChangeSupport}
					/>
				</Form.Item>
				{!(symbol || (wasTaken !== null && wasTaken)) && (
					<Form.Item
						label="Description of an asset (up to 140 characters)"
						hasFeedback
						validateStatus={descr && !descr.valid ? "error" : null}
					>
						<Input.TextArea
							disabled={pendingCheck}
							value={descr ? descr.value : undefined}
							onChange={handleChangeDescr}
						/>
					</Form.Item>
				)}
				<Form.Item>
					{wasTaken === null ? (
						<Button
							type="primary"
							size="large"
							ref={checkBtn}
							onClick={() => dispatch(checkToken(token.value))}
							loading={pendingCheck}
							disabled={!token.valid}
						>
							Check availability
						</Button>
					) : (
						<a
							className="ant-btn ant-btn-primary ant-btn-lg"
							ref={regBtn}
							disabled={disabled}
							href={`obyte${config.testnet ? "-tn" : ""}:${
								config.TOKEN_REGISTRY_AA_ADDRESS
							}?amount=${tokenSupport.value *
								10 ** 9}&base64data=${encodeURIComponent(dataBase64)}`}
						>
							{wasTaken
								? (symbol && symbol === token.value && "Add support") ||
								  "Register anyway"
								: "Register"}
						</a>
					)}
				</Form.Item>
			</Form>
		</Row>
	);
};
