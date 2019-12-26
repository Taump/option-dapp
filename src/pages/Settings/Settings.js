import React, { useState } from 'react';
import { Row, Col, Button, Form, Alert, Steps, Result, Icon } from 'antd';
import { useSelector } from 'react-redux';
import base64url from "base64url";
import { Link } from 'react-router-dom'
import { Layout } from '../../components/Layout/Layout';
import { SelectAA } from '../../components/SelectAA/SelectAA';
import { ModalAddAA } from '../../components/ModalAddAA/ModalAddAA';

import styles from '../Settings/Settings.module.css'
import config from './../../config';

const { Step } = Steps;

const getCurrentStep = (info) => {
    if (info) {
        if (info.yes_asset) {
            if (info.no_asset) {
                return 2
            } else {
                return 1
            }
        } else {
            return 0
        }
    } else {
        return 0
    }
}

export default () => {
    const [visibleAddAaModal, setVisibleAddAaModal] = useState(false);
    const aaActive = useSelector(state => state.aa.active);
    const aaActiveInfo = useSelector(state => state.aa.activeInfo);
    const current = getCurrentStep(aaActiveInfo);
    const currentBlock = [];
    const data = current === 0 ? { define_yes: 1 } : { define_no: 1 };
    const dataString = JSON.stringify(data);
    const dataBase64 = base64url(dataString);

    currentBlock[0] = <Result
        icon={<Icon type="loading" />}
        title="Issue yes_asset"
        subTitle="Once the asset is stable, you will go to the next step"
        extra={
            <a
                href={`byteball${config.testnet ? '-tn' : ''}:${aaActive}?amount=10000&base64data=${dataBase64}`}
                className="ant-btn ant-btn-primary ant-btn-lg"
            >Issue</a>
        } />

    currentBlock[1] = <Result
        icon={<Icon type="loading" />}
        title="Issue no_asset"
        subTitle="Once the asset is stable, you will go to the next step"
        extra={
            <a
                href={`byteball${config.testnet ? '-tn' : ''}:${aaActive}?amount=10000&base64data=${dataBase64}`}
                className="ant-btn ant-btn-primary ant-btn-lg"
            >Issue</a>
        } />

    currentBlock[2] = <Result
        status="success"
        title="Autonomous agent successfully configured"
        extra={
            <Link to="/" className="ant-btn ant-btn-primary ant-btn-lg">Go dashboard</Link>
        }
    />
    return (
        <Layout title="Settings" page="settings">
            <Row>
                <Col xs={{ span: 24 }} md={{ span: 18 }} xl={{ span: 14 }} >

                    {!aaActive && <Row className={styles.alertWrap}>
                        <Alert message="Please add autonomous agent to the system for issue assets" type="warning" />
                    </Row>}


                    <Row className={styles.SelectAaRow}>
                        <Form>
                            <Col xs={{ span: 24 }} md={{ span: 12 }}>
                                <Form.Item>
                                    <SelectAA />
                                </Form.Item>
                            </Col>
                            <Col xs={{ span: 24, push: 0 }} md={{ span: 12, push: 1 }} >
                                <Form.Item>
                                    <Button
                                        type="primary"
                                        icon="plus"
                                        size="large"
                                        onClick={() => setVisibleAddAaModal(true)}>Add</Button>
                                </Form.Item>
                            </Col>
                        </Form>
                    </Row>
                </Col>
            </Row>
            {aaActive && <div>
                <Steps current={current}>
                    <Step title="yes_asset" description="" />
                    <Step title="no_asset" description="" />
                    <Step title="Finish" description="" />
                </Steps>
                <Row>
                    {currentBlock[current]}
                </Row>
            </div>}
            <ModalAddAA
                visible={visibleAddAaModal}
                onCancel={() => setVisibleAddAaModal(false)} />
        </Layout >
    )
}