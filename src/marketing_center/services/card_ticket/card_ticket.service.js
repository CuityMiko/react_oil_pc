import q from 'q';

import httpHelper from '@/base/axios/http_helper';
import moment from 'moment';

import {
    couponListUrl,addCouponUrl,copyCouponUrl,editCouponUrl,
    detailCouponUrl,detailCouponIdUrl,operateCouponUrl, expandCouponUrl,effectViewCouponUrl,couponCountUrl,couponCountChartUrl
} from './card_ticket.url';

// 新增卡券
const addCoupon = function (data) {
    const params = Object.assign({}, data);
    const deferred = q.defer();
    httpHelper.post(addCouponUrl, params).then(res => {
        deferred.resolve(res);
    }).catch(err => {
        deferred.reject(err);
    });
    return deferred.promise;
};

// 卡券列表
const couponList = function (data,couponCardBack,funcs) {
    // funcs为各个处理函数-如删除等，couponCardBack为卡券card的背景图片-传参形式
    const params = Object.assign({}, data);
    const deferred = q.defer();
    let dataCouponInfo = {}
    let dataSource = [];
    let dataOperations =[];
    let dataSourceItem = {
        id:'--',
        couponNumber:'--',
        putInChannel:'--',
        couponAmount:'0',
        couponName:'--',
        couponTime:'--',
        labelText:'库存',
        get:'--',
        total:'0',
        status:'--',
        couponCardBack:couponCardBack,
        edit:funcs.edit?funcs.edit:function(){},
        detail:funcs.detail?funcs.detail:function(){},
        dataOperations:dataOperations
    };
    dataCouponInfo = {
        total:0,
        dataSource:dataSource
    };
    httpHelper.get(couponListUrl,params).then(res => {
        dataCouponInfo.total = res.total;
        if(res.items && res.items.length>0){
            res.items.map((item,index)=>{
                // couponStatus-0未开始-1进行中-(-1)已结束 promoteType-1卡券广场-2二维码广场
                // dataOperations-不同广场及状态下的操作项数组
                if(item.promoteType==1){
                    if(item.couponStatus==0){
                        dataOperations = [
                            {
                                text:'复制',
                                handleClick:funcs.copy?funcs.copy:function () {}
                            },
                            {
                                text:'删除',
                                handleClick:funcs.del?funcs.del:function () {}
                            }
                        ]
                    }else if(item.couponStatus==1){
                        dataOperations = [
                            {
                                text:'复制',
                                handleClick:funcs.copy?funcs.copy:function () {}
                            },
                            {
                                text:'提前结束',
                                handleClick:funcs.end?funcs.end:function () {}
                            },
                            {
                                text:'效果查看',
                                handleClick:funcs.effectView?funcs.effectView:function () {}
                            }
                        ]
                    }else if(item.couponStatus==2){
                        dataOperations = [
                            {
                                text:'复制',
                                handleClick:funcs.copy?funcs.copy:function () {}
                            },
                            {
                                text:'删除',
                                handleClick:funcs.del?funcs.del:function () {}
                            },
                            {
                                text:'效果查看',
                                handleClick:funcs.effectView?funcs.effectView:function () {}
                            }
                        ]
                    }
                }else if(item.promoteType==2){
                    if(item.couponStatus==0){
                        dataOperations = [
                            {
                                text:'复制',
                                handleClick:funcs.copy?funcs.copy:function () {}
                            },
                            {
                                text:'删除',
                                handleClick:funcs.del?funcs.del:function () {}
                            },
                            {
                                text:'推广',
                                handleClick:funcs.link?funcs.link:function () {}
                            },
                        ]
                    }else if(item.couponStatus==1){
                        dataOperations = [
                            {
                                text:'复制',
                                handleClick:funcs.copy?funcs.copy:function () {}
                            },
                            {
                                text:'推广',
                                handleClick:funcs.link?funcs.link:function () {}
                            },
                            {
                                text:'提前结束',
                                handleClick:funcs.end?funcs.end:function () {}
                            },
                            {
                                text:'效果查看',
                                handleClick:funcs.effectView?funcs.effectView:function () {}
                            }
                        ]
                    }else if(item.couponStatus==2){
                        dataOperations = [
                            {
                                text:'复制',
                                handleClick:funcs.copy?funcs.copy:function () {}
                            },
                            {
                                text:'删除',
                                handleClick:funcs.del?funcs.del:function () {}
                            },
                            {
                                text:'效果查看',
                                handleClick:funcs.effectView?funcs.effectView:function () {}
                            }
                        ]
                    }
                }
                dataSourceItem = {
                    id:item.id,
                    couponNumber:item.couponNumber,
                    putInChannel:item.promoteType?item.promoteType==1?'卡券广场':'二维码广场':'--',
                    couponAmount:item.amount?item.amount.toFixed(2):'0',
                    couponName:item.name?item.name:'--',
                    couponTime: (item.actTimeStart && item.actTimeEnd)?(moment(item.actTimeStart).format('YYYY.MM.DD')
                        +'-'+moment(item.actTimeEnd).format('YYYY.MM.DD')):'--',
                    labelText:'库存',
                    get:((item.totalInventory!==null && item.totalInventory!==undefined && item.totalInventory!=='') &&
                        (item.availInventory!==null && item.availInventory!==undefined && item.availInventory!==''))?
                        (Number(item.totalInventory)-Number(item.availInventory)):'0',
                    total:item.totalInventory?item.totalInventory==99999?'不限制':item.totalInventory:'0',
                    status:item.couponStatus,
                    couponCardBack:couponCardBack,
                    edit:funcs.edit?funcs.edit:function () {},
                    detail:funcs.detail?funcs.detail:function () {},
                    dataOperations:dataOperations
                };
                dataSource.push(dataSourceItem);
            });
        }
        deferred.resolve(dataCouponInfo);
    }).catch(err => {
        dataSource=[];
        deferred.reject({error: err, data: dataCouponInfo});
    });
    return deferred.promise;
};

