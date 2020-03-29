import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  changeActiveAA,
  updateInfoActiveAA,
  watchRequestAas,
  clearSubscribesAA,
  subscribeActualAA,
  getAasByBase,
  subscribeBaseAA,
  openNetwork,
  closeNetwork
} from "../../store/actions/aa";
import client from "../../socket";
import { Result } from "antd";

export const WatcherUpdate = props => {
  const dispatch = useDispatch();
  const aaActive = useSelector(state => state.aa.active);
  const network = useSelector(state => state.aa.network);
  // useEffect(() => {
  //   dispatch(subscribeBaseAA());
  // }, [dispatch]);

  // useEffect(() => {
  //   const watch = async () => {
  //     if (aaActive === null) {
  //       await dispatch(getAasByBase());
  //       await dispatch(subscribeActualAA());
  //     }
  //   };
  //   watch();
  // }, [dispatch, aaActive]);

  // useEffect(() => {
  //   if (aaActive) {
  //     const update = setInterval(
  //       () => dispatch(updateInfoActiveAA(aaActive)),
  //       10000
  //     );
  //     return () => {
  //       clearInterval(update);
  //     };
  //   }
  // }, [aaActive, dispatch]);

  // useEffect(() => {
  //   dispatch(watchRequestAas());
  // }, [dispatch]);

  // useEffect(() => {
  //   client.client.ws.addEventListener("close", () => {
  //     dispatch(clearSubscribesAA());
  //   });
  //   client.client.ws.addEventListener("open", () => {
  //     if (aaActive) {
  //       dispatch(changeActiveAA(aaActive));
  //     }
  //   });
  // }, [dispatch, aaActive]);

  useEffect(() => {
    client.onConnect(async () => {
      dispatch(openNetwork());
      dispatch(subscribeBaseAA());

      const update = setInterval(() => dispatch(updateInfoActiveAA()), 10000);

      const heartbeat = setInterval(function() {
        client.api.heartbeat();
      }, 10 * 1000);

      client.client.ws.addEventListener("close", () => {
        dispatch(closeNetwork());
        dispatch(clearSubscribesAA());
        clearInterval(update);
        clearInterval(heartbeat);
      });

      if (aaActive) {
        dispatch(changeActiveAA(aaActive));
      }

      dispatch(watchRequestAas());
      if (aaActive === null) {
        await dispatch(getAasByBase());
        await dispatch(subscribeActualAA());
      }
    });
  });
  if (network) {
    return <div>{props.children}</div>;
  } else if (!network) {
    return (
      <Result
        status="500"
        title="Connection is broken"
        subTitle="Wait until the connection is restored or reload the page"
      />
    );
  }
};
