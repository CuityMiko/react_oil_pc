/**
 * 每升立减接口服务
 */
import q from 'q';
import httpHelper from '@/base/axios/http_helper';
import perRiseMinusUrls from "./per_rise_minus_url";

/**
 * 查询每升立减列表
 * @param {*} data
 */
const litreActivityFindList = function (params) {
    const deferred = q.defer();
    httpHelper.get(perRiseMinusUrls.litreActivityFindListUrl, params).then((res) => {
        deferred.resolve(res)
    }).catch((err) => {
        deferred.reject(err);
    });
    return deferred.promise;
};

/**
 * 删除每升立减
 * @param {*} data
 */
const litreActivityDel = function (params) {
    const deferred = q.defer();
    httpHelper.post(perRiseMinusUrls.litreActivityDelUrl + '/' + params).then((res) => {
        deferred.resolve(res)
    }).catch((err) => {
        deferred.reject(err);
    });
    return deferred.promise;
};

/**
 * 提前结束每升立减
 * @param {*} data
 */
const litreActivityEnd = function (params) {
    const deferred = q.defer();
    httpHelper.post(perRiseMinusUrls.litreActivityEndUrl + '/' + params).then((res) => {
        deferred.resolve(res)
    }).catch((err) => {
        deferred.reject(err);
    });
    return deferred.promise;
};

/**
 * 查看每升立减
 * @param {*} data
 */
const litreActivityGet = function (params) {
    const deferred = q.defer();
    httpHelper.get(perRiseMinusUrls.litreActivityGetUrl + '/' + params).then((res) => {
        deferred.resolve(res)
    }).catch((err) => {
        deferred.reject(err);
    });
    return deferred.promise;
};

/**
 * 修改每升立减
 * @param {*} data
 */
const litreActivityModify = function (params) {
    const deferred = q.defer();
    httpHelper.post(perRiseMinusUrls.litreActivityModifyUrl, params).then((res) => {
        deferred.resolve(res)
    }).catch((err) => {
        deferred.reject(err);
    });
    return deferred.promise;
};

/**
 * 新增每升立减
 * @param {*} data
 */
const litreActivitySave = function (params) {
    const deferred = q.defer();
    httpHelper.post(perRiseMinusUrls.litreActivitySaveUrl, params).then((res) => {
        deferred.resolve(res)
    }).catch((err) => {
        deferred.reject(err);
    });
    return deferred.promise;
};

export default {
    litreActivityFindList,
    litreActivityDel,
    litreActivityEnd,
    litreActivityGet,
    litreActivityModify,
    litreActivitySave
}