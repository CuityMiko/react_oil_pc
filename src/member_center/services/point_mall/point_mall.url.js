/**
 * 积分商城请求接口Url
 */

// 查询积分商城活动列表
export const queryScoreExchangeListUrl = '/api/score/score-exchange/query-score-exchange-list';

// 删除积分商城活动
export const scoreExchangeDelUrl = '/api/score/score-exchange/del';

// 提前结束积分商城活动
export const scoreExchangeEarlyEndUrl = '/api/score/score-exchange/early-end';

// 修改库存
export const scoreExchangeModifyInventoryUrl = '/api/score/score-exchange/modify-inventory';

// 新增积分商城活动
export const scoreExchangeSaveUrl = '/api/score/score-exchange/save';

//查询活动详情
export const scoreExchangeGetUrl = '/api/score/score-exchange/get';

//修改积分商城活动
export const scoreExchangeModifyUrl = '/api/score/score-exchange/modify';

/**
 * 积分商城兑换管理
 */

//查询积分商城活动兑换列表
export const queryScoreRecordListUrl = '/api/score/score-exchange-record/query-score-exchange-record-list';

//积分商城活动兑换提货码
export const scoreExchangeRecordVerificationCodeUrl = '/api/score/score-exchange-record/verification-code';

export default {
    queryScoreExchangeListUrl,
    scoreExchangeDelUrl,
    scoreExchangeEarlyEndUrl,
    scoreExchangeModifyInventoryUrl,
    scoreExchangeSaveUrl,
    scoreExchangeGetUrl,
    scoreExchangeModifyUrl,
    queryScoreRecordListUrl,
    scoreExchangeRecordVerificationCodeUrl
}