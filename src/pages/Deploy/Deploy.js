import React, { useState, useEffect, useRef } from "react";
import {
  Row,
  Col,
  Form,
  Input,
  Select,
  DatePicker,
  Alert,
  notification
} from "antd";

import obyte from "obyte";
import { useDispatch } from "react-redux";
import moment from "moment";
import { useLocation, useHistory } from "react-router-dom";

import { Layout } from "../../components/Layout/Layout";
import utils from "../../utils";
import { clearBalanceActiveAA } from "../../store/actions/aa";

import styles from "../Deploy/Deploy.module.css";
import config from "../../config";

const { Option } = Select;
const { toNumericValue } = utils;

export default () => {
  const location = useLocation();
  let history = useHistory();
  let params = {};

  if (location.search) {
    const queryParams = location.search.slice(1).split("&");
    queryParams.forEach(param => {
      const p = param.split("=");
      params[p[0]] = decodeURIComponent(p[1]).slice(0, 64);
    });
    if ("oracle" in params) {
      params.oracle_valid = obyte.utils.isValidAddress(params.oracle);
    }
    if ("expire_date" in params) {
      if (!moment(params.expire_date, "YYYY-MM-DD").isValid()) {
        notification["error"]({
          message: "Date expiry is not valid!"
        });
        params.valid_date = false;
      } else {
        params.valid_date = true;
      }
    }
    if (params.oracle && !params.oracle_valid) {
      notification["error"]({
        message: "Oracle address is not valid!"
      });
    }
  }

  const [oracle, setOracle] = useState({
    value: (params.oracle_valid && params.oracle) || "",
    status: "",
    help: "",
    valid: params.oracle_valid || false
  });

  const [feedName, setFeedName] = useState(params.feed_name || "");
  const [comparison, setComparison] = useState(params.comparison || undefined);
  const [expiryDate, setExpiryDate] = useState(
    (params.valid_date && moment(params.expire_date)) || undefined
  );
  const [feedValue, setFeedValue] = useState(params.feed_value || "");
  const dispatch = useDispatch();
  const deployLink = useRef(null);

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
    if (date && moment(date).isValid()) {
      // let time = date.utc(true);
      // .format("YYYY-MM-DD");
      // .milliseconds(0);
      // .toISOString();
      setExpiryDate(moment(date));
    } else {
      setExpiryDate("");
    }
  };
  const handleKeyDownForm = e => {
    if (e.keyCode === 13) {
      if (oracle.valid && expiryDate && feedName && comparison && feedValue) {
        deployLink.current.click();
      }
    }
  };

  const AA = `{
  base_aa: '${config.base_aa}',
  params: {
    oracle_address: '${oracle.value}',
    comparison: '${comparison}', 
    feed_name: '${feedName}',
    feed_value: ${toNumericValue(feedValue)},
    expiry_date: '${expiryDate &&
      expiryDate.isValid() &&
      expiryDate.format("YYYY-MM-DD")}'
  }
}`;

  useEffect(() => {
    if (location && location.search) {
      history.push("/deploy");
    }
  });

  return (
    <Layout title="Deploy" page="deploy">
      <Row>
        <Col xs={{ span: 24 }} md={{ span: 18 }} xl={{ span: 14 }}>
          <Form onKeyDown={handleKeyDownForm}>
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
                    value={comparison}
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
                    className={styles.datePicker}
                    onChange={handleChangeExpiryDate}
                    allowClear={false}
                    value={(expiryDate && moment(expiryDate)) || undefined}
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
                    ref={deployLink}
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