// 卡券详情
const detailCoupon = function (couponNumber,couponDetailScene) {
    const deferred = q.defer();
    httpHelper.get(detailCouponUrl+'/'+couponNumber).then(res => {
        let dataCouponDetail = {
            dataMain:new Map(),
            dataRule:new Map(),
            dataExpired:new Map(),
            originData:res
        };
        let suitedOils = '';
        if (res != null) {
            dataCouponDetail = {
                dataMain:new Map(),
                dataRule:new Map(),
                dataExpired:new Map(),
                originData:res
            };
            // 适用油品处理
            res.skus.map((item, index) => {
                // 数据为null的情况不显示
                if(item.skuName!=null){
                    if(index==0){
                        suitedOils = suitedOils +''+ item.skuName
                    }else{
                        suitedOils = suitedOils +', '+ item.skuName
                    }
                }
            });
            if(couponDetailScene && couponDetailScene=='couponCreate'){
                // 判断是卡券主动创建还是其他渠道的赠送卡券（这种方式有些字段不显示）
                dataCouponDetail.dataMain.set('卡券名称',res.name?res.name:'--')
                    .set('卡券面值','￥'+res.amount?res.amount+'元':0.00+'元')
                    .set('卡券logo',res.logo?res.logo:'--')
                    .set('卡券使用期限',res.dateType==1?'领取后'+res.fixedTerm+'天有效':res.dateType==0?
                        moment(Number(res.useTimeBegin)).format('YYYY.MM.DD')+'-'+
                        moment(Number(res.useTimeEnd)).format('YYYY.MM.DD'):'--')
                    // 适用油品返回数组，前面处理后这里显示
                    .set('适用油品',suitedOils?suitedOils:'--')
                    .set('发放总量',res.totalInventory==99999?'不限制':res.totalInventory+'张')
                    .set('卡券投放时间段',res.actTimeStart&&res.actTimeEnd?
                        moment(Number(res.actTimeStart)).format('YYYY.MM.DD')+'-'+
                        moment(Number(res.actTimeEnd)).format('YYYY.MM.DD'):'--')
                    .set('卡券说明',res.remark?res.remark:'--')
                dataCouponDetail.dataRule.set('投放渠道',res.promoteType==1?'卡券广场':res.promoteType==2?'二维码广场':'--')
                    .set('最低消费',res.leastCost==0?'不限制':res.leastCost+'元')
                    .set('使用时段','不限制')
                    .set('每位用户限领',res.getLimit==99999?'不限制':res.getLimit+'张')
            }else {
                dataCouponDetail.dataMain.set('卡券名称',res.name?res.name:'--')
                    .set('卡券面值','￥'+res.amount?res.amount+'元':0.00+'元')
                    .set('卡券logo',res.logo?res.logo:'--')
                    .set('卡券使用期限',res.dateType==1?'领取后'+res.fixedTerm+'天有效':res.dateType==0?
                        moment(Number(res.useTimeBegin)).format('YYYY.MM.DD')+'-'+
                        moment(Number(res.useTimeEnd)).format('YYYY.MM.DD'):'--')
                    .set('适用油品',suitedOils?suitedOils:'--')
                    .set('卡券说明',res.remark?res.remark:'--')
                dataCouponDetail.dataRule.set('最低消费',res.leastCost==0?'不限制':res.leastCost+'元')
                    .set('使用时段','不限制')
            }
            // 过期提醒后台暂时没做，字段不定
            dataCouponDetail.dataExpired.set('过期提醒',res.invalidTip==1?'过期前3天提醒':'不提醒')
        }
        deferred.resolve(dataCouponDetail);
    }).catch(err => {
        deferred.reject(err);
    });
    return deferred.promise;
};

