/**
 * 充值规则服务
 */

import q from 'q';

import httpHelper from '@/base/axios/http_helper';
import {GetRechargeRuleListUrl, ToStartOrStopRechargeRuleUrl, DeleteRechargeRuleUrl, ToTopRechargeRuleUrl, AddRechargeRuleUrl, ModifyRechargeRuleUrl, GetRechargeRuleUrl} from './store_rule.url';

/**
 * 获取充值规则列表
 * @param {*} data 
 */
const GetRechargeRuleList = (data) => {
    const deferred = q.defer();
    httpHelper.get(GetRechargeRuleListUrl, data, {isLoading: false}).then(res => {
       deferred.resolve(res);
    }).catch(err => {
        deferred.reject(err);
    });
    return deferred.promise;
}

/**
 * 停用/启用充值规则
 * @param {*} data 
 */
const ToStartOrStopRechargeRule = (data) => {
    const deferred = q.defer();
    httpHelper.post(ToStartOrStopRechargeRuleUrl, data).then(res => {
       deferred.resolve(res);
    }).catch(err => {
        deferred.reject(err);
    });
    return deferred.promise;
}

/**
 * 删除充值规则
 * @param {*} data 
 */
const DeleteRechargeRule = (data) => {
    const deferred = q.defer();
    httpHelper.post(DeleteRechargeRuleUrl, data).then(res => {
       deferred.resolve(res);
    }).catch(err => {
        deferred.reject(err);
    });
    return deferred.promise;
}

/**
 * 设置推荐
 * @param {*} data 
 */
const ToTopRechargeRule = (data) => {
    const deferred = q.defer();
    httpHelper.post(ToTopRechargeRuleUrl, data).then(res => {
       deferred.resolve(res);
    }).catch(err => {
        deferred.reject(err);
    });
    return deferred.promise;
}

/**
 * 新增充值规则
 * @param {*} data 
 */
const AddRechargeRule = (data) => {
    const deferred = q.defer();
    httpHelper.post(AddRechargeRuleUrl, data).then(res => {
       deferred.resolve(res);
    }).catch(err => {
        deferred.reject(err);
    });
    return deferred.promise;
}

/**
 * 修改充值规则
 * @param {*} data 
 */
const ModifyRechargeRule = (data) => {
    const deferred = q.defer();
    httpHelper.post(ModifyRechargeRuleUrl, data).then(res => {
       deferred.resolve(res);
    }).catch(err => {
        deferred.reject(err);
    });
    return deferred.promise;
}

/**
 * 获取充值规则
 * @param {*} data 
 */
const GetRechargeRule = (data) => {
    const deferred = q.defer();
    httpHelper.get(GetRechargeRuleUrl, data).then(res => {
        if (res != null) {
            let result = {
                storeaccount: res.amount,
                cardSpecId: res.cardSpecId,
                status: res.enable > 0,
                storediscountval: res.giftType == 2 ? res.giftContent + ',' + (res.giftContentName || '') : res.giftContent, // 2: 卡券
                storediscount: res.giftType,
                couponName: res.giftType == 2 ? res.giftContentName || '' : '',
                couponId: res.giftType == 2 ? res.giftContent || 0 : 0,
                rulename: res.name,
                id: res.id
            }
            deferred.resolve(result);
        } else {
            deferred.resolve(res);
        }
    }).catch(err => {
        deferred.reject(err);
    });
    return deferred.promise;
}

export default {
    GetRechargeRuleList,
    ToStartOrStopRechargeRule,
    DeleteRechargeRule,
    ToTopRechargeRule,
    AddRechargeRule,
    ModifyRechargeRule,
    GetRechargeRule
}