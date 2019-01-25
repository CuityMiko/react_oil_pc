/**
 * action工厂模块
 */

import * as type from './action-types';

const requestData = category => ({
    type: type.REQUEST_DATA,
    category
});

/**
 * 请求loading
 * @param {*} operate 
 */
export const requestLoading = operate => ({
    type: type.REQUEST_lOADING,
    data: operate
});

export const receiveData = (data, category) => ({
    type: type.RECEIVE_DATA,
    data,
    category
});