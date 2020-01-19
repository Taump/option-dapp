import React from "react";
import { Row, Col, Form, Steps, Result, Icon } from "antd";
import { useSelector } from "react-redux";
import base64url from "base64url";
import { Link } from "react-router-dom";
import { Layout } from "../../components/Layout/Layout";
import { SelectAA } from "../../components/SelectAA/SelectAA";

import styles from "./IssuingAssets.module.css";
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
      title="Issue yes_asset"
      subTitle="Once the asset is stable, you will go to the next step"
      extra={
        <a
          href={`byteball${
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
      title="Issue no_asset"
      subTitle="Once the asset is stable, you will go to the next step"
      extra={
        <a
          href={`byteball${
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
      title="Autonomous agent successfully configured"
      extra={
        <Link to="/" className="ant-btn ant-btn-primary ant-btn-lg">
          Go home page
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
            <Step title="yes_asset" description="" />
            <Step title="no_asset" description="" />
            <Step title="Finish" description="" />
          </Steps>
          <Row>{currentBlock[current]}</Row>
        </div>
      )}
    </Layout>
  );
};
