import React, { useEffect } from "react";
import { Select } from "antd";
import { useSelector, useDispatch } from "react-redux";

import { changeActiveAA, getAasByBase } from "../../store/actions/aa";
import styles from "../SelectAA/SelectAA.module.css";

const { Option } = Select;

export const SelectAA = props => {
  const dispatch = useDispatch();
  const aaListByBase = useSelector(state => state.aa.listByBase);
  const aaActive = useSelector(state => state.aa.active);
  const listByBaseLoaded = useSelector(state => state.aa.listByBaseLoaded);
  const subscriptions = useSelector(state => state.aa.subscriptions);

  useEffect(() => {
    dispatch(getAasByBase());
  }, [dispatch]);

  const handleSelectAA = address => {
    const isSubscription =
      subscriptions.filter(aa => aa === address).length > 0;
    dispatch(changeActiveAA(address, isSubscription));
  };

  return (
    <Select
      className={styles.select}
      placeholder="Select a AA"
      onChange={handleSelectAA}
      value={aaActive || 0}
      size="large"
      loading={!listByBaseLoaded}
      showSearch={true}
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
            {feed_name + " " + comparison + " " + feed_value} on {expiry_date} (
            {aa.address})
          </Option>
        );
      })}
    </Select>
  );
};
