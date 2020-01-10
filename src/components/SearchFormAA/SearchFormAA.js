import { Col, DatePicker, Form, Input, Row, Select, Button } from "antd";
import styles from "../../pages/Deploy/Deploy.module.css";
import moment from "moment";
import React, { useState } from "react";

const { Option } = Select;
export const SearchFormAA = props => {
  const [oracle, setOracle] = useState("");
  const [feedName, setFeedName] = useState("");
  const [comparison, setComparison] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [feedValue, setFeedValue] = useState("");
  const handleChangeOracle = ev => {
    const oracle = ev.target.value;
    setOracle(oracle);
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
      let time = date.utc(true).format("YYYY-DD-MM");
      // .milliseconds(0);
      // .toISOString();
      setExpiryDate(time);
    } else {
      setExpiryDate("");
    }
  };
  return (
    <Form
      onKeyDown={e =>
        e.keyCode === 13 &&
        props.handleChangeSearchFormAA({
          feed_name: feedName,
          feed_value: feedValue,
          expiry_date: expiryDate,
          comparison,
          oracle: oracle
        })
      }
    >
      <Row>
        <Form.Item>
          <Input
            placeholder="Oracle"
            value={oracle}
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
                =
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
              format="YYYY-DD-MM"
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
        <Form.Item>
          <Button
            onClick={() => {
              props.handleChangeSearchFormAA({
                feed_name: feedName,
                feed_value: feedValue,
                expiry_date: expiryDate,
                comparison,
                oracle: oracle
              });
            }}
          >
            Search
          </Button>
        </Form.Item>
      </Row>
    </Form>
  );
};
