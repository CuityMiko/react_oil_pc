/**
 * 数据中心
 */

export default {
    menus: [ // 菜单相关路由
        { key: '/main/data_center', title: '订单列表', icon: 'icon-dingdanliebiao', component: 'DataCenter', power_code: 'GEN_004'},
    ],
    others: [ // 非菜单相关路由
        { key: '/main/data_center/recharge', title: '充值订单', icon: 'flag', component: 'RechargeOrders', power_code: 'GEN_004'},
        { key: '/main/data_center/consumer_orders_detail/:orderId', title: '消费订单详情', icon: 'flag', component: 'ConsumerOrdersDetail', power_code: 'GEN_004'}
    ]
}