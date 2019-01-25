import React, {Component} from 'react';
import PropTyeps from 'prop-types';
import moment from 'moment';

import {
    Table, Button, Modal, Form, Row, DatePicker, InputNumber, Radio, Select, Col, Checkbox, message
} from 'antd';

import afterPaymentService from '@/marketing_center/services/after_payment/after_payment.service';
import AddCoupon from '@/marketing_center/components/AddCoupon';

import './after_payment_form.less'

const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;
const CheckboxGroup = Checkbox.Group;
const {RangePicker} = DatePicker;


//新增/编辑加油员表单
class afterPaymentForm extends Component {
    static propTypes = {};

    state = {
        //会员：0 非会员：1
        checkedList: [1],
        plainOptions: [{label: '会员', value: 0}, {label: '非会员', value: 1}],
        sendMemberOptions: [{label: '非会员', value: 1}],
        checkedRadioValue: 'sendCard',
        couponId: 0,
        couponName: '',
        amount: 0,
        visibleCoupon: false,
        sourceData: {},
        giftCard: 0,
        _initTime: [],
        id: ''
    };

    componentDidMount() {
        afterPaymentService.payMarGet().then(res => {
            console.log(res);
            //如果有id则提供id
            this.setState({
                id: res.id
            });
            //如果没数据，则显示新增, 如果是未开始的活动数据回传编辑
            if (res.status == 'NOT_START') {
                let _initTime = [];
                let _startTime = moment(res.startTime).format("YYYY/MM/DD");
                let _endTime = moment(res.endTime).format("YYYY/MM/DD");
                let startTime = moment(_startTime, "YYYY-MM-DD");
                let endTime = moment(_endTime, "YYYY-MM-DD");
                _initTime.push(startTime);
                _initTime.push(endTime);

                this.setState({
                    sourceData: res,
                    checkedList: res.scope,
                    couponId: res.couponId,
                    couponName: res.couponName,
                    _initTime: _initTime,
                    amount: res.amount,
                    _amount: res.amount == 0 ? '' : res.amount,
                    checkedRadioValue: res.couponId ? 'sendCoupon' : 'sendCard',
                    id: res.id
                })
            }
        }).catch(err => {
            console.log(err);
        })
    };

    onChange = (checkedList) => {
        const {plainOptions} = this.state;
        this.setState({
            checkedList,
            indeterminate: !!checkedList.length && (checkedList.length < plainOptions.length),
            checkAll: checkedList.length === plainOptions.length,
        });
    };

    onRadioChange = (e) => {
        console.log('radio checked', e.target.value);
        if (e.target.value == 'sendCoupon') {
            this.setState({
                checkedRadioValue: e.target.value,
                checkedList: [0, 1],
            });
        } else {
            this.setState({
                checkedRadioValue: e.target.value,
                checkedList: [1],
            });
        }

    };

    closeModalCoupon = () => {
        this.setState({
            visibleCoupon: false,
        });
    };

    //新建卡券
    addCoupon = () => {
        this.setState({
            visibleCoupon: true,
        });
    };

    getCouponId = (res) => {
        if (res != null) {
            this.setState({
                couponId: res.id,
                couponName: res.name
            })
        }
    };

    changeAmount = (value) => {
        console.log('change', value);
        this.setState({
            _amount: value
        });
        this.props.form.setFieldsValue({
            amount: value,
        });
    };

    cancel = (e) => {
        e.preventDefault();
        this.props.history.push('/main/marketing_center/after_payment');
    }

    handleSubmit = (e) => {
        e.preventDefault();
        //表单验证
        this.props.form.validateFields((err, values) => {
            if (!err) {
                const {
                    amount,
                    giftCard,
                    couponId,
                    checkedList,
                    id,
                    checkedRadioValue
                } = this.state;
                console.log('Received values of form: ', values, checkedList);
                let postData = {};
                //如果选择赠送卡券
                if (values.send == 'sendCoupon') {
                    //判断是否有创建卡券
                    if (!couponId) {
                        message.error('请新建卡券赠送')
                        return;
                    }
                    postData.couponId = couponId;
                    postData.giftCard = 0;
                } else {
                    postData.giftCard = 1;
                    postData.couponId = null;
                }
                postData.startTime = Number(values.time[0].format("x"));
                postData.endTime = Number(values.time[1].format("x"));
                postData.amount = values.amount;
                postData.scope = checkedList;
                postData.id = id ? id : id;
                console.log(postData, 'postData');
                afterPaymentService.payMarSaveModify({...postData}).then(res => {
                    console.log(res);
                    message.success('修改成功');
                    this.props.history.push('/main/marketing_center/after_payment');
                }).catch(
                    err => {
                        console.log(err);
                    }
                )
            }
        })
    }

