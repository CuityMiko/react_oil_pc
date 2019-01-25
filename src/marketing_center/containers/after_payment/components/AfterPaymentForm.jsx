import React, {Component} from 'react';
import PropTyeps from 'prop-types';
import moment from 'moment';

import {
    Table, Button, Modal, Form, Row, DatePicker, InputNumber, Radio, Select, Col, Checkbox, message
} from 'antd';

import afterPaymentService from '@/marketing_center/services/after_payment/after_payment.service';

import './after_payment_form.less'

const FormItem = Form.Item;

let statusMap = new Map();
statusMap.set('NOT_START', '未开始');
statusMap.set('ACTIVITING', '进行中');
statusMap.set('OVER', '已结束');
statusMap.set('FORCE_CLOSED', '已结束');

//新增/编辑加油员表单
class afterPaymentForm extends Component {
    static propTypes = {};

    state = {
        startTime: '',
        endTime: '',
        condation: '', //消费条件
        sendContent: '', // 赠送内容
        objectName: '', //活动对象
        activityText: '', // 活动状态
        couponId: 0
    };

    componentDidMount() {
        afterPaymentService.payMarGet().then(res => {
            let _startTime = moment(res.startTime).format("YYYY.MM.DD")
            let _endTime = moment(res.endTime).format("YYYY.MM.DD")
            let _condation = res.amount ? ('消费满' + res.amount + '元以上') : '不限金额'
            let _sendContent = res.couponId ? (
                <a className="mg-12"
                   onClick={this.couponDetail}>{res.couponName}</a>
            ) : '会员卡';
            let _objectName = '';
            for (let i in res.scope) {
                _objectName += (i != 0) ? ' / ' : '';
                _objectName += (res.scope[i] ? '非会员' : '会员');
            };
            let _activityText = statusMap.get(res.status);

            this.setState({
                startTime: _startTime,
                endTime: _endTime,
                condation: _condation,
                sendContent: _sendContent,
                objectName: _objectName,
                activityText: _activityText,
                couponId: res.couponId
            })

        }).catch(err => {
            console.log(err);
        })
    };


    closeModalCoupon = () => {
        this.setState({
            visibleCoupon: false,
        });
    };

    //卡券详情
    couponDetail = () => {
        const {couponId} = this.state;
        this.props.history.push('/main/marketing_center/coupon_detail?' +
            'couponId=' + couponId + '&couponDetailScene=couponGift');
    };

    render() {
        const {
            startTime,
            endTime,
            condation,
            sendContent,
            objectName,
            activityText,
        } = this.state;

        const formItemLayout = {
            labelCol: {
                xs: {span: 24},
                sm: {span: 4},
            },
            wrapperCol: {
                xs: {span: 24},
                sm: {span: 10, offset: 1},
            },
        };

        return (
            <div>
                <FormItem
                    {...formItemLayout}
                    label="活动状态"
                >
                    <div>
                        <span>{activityText}</span>
                    </div>
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="活动时间"
                >
                    <div>
                        <span>{startTime}</span> - <span>{endTime}</span>
                    </div>
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="消费条件">
                    <div>
                        <span>{condation}</span>
                    </div>
                </FormItem>
                <FormItem
                    className="mb-0"
                    {...formItemLayout}
                    label="赠送内容"
                >
                    <div><span>{sendContent}</span></div>
                </FormItem>
                <FormItem
                    className="mb-0"
                    {...formItemLayout}
                    label="活动对象"
                >
                    <div><span>{objectName}</span>
                    </div>
                </FormItem>
            </div>
        )
    }
}

const WrappedAfterPaymentDetailForm = Form.create()(afterPaymentForm);

export default WrappedAfterPaymentDetailForm;