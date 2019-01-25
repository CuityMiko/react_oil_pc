import q from 'q';
import httpHelper from '@/base/axios/http_helper';
import moment from 'moment';

import {noticeOperateUrl,noticeDetailUrl} from './banner_center.url';

//新增-编辑-提前结束
const noticeOperate = function (data) {
    const params = Object.assign({}, data);
    const deferred = q.defer();
    httpHelper.post(noticeOperateUrl, params).then(res => {
        // if(res!=null){
            deferred.resolve(res);
        // }
    }).catch(err => {
        deferred.reject(err);
    });
    return deferred.promise;
};

// 详情
const noticeDetail = function () {
    const deferred = q.defer();
    httpHelper.get(noticeDetailUrl).then(res => {
        if(res!=null){
            deferred.resolve(res);
        }
    }).catch(err => {
        deferred.reject(err);
    });
    return deferred.promise;
};

export default {noticeOperate,noticeDetail}