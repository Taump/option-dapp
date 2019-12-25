
import {
    ADD_AA,
    ADD_AA_ERR,
    CHANGE_ACTIVE_AA,
    GET_BALANCE_ACTIVE_AA,
    UPDATE_INFO_ACTIVE_AA,
    CLEAR_BALANCE_ACTIVE_AA
} from '../types/aa';

const initialState = {
    list: [],
    active: null,
    activeInfo: null,
    activeBalance: {
        loading: false
    },
    error: null
}

export const aaReducer = (state = initialState, action) => {
    switch (action.type) {
        case ADD_AA: {
            return {
                ...state,
                list: [action.payload, ...state.list]
            }
        }
        case ADD_AA_ERR: {
            return {
                ...state,
                error: true
            }
        }
        case CHANGE_ACTIVE_AA: {
            return {
                ...state,
                active: action.payload.address,
                activeInfo: action.payload.aaVars,
                activeBalance: {
                    loading: false
                }
            }
        }
        case UPDATE_INFO_ACTIVE_AA: {
            return {
                ...state,
                activeInfo: action.payload.aaVars
            }
        }
        case GET_BALANCE_ACTIVE_AA: {
            const { balance } = action.payload;
            return {
                ...state,
                activeBalance: {
                    loading: true,
                    yes_asset: state.activeInfo.yes_asset && balance[state.activeInfo.yes_asset] ? balance[state.activeInfo.yes_asset].stable : 0,
                    no_asset: state.activeInfo.no_asset && balance[state.activeInfo.no_asset] ? balance[state.activeInfo.no_asset].stable : 0
                }
            }
        }
        case CLEAR_BALANCE_ACTIVE_AA: {
            return {
                ...state,
                activeBalance: {
                    loading: false
                }
            }
        }
        default:
            return state;
    }
}

