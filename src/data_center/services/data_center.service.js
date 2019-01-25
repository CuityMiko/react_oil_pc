/**
 * 订单列表接口服务
 */
import q from 'q';
import httpHelper from '@/base/axios/http_helper';
import dataCerterUrls from './data_center.url';
import qs from "query-string";

// 查询消费订单列表
const querySimpleOrder = function (params) {
    const deferred = q.defer();
    httpHelper.get(dataCerterUrls.querySimpleOrderUrl, params)
        .then((res) => {
            deferred.resolve(res)
        })
        .catch((err) => {
            deferred.reject(err)
        });
    return deferred.promise;
};

// 查询充值订单列表
const queryRechargeOrder = function (params) {
    const deferred = q.defer();
    httpHelper.get(dataCerterUrls.queryRechargeOrderUrl, params)
        .then((res) => {
            deferred.resolve(res)
        })
        .catch((err) => {
            deferred.reject(err)
        });
    return deferred.promise;
};

// 导出消费订单列表
const exportSimpleOrder = function (params) {
    window.open(dataCerterUrls.exportSimpleOrderUrl +'?'+ qs.stringify(params));
};

// 导出充值订单列表
const exportRechargeOrder = function (params) {
    window.open(dataCerterUrls.exportRechargeOrderUrl +'?'+ qs.stringify(params));
};

// 查询消费订单详情
const getSimpleOrderDetail = function (params) {
    const deferred = q.defer();
    httpHelper.get(dataCerterUrls.getSimpleOrderDetailUrl + params)
        .then((res) => {
            deferred.resolve(res)
        })
        .catch((err) => {
            deferred.reject(err)
        });
    return deferred.promise;
};

// 消费订单退款
const refund = function (params) {
    const deferred = q.defer();
    httpHelper.post(dataCerterUrls.refundUrl, params)
        .then((res) => {
            deferred.resolve(res)
        })
        .catch((err) => {
            deferred.reject(err)
        });
    return deferred.promise;
};

// 首页用到的订单数量统计
const getOrderTotal = function (params) {
    const deferred = q.defer();
    httpHelper.get(dataCerterUrls.getOrderTotalUrl, params)
        .then((res) => {
            deferred.resolve(res)
        })
        .catch((err) => {
            deferred.reject(err)
        });
    return deferred.promise;
};

/**
 * 首页-获取会员消费统计
 * @param {*} params 
 */
const getMemberConsumeData = function () {
    const deferred = q.defer();
    httpHelper.get(dataCerterUrls.getMemberConsumeDataUrl)
        .then((res) => {
            deferred.resolve(res)
        })
        .catch((err) => {
            deferred.reject(err)
        });
    return deferred.promise;
};

export default {
    querySimpleOrder,
    queryRechargeOrder,
    exportSimpleOrder,
    exportRechargeOrder,
    getSimpleOrderDetail,
    refund,
    getOrderTotal,
    getMemberConsumeData
}