// 卡券详情
const detailCouponId = function (couponNumber,couponDetailScene) {
    const deferred = q.defer();
    httpHelper.get(detailCouponIdUrl+'/'+couponNumber).then(res => {
        let dataCouponDetail = {
            dataMain:new Map(),
            dataRule:new Map(),
            dataExpired:new Map(),
            originData:res
        };
        let suitedOils = '';
        if (res != null) {
            dataCouponDetail = {
                dataMain:new Map(),
                dataRule:new Map(),
                dataExpired:new Map(),
                originData:res
            };
            // 适用油品处理
            res.skus.map((item, index) => {
                // 数据为null的情况不显示
                if(item.skuName!=null){
                    if(index==0){
                        suitedOils = suitedOils +''+ item.skuName
                    }else{
                        suitedOils = suitedOils +', '+ item.skuName
                    }
                }
            });
            if(couponDetailScene && couponDetailScene=='couponCreate'){
                // 判断是卡券主动创建还是其他渠道的赠送卡券（这种方式有些字段不显示）
                dataCouponDetail.dataMain.set('卡券名称',res.name?res.name:'--')
                    .set('卡券面值','￥'+res.amount?res.amount+'元':0.00+'元')
                    .set('卡券logo',res.logo?res.logo:'--')
                    .set('卡券使用期限',res.dateType==1?'领取后'+res.fixedTerm+'天有效':res.dateType==0?
                        moment(Number(res.useTimeBegin)).format('YYYY.MM.DD')+'-'+
                        moment(Number(res.useTimeEnd)).format('YYYY.MM.DD'):'--')
                    // 适用油品返回数组，前面处理后这里显示
                    .set('适用油品',suitedOils?suitedOils:'--')
                    .set('发放总量',res.totalInventory==99999?'不限制':res.totalInventory+'张')
                    .set('卡券投放时间段',res.actTimeStart&&res.actTimeEnd?
                        moment(Number(res.actTimeStart)).format('YYYY.MM.DD')+'-'+
                        moment(Number(res.actTimeEnd)).format('YYYY.MM.DD'):'--')
                    .set('卡券说明',res.remark?res.remark:'--')
                dataCouponDetail.dataRule.set('投放渠道',res.promoteType==1?'卡券广场':res.promoteType==2?'二维码广场':'--')
                    .set('最低消费',res.leastCost==0?'不限制':res.leastCost+'元')
                    .set('使用时段','不限制')
                    .set('每位用户限领',res.getLimit==99999?'不限制':res.getLimit+'张')
            }else {
                dataCouponDetail.dataMain.set('卡券名称',res.name?res.name:'--')
                    .set('卡券面值','￥'+res.amount?res.amount+'元':0.00+'元')
                    .set('卡券logo',res.logo?res.logo:'--')
                    .set('卡券使用期限',res.dateType==1?'领取后'+res.fixedTerm+'天有效':res.dateType==0?
                        moment(Number(res.useTimeBegin)).format('YYYY.MM.DD')+'-'+
                        moment(Number(res.useTimeEnd)).format('YYYY.MM.DD'):'--')
                    .set('适用油品',suitedOils?suitedOils:'--')
                    .set('卡券说明',res.remark?res.remark:'--')
                dataCouponDetail.dataRule.set('最低消费',res.leastCost==0?'不限制':res.leastCost+'元')
                    .set('使用时段','不限制')
            }
            // 过期提醒后台暂时没做，字段不定
            dataCouponDetail.dataExpired.set('过期提醒',res.invalidTip==1?'过期前3天提醒':'不提醒')
        }
        deferred.resolve(dataCouponDetail);
    }).catch(err => {
        deferred.reject(err);
    });
    return deferred.promise;
};

