import React, { useState } from 'react';
import { Row, Col, Form, Input, Select, DatePicker, Button, InputNumber } from 'antd';
import obyte from 'obyte';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { Layout } from '../../components/Layout/Layout'

import styles from '../Deploy/Deploy.module.css';

const { Option } = Select;

export default () => {

    const [oracle, setOracle] = useState({
        value: '',
        status: '',
        help: '',
        btnActive: false
    });

    const [feedName, setFeedName] = useState('FeedName')
    const [comparison, setComparison] = useState('>');
    const [timestamp, setTimestamp] = useState('4234235345345')
    const [feedValue, setFeedValue] = useState('gfdgdfg')

    const isNumeric = (value) => {
        return /^-{0,1}\d+$/.test(value);
    }
    const handleChangeOracle = (ev) => {
        const oracle = ev.target.value;
        if (!obyte.utils.isValidAddress(oracle)) {
            setOracle({ value: oracle, status: 'error', help: 'Address is not valid', isValid: false })
        } else {
            setOracle({ value: oracle, status: 'success', help: '', isValid: true })
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

    const handleChangeTimestamp = (date) => {

        let time = date.utc(true).format('x')
        setTimestamp(time)
    }
    const print = function (o) {
        var str = '';

        for (var p in o) {
            if (typeof o[p] == 'string') {
                str += p + ': ' + o[p] + '; </br>';
            } else {
                str += p + ': { </br>' + print(o[p]) + '}';
            }
        }

        return str;
    }
    const AA = {
        messages: {
            cases: [
                {
                    if: `{
                        $define_yes = trigger.data.define_yes AND !var['yes_asset'];
                        $define_no = trigger.data.define_no AND !var['no_asset'];
                        if ($define_yes AND $define_no)
                            bounce("Can't define both assets at the same time!");
                        $define_yes OR $define_no
                    }`,
                    messages: [
                        {
                            app: 'asset',
                            payload: {
                                // without cap
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
                            state: `{
                                $asset = $define_yes ? 'yes_asset' : 'no_asset';
                                var[$asset] = response_unit;
                                response[$asset] = response_unit;
                            }`
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
                    if: `{exists(trigger.data.winner) AND (trigger.data.winner == 'yes' OR trigger.data.winner == 'no') AND !var['winner']}`,
                    messages: [{
                        app: 'state',
                        state: `{
                            if (trigger.data.winner == 'yes' AND data_feed[[oracles='${oracle.value}', feed_name='${feedName}']] ${comparison} ${isNumeric(feedValue) ? feedValue : "'" + feedValue + "'"})
                                var['winner'] = 'yes';
                            else if (trigger.data.winner == 'no' AND timestamp > ${timestamp})
                                var['winner'] = 'no';
                            else
                                bounce('suggested outcome not confirmed');
                            response['winner'] = trigger.data.winner;
                        }`
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
        console.log(`
        oracle: ${ oracle}
        feedName: ${ feedName}
        feedValue: ${ feedValue}
        timestamp: ${ timestamp}
        comparison: ${ comparison}
                    `)

        // copy(output)
    }
    const TEST = {
        bounce_fees: { base: 10000 },
        messages: [
            {
                app: 'payment',
                payload: {
                    asset: 'base',
                    outputs: [
                        { address: "{trigger.address}", amount: "{trigger.output[[asset=base]] - 1000}" }
                    ]
                }
            }
        ]
    }
    const AAurl = encodeURIComponent(JSON.stringify(AA))
    // const TESTurl = encodeURIComponent(JSON.stringify(TEST))
    const TESTurl = encodeURIComponent(JSON.stringify(TEST))
    console.log('new', AAurl)
    return (<Layout title="Deploy" page="deploy" >
        <Row>
            <Col xs={{ span: 24 }} lg={{ span: 14 }} >
                <Form>
                    <Row>
                        <Form.Item help={oracle.help} validateStatus={oracle.status}>
                            <Input
                                placeholder="Oracle"
                                value={oracle.value}
                                onChange={handleChangeOracle}
                                size="large"
                            />
                        </Form.Item>
                    </Row>
                    <Row>
                        <Col span={8}>
                            <Form.Item>
                                <Input
                                    placeholder="Feed name"
                                    value={feedName}
                                    onChange={handleChangeFeedName}
                                    size="large"
                                    maxLength={64} />
                            </Form.Item>
                        </Col>
                        <Col span={4} offset={2}>
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
                                    <Option key="less-6" value="=">=</Option>
                                    <Option key="equals-7" value="!=">!=</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={8} offset={2}>
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
                        <Form.Item>
                            <DatePicker
                                showTime
                                format="YYYY-MM-DD HH:mm:ss"
                                onChange={() => true}
                                placeholder="Expiration date"
                                size="large"
                                onChange={handleChangeTimestamp}
                            />
                        </Form.Item>
                    </Row>
                    <Row>
                        <Form.Item>
                            <Button type="primary" onClick={handleClick}>
                                Deploy
                            </Button>
                            {/* {print(AA)} */}
                            <a href={`byteball-tn:data?app=definition`} target="_blank">
                                open Send screen with AA definition
</a>
                        </Form.Item>
                    </Row>
                </Form>
            </Col>
        </Row>
        <Row>
            &#123;
        messages: &#123;
            cases: [
                &#123;
                    if: &#096;&#123;
                        $define_yes = trigger.data.define_yes AND !var[&#039;yes_asset&#039;];
                        $define_no = trigger.data.define_no AND !var[&#039;no_asset&#039;];
                        if ($define_yes AND $define_no)
                            bounce(&#034;Can&#039;t define both assets at the same time!&#034;);
                        $define_yes OR $define_no
                    &#125;&#096;,
                    messages: [
                        &#123;
                            app: &#039;asset&#039;,
                            payload: &#123;
                                // without cap
                                is_private: false,
                                is_transferrable: true,
                                auto_destroy: false,
                                fixed_denominations: false,
                                issued_by_definer_only: true,
                                cosigned_by_definer: false,
                                spender_attested: false,
                            &#125;
                        &#125;,
                        &#123;
                            app: &#039;state&#039;,
                            state: &#096;&#123;
                                $asset = $define_yes ? &#039;yes_asset&#039; : &#039;no_asset&#039;;
                                var[$asset] = response_unit;
                                response[$asset] = response_unit;
                            &#125;&#096;
                        &#125;
                    ]
                &#125;,
                &#123;
                    if: &#034;&#123;trigger.output[[asset=base]] >= 1e5 AND var[&#039;yes_asset&#039;] AND var[&#039;no_asset&#039;]&#125;&#034;,
                    messages: [
                        &#123;
                            app: &#039;payment&#039;,
                            payload: &#123;
                                asset: &#034;&#123;var[&#039;yes_asset&#039;]&#125;&#034;,
                                outputs: [
                                    &#123; address: &#034;&#123;trigger.address&#125;&#034;, amount: &#034;&#123; trigger.output[[asset=base]] &#125;&#034; &#125;
                                ]
                            &#125;
                        &#125;,
                        &#123;
                            app: &#039;payment&#039;,
                            payload: &#123;
                                asset: &#034;&#123;var[&#039;no_asset&#039;]&#125;&#034;,
                                outputs: [
                                    &#123; address: &#034;&#123;trigger.address&#125;&#034;, amount: &#034;&#123; trigger.output[[asset=base]] &#125;&#034; &#125;
                                ]
                            &#125;
                        &#125;,
                    ]
                &#125;,
                &#123;
                    if: &#096;&#123;exists(trigger.data.winner) AND (trigger.data.winner == &#039;yes&#039; OR trigger.data.winner == &#039;no&#039;) AND !var[&#039;winner&#039;]&#125;&#096;,
                    messages: [&#123;
                        app: &#039;state&#039;,
                        state: &#096;&#123;
                            if (trigger.data.winner == &#039;yes&#039; AND data_feed[[oracles=&#039;{oracle.value}&#039;, feed_name=&#039;$&#123;feedName&#125;&#039;]] $&#123;comparison&#125; $&#123;isNumeric(feedValue) ? feedValue : &#034;&#039;&#034; + feedValue + &#034;&#039;&#034;&#125;)
var[&#039;winner&#039;] = &#039;yes&#039;;
else if (trigger.data.winner == &#039;no&#039; AND timestamp > $&#123;timestamp&#125;)
var[&#039;winner&#039;] = &#039;no&#039;;
else
bounce(&#039;suggested outcome not confirmed&#039;);
response[&#039;winner&#039;] = trigger.data.winner;
&#125;&#096;
&#125;]
&#125;,
&#123;
if: &#034;&#123;trigger.output[[asset!=base]] > 1000 AND var[&#039;winner&#039;] AND trigger.output[[asset!=base]].asset == var[var[&#039;winner&#039;] || &#039;_asset&#039;]&#125;&#034;,
messages: [&#123;
app: &#039;payment&#039;,
payload: &#123;
asset: &#034;base&#034;,
outputs: [
&#123; address: &#034;&#123;trigger.address&#125;&#034;, amount: &#034;&#123; trigger.output[[asset!=base]] &#125;&#034; &#125;
]
&#125;
&#125;]
&#125;,
]
&#125;
&#125;
        </Row>
    </Layout>
    )
}