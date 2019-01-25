/**
 * 公共业务服务
 */
import q from 'q';

import httpHelper from '@/base/axios/http_helper';
import SiteConf from  '@/base/config';
import {GetIndustryIdUrl} from './business.url';

/**
 * 获取商户分类接口(如:石油/积分商品分类)
 */
const GetIndustryId = () => {
    const deferred = q.defer();
    httpHelper.get(GetIndustryIdUrl).then(res => {
        if (res != null && res.length > 0) {
            let result = res.map(c=>({id: c.id, name: c.categoryName}))
            sessionStorage.setItem('category', JSON.stringify(result));
            let oilIndustry = result.find(c=>c.name == SiteConf.oilIndustryName);
            sessionStorage.setItem('oilCategoryId', oilIndustry.id || '')
            let productIndustry = result.find(c=>c.name == SiteConf.productIndustryName);
            sessionStorage.setItem('productCategoryId', productIndustry.id || '')
            deferred.resolve(result);
        } else {
            deferred.resolve(res);
        }
    }).catch(err => {
        deferred.reject(err);
    })
    return deferred.promise;
}

export default {
    GetIndustryId
}