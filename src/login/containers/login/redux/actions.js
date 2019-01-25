/**
 * 登录Redux的Actions操作
 */
import {
    RECEIVE_LOGIN_USERINFO,
    RESET_LOGIN_USERINFO,
    SET_USERLOGININFO,
    GET_ERRORMSG,
    RESET_ERRORMSG
} from './action-types'
import LoginService from '@/login/services/login.service';
import {ResetUserinfoAction} from '@/oiltation_manage/containers/operator_manage/redux/actions';
// 接收登录用户信息的同步action
const receiveLoginUserInfo = (userInfo) => ({type: RECEIVE_LOGIN_USERINFO, data: userInfo});

// 重置用户信息（退出登录）
const resetLoginUserInfo = () => ({type: RESET_LOGIN_USERINFO, data: {}})

// 接收错误信息
const getErrorMsg = (error) => ({type: GET_ERRORMSG, data: error})

// 重置错误信息
const resetErrorMsg = () => ({type: RESET_ERRORMSG})

/**
 * 登录Action
 * @param {*} logininfo 
 * @param {*} loginType 
 */
export const LoginAction = (logininfo, loginType = 'MOBILE_PWD') => {
    return async dispatch => {
        // 调用登录接口
        const result = await LoginService.Login(logininfo, loginType);
        if (result.success) {
            // 重置错误信息
            dispatch(resetErrorMsg())
            const loginuserinfo = result.data;
            // 将获取到的登录信息放在本地存储内
            sessionStorage.setItem('login_userinfo', JSON.stringify(loginuserinfo))
            // 同步接收用户登录信息
            dispatch(receiveLoginUserInfo(loginuserinfo))
        } else {
            dispatch(getErrorMsg({success: false, errMsg: result.errMsg}))
        }
    }
}

/**
 * 登出Action
 */
export const LoginOutAction = (flag) => {
    return async dispatch => {
        if (flag == undefined) {
            // 调用登出接口
            const result = await LoginService.LoginOut();
        }
        // 清空本地存储
        sessionStorage.removeItem('login_userinfo');
        // 清空全局类目
        sessionStorage.removeItem('category');
        sessionStorage.removeItem('oilCategoryId');
        sessionStorage.removeItem('productCategoryId');
        // 同步重置用户信息
        dispatch(resetLoginUserInfo())
        dispatch(ResetUserinfoAction())
    }
}

/**
 * 设置用户登录信息
 */
export const SetUserLoginInfoAction = () => ({
    type: SET_USERLOGININFO,
    data: JSON.parse(sessionStorage.getItem('login_userinfo'))
})