/**
 * 公共基础服务
 */
import q from 'q';

import httpHelper from '@/base/axios/http_helper';
import {SendCodeUrl, UploadUrl} from './common.url';

/**
 * 发送短信验证码
 * @param {*} data 
 * @param {*} type 发送短信类型 LOGIN: '登录'（默认） RESET_PWD: '重置密码'
 */
const SendCode = function (data, type = 'LOGIN') {
    const params = Object.assign({}, {...data, type});
    const deferred = q.defer();
    httpHelper.get(SendCodeUrl, params).then(res => {
        deferred.resolve(res);
    }).catch(err => {
        deferred.reject(err);
    })
    return deferred.promise;
}

/**
 * 上传文件
 * @param {*} file
 */
const Upload = function (file) {
    const deferred = q.defer();
    let formData = new FormData();
    formData.append("file", file);
    httpHelper.post(UploadUrl, formData).then(res => {
        deferred.resolve(res);
    }).catch(err => {
        deferred.reject(err);
    })
    return deferred.promise;
}

export default {
    SendCode,
    Upload
}