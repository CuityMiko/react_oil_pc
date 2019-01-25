/**
 * 油站管理
 */
import Loadable from 'react-loadable';
import {Loading} from '@/common/components/widget';

/**
 *  油站信息
 */
const OiltationInformation = Loadable({
    loader: () => import('../containers/oiltation_information/OiltationInformation.jsx'),
    loading: Loading
});

/**
 *  油站信息编辑
 */
const OiltationInformationEdit = Loadable({
    loader: () => import('../containers/oiltation_information/OiltationInformationEdit.jsx'),
    loading: Loading
});

/**
 *  加油员管理
 */
const OperatorManage = Loadable({
    loader: () => import('../containers/operator_manage/OperatorManage.jsx'),
    loading: Loading
});

/**
 *  支付二维码
 */
const PayQrcode = Loadable({
    loader: () => import('../containers/pay_qrcode/PayQrcode.jsx'),
    loading: Loading
});

export default {
    OiltationInformation,
    OiltationInformationEdit,
    OperatorManage,
    PayQrcode
}