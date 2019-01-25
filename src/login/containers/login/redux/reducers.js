/**
 * 登录Redux的Reducer操作
 */
import {
    RECEIVE_LOGIN_USERINFO, 
    RESET_LOGIN_USERINFO,
    SET_USERLOGININFO,
    GET_ERRORMSG,
    RESET_ERRORMSG
} from './action-types'

/**
 * 用户登录信息
 * @param {*} state 
 * @param {*} action 
 */
const LoginUserInfo = function (state = null, action) {
    switch (action.type) {
        case RECEIVE_LOGIN_USERINFO:
        case SET_USERLOGININFO:
            return action.data;
        case RESET_LOGIN_USERINFO:
            return null;
        default:
            return state;
    }
}

/**
 * 请求结果
 * @param {*} state 
 * @param {*} action 
 */
const RequestResult = function (state = null, action) {
    switch (action.type) {
        case GET_ERRORMSG:
            return action.data;
        case RESET_ERRORMSG:
            return null;
        default:
            return state;
    }
}

export default {
    LoginUserInfo,
    RequestResult
}