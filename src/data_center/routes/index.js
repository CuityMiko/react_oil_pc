/**
 * 数据中心
 */
import Loadable from 'react-loadable';
import {Loading} from '@/common/components/widget';

// 消费订单
const DataCenter = Loadable({ 
    loader: () => import('../index'),
    loading: Loading
});

// 充值订单
const RechargeOrders = Loadable({
    loader: () => import('../containers/RechargeOrders'),
    loading: Loading
});

// 消费订单详情
const ConsumerOrdersDetail = Loadable({
    loader: () => import('../containers/ConsumerOrdersDetail'),
    loading: Loading
});

export default {
    DataCenter,
    RechargeOrders,
    ConsumerOrdersDetail
}