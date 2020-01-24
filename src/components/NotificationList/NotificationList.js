import React from "react";
import { Typography, Skeleton, BackTop, Timeline, Icon } from "antd";
import { useSelector, useDispatch } from "react-redux";
import moment from "moment";
import { groupBy } from "lodash";

import utils from "../../utils";
import config from "../../config";
import styles from "./NotificationList.module.css";
import { changeActiveAA } from "../../store/actions/aa";

const { Title } = Typography;
const { createStringDescrForAa } = utils;

const reducer = (accumulator, currentValue) => {
  if (currentValue.time > accumulator) {
    return currentValue.time;
  } else {
    return accumulator;
  }
};

const NotificationList = ({ isFull = true }) => {
  let addressSortByLastTime = [];
  const notifications = useSelector(state =>
    isFull ? state.aa.fullNotifications : state.aa.notifications
  );
  const listByBase = useSelector(state => state.aa.listByBase);
  const dispatch = useDispatch();
  const notificationsGroup = groupBy(notifications, "AA");

  if (notifications.length === 0 && isFull) {
    return (
      <div>
        <Title level={2}>Recent events</Title>
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
      <Title level={2}>Recent events</Title>
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
                href={`https://${config.testnet &&
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
        const currentAaObject = listByBase.find(aa => aa.address === objectKey);
        const currentAaParams = currentAaObject.definition[1].params;
        const titleAa = createStringDescrForAa(
          currentAaObject.address,
          currentAaParams.feed_name,
          currentAaParams.comparison,
          currentAaParams.expiry_date,
          currentAaParams.feed_value
        );

        return (
          <Timeline key={"timeline-" + objectKey}>
            {isFull && (
              <div
                className={styles.timelineTitle}
                onClick={() =>
                  dispatch(changeActiveAA(currentAaObject.address))
                }
              >
                {titleAa}
              </div>
            )}
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
