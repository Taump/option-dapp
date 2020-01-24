import React, { useEffect } from "react";
import { Row, Col, notification, Result, Icon, Button } from "antd";

import obyte from "obyte";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import { useLocation, useHistory } from "react-router-dom";

import { Layout } from "../../components/Layout/Layout";
import { DeployAaForm } from "../../forms";
import { clearBalanceActiveAA } from "../../store/actions/aa";
import { CancelPendingDeployRequest } from "../../store/actions/deploy";
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
  const pending = useSelector(state => state.deploy.pending);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(clearBalanceActiveAA());
  }, [dispatch]);

  useEffect(() => {
    if (location && location.search) {
      history.push("/deploy");
    }
  });

  // useEffect(() => {
  //   if (wasIssued && deployAaPrams) {
  //     history.push("/issuing_assets");
  //   }
  // }, [wasIssued, history, deployAaPrams]);

  return (
    <Layout title="Deploy" page="deploy">
      <Row>
        <Col span={24}>
          {!pending ? (
            <DeployAaForm params={params} />
          ) : (
            <Result
              icon={<Icon type="loading" />}
              title="We are waiting for your deployment request"
              subTitle="After that, you will be redirected to the asset issue page"
              extra={
                <Button
                  type="danger"
                  onClick={() => dispatch(CancelPendingDeployRequest())}
                >
                  Cancel
                </Button>
              }
            />
          )}
        </Col>
      </Row>
    </Layout>
  );
};
