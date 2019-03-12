/**
 * 支付后营销
 */

import React, {Component} from 'react';
import {connect} from 'react-redux';

import {Row, Col, Alert, Button, message, Modal} from 'antd'
import Panel from "@/common/components/panel/Panel"
import WhiteSpace from "@/common/components/white_space/WhiteSpace"

import WrappedAfterPaymentDetailForm from './components/AfterPaymentForm'

import afterPaymentService from '@/marketing_center/services/after_payment/after_payment.service';
import afterPaymentExample from '@/marketing_center/assets/images/after-payment-example.png'

import {receiveData} from '@/base/redux/actions';

import './after_payment.less';

class AfterPayment extends Component {
    state = {
        title: '支付后营销',
        sourceData: []
    };

    componentWillMount() {
        const {receiveData} = this.props;
        const breadcrumbdata = {
            title: '支付后营销',
            routes: [
                {title: '支付后营销', path: '/main/marketing_center/after_payment'}
            ]
        };
        receiveData(breadcrumbdata, 'breadcrumb')
    };

    componentDidMount() {
        this.initData()
    };

    //初始化数据
    initData() {
        afterPaymentService.payMarGet().then(res => {
            console.log(res, '有没有数据')
            //如果没数据，跳转新增页面
            if (!res) {
                this.props.history.push('/main/marketing_center/after_payment_edit');
            } else {
                this.setState({
                    sourceData: res,
                    status: res.status
                })
            }
        }).catch(err => {
            console.log(err);
        })
    };

    //跳转编辑页
    onEdit = (e) => {
        this.props.history.push('/main/marketing_center/after_payment_edit');
    };

    //提前结束
    onOver = () => {
        const _self = this;
        const {id} = this.state.sourceData;
        Modal.confirm({
            title: '请确认',
            content: '是否提前结束该活动',
            okText: '确认',
            cancelText: '取消',
            onOk() {
                afterPaymentService.payMarEndActivity(id).then(res => {
                    console.log('res')
                    message.success('提前结束该活动成功')
                    _self.initData();
                }).catch(err => {
                    console.log(err);
                })
            }
        })
    }

    render() {
        const {sourceData, statusMap} = this.state;
        const {history} = this.props;

        return (
            <div className="after-pay-container">
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
                        <Panel title="活动设置"
                               headerBtnHtml={
                                   <div>
                                       {
                                           sourceData.status == 'ACTIVITING' ? (
                                               <Button onClick={this.onOver}>提前结束</Button>
                                           ) : (
                                               <Button type="primary" onClick={this.onEdit}>{
                                                   sourceData.status == 'NOT_START' ? '编辑' : '新增'
                                               }</Button>
                                           )
                                       }

                                   </div>}
                        >
                            <Row style={{height: '545px'}}>
                                <Col xs={24} md={{span: 20, offset: 2}}>
                                    <Alert message="如通知示例所示，蓝色区域为显示位置，可选择卡券或者会员卡赠送" type="info" showIcon />
                                    <WhiteSpace size="v-xl" />
                                    <WrappedAfterPaymentDetailForm history={history} />
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