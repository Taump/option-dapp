import React from "react";
import { Select } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { truncate } from "lodash";
import { changeActiveAA, getAasByBase } from "../../store/actions/aa";
import styles from "../SelectAA/SelectAA.module.css";

const { Option } = Select;

export const SelectAA = props => {
  const dispatch = useDispatch();
  const aaListByBase = useSelector(state => state.aa.listByBase);
  const aaActive = useSelector(state => state.aa.active);
  const listByBaseLoaded = useSelector(state => state.aa.listByBaseLoaded);

  const handleSelectAA = address => {
    dispatch(changeActiveAA(address));
  };
  const truncateOptions = { length: 13 };
  return (
    <Select
      className={styles.select}
      placeholder="Select a AA"
      onChange={handleSelectAA}
      value={aaActive || 0}
      size="large"
      loading={!listByBaseLoaded}
      showSearch={true}
      onDropdownVisibleChange={() => dispatch(getAasByBase())}
      {...props}
    >
      <Option key={"AA0"} value={0} disabled>
        Select a AA
      </Option>
      {aaListByBase.map((aa, i) => {
        const {
          feed_name,
          comparison,
          expiry_date,
          feed_value
        } = aa.definition[1].params;
        return (
          <Option key={"AA" + i} value={aa.address}>
            {truncate(feed_name, truncateOptions) +
              " " +
              comparison +
              " " +
              truncate(feed_value, truncateOptions)}{" "}
            on {expiry_date} ({aa.address})
          </Option>
        );
      })}
    </Select>
  );
};
