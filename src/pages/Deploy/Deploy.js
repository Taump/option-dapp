import React, { useState, useEffect } from "react";
import { Row, Col, Form, Input, Select, DatePicker, Alert } from "antd";
import obyte from "obyte";
import { useDispatch } from "react-redux";
import moment from "moment";

import { Layout } from "../../components/Layout/Layout";
import utils from "../../utils";
import { clearBalanceActiveAA } from "../../store/actions/aa";

import styles from "../Deploy/Deploy.module.css";
import config from "../../config";

const { Option } = Select;
const { toNumericValue } = utils;

export default () => {
  const [oracle, setOracle] = useState({
    value: "",
    status: "",
    help: "",
    valid: false
  });

  const [feedName, setFeedName] = useState("");
  const [comparison, setComparison] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [feedValue, setFeedValue] = useState("");
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(clearBalanceActiveAA());
  }, [dispatch]);

  const handleChangeOracle = ev => {
    const oracle = ev.target.value;
    if (!obyte.utils.isValidAddress(oracle)) {
      setOracle({
        value: oracle,
        status: "error",
        help: "Address is not valid",
        valid: false
      });
    } else {
      setOracle({ value: oracle, status: "success", help: "", valid: true });
    }
  };

  const handleChangeFeedName = ev => {
    setFeedName(ev.target.value);
  };

  const handleChangeFeedValue = ev => {
    setFeedValue(ev.target.value);
  };

  const handleChangeComparison = value => {
    setComparison(value);
  };

  const handleChangeExpiryDate = date => {
    if (date) {
      let time = date.utc(true).format("YYYY-MM-DD");
      // .milliseconds(0);
      // .toISOString();
      setExpiryDate(time);
    } else {
      setExpiryDate("");
    }
  };
  const AA = `{
  base_aa: '${config.base_aa}',
  params: {
    oracle_address: '${oracle.value}',
    comparison: '${comparison}', 
    feed_name: '${feedName}',
    feed_value: ${toNumericValue(feedValue)},
    expiry_date: '${expiryDate}'
  }
}`;
  return (
    <Layout title="Deploy" page="deploy">
      <Row>
        <Col xs={{ span: 24 }} md={{ span: 18 }} xl={{ span: 14 }}>
          <Form>
            <Row className={styles.alertWrap}>
              <Alert
                message="After the deployment, go to the settings for issue assets"
                type="warning"
              />
            </Row>
            <Row>
              <Form.Item
                hasFeedback
                validateStatus={oracle.status}
                help={oracle.help}
              >
                <Input
                  placeholder="Oracle"
                  value={oracle.value}
                  onChange={handleChangeOracle}
                  size="large"
                  autoFocus={true}
                />
              </Form.Item>
            </Row>
            <Row>
              <Col xs={{ span: 24 }} md={{ span: 8 }}>
                <Form.Item>
                  <Input
                    placeholder="Feed name"
                    value={feedName}
                    onChange={handleChangeFeedName}
                    size="large"
                    maxLength={64}
                  />
                </Form.Item>
              </Col>
              <Col xs={{ span: 24 }} md={{ span: 4, offset: 2 }}>
                <Form.Item>
                  <Select
                    placeholder="Comparison operator"
                    className={styles.select}
                    size="large"
                    onChange={handleChangeComparison}
                  >
                    <Option key="more-1" value=">">
                      >
                    </Option>
                    <Option key="less-2" value="<">
                      {"<"}
                    </Option>
                    <Option key="equals-4" value=">=">
                      >=
                    </Option>
                    <Option key="more-5" value="<=">
                      {"<="}
                    </Option>
                    <Option key="less-6" value="==">
                      ==
                    </Option>
                    <Option key="equals-7" value="!=">
                      !=
                    </Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={{ span: 24 }} md={{ span: 8, offset: 2 }}>
                <Form.Item>
                  <Input
                    className={styles.input}
                    size="large"
                    placeholder="Feed value"
                    maxLength={64}
                    value={feedValue}
                    onChange={handleChangeFeedValue}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col xs={{ span: 24 }} sm={{ span: 16 }} md={{ span: 12 }}>
                <Form.Item>
                  <DatePicker
                    showTime={{
                      defaultValue: moment("00:00:00", "H:mm")
                    }}
                    format="YYYY-MM-DD"
                    placeholder="Expiration date (UTC)"
                    size="large"
                    style={{ width: "100%" }}
                    onChange={handleChangeExpiryDate}
                    allowClear={false}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col
                xs={{ span: 24 }}
                sm={{ span: 12 }}
                md={{ span: 10 }}
                xxl={{ span: 8 }}
              >
                <Form.Item>
                  <a
                    className="ant-btn ant-btn-lg"
                    disabled={
                      !(
                        oracle.valid &&
                        expiryDate &&
                        feedName &&
                        comparison &&
                        feedValue
                      )
                    }
                    href={`byteball-tn:data?app=definition&definition=${encodeURIComponent(
                      AA
                    )}`}
                  >
                    Open deploy screen
                  </a>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Col>
      </Row>
    </Layout>
  );
};
