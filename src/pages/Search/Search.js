import React, { useState } from "react";
import { Table, Popover, Row } from "antd";
import { useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { truncate } from "lodash";

import { Layout } from "../../components/Layout/Layout";
import { changeActiveAA } from "../../store/actions/aa";
import { useWindowSize } from "../../hooks/useWindowSize";
import { SearchFormAA } from "../../components/SearchFormAA/SearchFormAA";

import styles from "./Search.module.css";

export default () => {
  const aaListByBase = useSelector(state => state.aa.listByBase);
  const listByBaseLoaded = useSelector(state => state.aa.listByBaseLoaded);
  const dispatch = useDispatch();
  let history = useHistory();

  const dataSource = [];
  aaListByBase.forEach(aa => {
    const params = aa.definition[1].params;
    dataSource.push({
      key: aa.address,
      address: aa.address,
      oracle: params.oracle_address,
      feed_name: params.feed_name,
      expiry_date: params.expiry_date,
      feed_value: params.feed_value,
      comparison: params.comparison
    });
  });
  const [width] = useWindowSize();
  const truncateOptions = { length: width < 1280 ? 13 : 20 };
  const handleChangeAA = address => {
    dispatch(changeActiveAA(address));
    history.push("/");
  };
  const columns = [
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
      render: text => {
        if (width >= 1440) {
          return text;
        } else {
          if (text.length > truncateOptions.length) {
            return (
              <Popover content={<div style={{ maxWidth: 600 }}>{text}</div>}>
                <span>{truncate(text, truncateOptions)}</span>
              </Popover>
            );
          } else {
            return text;
          }
        }
      }
    },
    {
      title: "Oracle",
      dataIndex: "oracle",
      key: "oracle",
      render: text => {
        if (width >= 1440) {
          return text;
        } else {
          if (text.length > truncateOptions.length) {
            return (
              <Popover content={<div style={{ maxWidth: 600 }}>{text}</div>}>
                <span>{truncate(text, truncateOptions)}</span>
              </Popover>
            );
          } else {
            return text;
          }
        }
      }
    },
    {
      title: "Feed name",
      dataIndex: "feed_name",
      key: "feed_name",
      width: width >= 1280 ? "auto" : "none",
      render: text => {
        if (width >= 1440) {
          return text;
        } else {
          if (text.length > truncateOptions.length) {
            return (
              <Popover content={<div style={{ maxWidth: 600 }}>{text}</div>}>
                <span>{truncate(text, truncateOptions)}</span>
              </Popover>
            );
          } else {
            return text;
          }
        }
      }
    },
    {
      title: "Comparison",
      dataIndex: "comparison",
      key: "comparison"
    },
    {
      title: "Feed value",
      dataIndex: "feed_value",
      key: "feed_value",
      width: width >= 1440 ? "auto" : "none",
      render: text => {
        if (width >= 1440) {
          return text;
        } else {
          if (text.length > truncateOptions.length) {
            return (
              <Popover content={<div style={{ maxWidth: 600 }}>{text}</div>}>
                <span>{truncate(text, truncateOptions)}</span>
              </Popover>
            );
          } else {
            return text;
          }
        }
      }
    },
    {
      title: "Expiry date",
      dataIndex: "expiry_date",
      key: "expiry_date",
      width: 100
    }
  ];
  const [searchAA, setSearchAA] = useState(null);
  const handleChangeSearchFormAA = data => {
    let newList = dataSource;
    if (data.oracle) {
      newList = newList.filter(
        aa => aa.oracle.indexOf(data.oracle.toUpperCase()) !== -1
      );
    }
    if (data.feed_value) {
      console.log("value is ", data.feed_value);
      newList = newList.filter(
        aa =>
          aa.feed_value.toString().toUpperCase() ===
          data.feed_value.toUpperCase()
      );
    }
    if (data.feed_name) {
      newList = newList.filter(
        aa =>
          aa.feed_name.toUpperCase().indexOf(data.feed_name.toUpperCase()) !==
          -1
      );
    }
    if (data.comparison) {
      newList = newList.filter(aa => aa.comparison === data.comparison);
    }
    if (data.expiry_date) {
      newList = newList.filter(aa => aa.expiry_date === data.expiry_date);
    }

    setSearchAA(newList);
  };

  return (
    <Layout title="Search AA" page="search">
      <Row>
        <SearchFormAA handleChangeSearchFormAA={handleChangeSearchFormAA} />
      </Row>
      {width >= 900 && (
        <Table
          dataSource={searchAA || dataSource}
          columns={columns}
          size="middle"
          loading={!listByBaseLoaded}
          rowClassName={styles.row}
          onRow={record => {
            return {
              onClick: event => {
                handleChangeAA(record.address);
              }
            };
          }}
        />
      )}
      {width < 900 && (
        <Row>
          {(searchAA || dataSource).map((aa, i) => {
            return (
              <div
                key={"aa" + i}
                className={styles.viewRow}
                onClick={() => {
                  handleChangeAA(aa.address);
                }}
              >
                <div>
                  <b>Address:</b> {aa.address}
                </div>
                <div>
                  <b>Oracle:</b> {aa.oracle}
                </div>
                <div>
                  <b>Feed name:</b> {aa.feed_name}
                </div>
                <div>
                  <b>Comparison:</b> {aa.comparison}
                </div>
                <div>
                  <b>Feed value:</b> {aa.feed_value}
                </div>
                <div>
                  <b>Expiry date:</b> {aa.expiry_date}
                </div>
              </div>
            );
          })}
        </Row>
      )}
    </Layout>
  );
};
