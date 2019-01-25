/**
 * 油站信息服务接口
 */
import q from 'q';
import httpHelper from '@/base/axios/http_helper';
import oiltationInformationUrls from "../oiltation_information/oiltation_information.url";

/**
 * 查询商户信息
 * @param {*} data
 */
const merchantGetInfo = function () {
    const deferred = q.defer();
    httpHelper.get(oiltationInformationUrls.merchantGetInfoUrl).then((res) => {
        deferred.resolve(res)
    }).catch((err) => {
        deferred.reject(err);
    });
    return deferred.promise;
};

/**
 * 修改商户信息
 * @param {*} data
 */
const merchantModifyInfo = function (params) {
    const deferred = q.defer();
    httpHelper.post(oiltationInformationUrls.merchantModifyInfoUrl, params).then((res) => {
        deferred.resolve(res)
    }).catch((err) => {
        deferred.reject(err);
    });
    return deferred.promise;
};

/**
 * 获取省市列表
 * @param {*} data
 */
const merCommonRegion = function () {
    const deferred = q.defer();
    httpHelper.get(oiltationInformationUrls.merCommonRegionUrl).then((res) => {
        deferred.resolve(res)
    }).catch((err) => {
        deferred.reject(err);
    });
    return deferred.promise;
};

export default {
    merchantGetInfo,
    merchantModifyInfo,
    merCommonRegion
}