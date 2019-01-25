/**
 * 营销中心
 */

export default {
    menus: [ // 菜单相关路由
        {
            key: '/main/marketing_center', title: '营销中心', icon: 'icon-yingxiaozhongxin', power_code: 'GEN_006',
            subs: [
                { key: '/main/marketing_center/card_ticket', title: '卡券营销', component: 'CardTicket', power_code: 'GEN_006_0001'},
                { key: '/main/marketing_center/per_rise_minus', title: '每升立减', component: 'PerRiseMinus', power_code: 'GAS_006_0002'},
                { key: '/main/marketing_center/after_payment', title: '支付后营销', component: 'AfterPayment', power_code: 'GEN_006_0003'},
                { key: '/main/marketing_center/banner_center', title: '轮播中心', component: 'BannerCenter', power_code: 'GEN_006_0004'}
            ]
        }
    ],
others: [ // 非菜单相关路由
        // couponScene表示新增卡券组件适用场景，可选值1和2,1表示新增卡券，2表示编辑卡券，3表示复制卡券，4表示其他一切赠券；
        { key: '/main/marketing_center/coupon_operate', title: '新增代金券', component: 'AddCoupon', power_code: 'GEN_006_0001'},
        // { key: '/main/marketing_center/coupon_operate/:couponScene', title: '新增代金券', component: 'AddCoupon', power_code: 'GEN_006_0001'},
        { key: '/main/marketing_center/coupon_detail', title: '卡券详情', component: 'CouponDetail', power_code: 'GEN_006_0001'},
        { key: '/main/marketing_center/coupon_detail/:couponId', title: '卡券详情', component: 'CouponDetail', power_code: 'GEN_006_0001'},
        { key: '/main/marketing_center/coupon_analysis', title: '营销分析', component: 'CouponAnalysis', power_code: 'GEN_006_0001'},
        { key: '/main/marketing_center/per_rise_minus_edit/:id', title: '每升立减修改', component: 'PerRiseMinusEdit', power_code: 'GAS_006_0002'},
        { key: '/main/marketing_center/per_rise_minus_new', title: '每升立减新增', component: 'PerRiseMinusNew', power_code: 'GAS_006_0002'},
        { key: '/main/marketing_center/banner_center_detail', title: '轮播中心', component: 'BannerCenterDetail', power_code: 'GEN_006_0004'},
        { key: '/main/marketing_center/banner_center/:pageIndex', title: '轮播中心', component: 'BannerCenter', power_code: 'GEN_006_0004'},
        { key: '/main/marketing_center/after_payment_edit', title: '支付后营销编辑', component: 'AfterPaymentEdit', power_code: 'GEN_006_0003'}

    ]
}