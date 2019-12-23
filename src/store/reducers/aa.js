
import { ADD_AA, CHANGE_ACTIVE_AA, GET_BALANCE_ACTIVE_AA, UPDATE_INFO_ACTIVE_AA } from '../types/aa';

const initialState = {
    list: ['ITVTJPWCKMHW33XM5ZRARVUDJ4WF6ITN', 'HVEJT3FY2NJQMOOKIRPRLM2JZBQBG7HM'],
    active: null,
    activeInfo: null,
    activeBalance: {
        loading: false
    }
}

export const aaReducer = (state = initialState, action) => {
    console.log('action', action)
    switch (action.type) {
        case ADD_AA: {
            return {
                ...state,
                list: [action.payload, ...state.list],
                active: action.payload
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
            const { balance, address } = action.payload;
            return {
                ...state,
                activeBalance: {
                    loading: true,
                    yes_asset: balance[state.activeInfo.yes_asset] ? balance[state.activeInfo.yes_asset].stable : 0,
                    no_asset: balance[state.activeInfo.no_asset] ? balance[state.activeInfo.no_asset].stable : 0
                }
            }
        }
        default:
            return state;
    }
}