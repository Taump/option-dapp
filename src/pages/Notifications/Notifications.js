import React, { useEffect } from "react";
import { Col, Row, Timeline, Empty, Form, Typography, Popover } from "antd";
import { Layout } from "../../components/Layout/Layout";
import { useDispatch, useSelector } from "react-redux";
import { viewedNotification } from "../../store/actions/aa";
import { SelectAA } from "../../components/SelectAA/SelectAA";
const { Text } = Typography;
export default () => {
  const dispatch = useDispatch();
  const aaListByBase = useSelector(state => state.aa.listByBase);
  const aaListByBaseCount = aaListByBase.length;
  const notifications = useSelector(state => state.aa.notifications);
  const aaActive = useSelector(state => state.aa.active);
  useEffect(() => {
    dispatch(viewedNotification());
  }, [dispatch]);

  const notificationsList = notifications;

  return (
    <Layout title="Notifications" page="notifications">
      <Row>
        <Col xs={{ span: 24 }} md={{ span: 12 }}>
          <Form.Item>
            <SelectAA autoFocus={aaListByBaseCount !== 0} />
          </Form.Item>
        </Col>
      </Row>
      <Row>
        <Col xs={{ span: 24 }} md={{ span: 18 }} xl={{ span: 14 }}>
          <Row style={{ marginTop: 50 }}>
            {notificationsList.length !== 0 ? (
              <Timeline>
                {notificationsList.map((n, i) => (
                  <Timeline.Item key={"Timeline - " + i}>
                    {n.tag !== "error" ? (
                      n.title
                    ) : (
                      <Popover
                        content={<div style={{ maxWidth: 500 }}>{n.title}</div>}
                      >
                        <Text type="danger" alt={"test"}>
                          {n.title.substring(100, -10)}
                          {n.title.length > 100 && `...`}
                        </Text>
                      </Popover>
                    )}
                  </Timeline.Item>
                ))}
              </Timeline>
            ) : (
              <div>
                {aaListByBaseCount !== 0 && !!aaActive && (
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
