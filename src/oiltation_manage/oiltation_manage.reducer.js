/**
 * 加油站管理
 */

// 加油站信息
import OiltationInformation from './containers/oiltation_information/redux/reducers';

// 加油员管理
import OperatorManage from './containers/operator_manage/redux/reducers';

// 支付二维码
import PayQrcode from './containers/pay_qrcode/redux/reducers';

export default {
    ...OiltationInformation,
    ...OperatorManage,
    ...PayQrcode
}