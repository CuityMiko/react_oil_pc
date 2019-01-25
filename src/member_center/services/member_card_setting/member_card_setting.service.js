/**
 * 会员卡配置接口服务
 */
import q from 'q';

import httpHelper from '@/base/axios/http_helper';

// 会员设置-保存-修改-详情
import {saveMbrCardUrl,modifyMbrCardUrl,detailMbrCardUrl,linkQrcodeH5Url} from './member_card_setting.url';

// 保存
const saveMbrCard = function (data) {
    const params = Object.assign({}, data);
    const deferred = q.defer();
    httpHelper.post(saveMbrCardUrl, params).then(res => {
        deferred.resolve(res);
    }).catch(err => {
        deferred.reject(err);
    });
    return deferred.promise;
};

// 修改
const modifyMbrCard = function (data) {
    const params = Object.assign({}, data);
    const deferred = q.defer();
    httpHelper.post(modifyMbrCardUrl, params).then(res => {
        deferred.resolve(res);
    }).catch(err => {
        deferred.reject(err);
    });
    return deferred.promise;
};

// 详情
const detailMbrCard = function () {
    const deferred = q.defer();
    httpHelper.get(detailMbrCardUrl).then(res => {
        let dataMbrCard = {
            dataMbrCardBasic:new Map(),
            dataMbrCardGet:new Map(),
            mbrCovers:null,
            cardCoverChoice:null,
            originData:res
        };
        if (res != null) {
            dataMbrCard = {
                dataMbrCardBasic:new Map(),
                dataMbrCardGet:new Map(),
                mbrCovers:res.cardCoverType,
                cardCoverChoice:res.cardCoverChoice,
                originData:res
            };
            dataMbrCard.dataMbrCardBasic.set('油站LOGO',res.gasLogo?res.gasLogo:'--')
                .set('会员卡封面',res.cardCoverType==1?res.cardCoverChoice!=null?
                    res.cardCoverChoice:'--':'http://chuangjiangx-files.oss-cn-hangzhou.aliyuncs.com/image/729DA9BC-A1F5-4907-B646-06AF2E1FCF29.png')
                .set('会员期限','永久有效')
                .set('联系电话',res.contactNumber?res.contactNumber:'--')
                .set('会员特权说明',res.cardPrivilegeExplain?res.cardPrivilegeExplain:'--')
                .set('使用须知',res.cardUseNotice?res.cardUseNotice:'--')

            dataMbrCard.dataMbrCardGet.set('领取方式','免费激活领取')
                .set('领取赠送',res.giftScore && res.giftCouponNumber?(res.giftScore+'积分,'+
                    res.giftCouponName):res.giftScore?res.giftScore+'积分':
                    res.giftCouponName?res.giftCouponName:'--');
        }
        deferred.resolve(dataMbrCard);
    }).catch(err => {
        deferred.reject(err);
    });
    return deferred.promise;
};

// H5链接
const linkQrcodeH5 = function () {
    const deferred = q.defer();
    httpHelper.get(linkQrcodeH5Url).then(res => {
        deferred.resolve(res);
    }).catch(err => {
        deferred.reject(err);
    });
    return deferred.promise;
};

export default {
    saveMbrCard,
    modifyMbrCard,
    detailMbrCard,
    linkQrcodeH5,
}