import React, { useRef, useState } from "react";
import { Col, DatePicker, Form, Input, Row, Select } from "antd";
import { useDispatch } from "react-redux";
import moment from "moment";
import obyte from "obyte";

import { pendingDeployRequest } from "../../store/actions/deploy";

import styles from "../../pages/DeployPage/DeployPage.module.css";
import utils from "../../utils";
import config from "../../config";

const { Option } = Select;
const { toNumericValue } = utils;

export const DeployAaForm = ({ params }) => {
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
  // const [redirect, setRedirect] = useState(false);
  const dispatch = useDispatch();

  const deployLink = useRef(null);
  // useEffect(() => {
  //   if (!pending && redirect) {
  //     history.push("/issuing_assets");
  //   }
  // }, [pending, history, redirect]);
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
  const handleClickDeploy = () => {
    console.log("object", {
      oracle_address: oracle.value,
      comparison,
      feed_name: feedName,
      feed_value: toNumericValue(feedValue, false),
      expiry_date: expiryDate.format("YYYY-MM-DD")
    });
    dispatch(
      pendingDeployRequest({
        oracle_address: oracle.value,
        comparison,
        feed_name: feedName,
        feed_value: toNumericValue(feedValue, false),
        expiry_date: expiryDate.format("YYYY-MM-DD")
      })
    );
  };
  return (
    <Form onKeyDown={handleKeyDownForm}>
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
              onClick={handleClickDeploy}
              disabled={
                !(
                  oracle.valid &&
                  expiryDate &&
                  feedName &&
                  comparison &&
                  feedValue
                )
              }
              href={`byteball${
                config.testnet ? "-tn" : ""
              }:data?app=definition&definition=${encodeURIComponent(AA)}`}
            >
              Open deploy screen
            </a>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};
