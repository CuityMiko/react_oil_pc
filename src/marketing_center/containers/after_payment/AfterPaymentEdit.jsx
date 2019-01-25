/**
 * 支付后营销
 */

import React, {Component} from 'react';
import {connect} from 'react-redux';

import {Row, Col, Alert, Button} from 'antd'
import Panel from "@/common/components/panel/Panel"
import WhiteSpace from "@/common/components/white_space/WhiteSpace"

import afterPaymentExample from '@/marketing_center/assets/images/after-payment-example.png'

import WrappedAfterPaymentEditForm from './components/AfterPaymentFormEdit'

import {receiveData} from '@/base/redux/actions';

class AfterPayment extends Component {
    state = {
        title: '支付后营销'
    }

    componentWillMount() {
        const {receiveData} = this.props;
        const breadcrumbdata = {
            title: '支付后营销',
            routes: [
                {title: '支付后营销', path: '/main/marketing_center/after_payment'}
            ]
        }
        receiveData(breadcrumbdata, 'breadcrumb')
    }

    //跳转编辑页
    onEdit = (e) => {
        this.props.history.push('/main/marketing_center/after_payment_edit');
    }

    render() {
        const {history} = this.props;

        return (
            <div>
                <Row gutter={16}>
                    <Col xs={24} md={8}>
                        <Panel title={
                            <div>活动示例
                                <span>(图片数据仅为示例)</span>
                            </div>}
                            >
                            <img src={afterPaymentExample} style={{width: `100%`}} />
                        </Panel>
                    </Col>
                    <Col xs={24} md={16}>
                        <Panel title="活动设置">
                            <Row style={{height: '545px'}}>
                                <Col xs={24} md={{span: 20, offset: 2}}>
                                    <Alert message="如通知示例所示，蓝色区域为显示位置，可选择卡券或者会员卡赠送" type="info" showIcon />
                                    <WhiteSpace size="v-xl" />
                                    <WrappedAfterPaymentEditForm history={history}/>
                                </Col>
                            </Row>
                        </Panel>
                    </Col>
                </Row>
            </div>
        )
    }
}

export default connect(state => ({}), {receiveData})(AfterPayment);