// 复制卡券,这个暂时没用，直接调用新增接口
const copyCoupon = function (data) {
    const params = Object.assign({}, data);
    const deferred = q.defer();
    httpHelper.post(copyCouponUrl, params).then(res => {
        deferred.resolve(res);
    }).catch(err => {
        deferred.reject(err);
    });
    return deferred.promise;
};

// 修改卡券库存-提前结束-删除
const operateCoupon = function (data) {
    const params = Object.assign({}, data);
    const deferred = q.defer();
    httpHelper.post(operateCouponUrl, params).then(res => {
        deferred.resolve(res);
    }).catch(err => {
        deferred.reject(err);
    });
    return deferred.promise;
};

// 编辑卡券
const editCoupon = function (data) {
    const params = Object.assign({}, data);
    const deferred = q.defer();
    httpHelper.post(editCouponUrl, params).then(res => {
        deferred.resolve(res);
    }).catch(err => {
        deferred.reject(err);
    });
    return deferred.promise;
};

// 卡券营销分析-表格数据
const effectViewCoupon = function (couponName) {
    const deferred = q.defer();
    let dataSource = {
        detailDataNew:{
            titleText:'活动拉新效果',
            numText:'人数',
            perText:'占比',
            dataItems:[
                {
                    title:'拉新人数占比',
                    num:0,
                    per:'0%'
                },
                {
                    title:'回头客人数占比',
                    num:0,
                    per:'0%'
                },
                {
                    title:'挽回流失人数占比',
                    num:0,
                    per:'0%'
                }
            ]
        },
        detailDataRetain:{
            titleText:'活动留存效果',
            numText:'人数',
            perText:'转化',
            dataItems:[
                {
                    title:'7天内',
                    num:0,
                    per:'0%'
                },
                {
                    title:'1月内',
                    num:0,
                    per:'0%'
                },
                {
                    title:'3月内',
                    num:0,
                    per:'0%'
                }
            ]
        }
    };
    httpHelper.get(effectViewCouponUrl+'/'+couponName).then(res => {
        if(res!=null){
            dataSource = {
                detailDataNew:{
                    titleText:'活动拉新效果',
                    numText:'人数',
                    perText:'占比',
                    dataItems:[
                        {
                            title:'拉新人数占比',
                            num:res.newMember?res.newMember:0,
                            per:res.newMemberPercent?res.newMemberPercent * 100+'%':'0%'
                        },
                        {
                            title:'回头客人数占比',
                            num:res.returnMember?res.returnMember:0,
                            per:res.returnMemberPercent?res.returnMemberPercent * 100+'%':'0%'
                        },
                        {
                            title:'挽回流失人数占比',
                            num:res.returnLossMember?res.returnLossMember:0,
                            per:res.returnLossMemberPercent?res.returnLossMemberPercent * 100+'%':'0%'
                        }
                    ]
                },
                detailDataRetain:{
                    titleText:'活动留存效果',
                    numText:'人数',
                    perText:'转化',
                    dataItems:[
                        {
                            title:'7天内',
                            num:res.sevenDays?res.sevenDays:0,
                            per:res.sevenDaysPercent?res.sevenDaysPercent * 100+'%':'0%'
                        },
                        {
                            title:'1月内',
                            num:res.oneMonth?res.oneMonth:0,
                            per:res.oneMonthPercent?res.oneMonthPercent * 100+'%':'0%'
                        },
                        {
                            title:'3月内',
                            num:res.oneQuarter?res.oneQuarter:'0',
                            per:res.oneQuarterPercent?res.oneQuarterPercent * 100+'%':'0%'
                        }
                    ]
                }
            }
        }
        deferred.resolve(dataSource);
    }).catch(err => {
        deferred.reject({error: err, data: dataSource});
    });
    return deferred.promise;
};

