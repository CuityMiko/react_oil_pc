/**
 * 每升立减接口服务
 */
import q from 'q';
import httpHelper from '@/base/axios/http_helper';
import {payMarGetUrl, payMarSaveModifyUrl, payMarEndActivityUrl} from './after_payment.url';


/**
 * 查询支付后营销活动
 * @param {*} data
 */
const payMarGet = function () {
    const deferred = q.defer();
    httpHelper.get(payMarGetUrl).then((res) => {
        deferred.resolve(res)
    }).catch((err) => {
        deferred.reject(err);
    });
    return deferred.promise;
};

/**
 * 新增修改支付后营销活动
 * @param {*} data
 */
const payMarSaveModify = function (params) {
    const deferred = q.defer();
    httpHelper.post(payMarSaveModifyUrl, params).then((res) => {
        deferred.resolve(res)
    }).catch((err) => {
        deferred.reject(err);
    });
    return deferred.promise;
};

/**
 * 提前结束支付后营销活动
 * @param {*} data
 */
const payMarEndActivity = function (params) {
    const deferred = q.defer();
    httpHelper.post(payMarEndActivityUrl + '/' + params).then((res) => {
        deferred.resolve(res)
    }).catch((err) => {
        deferred.reject(err);
    });
    return deferred.promise;
};

export default {
    payMarGet,
    payMarSaveModify,
    payMarEndActivity
}