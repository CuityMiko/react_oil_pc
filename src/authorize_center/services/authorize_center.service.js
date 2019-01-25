/**
 * 授权中心服务
 */
import q from 'q';

import httpHelper from '@/base/axios/http_helper';
import {AuthorizeUrl} from './authorize_center.url';

/**
 * 授权
 */
const Authorize = function () {
    const deferred = q.defer();
    httpHelper.get(AuthorizeUrl).then(res => {
        deferred.resolve(res);
    }).catch(err => {
        deferred.reject(err);
    })
    return deferred.promise;
}

export default {
    Authorize
}