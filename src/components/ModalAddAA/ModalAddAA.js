import React, { useState, useEffect } from 'react';
import { Input, Modal, Form } from 'antd';
import { useDispatch } from 'react-redux';
import { Redirect } from 'react-router-dom';
import obyte from 'obyte';

import { addAA } from '../../store/actions/aa';

import styles from '../ModalAddAA/ModalAddAA.module.css';


export const ModalAddAA = ({ visible, onCancel, value }) => {
    const dispatch = useDispatch();
    const [statusAdress, setStatusAdress] = useState({
        value: value || '',
        status: '',
        help: '',
        btnActive: false
    });
    const [redirect, setRedirect] = useState(false)
    useEffect(() => {
        if (value) {
            if (!obyte.utils.isValidAddress(value)) {
                setStatusAdress({ value, status: 'error', help: 'Address is not valid', btnActive: false })
            } else {
                setStatusAdress({ value, status: 'success', help: '', btnActive: true })
            }
        }
    }, [])
    const handleChangeAdress = (ev) => {
        const address = ev.target.value;
        if (!obyte.utils.isValidAddress(address)) {
            setStatusAdress({ value: address, status: 'error', help: 'Address is not valid', btnActive: false })
        } else {
            setStatusAdress({ value: address, status: 'success', help: '', btnActive: true })
        }
    }
    return (
        <Modal
            title="Add AA in dashboard"
            visible={visible}
            onOk={() => {
                if (statusAdress.btnActive) {
                    dispatch(addAA(statusAdress.value))
                    onCancel();
                    setStatusAdress({ value: '', status: '', help: '', btnActive: false })
                    setRedirect(true)
                }
            }}
            onCancel={() => {
                onCancel();
                setStatusAdress({ value: '', status: '', help: '', btnActive: false })
            }}
        >
            <Form>
                <Form.Item hasFeedback validateStatus={statusAdress.status} help={statusAdress.help}>
                    <Input
                        placeholder="Your adress"
                        onChange={handleChangeAdress}
                        value={statusAdress.value}
                        className={styles.input}
                        min={100000}
                        size="large"
                    />
                </Form.Item>
            </Form>
            {redirect && <Redirect to="/" />}
        </Modal>
    )
}