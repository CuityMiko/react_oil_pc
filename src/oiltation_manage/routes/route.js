/**
 * 油站管理
 */

export default {
    menus: [ // 菜单相关路由
        {
            key: '/main/oiltation_manage', title: '加油站管理', icon: 'icon-jiayouzhanguanli', power_code: 'GAS_007',
            subs: [
                {key: '/main/oiltation_manage/oiltation_information', title: '加油站信息', component: 'OiltationInformation', power_code: 'GAS_007_0001'},
                {key: '/main/oiltation_manage/operator_manage', title: '加油员管理', component: 'OperatorManage', power_code: 'GAS_007_0002'},
                {key: '/main/oiltation_manage/pay_qrcode', title: '支付二维码', component: 'PayQrcode', power_code: 'GEN_007_0003'},
            ]
        },
    ],
    others: [ // 非菜单相关路由
        {key: '/main/oiltation_manage/oiltation_information_edit', title: '加油站信息编辑', component: 'OiltationInformationEdit', power_code: 'GAS_007_0001'}
    ]
}