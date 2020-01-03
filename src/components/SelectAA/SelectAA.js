import React from "react";
import { Select } from "antd";
import { useSelector, useDispatch } from "react-redux";

import { changeActiveAA } from "../../store/actions/aa";
import styles from "../SelectAA/SelectAA.module.css";

const { Option } = Select;

export const SelectAA = props => {
  const dispatch = useDispatch();
  const aaList = useSelector(state => state.aa.list);
  const aaActive = useSelector(state => state.aa.active);

  const handleSelectAA = address => {
    dispatch(changeActiveAA(address));
  };

  return (
    <Select
      className={styles.select}
      placeholder="Select a AA"
      onChange={handleSelectAA}
      value={aaActive || 0}
      size="large"
      {...props}
    >
      <Option key={"AA0"} value={0} disabled>
        Select a AA
      </Option>
      {aaList.map((aa, i) => (
        <Option key={"AA" + i} value={aa}>
          {aa}
        </Option>
      ))}
    </Select>
  );
};
