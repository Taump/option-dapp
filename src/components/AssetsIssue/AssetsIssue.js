import React from "react";
import { Icon, Result, Row, Steps } from "antd";
import config from "../../config";
import { useSelector } from "react-redux";
import base64url from "base64url";
const { Step } = Steps;

export const AssetsIssue = () => {
	const aaActive = useSelector(state => state.aa.active);
	const aaActiveInfo = useSelector(state => state.aa.activeInfo);
	const aaActiveAssetsRequest = useSelector(
		state => state.aa.activeAssetsRequest
	);
	const getCurrentStep = info => {
		if (info) {
			if (info.yes_asset || aaActiveAssetsRequest.yes_asset) {
				if (info.no_asset || aaActiveAssetsRequest.no_asset) {
					return 2;
				} else {
					return 1;
				}
			} else {
				return 0;
			}
		} else {
			return 0;
		}
	};
	const current = getCurrentStep(aaActiveInfo);
	const data = current === 0 ? { define_yes: 1 } : { define_no: 1 };
	const dataString = JSON.stringify(data);
	const dataBase64 = base64url(dataString);
	const currentBlock = [];
	currentBlock[0] = (
		<Result
			icon={<Icon type="loading" />}
			title="Issue Yes asset"
			subTitle="After sending a request to issue the asset, you will proceed to the next step"
			extra={
				<a
					href={`obyte${
						config.testnet ? "-tn" : ""
					}:${aaActive}?amount=10000&base64data=${dataBase64}`}
					className="ant-btn ant-btn-primary ant-btn-lg"
				>
					Issue
				</a>
			}
		/>
	);

	currentBlock[1] = (
		<Result
			icon={<Icon type="loading" />}
			title="Issue No asset"
			subTitle="After sending a request to issue the asset, you will proceed to the next step"
			extra={
				<a
					href={`obyte${
						config.testnet ? "-tn" : ""
					}:${aaActive}?amount=10000&base64data=${dataBase64}`}
					className="ant-btn ant-btn-primary ant-btn-lg"
				>
					Issue
				</a>
			}
		/>
	);

	currentBlock[2] = (
		<Result
			icon={<Icon type="loading" />}
			title="We are waiting for the assets to be issued."
		/>
	);

	return (
		<div>
			<Steps current={current}>
				<Step title="Yes asset" description="" />
				<Step title="No asset" description="" />
				<Step title="Pending issue" description="" />
			</Steps>
			<Row>{currentBlock[current]}</Row>
		</div>
	);
};
