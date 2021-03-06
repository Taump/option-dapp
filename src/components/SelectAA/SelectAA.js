import React from "react";
import { Select } from "antd";
import { useSelector, useDispatch } from "react-redux";

import { changeActiveAA } from "../../store/actions/aa";

import styles from "../SelectAA/SelectAA.module.css";
const { Option, OptGroup } = Select;

export const SelectAA = props => {
	const dispatch = useDispatch();
	const aaListByBase = useSelector(state => state.aa.listByBase);
	const aaActive = useSelector(state => state.aa.active);
	const listByBaseLoaded = useSelector(state => state.aa.listByBaseLoaded);
	// const [recentAas, setRecentAas] = useLocalStorage("recentAas", []);
	const recentAas = useSelector(state => state.recent);
	const recentActive = aaListByBase.length > 8;
	const handleSelectAA = address => {
		dispatch(changeActiveAA(address));
	};

	const notRecentAaListByBase = aaListByBase.filter(
		aaBase =>
			recentAas.find(address => address === aaBase.address) === undefined
	);

	return (
		<Select
			className={styles.select}
			placeholder="Select a AA"
			onChange={handleSelectAA}
			value={aaActive || 0}
			size="large"
			loading={!listByBaseLoaded}
			showSearch={true}
			optionFilterProp="children"
			filterOption={(input, option) => {
				const inputData = input.toLowerCase();
				const viewData = String(option.props.children).toLowerCase();
				return viewData.indexOf(inputData) >= 0;
			}}
			{...props}
		>
			<Option key={"AA0"} value={0} disabled>
				Select a market
			</Option>
			{recentActive && recentAas.length >= 1 && (
				<OptGroup label="Recent markets">
					{recentAas &&
						recentAas.map((address, i) => {
							const aa = aaListByBase.find(aa => aa.address === address);
							if (!aa) {
								return null;
							}
							return (
								<Option
									key={"AA" + i}
									value={aa.address}
									style={{ fontWeight: "regular" }}
								>
									{aa.view}
								</Option>
							);
						})}
				</OptGroup>
			)}
			<OptGroup
				label={
					(recentActive && recentAas.length >= 1 && "Other markets") ||
					"All markets"
				}
			>
				{notRecentAaListByBase.map((aa, i) => {
					return (
						<Option
							key={"AA" + i}
							value={aa.address}
							style={{ fontWeight: "regular" }}
						>
							{aa.view}
						</Option>
					);
				})}
			</OptGroup>
		</Select>
	);
};
