import React, { useEffect, useState } from "react";
import { Col, Row, Timeline, Select, Empty, Alert } from "antd";
import { Layout } from "../../components/Layout/Layout";
import styles from "../../components/SelectAA/SelectAA.module.css";
import { useDispatch, useSelector } from "react-redux";
import { viewedNotification } from "../../store/actions/aa";
const { Option } = Select;
export default () => {
  const dispatch = useDispatch();
  const aaList = useSelector(state => state.aa.list);
  const aaListCount = aaList.length;
  const notifications = useSelector(state => state.aa.notifications);
  const [selectedAa, setSelectedAA] = useState("all");

  useEffect(() => {
    dispatch(viewedNotification());
  }, [dispatch]);

  const notificationsList =
    selectedAa === "all"
      ? notifications
      : notifications.filter(n => n.AA === selectedAa);

  return (
    <Layout title="Notifications" page="notifications">
      <Row>
        <Col xs={{ span: 24 }} md={{ span: 18 }} xl={{ span: 14 }}>
          {aaListCount === 0 ? (
            <Row style={{ marginBottom: 20 }}>
              <Alert
                message="Please add autonomous agent to the system for  track events"
                type="warning"
              />
            </Row>
          ) : (
            <Row>
              <Select
                className={styles.select}
                placeholder="Select a AA"
                onChange={setSelectedAA}
                value={selectedAa}
                size="large"
                autoFocus={true}
              >
                <Option key={"AA0"} value="all">
                  All AA
                </Option>
                {aaList.map((aa, i) => (
                  <Option key={"AAList" + i} value={aa}>
                    {aa}
                  </Option>
                ))}
              </Select>
            </Row>
          )}
          <Row style={{ marginTop: 50 }}>
            {notificationsList.length !== 0 ? (
              <Timeline>
                {notificationsList.map((n, i) => (
                  <Timeline.Item key={"Timeline - " + i}>
                    {selectedAa === "all" && <b>{n.AA}: </b>}
                    {n.title}
                  </Timeline.Item>
                ))}
              </Timeline>
            ) : (
              <div>
                {aaListCount !== 0 && (
                  <Empty
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    description="There are no notifications for this AA"
                  />
                )}
              </div>
            )}
          </Row>
        </Col>
      </Row>
    </Layout>
  );
};
