/**
 * 路由组件出口文件
 */

// 首页
import Home from '@/main/routes/index'
// 会员中心
import MemberCenter from '@/member_center/routes/index'
// 授权中心
import AuthorizeCenter from '@/authorize_center/routes/index'
// 数据中心
import DataCenter from '@/data_center/routes/index'
// 营销中心
import MarketingCenter from '@/marketing_center/routes/index'
// 油品管理
import OilManage from '@/oil_manage/routes/index'
// 油站管理
import OiltationManage from '@/oiltation_manage/routes/index'
// 交接班
import ShiftsCenter from '@/shifts_center/routes/index'

export default { 
    ...Home, 
    ...AuthorizeCenter, 
    ...DataCenter, 
    ...MarketingCenter, 
    ...MemberCenter, 
    ...OilManage, 
    ...OiltationManage,
    ...ShiftsCenter
}