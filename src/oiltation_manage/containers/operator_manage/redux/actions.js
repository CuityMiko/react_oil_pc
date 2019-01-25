/**
 * 员工管理Redux的Action
 */
import {
    GET_USERINFO,
    UPDATE_USERINFO,
    RESET_USERINFO
} from './action-types';

import OperatorService from '@/oiltation_manage/services/operator_manage/operator_manage.service';

// 获取用户信息的同步Action
const getUserInfo = (userinfo) => ({type: GET_USERINFO, data: userinfo})

// 更新用户信息同步Action 
const updateUserinfo = (userinfo) => ({type: UPDATE_USERINFO, data: userinfo})

// 重置用户信息同步Action 
export const ResetUserinfoAction = () => ({type: RESET_USERINFO})

/**
 * 获取用户信息异步Action
 * @param {*} userid 
 */
export const GetUserInfoAction = (userid) => {
    return async dispatch => {
        const userinfo = await OperatorService.staffGetInfo(userid);
        dispatch(getUserInfo(userinfo));
    }
}

/**
 * 更新用户信息异步操作
 * @param {*} userid 
 */
export const UpdateUserinfoAction = (userid) => {
    return async dispatch => {
        const userinfo = await OperatorService.staffGetInfo(userid);
        dispatch(updateUserinfo(userinfo));
    }
}