/**
 * 积分规则服务
 */

import q from 'q';

import httpHelper from '@/base/axios/http_helper';
import {GetPointRuleListUrl, GetPointRuleDetailUrl, AddPointRuleUrl, UpdatePointRuleUrl, DeletePointRuleUrl} from './point_rule.url';

/**
 * 获取积分规则列表
 * @param {*} cardSpecId 卡种ID
 */
const GetPointRuleList = (cardSpecId) => {
    const deferred = q.defer();
    httpHelper.get(GetPointRuleListUrl, {cardSpecId}).then(res => {
        if (res != null && res.length > 0) {
            const result = res.map(rule => ({
                id: rule.id, 
                name: rule.name,
                amount: rule.amount,
                score: rule.score,
                skus: rule.skuResponses != null ? rule.skuResponses.filter(s => s.skuName != null).map(s => s.skuName).join('/') : '',
                skuids: rule.skuResponses != null ? rule.skuResponses.filter(s => s.skuName != null).map(s => s.skuId) : [],
            }))
            deferred.resolve(result);
        } else {
            deferred.resolve(res);
        }
    }).catch(err => {
        deferred.reject(err);
    })
    return deferred.promise;
}

/**
 * 获取积分规则详情
 * @param {*} scoreRuleId 
 */
const GetPointRuleDetail = (scoreRuleId) => {
    const deferred = q.defer();
    httpHelper.get(GetPointRuleDetailUrl, {scoreRuleId}).then(res => {
        deferred.resolve(res);
    }).catch(err => {
        deferred.reject(err);
    })
    return deferred.promise;
}

/**
 * 新增积分规则
 */
const AddPointRule = (data) => {
    const deferred = q.defer();
    httpHelper.post(AddPointRuleUrl, data).then(res => {
        deferred.resolve(res);
    }).catch(err => {
        deferred.reject(err);
    })
    return deferred.promise;
}

/**
 * 修改积分规则
 */
const UpdatePointRule = (data) => {
    const deferred = q.defer();
    httpHelper.post(UpdatePointRuleUrl, data).then(res => {
        deferred.resolve(res);
    }).catch(err => {
        deferred.reject(err);
    })
    return deferred.promise;
}

/**
 * 删除积分规则
 */
const DeletePointRule = (cardSpecId, scoreRuleId) => {
    const deferred = q.defer();
    httpHelper.post(DeletePointRuleUrl, {cardSpecId, scoreRuleId}).then(res => {
        deferred.resolve(res);
    }).catch(err => {
        deferred.reject(err);
    })
    return deferred.promise;
}

export default {
    GetPointRuleList,
    GetPointRuleDetail,
    AddPointRule,
    UpdatePointRule,
    DeletePointRule
}