// 卡券统计-数字卡券数据
const couponCount = function (couponNumber,icons) {
    const deferred = q.defer();
    let dataTotal=[
        {
            'title':'投放张数',
            'amount':0,
            'icon':icons.putInNum1
        },
        {
            'title':'领取张数',
            'amount':0,
            'icon':icons.getIn2
        },
        {
            'title':'验券张数',
            'amount':0,
            'icon':icons.verif3
        },
        {
            'title':'带动消费',
            'amount':0,
            'icon':icons.pushConsume4
        },
        {
            'title':'抵用金额',
            'amount':'￥0.00',
            'icon':icons.sumOfMoney5
        },
        {
            'title':'转化率',
            'amount':'0.00%',
            'icon':icons.perTransf6
        }
    ];
    httpHelper.get(couponCountUrl+'/'+couponNumber).then(res => {
        // console.log(res,'卡券统计数据')
        if (res != null) {
            dataTotal=[
                {
                    'title':'投放张数',
                    'amount':res.total,
                    'icon':icons.putInNum1
                },
                {
                    'title':'领取张数',
                    'amount':res.getTotal,
                    'icon':icons.getIn2
                },
                {
                    'title':'验券张数',
                    'amount':res.verifyTotal,
                    'icon':icons.verif3
                },
                {
                    'title':'带动消费',
                    'amount':res.totalAmount?'￥'+res.totalAmount.toFixed(2):'￥0.00',
                    'icon':icons.pushConsume4
                },
                {
                    'title':'抵用金额',
                    'amount':res.totalDiscount?'￥'+res.totalDiscount.toFixed(2):'￥0.00',
                    'icon':icons.sumOfMoney5
                },
                {
                    'title':'转化率',
                    'amount':res.percent?(res.percent * 100).toFixed(2)+'%':'0.00%',
                    'icon':icons.perTransf6
                }
            ];
        }
        deferred.resolve(dataTotal);
    }).catch(err => {
        deferred.reject({error: err, data: dataTotal});
    });
    return deferred.promise;
};

// 图表couponCountChartUrl
const couponCountChart = function (id) {
    // const params = Object.assign({}, data);
    const deferred = q.defer();
    let x = [];
    let y = [];
    let dataSource = {
        x:x,
        y:y
    }
    httpHelper.get(couponCountChartUrl+'/'+id).then(res => {
        if(res!=null){
            res.map((item,index)=>{
                if(item.date){
                    x.push(moment(Number(item.date)).format('MM.DD'));
                }
                if(item.eveTotal){
                    y.push(item.eveTotal);
                }
            })
        }
        deferred.resolve(dataSource);
    }).catch(err => {
        deferred.reject(err);
    });
    return deferred.promise;
};
// 推广卡券-expandCouponUrl
const expandCoupon = function (id) {
    // const params = Object.assign({}, data);
    const deferred = q.defer();
    httpHelper.get(expandCouponUrl+'/'+id).then(res => {
        deferred.resolve(res);
    }).catch(err => {
        deferred.reject(err);
    });
    return deferred.promise;
};

export default {
    addCoupon,
    couponList,
    copyCoupon,
    operateCoupon,
    detailCoupon,
    detailCouponId,
    editCoupon,
    effectViewCoupon,
    couponCount,
    couponCountChart,
    expandCoupon
}