/**
 * 交接班接口服务
 */
import q from 'q';
import httpHelper from '@/base/axios/http_helper';
import handoverWorkUrls from './handover_work.url';

// 查询加油员列表
const findWorkUserList = function (params) {
    const deferred = q.defer();
    httpHelper.get(handoverWorkUrls.findWorkUserListUrl, params)
        .then((res) => {
            deferred.resolve(res)
        })
        .catch((err) => {
            deferred.reject(err)
        });
    return deferred.promise;
};

// 修改工作状态
const modifyWorkStatus = function (params) {
    const deferred = q.defer();
    httpHelper.post(handoverWorkUrls.modifyWorkStatusUrl, params)
        .then((res) => {
            deferred.resolve(res)
        })
        .catch((err) => {
            deferred.reject(err)
        });
    return deferred.promise;
};

// 自动续班设置
const modifyAutoWorkStatus = function (params) {
    const deferred = q.defer();
    httpHelper.post(handoverWorkUrls.modifyAutoWorkStatusUrl + params)
        .then((res) => {
            deferred.resolve(res)
        })
        .catch((err) => {
            deferred.reject(err)
        });
    return deferred.promise;
};

// 获取加油员姓名和id
const findWorkUser = function (params) {
    const deferred = q.defer();
    httpHelper.get(handoverWorkUrls.findWorkUserUrl, params)
        .then((res) => {
            deferred.resolve(res)
        })
        .catch((err) => {
            deferred.reject(err)
        });
    return deferred.promise;
};

// 查询加油员交班记录列表
const findWorkRecordList = function (params) {
    const deferred = q.defer();
    httpHelper.get(handoverWorkUrls.findWorkRecordListUrl, params)
        .then((res) => {
            deferred.resolve(res)
        })
        .catch((err) => {
            deferred.reject(err)
        });
    return deferred.promise;
};

// 下载交班小票
const getWorkRecord = function (params) {
    const deferred = q.defer();
    httpHelper.get(handoverWorkUrls.getWorkRecordUrl + params)
        .then((res) => {
            deferred.resolve(res)
        })
        .catch((err) => {
            deferred.reject(err)
        });
    return deferred.promise;
};

export default {
    findWorkUserList,
    modifyWorkStatus,
    modifyAutoWorkStatus,
    findWorkUser,
    findWorkRecordList,
    getWorkRecord
}