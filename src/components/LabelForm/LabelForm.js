import { Icon, Tooltip } from "antd";
import React from "react";

import styles from "./LabelForm.module.css";

export const LabelForm = ({ label, desc }) => (
	<span className={styles.LabelForm}>
		<Tooltip title={desc} placement="top">
			<Icon type="info-circle" className={styles.icon} />
		</Tooltip>{" "}
		{label}:
	</span>
);
