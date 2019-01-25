/**
 * 加油卡接口服务
 */
import q from 'q';
import {message} from 'antd';

import httpHelper from '@/base/axios/http_helper';

// 查询卡种-商户卡种开关设置
import {listCardUrl, switchCardUrl, GetCardConfigUrl, SetCardConfigUrl} from './oil_card.url';

// 加油卡品种
const ListCard = function () {
    const deferred = q.defer();
    httpHelper.get(listCardUrl).then(res => {
        if (res != null && res.length > 0) {
            const cards = res.map(card => ({
                id: card.id,
                enable: card.enable, // 卡种开关 0：关 1：开
                name: card.name,
                skus: card.proSkuResponses.map(s=>s.skuName).join('、')
            }))
            deferred.resolve(cards);
        } else {
            message.warning('暂无卡种信息');
            deferred.reject('暂无卡种信息');
        }
    }).catch(err => {
        deferred.reject(err);
    });
    return deferred.promise;
};

// 加油卡开关
const SwitchCard = function (data) {
    const params = Object.assign({}, {...data});
    const deferred = q.defer();
    httpHelper.post(switchCardUrl, params).then(res => {
       deferred.resolve(res);
    }).catch(err => {
        deferred.reject(err);
    });
    return deferred.promise;
};

/**
 * 查询卡种配置 0：关 1：开
 * @param {*} id 
 */
const GetCardConfig = function (id) {
    const deferred = q.defer();
    const url = `${GetCardConfigUrl}/${id}`;
    httpHelper.get(url).then(res => {
       deferred.resolve(res);
    }).catch(err => {
        deferred.reject(err);
    });
    return deferred.promise;
};

/**
 * 设置卡种配置
 * @param {*} data 
 */
const SetCardConfig = function (data) {
    const deferred = q.defer();
    httpHelper.post(SetCardConfigUrl, data).then(res => {
       deferred.resolve(res);
    }).catch(err => {
        deferred.reject(err);
    });
    return deferred.promise;
};

export default {
    ListCard,
    SwitchCard,
    GetCardConfig,
    SetCardConfig
}




