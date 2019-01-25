/**
 * 卡券营销请求接口Url
 */
// 卡券列表
export const couponListUrl = '/api/mer/coupon/find/list';

// 新增卡券
export const addCouponUrl = '/api/mer/coupon/save';

// 复制卡券
export const copyCouponUrl = '/api/mer/coupon/modify/copy-coupon';

// 编辑卡券，待定
export const editCouponUrl = '/api/mer/coupon/modify';

// 卡券详情-根据couponNumber查询
export const detailCouponUrl = '/api/mer/coupon/find/detail';

// 卡券详情-根据couponId查询
export const detailCouponIdUrl = '/api/mer/coupon/find-detail';

// 修改卡券库存-提前结束-删除卡券
export const operateCouponUrl = '/api/mer/coupon/modify/coupon-inventory';

// 推广卡券，待定
export const expandCouponUrl = '/api/mer/coupon/qrcode-coupon';

// 卡券营销分析
export const effectViewCouponUrl = '/api/mer/marketing/analysis';

// 卡券统计
export const couponCountUrl = '/api/mer/marketing/count';

// 卡券图表统计
export const couponCountChartUrl = '/api/mer/marketing/find-get-total';