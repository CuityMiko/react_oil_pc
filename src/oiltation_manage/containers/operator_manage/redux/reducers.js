/**
 * 员工管理的Reduser
 */
import {
    GET_USERINFO,
    UPDATE_USERINFO,
    RESET_USERINFO
} from './action-types'

/**
 * 用户信息状态
 * @param {*} state 
 * @param {*} action 
 */
const UserInfo = function (state = null, action) {
    switch (action.type) {
        case GET_USERINFO: // 获取用户数据
            return action.data;
        case UPDATE_USERINFO: // 更新用户信息
            return {...state, ...action.data};
        case RESET_USERINFO: // 重置用户信息
            return null;
        default:
            return state;
    }
}

export default {
    UserInfo
}