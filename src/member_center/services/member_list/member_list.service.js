/**
 * 会员列表接口服务
 */
import q from 'q';
import qs from 'query-string';
import moment from 'moment';

import httpHelper from '@/base/axios/http_helper';

// 会员列表-详情-删除-新增量-导出
import {listMbrUrl,detailMbrUrl,delteMbrUrl,amountMbrUrl,exportMbrUrl,
    storedCountUrl,storedListUrl,scoreCountUrl,scoreListUrl,editScoreUrl,newTotalMbrUrl,
    mbrImportListUrl,codeImportUrl,verifyCodeImportUrl,mbrUploadImportUrl,resultUploadImportUrl
} from './member_list.url';

// 列表
const listMbr = function (data) {
    const params = Object.assign({}, {...data});
    const deferred = q.defer();
    httpHelper.get(listMbrUrl,params).then(res => {
       deferred.resolve(res);
    }).catch(err => {
        deferred.reject(err);
    });
    return deferred.promise;
};

// 详情
const detailMbr = function (memberId) {
    const deferred = q.defer();
    let dataDetailBasic = new Map();
    let dataDetail = {
        gasCardId:0,
        dieselCardId:0,
        dataDetailBasic:dataDetailBasic
    };
    dataDetail.dataDetailBasic.set('会员名称','--')
        .set('手机号','--')
        .set('性别','--')
        .set('生日','--')
    httpHelper.get(detailMbrUrl+'/'+memberId).then(res => {
        if (res != null) {
            dataDetail.dataDetailBasic.set('会员名称',res.name?res.name:'--')
                .set('手机号',res.mobile?res.mobile:'--')
                .set('性别',res.sex?res.sex:'--')
                .set('生日',res.birthday?(moment(Number(res.birthday)).format('YYYY.MM.DD')):'--')
            dataDetail.gasCardId = res.gasCardId;
            dataDetail.dieselCardId = res.dieselCardId;
        }
        deferred.resolve(dataDetail);
    }).catch(err => {
        deferred.reject({error: err, data: dataDetail});
    });
    return deferred.promise;
};

// 删除会员,/拼接形式
const delteMbr = function (memberId) {
    const deferred = q.defer();
    httpHelper.post(delteMbrUrl+'/'+memberId).then(res => {
         deferred.resolve(res);
    }).catch(err => {
        deferred.reject(err);
    });
    return deferred.promise;
};

// 新增会员量
const amountMbr = function (icons) {
    const deferred = q.defer();
    let dataTotalMbr = [
        {
            'title':'昨日新增会员',
            'amount':0,
            'icon':icons.addNewMbr
        },
        {
            'title':'会员总量',
            'amount':0,
            'icon':icons.addTotalMbr
        }
    ];
    httpHelper.get(amountMbrUrl).then(res => {
        if (res != null) {
            dataTotalMbr = [
                {
                    'title':'昨日新增会员',
                    'amount':res.yesterdayMemberCount,
                    'icon':icons.addNewMbr
                },
                {
                    'title':'会员总量',
                    'amount':res.memberCount,
                    'icon':icons.addTotalMbr
                }
            ];
        }
        deferred.resolve(dataTotalMbr);
    }).catch(err => {
        deferred.reject({error: err, data: dataTotalMbr});
    });
    return deferred.promise;
};

// 导出会员
const exportMbr = function (params) {
    // let params = Object.assign({}, {...data});
    // console.log(qs.stringify(params),'exportparams')对象转json
    window.open(exportMbrUrl +'?'+ qs.stringify(params));
};

// 储值统计
const storedCount = function (cardId,icons) {
    const deferred = q.defer();
    let dataTotalStoredQi = [
        {
            'title':'汽油卡储值余额',
            'amount':'￥0.00',
            'icon':icons.availMoney
        },
        {
            'title':'汽油卡储值总额',
            'amount':'￥0.00',
            'icon':icons.totalMoney
        }
    ];
    let dataTotalStoredChai = [
        {
            'title':'柴油卡储值余额',
            'amount':'￥0.00',
            'icon':icons.availMoney
        },
        {
            'title':'柴油卡储值总额',
            'amount':'￥0.00',
            'icon':icons.totalMoney
        }
    ];
    let dataStored = {
        dataTotalStoredQi:dataTotalStoredQi,
        dataTotalStoredChai:dataTotalStoredChai
    };
    httpHelper.get(storedCountUrl+'/'+cardId).then(res => {
        if (res != null) {
            dataTotalStoredQi = [
                {
                    'title':'汽油卡储值余额',
                    'amount':res.balance?'￥'+Number(res.balance).toFixed(2):'￥0.00',
                    'icon':icons.availMoney
                },
                {
                    'title':'汽油卡储值总额',
                    'amount':res.amount?'￥'+Number(res.amount).toFixed(2):'￥0.00',
                    'icon':icons.totalMoney
                }
            ];
            dataTotalStoredChai = [
                {
                    'title':'柴油卡储值余额',
                    'amount':res.balance?'￥'+Number(res.balance).toFixed(2):'￥0.00',
                    'icon':icons.availMoney
                },
                {
                    'title':'柴油卡储值总额',
                    'amount':res.amount?'￥'+Number(res.amount).toFixed(2):'￥0.00',
                    'icon':icons.totalMoney
                }
            ]
            dataStored = {
                dataTotalStoredQi:dataTotalStoredQi,
                dataTotalStoredChai:dataTotalStoredChai
            };
        }
        deferred.resolve(dataStored);
    }).catch(err => {
        // deferred.reject(err);
        deferred.reject({error: err, data: dataStored});
    });
    return deferred.promise;
};

