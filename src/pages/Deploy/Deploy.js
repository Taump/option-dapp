import React, { useState, useEffect } from 'react';
import { Row, Col, Form, Input, Select, DatePicker, Button } from 'antd';
import obyte from 'obyte';
import copy from 'copy-to-clipboard';
import { useDispatch } from 'react-redux';
import moment from 'moment';
import { ModalAddAA } from '../../components/ModalAddAA/ModalAddAA'
import { Layout } from '../../components/Layout/Layout';
import { clearBalanceActiveAA } from '../../store/actions/aa';

import styles from '../Deploy/Deploy.module.css';

const { Option } = Select;


const isNumericValue = (value) => {
    const t = /^-{0,1}\d+$/.test(value);
    if (t) {
        return value
    } else {
        return `'${value}'`
    }
}

export default () => {

    const [oracle, setOracle] = useState({
        value: '',
        status: '',
        help: '',
        valid: false
    });

    const [feedName, setFeedName] = useState('')
    const [comparison, setComparison] = useState('');
    const [expiryDate, setExpiryDate] = useState('')
    const [feedValue, setFeedValue] = useState('')
    const [visibleAddAaModal, setVisibleAddAaModal] = useState(false);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(clearBalanceActiveAA())
    }, [dispatch])

    const handleChangeOracle = (ev) => {
        const oracle = ev.target.value;
        if (!obyte.utils.isValidAddress(oracle)) {
            setOracle({ value: oracle, status: 'error', help: 'Address is not valid', valid: false })
        } else {
            setOracle({ value: oracle, status: 'success', help: '', valid: true })
        }
    }

    const handleChangeFeedName = (ev) => {
        setFeedName(ev.target.value)
    }

    const handleChangeFeedValue = (ev) => {
        setFeedValue(ev.target.value)
    }

    const handleChangeComparison = (value) => {
        setComparison(value)
    }

    const handleChangeExpiryDate = (date) => {
        let time = date.utc(true).toISOString();
        setExpiryDate(time)
    }
    const AA = {
        init: "{$oracle_address = '" + oracle.value + "'; " +
            "$feed_name = '" + feedName + "'; " +
            "$comparison = '" + comparison + "'; " +
            "$expiry_date = '" + expiryDate + "'; " +
            "$feed_value = " + isNumericValue(feedValue) + "; }",
        messages: {
            cases: [
                {
                    if: "{$define_yes = trigger.data.define_yes AND !var['yes_asset']; " +
                        "$define_no = trigger.data.define_no AND !var['no_asset']; " +
                        "if ($define_yes AND $define_no) bounce('Cant define both assets at the same time!');" +
                        "$define_yes OR $define_no}",
                    messages: [
                        {
                            app: 'asset',
                            payload: {
                                is_private: false,
                                is_transferrable: true,
                                auto_destroy: false,
                                fixed_denominations: false,
                                issued_by_definer_only: true,
                                cosigned_by_definer: false,
                                spender_attested: false,
                            }
                        },
                        {
                            app: 'state',
                            state: "{ $asset = $define_yes ? 'yes_asset' : 'no_asset'; var[$asset] = response_unit; response[$asset] = response_unit; }"
                        }
                    ]
                },
                {
                    if: "{trigger.output[[asset=base]] >= 1e5 AND var['yes_asset'] AND var['no_asset']}",
                    messages: [
                        {
                            app: 'payment',
                            payload: {
                                asset: "{var['yes_asset']}",
                                outputs: [
                                    { address: "{trigger.address}", amount: "{ trigger.output[[asset=base]] }" }
                                ]
                            }
                        },
                        {
                            app: 'payment',
                            payload: {
                                asset: "{var['no_asset']}",
                                outputs: [
                                    { address: "{trigger.address}", amount: "{ trigger.output[[asset=base]] }" }
                                ]
                            }
                        },
                    ]
                },
                {
                    if: "{exists(trigger.data.winner) AND (trigger.data.winner == 'yes' OR trigger.data.winner == 'no') AND !var['winner']}",
                    messages: [{
                        app: 'state',
                        state: "{" +
                            "if ($comparison == '>') " +
                            "$datafeed_value = data_feed[[oracles=$oracle_address, feed_name=$feed_name]] > $feed_value; " +
                            "else if ($comparison == '<') " +
                            "$datafeed_value = data_feed[[oracles=$oracle_address, feed_name=$feed_name]] < $feed_value; " +
                            "else if ($comparison == '!=') " +
                            "$datafeed_value = data_feed[[oracles=$oracle_address, feed_name=$feed_name]] != $feed_value; " +
                            "else if ($comparison == '==') " +
                            "$datafeed_value = data_feed[[oracles=$oracle_address, feed_name=$feed_name]] == $feed_value; " +
                            "else if ($comparison == '>=') " +
                            "$datafeed_value = data_feed[[oracles=$oracle_address, feed_name=$feed_name]] >= $feed_value; " +
                            "else if ($comparison == '<=') " +
                            "$datafeed_value = data_feed[[oracles=$oracle_address, feed_name=$feed_name]] <= $feed_value; " +
                            "else " +
                            "bounce('Comparison operator not found'); " +
                            "if (trigger.data.winner == 'yes' AND  $datafeed_value) " +
                            "var['winner'] = 'yes'; " +
                            "else if (trigger.data.winner == 'no' AND timestamp > parse_date($expiry_date)) " +
                            "var['winner'] = 'no'; " +
                            "else " +
                            "bounce('suggested outcome not confirmed'); " +
                            "response['winner'] = trigger.data.winner; " +
                            "}"
                    }]
                },
                {
                    if: "{trigger.output[[asset!=base]] > 1000 AND var['winner'] AND trigger.output[[asset!=base]].asset == var[var['winner'] || '_asset']}",
                    messages: [{
                        app: 'payment',
                        payload: {
                            asset: "base",
                            outputs: [
                                { address: "{trigger.address}", amount: "{ trigger.output[[asset!=base]] }" }
                            ]
                        }
                    }]
                },
            ]
        }
    }

    const handleClick = () => {
        const code = JSON.stringify(AA, null, '\t')
        copy(code);
    }


    return (<Layout title="Deploy" page="deploy" >
        <Row>
            <Col xs={{ span: 24 }} md={{ span: 18 }} xl={{ span: 14 }} >
                <Form>
                    <Row>
                        <Form.Item hasFeedback validateStatus={oracle.status} help={oracle.help}>
                            <Input
                                placeholder="Oracle"
                                value={oracle.value}
                                onChange={handleChangeOracle}
                                size="large"
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
                                    maxLength={64} />
                            </Form.Item>
                        </Col>
                        <Col xs={{ span: 24 }} md={{ span: 4, offset: 2 }}>
                            <Form.Item>
                                <Select
                                    placeholder="Comparison operator"
                                    className={styles.select}
                                    size="large"
                                    onChange={handleChangeComparison}>
                                    <Option key="more-1" value=">">></Option>
                                    <Option key="less-2" value="<">{'<'}</Option>
                                    <Option key="equals-4" value=">=">>=</Option>
                                    <Option key="more-5" value="<=">{'<='}</Option>
                                    <Option key="less-6" value="==">=</Option>
                                    <Option key="equals-7" value="!=">!=</Option>
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
                                    showTime={
                                        {
                                            defaultValue: moment('00:00:00', 'H:mm')
                                        }
                                    }
                                    format="YYYY-DD-MM HH:mm:ss"
                                    placeholder="Expiration date (UTC)"
                                    size="large"
                                    style={{ width: '100%' }}
                                    onChange={handleChangeExpiryDate}
                                    allowClear={false}
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={{ span: 24 }} sm={{ span: 12 }} md={{ span: 10 }} xxl={{ span: 8 }}>
                            <Form.Item>
                                <Button
                                    type="primary"
                                    onClick={handleClick}
                                    size="large"
                                    disabled={!(oracle.valid && expiryDate && feedName && comparison && feedValue)}
                                >
                                    Copy code to clipboard
                            </Button>
                            </Form.Item>
                        </Col>
                        <Col xs={{ span: 24 }} sm={{ span: 12 }} md={{ span: 10 }} xxl={{ span: 8 }}>
                            <Form.Item>
                                <span onClick={() => setVisibleAddAaModal(true)} >
                                    <a className="ant-btn ant-btn-lg" href={`byteball-tn:data?app=definition`} target="_blank" rel="noopener noreferrer">Open deploy screen</a>
                                </span>
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Col>
            <ModalAddAA
                visible={visibleAddAaModal}
                onCancel={() => setVisibleAddAaModal(false)} />
        </Row>
    </Layout>
    )
}