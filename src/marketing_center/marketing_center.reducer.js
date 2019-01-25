// 卡券营销
import CardTicket from './containers/card_ticket/redux/reducers'

// 每升立减
import PerRiseMinus from './containers/per_rise_minus/redux/reducers'

// 支付后营销
import AfterPayment from './containers/after_payment/redux/reducers'

// 轮播中心
import BannerCenter from './containers/banner_center/redux/reducers'

export default {
    ...CardTicket,
    ...PerRiseMinus,
    ...AfterPayment,
    ...BannerCenter
}