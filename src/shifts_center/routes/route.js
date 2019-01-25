/**
 * 交接班
 */

export default {
    menus: [ // 菜单相关路由
        { key: '/main/handover_work', title: '交接班', icon: 'icon-jiaojieban', component: 'HandoverWork', power_code: 'GAS_003'},
        { key: '/main/work_end', title: '班结管理', icon: 'icon-banjieguanli', component: 'WorkEnd', power_code: 'GAS_002'},
    ],
    others: [ // 非菜单相关路由
        { key: '/main/handover_work/record', title: '交班记录', icon: 'flag', component: 'Record', power_code: 'GAS_003'}
    ]
}