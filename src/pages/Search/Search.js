import React, { useEffect, useState } from "react";
import { Table, Button, Popover, Row } from "antd";

import { useSelector, useDispatch } from "react-redux";
import { Layout } from "../../components/Layout/Layout";
import { changeActiveAA, getAasByBase } from "../../store/actions/aa";
import { useWindowSize } from "../../hooks/useWindowSize";
import { truncate } from "lodash";
import { SearchFormAA } from "../../components/SearchFormAA/SearchFormAA";

export default () => {
  const aaListByBase = useSelector(state => state.aa.listByBase);
  const listByBaseLoaded = useSelector(state => state.aa.listByBaseLoaded);
  const aaActive = useSelector(state => state.aa.active);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAasByBase());
  }, [dispatch]);

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
    },
    {
      title: "Actions",
      key: "actions",
      align: "center",
      render: (text, record) => (
        <span>
          <Button
            type="primary"
            onClick={() => handleChangeAA(record.address)}
            disabled={aaActive === record.address}
          >
            Select
          </Button>
        </span>
      )
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
        />
      )}
      {width < 900 && (
        <Row>
          {(searchAA || dataSource).map((aa, i) => {
            return (
              <div
                key={"aa" + i}
                style={{
                  paddingBottom: 15,
                  paddingTop: 15,
                  paddingLeft: 10,
                  paddingRight: 10,
                  wordBreak: "break-all",
                  background: aaActive === aa.address ? "#f5f5f5" : "none"
                }}
                onClick={() => handleChangeAA(aa.address)}
              >
                {aa.feed_name} {aa.comparison} {aa.feed_value} on{" "}
                {aa.expiry_date} ({aa.address})
              </div>
            );
          })}
        </Row>
      )}
    </Layout>
  );
};