    render() {
        const {getFieldDecorator} = this.props.form;
        const {
            checkedRadioValue,
            plainOptions,
            sendMemberOptions,
            checkedList,
            visibleCoupon,
            couponId,
            couponName,
            amount,
            _amount,
            sourceData,
            _initTime
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

        const talItemLayout = {
            wrapperCol: {
                xs: {span: 24},
                sm: {span: 10, offset: 5},
            },
        };

        function disabledDate(current) {
            return current && current < moment().startOf('day');
        }

        return (
            <div>
                <Form onSubmit={this.handleSubmit} className="after-payment-form">
                    <FormItem
                        {...formItemLayout}
                        label="活动时间"
                    >  {getFieldDecorator('time', {
                        rules: [{required: true, message: '请选择活动时间'}],
                        initialValue: _initTime ? _initTime : null
                    })(
                        <RangePicker allowClear={false}
                                     disabledDate={disabledDate}
                                     placeholder={["开始时间", "结束时间"]}
                                     lang="cn"
                                     format="YYYY-MM-DD"
                        />
                    )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="消费条件"
                    >  {getFieldDecorator('amount', {
                        rules: [{required: true, message: '请选择消费条件'}],
                        initialValue: amount
                    })(
                        <RadioGroup>
                            <Row className="mb-24">
                                <Radio value={_amount}></Radio>
                                <span>消费满</span>
                                <span className="mg-12">
                                     <InputNumber className="number-input" placeholder="请输入" min={0.01}
                                                  max={9999} onChange={this.changeAmount} value={_amount}
                                     />
                            </span>
                                <span>元以上</span>
                            </Row>
                            <Row>
                                <Radio value={0}>不限金额</Radio>
                            </Row>
                        </RadioGroup>)}
                    </FormItem>
                    <FormItem
                        className="mb-0"
                        {...formItemLayout}
                        label="赠送内容"
                    >
                        {getFieldDecorator('send', {
                            rules: [{required: true, message: 'test'}],
                            initialValue: sourceData ? (sourceData.couponId ? 'sendCoupon' : 'sendCard') : 'sendCard'
                        })(
                            <RadioGroup onChange={this.onRadioChange}>
                                <Row className="mb-24">
                                    <Radio value="sendCoupon">赠送卡券</Radio>
                                    <Button type="primary" className="mg-12"
                                            onClick={this.addCoupon}>{couponName ? couponName : '新建卡券'}</Button>
                                </Row>
                                <Row className="mb-24">
                                    <CheckboxGroup options={plainOptions} value={checkedList}
                                                   onChange={this.onChange}
                                                   disabled={checkedRadioValue == 'sendCard'} />
                                </Row>
                                <Row className="mb-24">
                                    <Radio value="sendCard">赠送会员卡</Radio>
                                </Row>
                                <Row className="mb-24">
                                    <CheckboxGroup options={sendMemberOptions} value={checkedList}
                                                   onChange={this.onChange}
                                                   disabled={checkedRadioValue == 'sendCoupon'} />
                                </Row>
                            </RadioGroup>
                        )}

                    </FormItem>
                    <FormItem
                        className="mb-0"
                        {...talItemLayout}
                    >
                        <div>
                            <Button type="primary" htmlType="submit">保存</Button>
                            <Button onClick={this.cancel}>取消</Button>
                        </div>
                    </FormItem>
                </Form>
                {/*赠送卡券新建模态框*/}
                <Modal
                    wrapClassName="add-coupon-modal"
                    title={couponId == '' ? '添加卡券' : '修改卡券'}
                    visible={visibleCoupon}
                    footer={null}
                    onCancel={this.closeModalCoupon}
                    destroyOnClose={true}
                >
                    <AddCoupon ref='couponForm' couponScene={couponId ? 2 : 1} promoteType={5}
                               couponSource="modalSource"
                               getCouponId={this.getCouponId} closeModalCoupon={this.closeModalCoupon}
                               couponId={couponId} />
                </Modal>
            </div>
        )
    }
}

const WrappedAfterPaymentForm = Form.create()(afterPaymentForm);

export default WrappedAfterPaymentForm;
