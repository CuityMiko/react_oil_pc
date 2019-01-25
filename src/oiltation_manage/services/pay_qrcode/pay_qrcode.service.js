/**
 * 支付二维码接口服务
 */
import q from 'q';
import qs from 'query-string';
import moment from 'moment';

import httpHelper from '@/base/axios/http_helper';

import {
    codeListUrl,
    addCodeUrl,
    searchCodeUrl,
    editCodeUrl,
    logoutCodeUrl
} from './pay_qrcode.url';

// 二维码列表
const codeList = function (data) {
    const params = Object.assign({}, {...data});
    const deferred = q.defer();
    let dataSource = [];
    let dataSourceItem = {
        id:'--',
        url:'--',
        nameOne: '--',
        nameTwo: '--',
        desc: '--',
        leftText: '下载',
        centerText: '注销',
        rightText: '修改'
    }
    // dataInfo数据包含列表总数和列表数组
    let dataInfo = {
        dataSource:dataSource,
        total:0
    };
    httpHelper.get(codeListUrl,params).then(res => {
        // 后台没有total，没有分页，用于后期加分页时使用
        if(res.total){
            dataInfo.total = res.total;
        }else{
            dataInfo.total = 0;
        }
        if(res && res.length>0){
            dataInfo.total = res.length;
            res.map((item,index)=>{
                dataSourceItem = {
                    id:item.id?item.id:'--',
                    url:item.url?item.url:'--',
                    nameOne: item.name?item.name:'--',
                    nameTwo: item.staffName?item.staffName:'--',
                    desc: item.description?item.description:'--',
                    leftText: '下载',
                    centerText: '注销',
                    rightText: '修改'
                };
                dataSource.push(dataSourceItem);
            })
        }
        deferred.resolve(dataInfo);
    }).catch(err => {
        dataSource=[];
        deferred.reject({error: err, data: dataInfo});
    });
    return deferred.promise;
};

// 新增二维码
const addCode = function (data) {
    const params = Object.assign({}, data);
    const deferred = q.defer();
    httpHelper.post(addCodeUrl,params).then(res => {
        deferred.resolve(res);
    }).catch(err => {
        deferred.reject(err);
    });
    return deferred.promise;
};

// 查询二维码
const searchCode = function (qrcodeId) {
    const deferred = q.defer();
    httpHelper.get(searchCodeUrl+'/'+qrcodeId).then(res => {
        console.log(res,'res')
        if(res!=null){
            deferred.resolve(res);
        }
    }).catch(err => {
        deferred.reject(err);
    });
    return deferred.promise;
};

// 修改二维码
const editCode = function (data) {
    const params = Object.assign({}, data);
    const deferred = q.defer();
    httpHelper.post(editCodeUrl,params).then(res => {
        deferred.resolve(res);
    }).catch(err => {
        deferred.reject(err);
    });
    return deferred.promise;
};

// 注销二维码
const logoutCode = function (qrcodeId) {
    const deferred = q.defer();
    httpHelper.post(logoutCodeUrl+'/'+qrcodeId).then(res => {
        deferred.resolve(res);
    }).catch(err => {
        deferred.reject(err);
    });
    return deferred.promise;
};


export default {
    codeList,
    addCode,
    searchCode,
    editCode,
    logoutCode
}
