import React from "react";
import { Row, Col, Form, Steps, Result, Icon } from "antd";
import { useSelector } from "react-redux";
import base64url from "base64url";
import { Link } from "react-router-dom";
import { Layout } from "../../components/Layout/Layout";
import { SelectAA } from "../../components/SelectAA/SelectAA";

import styles from "./IssuingAssetsPage.module.css";
import config from "./../../config";

const { Step } = Steps;

export default () => {
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
  const currentBlock = [];
  const data = current === 0 ? { define_yes: 1 } : { define_no: 1 };
  const dataString = JSON.stringify(data);
  const dataBase64 = base64url(dataString);

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
      status="success"
      title="Both assets issued and the market is operational"
      extra={
        <Link to="/" className="ant-btn ant-btn-primary ant-btn-lg">
          Go to home page
        </Link>
      }
    />
  );
  return (
    <Layout title="Issuing Assets" page="issuing_assets">
      <Row className={styles.SelectAaRow}>
        <Form>
          <Col xs={{ span: 24 }} md={{ span: 12 }}>
            <Form.Item>
              <SelectAA autoFocus={true} />
            </Form.Item>
          </Col>
        </Form>
      </Row>

      {aaActive && (
        <div>
          <Steps current={current}>
            <Step title="Yes asset" description="" />
            <Step title="No asset" description="" />
            <Step title="Finish" description="" />
          </Steps>
          <Row>{currentBlock[current]}</Row>
        </div>
      )}
    </Layout>
  );
};
