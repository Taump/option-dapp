import React, { useState } from "react";
import {
  Typography,
  Row,
  Col,
  Button,
  Form,
  InputNumber,
  Input,
  Modal
} from "antd";
import { useSelector, useDispatch } from "react-redux";
import obyte from "obyte";
import base64url from "base64url";
import { ModalAddAA } from "../../components/ModalAddAA/ModalAddAA";
import { Layout } from "../../components/Layout/Layout";
import { getBalanceActiveAA, updateInfoActiveAA } from "../../store/actions/aa";
import { SelectAA } from "../../components/SelectAA/SelectAA";
import config from "./../../config";
import styles from "../Main/Main.module.css";
const { Title } = Typography;

export default props => {
  const [statusAmount, setStatusAmount] = useState({
    value: "",
    status: "",
    help: "",
    valid: false
  });

  const [statusAddress, setStatusAddress] = useState({
    value: "",
    status: "",
    help: "",
    valid: false
  });

  const [visibleAddAaModal, setVisibleAddAaModal] = useState({
    visible: false,
    value: null
  });
  const [visibleWinnerModal, setVisibleWinnerModal] = useState(false);

  const dispatch = useDispatch();
  const aaActive = useSelector(state => state.aa.active);
  const aaList = useSelector(state => state.aa.list);
  const aaActiveInfo = useSelector(state => state.aa.activeInfo);
  const aaActiveBalance = useSelector(state => state.aa.activeBalance);

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

  const handleAmount = amount => {
    if (amount < 100000) {
      setStatusAmount({
        value: amount,
        status: "error",
        help: "The minimum amount is 100,000 bytes",
        valid: false
      });
    } else {
      if (!aaActiveInfo.winner) {
        if (aaActiveInfo.yes_asset) {
          if (aaActiveInfo.no_asset) {
            setStatusAmount({
              value: amount,
              status: "success",
              help: "",
              valid: true
            });
          } else {
            setStatusAmount({
              value: amount,
              status: "error",
              help: "no_asset has not been created",
              valid: false
            });
          }
        } else {
          setStatusAmount({
            value: amount,
            status: "error",
            help: "yes_asset has not been created",
            valid: false
          });
        }
      } else {
        setStatusAmount({
          value: amount,
          status: "error",
          help: "the winner has been chosen",
          valid: false
        });
      }
    }
  };

  const handleChangeAddress = ev => {
    const address = ev.target.value;
    if (!obyte.utils.isValidAddress(address)) {
      setStatusAddress({
        value: address,
        status: "error",
        help: "Address is not valid",
        valid: false
      });
    } else {
      setStatusAddress({
        value: address,
        status: "success",
        help: "",
        valid: true
      });
    }
  };

  const handleClick = () => {
    dispatch(getBalanceActiveAA(statusAddress.value));
    dispatch(updateInfoActiveAA(aaActive));
  };

  return (
    <Layout title="Dashboard" page="dashboard">
      <Form>
        <Row className={styles.SelectAaRow}>
          <Col xs={{ span: 24 }} md={{ span: 12 }}>
            <Form.Item>
              <SelectAA autoFocus={aaList.length !== 0} />
            </Form.Item>
          </Col>
          <Col xs={{ span: 24, push: 0 }} md={{ span: 11, push: 1 }}>
            <Form.Item>
              <Button
                type="primary"
                icon="plus"
                size="large"
                style={{ marginRight: 10 }}
                onClick={() => setVisibleAddAaModal({ visible: true })}
                autoFocus={aaList.length === 0}
              >
                Add
              </Button>

              {aaActive && !aaActiveInfo.winner && (
                <Button
                  type="default"
                  size="large"
                  onClick={() => setVisibleWinnerModal(true)}
                >
                  Choose a winner
                </Button>
              )}
            </Form.Item>
          </Col>
        </Row>
      </Form>
      {aaActive && (
        <Row>
          <Col xs={{ span: 24 }} md={{ span: 10 }}>
            <Title level={2}>Investment</Title>
            <Form>
              <Row>
                <Col xs={{ span: 24 }} lg={{ span: 16 }}>
                  <Form.Item
                    hasFeedback
                    validateStatus={statusAmount.status}
                    help={statusAmount.help}
                  >
                    <InputNumber
                      placeholder="Amount byte (>100k)"
                      onChange={handleAmount}
                      value={statusAmount.value}
                      style={{ width: "100%" }}
                      min={100000}
                      size="large"
                    />
                  </Form.Item>
                </Col>
                <Col xs={{ span: 24, push: 0 }} lg={{ span: 7, push: 1 }}>
                  <Form.Item>
                    <a
                      type="primary"
                      disabled={!(statusAmount.valid && !!aaActive)}
                      href={`byteball${
                        config.testnet ? "-tn" : ""
                      }:${aaActive}?amount=${
                        statusAmount.value
                      }&amp;asset=base`}
                      className="ant-btn ant-btn-primary ant-btn-lg"
                    >
                      Next
                    </a>
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </Col>
          <Col xs={{ span: 24 }} md={{ span: 12, push: 2 }}>
            <Title level={2}>Redemption</Title>
            <Form>
              <Row>
                <Col xs={{ span: 24 }} lg={{ span: 16 }}>
                  <Form.Item
                    hasFeedback
                    validateStatus={statusAddress.status}
                    help={statusAddress.help}
                  >
                    <Input
                      placeholder="Your address"
                      onChange={handleChangeAddress}
                      value={statusAddress.value}
                      style={{ width: "100%" }}
                      min={100000}
                      size="large"
                      onKeyPress={target => {
                        if (target.key === "Enter") {
                          if (statusAddress.valid && !!aaActive) {
                            handleClick();
                          }
                        }
                      }}
                    />
                  </Form.Item>
                </Col>
                <Col xs={{ span: 24, push: 0 }} lg={{ span: 7, push: 1 }}>
                  <Form.Item>
                    <Button
                      type="primary"
                      size="large"
                      disabled={!(statusAddress.valid && !!aaActive)}
                      onClick={handleClick}
                    >
                      Search
                    </Button>
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                {statusAddress.valid && aaActiveBalance.loading && (
                  <div
                    style={{
                      backgroundColor: "#F0F2F5",
                      wordBreak: "break-all",
                      padding: 25,
                      borderRadius: 5,
                      fontSize: 18
                    }}
                  >
                    <Row>
                      <b>winner: </b>
                      {aaActiveInfo.winner
                        ? aaActiveInfo.winner + "_asset"
                        : "the winner has not yet been chosen"}
                    </Row>
                    <Row>
                      <b>no_asset: </b>
                      {aaActiveInfo.no_asset
                        ? aaActiveInfo.no_asset
                        : "yes_asset has not been created"}
                    </Row>
                    <Row>
                      <b>yes_asset: </b>
                      {aaActiveInfo.yes_asset
                        ? aaActiveInfo.yes_asset
                        : "yes_asset has not been created"}
                    </Row>
                    <Row>
                      <b>your balance of yes_asset: </b>
                      {aaActiveBalance.yes_asset
                        ? aaActiveBalance.yes_asset
                        : "0"}
                    </Row>
                    <Row>
                      <b>your balance of no_asset: </b>
                      {aaActiveBalance.no_asset
                        ? aaActiveBalance.no_asset
                        : "0"}
                    </Row>
                    <Row style={{ marginTop: 15 }}>
                      {aaActiveInfo.winner &&
                        aaActiveBalance[aaActiveInfo.winner + "_asset"] > 0 && (
                          <a
                            type="primary"
                            href={`byteball${
                              config.testnet ? "-tn" : ""
                            }:${aaActive}?amount=${
                              aaActiveBalance[aaActiveInfo.winner + "_asset"]
                            }&amp;&asset=${encodeURIComponent(
                              aaActiveInfo[aaActiveInfo.winner + "_asset"]
                            )}`}
                            className="ant-btn ant-btn-lg"
                          >
                            Exchange for bytes
                          </a>
                        )}
                    </Row>
                  </div>
                )}
              </Row>
            </Form>
          </Col>
        </Row>
      )}
      {visibleAddAaModal.visible && (
        <ModalAddAA
          value={visibleAddAaModal.value}
          onCancel={() => setVisibleAddAaModal(false)}
        />
      )}
      <Modal
        visible={visibleWinnerModal}
        footer={null}
        title="Choose a winner"
        onCancel={() => setVisibleWinnerModal(false)}
      >
        <div style={{ display: "flex", justifyContent: "space-around" }}>
          <a
            href={`byteball${
              config.testnet ? "-tn" : ""
            }:${aaActive}?amount=10000&base64data=${dataWinnerYesBase64}`}
            className="ant-btn ant-btn-primary ant-btn-lg"
          >
            yes_asset
          </a>

          <a
            href={`byteball${
              config.testnet ? "-tn" : ""
            }:${aaActive}?amount=10000&base64data=${dataWinnerNoBase64}`}
            className="ant-btn ant-btn-primary ant-btn-lg"
          >
            no_asset
          </a>
        </div>
      </Modal>
    </Layout>
  );
};