// 储值列表
const storedList = function (data) {
    const params = Object.assign({}, {...data});
    const deferred = q.defer();
    httpHelper.get(storedListUrl,params).then(res => {
        deferred.resolve(res);
    }).catch(err => {
        deferred.reject(err);
    });
    return deferred.promise;
};

// 积分统计
const scoreCount = function (memberId,icons) {
    const deferred = q.defer();
    let dataCardCount = [
        {
            'title':'可用积分',
            'amount':0,
            'icon':icons.availScore
        },
        {
            'title':'积分总额',
            'amount':0,
            'icon':icons.totalScore
        }
    ];
    httpHelper.get(scoreCountUrl+'/'+memberId).then(res => {
        if (res != null) {
            dataCardCount = [
                {
                    'title':'可用积分',
                    'amount':res.availableScore,
                    'icon':icons.availScore
                },
                {
                    'title':'积分总额',
                    'amount':res.totalScore,
                    'icon':icons.totalScore
                }
            ];
        }
        deferred.resolve(dataCardCount);
    }).catch(err => {
        deferred.reject({error: err, data: dataCardCount});
    });
    return deferred.promise;
};

// 积分列表
const scoreList = function (data) {
    const params = Object.assign({}, {...data});
    const deferred = q.defer();
    httpHelper.get(scoreListUrl,params).then(res => {
        deferred.resolve(res);
    }).catch(err => {
        deferred.reject(err);
    });
    return deferred.promise;
};

// 手动修改积分
const editScore = function (data) {
    const params = Object.assign({}, data);
    const deferred = q.defer();
    httpHelper.post(editScoreUrl,params).then(res => {
        deferred.resolve(res);
    }).catch(err => {
        deferred.reject(err);
    });
    return deferred.promise;
};


// 首页用到的新增会员数量统计
const newTotalMbr = function (data) {
    const params = Object.assign({}, {...data});
    const deferred = q.defer();
    httpHelper.get(newTotalMbrUrl,params).then(res => {
        deferred.resolve(res);
    }).catch(err => {
        deferred.reject(err);
    });
    return deferred.promise;
};

// 会员导入查询列表
const mbrImportList = function () {
    const deferred = q.defer();
    httpHelper.get(mbrImportListUrl).then(res => {
        deferred.resolve(res);
    }).catch(err => {
        deferred.reject(err);
    });
    return deferred.promise;
};

// 导入-获取短信验证码
const codeImport = function (data) {
    const params = Object.assign({}, {...data});
    const deferred = q.defer();
    httpHelper.get(codeImportUrl,params).then(res => {
        deferred.resolve(res);
    }).catch(err => {
        deferred.reject(err);
    });
    return deferred.promise;
};

// 导入-验证短信验证码
const verifyCodeImport = function (data) {
    const params = Object.assign({}, {...data});
    const deferred = q.defer();
    httpHelper.get(verifyCodeImportUrl,params).then(res => {
        deferred.resolve(res);
    }).catch(err => {
        deferred.reject(err);
    });
    return deferred.promise;
};

// 会员上传excel，上传接口传参待定,这里的传参为上传文件通用接口返回的url，该接口只调用
const mbrUploadImport = function (data) {
    const params = Object.assign({}, data);
    const deferred = q.defer();
    httpHelper.post(mbrUploadImportUrl,params).then(res => {
        deferred.resolve(res);
    }).catch(err => {
        deferred.reject(err);
    });
    return deferred.promise;
};

// 上传结果
const resultUploadImport = function (id) {
    const deferred = q.defer();
    httpHelper.get(resultUploadImportUrl+'/'+id).then(res => {
        deferred.resolve(res);
    }).catch(err => {
        deferred.reject(err);
    });
    return deferred.promise;
};

export default {
    listMbr,
    detailMbr,
    delteMbr,
    amountMbr,
    exportMbr,
    storedCount,
    storedList,
    scoreCount,
    scoreList,
    editScore,
    newTotalMbr,
    mbrImportList,
    codeImport,
    verifyCodeImport,
    mbrUploadImport,
    resultUploadImport
}


