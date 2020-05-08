import { Button, Modal } from "antd";
import React, { useState } from "react";
import config from "../../config";
import base64url from "base64url";
import { useSelector } from "react-redux";

export const ChooseWinner = () => {
	const [visibleWinnerModal, setVisibleWinnerModal] = useState(false);

	const aaActive = useSelector(state => state.aa.active);
	const dataWinner = {
		yes_asset: {
			winner: "yes"
		},
		no_asset: {
			winner: "no"
		}
	};
	const dataWinnerYesStr = JSON.stringify(dataWinner.yes_asset);
	const dataWinnerNoStr = JSON.stringify(dataWinner.no_asset);
	const dataWinnerYesBase64 = base64url(dataWinnerYesStr);
	const dataWinnerNoBase64 = base64url(dataWinnerNoStr);
	return (
		<>
			<Button
				type="default"
				size="large"
				onClick={() => setVisibleWinnerModal(true)}
			>
				Choose a winner
			</Button>
			<Modal
				visible={visibleWinnerModal}
				footer={null}
				title="Post the outcome of the market. This outcome must be already confirmed by the oracle."
				onCancel={() => setVisibleWinnerModal(false)}
			>
				<div style={{ display: "flex", justifyContent: "space-around" }}>
					<a
						href={`obyte${
							config.testnet ? "-tn" : ""
						}:${aaActive}?amount=10000&base64data=${dataWinnerYesBase64}`}
						className="ant-btn ant-btn-primary ant-btn-lg"
					>
						“Yes” outcome won
					</a>

					<a
						href={`obyte${
							config.testnet ? "-tn" : ""
						}:${aaActive}?amount=10000&base64data=${dataWinnerNoBase64}`}
						className="ant-btn ant-btn-primary ant-btn-lg"
					>
						“No” outcome won
					</a>
				</div>
			</Modal>
		</>
	);
};
