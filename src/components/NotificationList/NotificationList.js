import React from "react";
import { Typography, Skeleton, BackTop, Timeline, Icon } from "antd";
import { useSelector } from "react-redux";
import moment from "moment";
import { groupBy } from "lodash";

import config from "../../config";
import styles from "./NotificationList.module.css";

const { Title } = Typography;

const reducer = (accumulator, currentValue) => {
  if (currentValue.time > accumulator) {
    return currentValue.time;
  } else {
    return accumulator;
  }
};

const NotificationList = ({ isFull = true }) => {
  let addressSortByLastTime = [];
  const notifications = useSelector(state => state.aa.notifications);
  const notificationsGroup = groupBy(notifications, "AA");

  if (notifications.length === 0 && isFull) {
    return (
      <div>
        <Title level={2}>Events list AA</Title>
        <Skeleton row={10} paragraph={{ rows: 10, width: 0 }} active={true} />
      </div>
    );
  }

  for (const aa in notificationsGroup) {
    const maxTime = notificationsGroup[aa].reduce(
      reducer,
      notificationsGroup[aa][0].time
    );
    addressSortByLastTime.push({ aa, time: maxTime });
  }

  addressSortByLastTime = addressSortByLastTime
    .sort((a, b) => b.time - a.time)
    .map(x => x.aa);

  return (
    <div>
      <Title level={2}>Events list AA</Title>
      {notifications.length === 0 && <div>Events not found</div>}
      {addressSortByLastTime.map(objectKey => {
        const notifications = isFull
          ? notificationsGroup[objectKey].slice(0, 10)
          : notificationsGroup[objectKey];
        const isSlice = notificationsGroup[objectKey].length > 10;
        const timeline = notifications.map((n, i) => {
          const typeError = n.tag === "error" ? n.title.split(" ")[0] : null;
          let errorTitle = null;
          if (typeError) {
            if (typeError === "formula") {
              errorTitle = "Formula Error";
            } else if (typeError === "neither") {
              errorTitle = "Neither case is true in messages";
            }
          }
          return (
            <Timeline.Item
              key={"list-" + objectKey + "-" + i}
              color={n.tag === "error" ? "red" : "green"}
            >
              <a
                target="_blank"
                rel="noopener noreferrer"
                href={`http://${config.testnet &&
                  "testnet"}explorer.obyte.org#${n.trigger_unit}`}
                className={styles.timelineLink}
              >
                <span>
                  {moment.unix(n.time).format("YYYY-MM-DD HH:mm:ss")} -{" "}
                  {n.tag !== "error" ? n.title : errorTitle}
                </span>
              </a>
            </Timeline.Item>
          );
        });
        return (
          <Timeline key={"timeline-" + objectKey}>
            {isFull && <div className={styles.timelineTitle}>{objectKey}</div>}
            {timeline}
            {isSlice && isFull && (
              <Timeline.Item dot={<Icon type="small-dash" />} color="black" />
            )}
          </Timeline>
        );
      })}
      <BackTop />
    </div>
  );
};

export default NotificationList;
