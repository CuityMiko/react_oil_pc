/**
 * 初始化state
 */

/**
 * App全局state管理
 */
const AppGlobalState = {
    responsive: { // 响应式
        data: {
            isMobile: false // 是否移动端
        }
    },
    menu: { // 菜单
        data: {
            Collapsed: false // 是否折叠
        }
    },
    breadcrumb: { // 面包导航
        data: {
            title: '',
            route: [],
            children: null
        }
    }
}

export default {
    AppGlobalState
}