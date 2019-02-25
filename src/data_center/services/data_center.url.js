/**
 * 订单列表接口请求url
 */

// 查询消费订单列表
const querySimpleOrderUrl = '/api/mer/order/query-simple-order';

// 查询消费订单列表汇总数据
const getOrderConsumeCountUrl = '/api/mer/order-statistics/order-consume-count';

// 查询充值订单列表
const queryRechargeOrderUrl = '/api/mer/order/query-recharge-order';

// 查询充值订单列表汇总数据
const getOrderRechargeCountUrl = '/api/mer/order-statistics/order-rechage-count';

// 导出消费订单列表
const exportSimpleOrderUrl = '/api/mer/order/export-simple-order';

// 导出充值订单列表
const exportRechargeOrderUrl = '/api/mer/order/export-recharge-order';

// 查询消费订单详情
const getSimpleOrderDetailUrl = '/api/mer/order/detail/';

// 消费订单退款
const refundUrl = '/api/mer/order/payment/refund';

// 首页用到的订单数量统计
const getOrderTotalUrl = '/api/mer/order-statistics/cash-flow-total';

// 首页-获取会员消费统计
const getMemberConsumeDataUrl = '/api/mer/order-statistics/consumptive-total';

export default {
    querySimpleOrderUrl,
    queryRechargeOrderUrl,
    exportSimpleOrderUrl,
    exportRechargeOrderUrl,
    getSimpleOrderDetailUrl,
    refundUrl,
    getOrderTotalUrl,
    getMemberConsumeDataUrl,
    getOrderConsumeCountUrl,
    getOrderRechargeCountUrl
}