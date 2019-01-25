/**
 * 首页
 */

export default {
    menus: [ // 菜单相关路由
        { key: '/main/index', title: '首页', icon: 'icon-zhuye', component: 'Home', power_code: 'GEN_001'}
    ],
    others: [ // 非菜单相关路由
        { key: '/main/update_password', title: '修改密码', component: 'UpdatePassword', power_code: 'GEN_001'},
        { key: '/main/personal_info', title: '个人信息', component: 'PersonalInfo', power_code: 'GEN_001'}
    ]
}