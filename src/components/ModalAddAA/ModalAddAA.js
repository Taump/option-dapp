import React, { useState, useEffect } from 'react';
import { Input, Modal, Form } from 'antd';
import { useDispatch } from 'react-redux';
import obyte from 'obyte';

import { addAA } from '../../store/actions/aa';

import styles from '../ModalAddAA/ModalAddAA.module.css';


export const ModalAddAA = ({ visible, onCancel, value }) => {
    const dispatch = useDispatch();
    const [adressAA, setAdressAA] = useState({
        value: '',
        status: '',
        help: '',
        valid: false
    });

    useEffect(() => {
        if (value) {
            if (!obyte.utils.isValidAddress(value)) {
                setAdressAA({ value, status: 'error', help: 'Address is not valid', valid: false })
            } else {
                setAdressAA({ value, status: 'success', help: '', valid: true })
            }
        }
    }, [value])

    const handleChangeAdress = (ev) => {
        const address = ev.target.value;
        if (!obyte.utils.isValidAddress(address)) {
            setAdressAA({ value: address, status: 'error', help: 'Address is not valid', valid: false })
        } else {
            setAdressAA({ value: address, status: 'success', help: '', valid: true })
        }
    }

    return (
        <Modal
            title="Add AA in dashboard"
            visible={visible}
            onOk={() => {
                if (adressAA.valid) {
                    dispatch(addAA(adressAA.value))
                    onCancel();
                    setAdressAA({ value: '', status: '', help: '', valid: false })
                }
            }}
            onCancel={() => {
                onCancel();
                setAdressAA({ value: '', status: '', help: '', valid: false })
            }}
        >
            <Form>
                <Form.Item hasFeedback validateStatus={adressAA.status} help={adressAA.help}>
                    <Input
                        placeholder="AA adress"
                        onChange={handleChangeAdress}
                        value={adressAA.value}
                        className={styles.input}
                        min={100000}
                        size="large"
                    />
                </Form.Item>
            </Form>
        </Modal>
    )
}