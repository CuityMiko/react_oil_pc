import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { Form, Input, Icon } from 'antd';

import './refund_modal.less';

const FormItem = Form.Item;

class RefundModal extends Component {
    static propTypes = {
        // 可退金额
        returnableAmount: PropTypes.number.isRequired,
        // 订单号
        orderNumber: PropTypes.string.isRequired
    };

    // 校验金额是否大于可退金额
    checkRefundAmount = (rule, value, callback) => {
        const { returnableAmount } = this.props;
        if(value==0){
            rule.message = '退款金额不能为0';
            callback('退款金额不能为0')
        }
        if (value > returnableAmount) {
            rule.message = '不可超过可退金额';
            callback('不可超过可退金额')
        } else if(!value) {
            rule.message = '请填写退款金额';
            callback('请填写退款金额');
        }
        callback();
    };

    render() {
        const {getFieldDecorator} = this.props.form;

        const {
            orderNumber,
            returnableAmount
        } = this.props;

        const formItemLayout = {
            labelCol: {
                xs: {span: 24},
                sm: {span: 4, offset: 2},
            },
            wrapperCol: {
                xs: {span: 24},
                sm: {span: 16},
            },
        };

        return (
            <div className="refund-modal-container">
                <Form onSubmit={this.handleSubmit}>
                    <FormItem {...formItemLayout} label="订单号：">
                        <div>{orderNumber}</div>
                    </FormItem>
                    <FormItem {...formItemLayout} label="可退金额：">
                        <div>￥{returnableAmount.toFixed(2)}</div>
                    </FormItem>
                    <FormItem {...formItemLayout} label="退款金额">
                        {getFieldDecorator('amount', {
                            rules: [{required: true, message: '请填写退款金额', validator: this.checkRefundAmount }]
                        })(
                            <Input placeholder="请输入" addonAfter="元" type="number" style={{ width: 150 }} />
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label="退款密码">
                        {getFieldDecorator('password', {
                            rules: [{required: true, message: '请填写退款密码'}]
                        })(
                            <Input type="password" placeholder="请输入" style={{ width: 200 }} />
                        )}
                    </FormItem>
                </Form>
                <div className="set-tip">
                    <Icon type="exclamation-circle" />
                    <span>请在此核对退款金额，确认后将直接退回，不可撤销</span>
                </div>
            </div>
        )
    }
}

export default Form.create()(RefundModal);