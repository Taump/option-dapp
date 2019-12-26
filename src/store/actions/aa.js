import {
    ADD_AA,
    CHANGE_ACTIVE_AA,
    GET_BALANCE_ACTIVE_AA,
    UPDATE_INFO_ACTIVE_AA,
    CLEAR_BALANCE_ACTIVE_AA,
    ADD_AA_ERR
} from '../types/aa';

import client from '../../socket';


export const addAA = (value) => async dispatch => {
    const def = await client.api.getDefinition(value);
    console.log('def', def)
    if (def && def[0] && def[0] === "autonomous agent") {
        await dispatch({
            type: ADD_AA,
            payload: value
        })
        await dispatch(changeActiveAA(value))
    } else {
        dispatch({
            type: ADD_AA_ERR
        })
    }
}

export const changeActiveAA = (address) => async dispatch => {
    try {

        const aaState = await client.api.getAaStateVars({ address })

        dispatch({
            type: CHANGE_ACTIVE_AA,
            payload: { address, aaVars: aaState }
        })
    } catch (e) {
        console.log('error', e)
    }

}

export const updateInfoActiveAA = (address) => async dispatch => {
    try {
        const aaState = await client.api.getAaStateVars({ address })
        dispatch({
            type: UPDATE_INFO_ACTIVE_AA,
            payload: { address, aaVars: aaState }
        })
    } catch (e) {
        console.log('error', e)
    }

}

export const getBalanceActiveAA = (address) => async dispatch => {
    try {
        const balance = await client.api.getBalances([address])
        dispatch({
            type: GET_BALANCE_ACTIVE_AA,
            payload: { balance: balance[address], address },
        })
    } catch (e) {
        console.log('error', e)
    }
}

export const clearBalanceActiveAA = () => ({
    type: CLEAR_BALANCE_ACTIVE_AA,
})