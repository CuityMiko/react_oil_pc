/**
 * 会员中心
 */

export default {
    menus: [ // 菜单相关路由
        {
            key: '/main/member_center', title: '会员中心', icon: 'icon-huiyuanzhongxin', power_code: 'GAS_005',
            subs: [
                { key: '/main/member_center/member_card_setting', title: '会员卡设置', component: 'MemberCardSetting', power_code: 'GEN_005_0001'},
                { key: '/main/member_center/member_list', title: '会员列表', component: 'MemberList', power_code: 'GEN_005_0002'},
                { key: '/main/member_center/oil_card', title: '加油卡', component: 'OilCard', power_code: 'GEN_005_0003'},
                { key: '/main/member_center/point_mall', title: '积分商城', component: 'PointMall', power_code: 'GEN_005_0004'},
            ],
        }
    ],
    others: [ // 非菜单相关路由
        { key: '/main/member_center/member_detail', title: '会员详情', component: 'MemberDetail', power_code: 'GEN_005_0002'},
        { key: '/main/member_center/member_detail/:memberId', title: '会员详情', component: 'MemberDetail', power_code: 'GEN_005_0002'},
        { key: '/main/member_center/member_import', title: '会员导入', component: 'MemberImport', power_code: 'GEN_005_0002'},
        { key: '/main/member_center/member_import_help', title: '会员导入手册', component: 'MemberImportHelper', power_code: 'GEN_005_0002'},
        { key: '/main/member_center/member_card_setting/:pageIndex', title: '会员卡设置', component: 'MemberCardSetting', power_code: 'GEN_005_0001'},
        { key: '/main/member_center/member_card_detail', title: '会员卡详情', component: 'MemberCardDetail', power_code: 'GEN_005_0001'},
        { key: '/main/member_center/member_card_detail', title: '会员卡详情', component: 'MemberCardDetail', power_code: 'GEN_005_0001'},
        { key: '/main/member_center/point_mall/add_point_activity', title: '新增活动', component: 'AddPointActivity', power_code: 'GEN_005_0004'},
        { key: '/main/member_center/point_mall/edit_point_activity/:id', title: '编辑活动', component: 'EditPointActivity', power_code: 'GEN_005_0004'},
        { key: '/main/member_center/point_mall/detail_point_activity/:id', title: '活动详情', component: 'DeatilPointActivity', power_code: 'GEN_005_0004'},
        { key: '/main/member_center/oil_card/point_rule/:cardid', title: '积分规则', component: 'PointRule', power_code: 'GEN_005_0003'},
        { key: '/main/member_center/oil_card/store_rule/:cardid', title: '充值规则', component: 'StoreRule', power_code: 'GEN_005_0003'}
    ]
}