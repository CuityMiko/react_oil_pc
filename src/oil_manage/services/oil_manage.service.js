/**
 * 油品管理服务
 */
import q from 'q';

import httpHelper from '@/base/axios/http_helper';
import {GetCategorysUrl, GetOilSkusUrl, DelOilSkuUrl, merchantOilListUrl, OperateSkuUrl} from './oil_manage.url';

/**
 * 获取品类
 */
const GetCategorys = () => {
    const deferred = q.defer();
    httpHelper.get(`${GetCategorysUrl}/${sessionStorage.getItem('oilCategoryId')}`).then(res => {
        deferred.resolve(res);
    }).catch(err => {
        deferred.reject(err);
    })
    return deferred.promise;
}

/**
 * 获取油品Sku
 */
const GetOilSkus = async (data) => {
    const deferred = q.defer();
    data = {...data, proCategoryId: sessionStorage.getItem('oilCategoryId')};
    httpHelper.get(GetOilSkusUrl, data).then(res => {
        deferred.resolve(res);
    }).catch(err => {
        deferred.reject(err);
    })
    return deferred.promise;
}

/**
 * 获取油品列表
 */
const GetOilList = async (cardSpecId) => {
    const deferred = q.defer();
    let oilskus = await GetOilSkus();
    let oillist = [];
    // 汽油
    let qoild = oilskus.filter(o => o.proName == '汽油');
    oillist.push({
        name: '汽油',
        skus: qoild
    })
    // 柴油
    let coild = oilskus.filter(o => o.proName == '柴油');
    oillist.push({
        name: '柴油',
        skus: coild
    })
    // 柴油
    deferred.resolve(oillist);
    return deferred.promise;
}

/**
 * 获取油品列表
 */
const GetOilList2 = async (cardSpecId) => {
    const deferred = q.defer();
    let categorys = await GetCategorys();
    if (categorys != null && categorys.length > 0) {
        let oillist = [];
        categorys = categorys.sort((x, y) => x.id - y.id);
        categorys.map(async cat => {
            let _parmas = {};
            if (cardSpecId != undefined) {
                _parmas = {..._parmas, ...{cardSpecId}}
            } else {
                _parmas = {cardSpecId: cat.id};
            }
            const oilskus = await GetOilSkus(_parmas);
            if (oilskus != null && oilskus.length > 0) {
                let _oilobj = {
                    name: cat.name,
                    skus: []
                }
                oilskus.map(oilsku => {
                    _oilobj.skus.push(oilsku)
                })
                oillist.push(_oilobj);
            }
            deferred.resolve(oillist);
        })
    } else {
        deferred.reject(null);
    }
    return deferred.promise;
}

/**
 * 删除油品SKU
 * @param {*} id
 */
const DelOilSku = (id) => {
    const deferred = q.defer();
    let url = `${DelOilSkuUrl}/${id}`;
    httpHelper.post(url).then(res => {
        deferred.resolve(res);
    }).catch(err => {
        deferred.reject(err);
    })
    return deferred.promise;
}

// 商户下的适用油品list
const merchantOilList = function (proCategoryId) {
    const deferred = q.defer();
    httpHelper.get(merchantOilListUrl+'/'+proCategoryId).then(res => {
        // 油品数据外层数组下的每个对象加一个id标识，方便于油品树形展示
        if(res!=null && res.length>0){
            res.map((item, index) => {
                item.id = index+'-' + index;
            })
        }
        deferred.resolve(res);
    }).catch(err => {
        deferred.reject(err);
    });
    return deferred.promise;
};

/**
 * 操作SKU
 */
const OperateSku = (data) => {
    const deferred = q.defer();
    httpHelper.post(OperateSkuUrl, data).then(res => {
        deferred.resolve(res);
    }).catch(err => {
        deferred.reject(err);
    })
    return deferred.promise;
}

export default {
    GetCategorys,
    GetOilSkus,
    DelOilSku,
    merchantOilList,
    OperateSku,
    GetOilList
}
