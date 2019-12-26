import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateInfoActiveAA } from '../../store/actions/aa';

export const UpdateActiveAA = (props) => {

    const dispatch = useDispatch();
    const aaActive = useSelector(state => state.aa.active);

    useEffect(() => {
        if (aaActive) {
            const update = setInterval(() => dispatch(updateInfoActiveAA(aaActive)), 10000)
            return () => {
                clearInterval(update)
            }
        }
    }, [aaActive, dispatch])

    return <div>{props.children}</div>
}