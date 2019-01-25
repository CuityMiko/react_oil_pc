/**
 * 登录接口服务
 */
import q from 'q';

import httpHelper from '@/base/axios/http_helper';
// 登录url
import {
    LoginUrl,
    LoginOutUrl,
    FindPwdUrl
} from './login.url';

/**
 * 登录
 * @param {*} data 
 * @param {*} loginType 登录方式 MOBILE_PWD: '手机号+密码'（默认） MOBILE_CODE: '手机号+验证码'
 */
const Login = function (data, loginType = 'MOBILE_PWD') {
    const params = Object.assign({}, {...data, loginType});
    const deferred = q.defer();
    httpHelper.postWithRes(LoginUrl, params).then(res => {
        deferred.resolve(res);
    }).catch(err => {
        deferred.reject(err);
    })
    return deferred.promise;
}

/**
 * 登出
 */
const LoginOut = function () {
    const deferred = q.defer();
    httpHelper.post(LoginOutUrl).then(res => {
        deferred.resolve(res);
    }).catch(err => {
        deferred.reject(err);
    })
    return deferred.promise;
}

/**
 * 找回密码
 * @param {*} data 
 */
const FindPwd = function (data) {
    const params = Object.assign({}, data);
    const deferred = q.defer();
    httpHelper.post(FindPwdUrl, params).then(res => {
        deferred.resolve(res);
    }).catch(err => {
        deferred.reject(err);
    })
    return deferred.promise;
}

export default {
    Login,
    LoginOut,
    FindPwd
}