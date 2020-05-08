import React, { useRef, useState } from "react";
import { Col, DatePicker, Form, Input, Row, Select } from "antd";
import { useDispatch } from "react-redux";
import moment from "moment";
import obyte from "obyte";

import { pendingDeployRequest } from "../../store/actions/deploy";

import styles from "../../pages/DeployPage/DeployPage.module.css";
import utils from "../../utils";
import config from "../../config";
import { LabelForm } from "../../components/LabelForm/LabelForm";

const { Option } = Select;
const { toNumericValue } = utils;

export const DeployAaForm = ({ params }) => {
	const StringDateNow = moment().format("YYYY-MM-DD");
	const [oracle, setOracle] = useState({
		value: (params.oracle_valid && params.oracle) || "",
		status: "",
		help: "",
		valid: params.oracle_valid || false
	});
	const [feedName, setFeedName] = useState(params.feed_name || "");
	const [comparison, setComparison] = useState(params.comparison || undefined);
	const [expiryDate, setExpiryDate] = useState(
		params.valid_date &&
			moment(params.expire_date).isValid() &&
			moment(StringDateNow).isSameOrBefore(params.expire_date)
			? { value: moment(params.expire_date), valid: true, help: "" }
			: { value: undefined, valid: false, help: "" }
	);
	const [feedValue, setFeedValue] = useState(params.feed_value || "");
	// const [redirect, setRedirect] = useState(false);
	const dispatch = useDispatch();

	const deployLink = useRef(null);

	const handleChangeOracle = ev => {
		const oracle = ev.target.value;
		if (!obyte.utils.isValidAddress(oracle)) {
			setOracle({
				value: oracle,
				status: "error",
				help: "Address is not valid",
				valid: false
			});
		} else {
			setOracle({ value: oracle, status: "success", help: "", valid: true });
		}
	};

	const handleChangeFeedName = ev => {
		setFeedName(ev.target.value);
	};

	const handleChangeFeedValue = ev => {
		setFeedValue(ev.target.value);
	};

	const handleChangeComparison = value => {
		setComparison(value);
	};

	const handleChangeExpiryDate = date => {
		if (date && moment(date).isValid()) {
			// let time = date.utc(true);
			// .format("YYYY-MM-DD");
			// .milliseconds(0);
			// .toISOString();

			if (moment(StringDateNow).isSameOrBefore(date)) {
				setExpiryDate({ value: moment(date), help: "", valid: true });
			} else {
				setExpiryDate({
					value: moment(date),
					help: "This date has already passed",
					valid: false
				});
			}
		} else {
			setExpiryDate({ value: undefined, help: "", valid: false });
		}
	};
	const handleKeyDownForm = e => {
		if (e.keyCode === 13) {
			if (oracle.valid && expiryDate && feedName && comparison && feedValue) {
				deployLink.current.click();
			}
		}
	};

	const AA = `{
  base_aa: '${config.base_aa}',
  params: {
    oracle_address: '${oracle.value}',
    comparison: '${comparison}', 
    feed_name: '${feedName}',
    feed_value: ${toNumericValue(feedValue)},
    expiry_date: '${expiryDate &&
			expiryDate.valid &&
			expiryDate.value.format("YYYY-MM-DD")}'
  }
}`;
	const handleClickDeploy = () => {
		dispatch(
			pendingDeployRequest({
				oracle_address: oracle.value,
				comparison,
				feed_name: feedName,
				feed_value: toNumericValue(feedValue, false),
				expiry_date: expiryDate.value.format("YYYY-MM-DD")
			})
		);
	};
	return (
		<Form onKeyDown={handleKeyDownForm}>
			<Row>
				<Form.Item
					hasFeedback
					validateStatus={oracle.status}
					help={oracle.help}
					label={
						<LabelForm
							label="Oracle"
							desc="Address of the oracle that tracks the event."
						/>
					}
					colon={false}
				>
					<Input
						placeholder="Oracle"
						value={oracle.value}
						onChange={handleChangeOracle}
						size="large"
						autoFocus={true}
					/>
				</Form.Item>
			</Row>
			<Row>
				<Col xs={{ span: 24 }} md={{ span: 8 }}>
					<Form.Item
						label={
							<LabelForm
								label="Feed name"
								desc="Name of the data feed where the result of the event will be posted."
							/>
						}
						colon={false}
					>
						<Input
							placeholder="Feed name"
							value={feedName}
							onChange={handleChangeFeedName}
							size="large"
							maxLength={64}
						/>
					</Form.Item>
				</Col>
				<Col xs={{ span: 24 }} md={{ span: 4, offset: 2 }}>
					<Form.Item
						label={
							<LabelForm
								label="Comparison operator"
								desc="Relation between the actual value posted by the oracle and the data feed value for Yes asset to win."
							/>
						}
						colon={false}
					>
						<Select
							placeholder="Comparison operator"
							className={styles.select}
							size="large"
							onChange={handleChangeComparison}
							value={comparison}
						>
							<Option key="more-1" value=">">
								>
							</Option>
							<Option key="less-2" value="<">
								{"<"}
							</Option>
							<Option key="equals-4" value=">=">
								>=
							</Option>
							<Option key="more-5" value="<=">
								{"<="}
							</Option>
							<Option key="less-6" value="==">
								==
							</Option>
							<Option key="equals-7" value="!=">
								!=
							</Option>
						</Select>
					</Form.Item>
				</Col>
				<Col xs={{ span: 24 }} md={{ span: 8, offset: 2 }}>
					<Form.Item
						label={
							<LabelForm
								label="Feed value"
								desc="Value of the tracked data feed that that will decide whether Yes or No asset wins."
							/>
						}
						colon={false}
					>
						<Input
							className={styles.input}
							size="large"
							placeholder="Feed value"
							maxLength={64}
							value={feedValue}
							onChange={handleChangeFeedValue}
						/>
					</Form.Item>
				</Col>
			</Row>
			<Row>
				<Col xs={{ span: 24 }} sm={{ span: 16 }} md={{ span: 12 }}>
					<Form.Item
						hasFeedback
						help={expiryDate.help}
						validateStatus={expiryDate.help && "error"}
						label={
							<LabelForm
								label="Expiration date (UTC)"
								desc="The event is supposed to happen on or before this date for Yes asset to win."
							/>
						}
						colon={false}
					>
						<DatePicker
							showTime={{
								defaultValue: moment("00 00 00", "H mm ss")
							}}
							format="YYYY-MM-DD"
							placeholder="Expiration date (UTC)"
							size="large"
							className={styles.datePicker}
							onChange={handleChangeExpiryDate}
							allowClear={false}
							value={
								(expiryDate.value && moment(expiryDate.value)) || undefined
							}
						/>
					</Form.Item>
				</Col>
			</Row>
			<Row>
				<Col
					xs={{ span: 24 }}
					sm={{ span: 12 }}
					md={{ span: 10 }}
					xxl={{ span: 8 }}
				>
					<Form.Item>
						<a
							className="ant-btn ant-btn-lg"
							ref={deployLink}
							onClick={handleClickDeploy}
							disabled={
								!(
									oracle.valid &&
									expiryDate.valid &&
									feedName &&
									comparison &&
									feedValue
								)
							}
							href={`obyte${
								config.testnet ? "-tn" : ""
							}:data?app=definition&definition=${encodeURIComponent(AA)}`}
						>
							Deploy from Obyte wallet
						</a>
					</Form.Item>
				</Col>
			</Row>
		</Form>
	);
};
