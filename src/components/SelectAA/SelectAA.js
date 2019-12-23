import React from 'react';
import { Select } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { changeActiveAA } from '../../store/actions/aa';
const { Option } = Select;

export const SelectAA = ({ }) => {
    const dispatch = useDispatch();
    const aaList = useSelector(state => state.aa.list);
    const aaActive = useSelector(state => state.aa.active);

    const handleSelectAA = (address) => {
        dispatch(changeActiveAA(address))
    }

    return (
        <Select
            style={{ width: '100%' }}
            placeholder="Select a AA"
            optionFilterProp="children"
            onChange={handleSelectAA}
            defaultValue={aaActive || 0}
            size="large"
        >
            <Option key={'AA0'} value={0} disabled>Select a AA</Option>
            {aaList.map(((aa, i) => <Option key={'AA' + i} value={aa}>{aa}</Option>))}
        </Select>
    )
}