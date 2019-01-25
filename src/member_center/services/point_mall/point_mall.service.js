/**
 * 积分商城接口服务
 */
import q from 'q';
import httpHelper from '@/base/axios/http_helper';
import pointMallUrls from "../point_mall/point_mall.url";

/**
 * 查询积分商城活动列表
 * @param {*} data
 */
const queryScoreExchangeList = function (params) {
    const deferred = q.defer();
    httpHelper.get(pointMallUrls.queryScoreExchangeListUrl, params).then((res) => {
        deferred.resolve(res)
    }).catch((err) => {
        deferred.reject(err);
    });
    return deferred.promise;
};

/**
 * 删除积分商城活动
 * @param {*} data
 */
const scoreExchangeDel = function (params) {
    const deferred = q.defer();
    httpHelper.post(pointMallUrls.scoreExchangeDelUrl + '/' + params).then((res) => {
        deferred.resolve(res)
    }).catch((err) => {
        deferred.reject(err);
    });
    return deferred.promise;
};

/**
 * 提前结束积分商城活动
 * @param {*} data
 */
const scoreExchangeEarlyEnd = function (params) {
    const deferred = q.defer();
    httpHelper.post(pointMallUrls.scoreExchangeEarlyEndUrl + '/' + params).then((res) => {
        deferred.resolve(res)
    }).catch((err) => {
        deferred.reject(err);
    });
    return deferred.promise;
};

/**
 * 修改库存
 * @param {*} data
 */
const scoreExchangeModifyInventory = function (params) {
    const deferred = q.defer();
    httpHelper.post(pointMallUrls.scoreExchangeModifyInventoryUrl, params).then((res) => {
        deferred.resolve(res)
    }).catch((err) => {
        deferred.reject(err);
    });
    return deferred.promise;
};

/**
 * 新增积分商城活动
 * @param {*} data
 */
const scoreExchangeSave = function (params) {
    const deferred = q.defer();
    httpHelper.post(pointMallUrls.scoreExchangeSaveUrl, params).then((res) => {
        deferred.resolve(res)
    }).catch((err) => {
        deferred.reject(err);
    });
    return deferred.promise;
};

/**
 * 查询积分商城活动详情
 * @param {*} data
 */
const scoreExchangeGet = function (params) {
    const deferred = q.defer();
    httpHelper.get(pointMallUrls.scoreExchangeGetUrl + '/' + params).then((res) => {
        deferred.resolve(res)
    }).catch((err) => {
        deferred.reject(err);
    });
    return deferred.promise;
};

/**
 * 修改积分商城活动
 * @param {*} data
 */
const scoreExchangeModify = function (params) {
    const deferred = q.defer();
    httpHelper.post(pointMallUrls.scoreExchangeModifyUrl, params).then((res) => {
        deferred.resolve(res)
    }).catch((err) => {
        deferred.reject(err);
    });
    return deferred.promise;
};

/**
 * 查询积分商城活动兑换列表
 * @param {*} data
 */
const queryScoreRecordList = function (params) {
    const deferred = q.defer();
    httpHelper.get(pointMallUrls.queryScoreRecordListUrl, params).then((res) => {
        deferred.resolve(res)
    }).catch((err) => {
        deferred.reject(err);
    });
    return deferred.promise;
};

/**
 * 积分商城活动兑换提货码
 * @param {*} data
 */
const scoreExchangeRecordVerificationCode = function (params) {
    const deferred = q.defer();
    httpHelper.post(pointMallUrls.scoreExchangeRecordVerificationCodeUrl + '/' + params).then((res) => {
        deferred.resolve(res)
    }).catch((err) => {
        deferred.reject(err);
    });
    return deferred.promise;
};


export default {
    queryScoreExchangeList,
    scoreExchangeDel,
    scoreExchangeEarlyEnd,
    scoreExchangeModifyInventory,
    scoreExchangeSave,
    scoreExchangeGet,
    scoreExchangeModify,
    queryScoreRecordList,
    scoreExchangeRecordVerificationCode
}