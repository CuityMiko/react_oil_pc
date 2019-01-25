/**
 * 班结管理接口服务
 */
import q from 'q';
import httpHelper from '@/base/axios/http_helper';
import workEndUrls from './work_end.url';
import qs from "query-string";

// 班结记录列表
const findShiftRecordList = function (params) {
    const deferred = q.defer();
    httpHelper.get(workEndUrls.findShiftRecordListUrl, params)
        .then((res) => {
            deferred.resolve(res)
        })
        .catch((err) => {
            deferred.reject(err)
        });
    return deferred.promise;
};

// 单条班结记录下载
const exportShiftRecord = function (params) {
    window.open(workEndUrls.exportShiftRecordUrl + params);
};

// 汇总班结记录下载
const exportShiftCollect = function (params) {
    window.open(workEndUrls.exportShiftCollectUrl +'?'+ qs.stringify(params));
};

// 获取首次开班
const getShiftStartDate = function (params) {
    const deferred = q.defer();
    httpHelper.get(workEndUrls.getShiftStartDateUrl, params)
        .then((res) => {
            deferred.resolve(res)
        })
        .catch((err) => {
            deferred.reject(err)
        });
    return deferred.promise;
};

// 班结
const saveShift = function (params) {
    const deferred = q.defer();
    httpHelper.post(workEndUrls.saveShiftUrl + params)
        .then((res) => {
            deferred.resolve(res)
        })
        .catch((err) => {
            deferred.reject(err)
        });
    return deferred.promise;
};

/**
 * 首页-班结统计
 */
const getHandoverWorkStatistics = function () {
    const deferred = q.defer();
    httpHelper.get(workEndUrls.getHandoverWorkStatisticsUrl)
        .then((res) => {
            deferred.resolve(res)
        })
        .catch((err) => {
            deferred.reject(err)
        });
    return deferred.promise;
};

export default {
    findShiftRecordList,
    exportShiftRecord,
    exportShiftCollect,
    getShiftStartDate,
    saveShift,
    getHandoverWorkStatistics
}