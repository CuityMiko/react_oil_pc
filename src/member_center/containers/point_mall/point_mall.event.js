/**
 * 积分商城模块组件通信
 */

import PubSub from 'pubsub-js';

/**
 * 订阅核销结果
 * @param {*} callback
 */
const sub_verificationResult = (callback) => {
    PubSub.subscribe('verificationResult', function(msg, data){ callback(data) });
}

/**
 * 发布核销结果
 * @param {*} data
 */
const pub_verificationResult = (data) => {
    PubSub.publish('verificationResult', data);
}

export default {
    sub_verificationResult,
    pub_verificationResult
}