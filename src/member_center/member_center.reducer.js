// 会员卡设置
import MemberCardSetting from './containers/member_card_setting/redux/reducers'

// 会员列表
import MemberList from './containers/member_list/redux/reducers'

// 加油卡
import OilCard from './containers/oil_card/redux/reducers'

// 积分商城
import PointMall from './containers/point_mall/redux/reducers'

export default {
    ...MemberCardSetting,
    ...MemberList,
    ...OilCard,
    ...PointMall
}