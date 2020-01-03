import React, { useState, useEffect } from "react";
import { Modal, Form, Select, Spin, Icon } from "antd";
import { useDispatch, useSelector } from "react-redux";

import { addAA, getAasByBase } from "../../store/actions/aa";

import styles from "../ModalAddAA/ModalAddAA.module.css";

const { Option } = Select;

export const ModalAddAA = ({ onCancel }) => {
  const dispatch = useDispatch();
  const listByBaseLoaded = useSelector(state => state.aa.listByBaseLoaded);
  const listByBase = useSelector(state => state.aa.listByBase);
  const list = useSelector(state => state.aa.list);
  const [addressAA, setAddressAA] = useState("");

  useEffect(() => {
    dispatch(getAasByBase());
  }, [dispatch]);

  const listByBaseForSelect = listByBase.filter(
    arr => list.find(a => a === arr.address) === undefined
  );

  return (
    <Modal
      title="Add AA in dashboard"
      visible={true}
      onOk={() => {
        if (addressAA) {
          dispatch(addAA(addressAA));
        }
        onCancel();
      }}
      onCancel={() => {
        onCancel();
        setAddressAA("");
      }}
    >
      {listByBaseLoaded ? (
        <Form>
          <Form.Item>
            <Select
              placeholder="Select a AA"
              size="large"
              showSearch={true}
              onChange={setAddressAA}
              autoFocus={true}
              removeIcon={<Icon type="close" />}
            >
              <Option key={"AA0"} value={0} disabled>
                Select a AA
              </Option>
              {listByBaseForSelect.map((aa, i) => (
                <Option key={"AA" + i} value={aa.address}>
                  {aa.address}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      ) : (
        <div className={styles.spinWrap}>
          <Spin size="large" />
        </div>
      )}
    </Modal>
  );
};
