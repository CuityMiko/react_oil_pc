/**
 * 营销中心
 */
import Loadable from 'react-loadable';
import {Loading} from '@/common/components/widget';

/**
 * 卡券营销
 */
const CardTicket = Loadable({ 
    loader: () => import('../containers/card_ticket/CardTicket.jsx'),
    loading: Loading
});

/**
 * 每升立减
 */
const PerRiseMinus = Loadable({ 
    loader: () => import('../containers/per_rise_minus/PerRiseMinus.jsx'),
    loading: Loading
});

/**
 * 每升立减编辑页
 */
const PerRiseMinusEdit = Loadable({
    loader: () => import('../containers/per_rise_minus/PerRiseMinusEdit.jsx'),
    loading: Loading
});

/**
 * 每升立减编辑页
 */
const PerRiseMinusNew = Loadable({
    loader: () => import('../containers/per_rise_minus/PerRiseMinusNew.jsx'),
    loading: Loading
});


/**
 * 支付后营销
 */
const AfterPayment = Loadable({ 
    loader: () => import('../containers/after_payment/AfterPayment.jsx'),
    loading: Loading
});

const AfterPaymentEdit = Loadable({
    loader: () => import('../containers/after_payment/AfterPaymentEdit.jsx'),
    loading: Loading
});

/**
 * 轮播中心
 */
const BannerCenter = Loadable({ 
    loader: () => import('../containers/banner_center/BannerCenter.jsx'),
    loading: Loading
});
const BannerCenterDetail = Loadable({
    loader: () => import('../containers/banner_center/BannerCenterDetail.jsx'),
    loading: Loading
});

/**
 * 新增代金券
 */
const AddCoupon = Loadable({
    loader: () => import('../components/AddCoupon.jsx'),
    loading: Loading
});

/**
 * 卡券详情
 */
const CouponDetail = Loadable({
    loader: () => import('../components/CouponDetail.jsx'),
    loading: Loading
});

/**
 * 营销分析
 */
const CouponAnalysis = Loadable({
    loader: () => import('../containers/card_ticket/components/CouponAnalysis.jsx'),
    loading: Loading
});

export default {
    CardTicket,
    PerRiseMinus,
    PerRiseMinusEdit,
    PerRiseMinusNew,
    AfterPayment,
    AfterPaymentEdit,
    BannerCenter,
    BannerCenterDetail,
    AddCoupon,
    CouponDetail,
    CouponAnalysis
}