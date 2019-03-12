import React from 'react';
import {Form, Modal, Switch, Input, InputNumber, Radio, Button, message} from 'antd';
import PropTypes from 'prop-types';

import AddCoupon from '@/marketing_center/components/AddCoupon';

import './store_rule.less';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;

class StoreRuleOperate extends React.Component {
    constructor() {
        super();
        this.discountMap = new Map();
    }

    static propTypes = {
        title: PropTypes.string.isRequired,
        visible: PropTypes.bool.isRequired,
        handleOk: PropTypes.func,
        handleCancel: PropTypes.func,
        storerule: PropTypes.object,
        afterClose: PropTypes.func
    }

    state = {
        visibleCoupon: false,
        couponId: 0,
        couponName: ''
    }

    componentWillReceiveProps() {
        const {storerule} = this.props;
        if (storerule != null) {
            this.discountMap.set(storerule.storediscount, storerule.storediscountval);
        }
    }

    currenthandleOk = () => {
        this.props.form.validateFields((err, values) => {
            if (!err) {
                const storediscount_flag = this.props.form.getFieldValue('storediscount');
                const storediscount = this.discountMap.get(storediscount_flag);
                if (storediscount == undefined) {
                    switch (storediscount_flag) {
                        case 0: // 送金额
                            message.warning('赠送金额为空', 2)
                            break;
                        case 1: // 送积分
                            message.warning('赠送积分为空', 2)
                            break;
                        case 2: // 送优惠券
                            message.warning('赠送优惠券为空', 2)
                            break;
                        default:
                            break;
                    }
                } else {
                    const result = {...values, storediscountval: storediscount}
                    this.props.handleOk(result)
                }
            }
        });
    }

    /**
     * 获取优惠变化
     */
    discountChange = (e, flag) => {
        console.log(e, 'discountChange')
        this.discountMap.set(flag, e);
    }

    closeModalCoupon = () => {
        this.setState({
            visibleCoupon: false,
        });
    }

    getCouponId = (res) => {
        if (res != null) {
            this.discountMap.set(2, `${res.id},${res.name}`);
            let couponName = '';
            if (res.name.length > 8) {
                couponName = res.name.substring(0, 8) + '...';
            } else {
                couponName = res.name;
            }
            this.setState({
                couponId: res.id,
                couponName
            })
        }
    }

    addCoupon = () => {
        this.setState({
            visibleCoupon: true,
        });
    }

    afterClose = () => {
        this.props.afterClose(() => {
            this.setState({
                couponId: 0,
                couponName: ''
            })
        });
    }

    render() {
        const {getFieldDecorator} = this.props.form;
        const formItemLayout = {
            labelCol: {
                xs: {span: 24},
                sm: {span: 6},
            },
            wrapperCol: {
                xs: {span: 24},
                sm: {span: 14},
            },
        };
        const radioStyle = {
            display: 'block',
            height: '45px',
            lineHeight: '45px'
        };
        const {title, visible, handleCancel, storerule} = this.props;
        let {visibleCoupon, couponName, couponId} = this.state;
        couponId = couponId == 0 ? storerule && storerule.couponId ? storerule.couponId : 0 : couponId;
        couponName = couponName == '' ? storerule && storerule.couponName ? storerule.couponName : '' : couponName;
        // 判断选中赠送类型，非选中赠送类型disabled
        let giftType = this.props.form.getFieldValue('storediscount');
        return (
            <div>
                <Modal className="store-gift-modal"
                       title={title}
                       visible={visible}
                       onOk={this.currenthandleOk}
                       onCancel={handleCancel}
                       okText="确认"
                       cancelText="取消"
                       afterClose={this.afterClose}
                       destroyOnClose={true}>
                    <Form>
                        <FormItem label="充值规则名称" {...formItemLayout}>
                            {getFieldDecorator('rulename', {
                                rules: [{
                                    required: true, message: '请输入充值规则名称!', whitespace: true
                                }],
                                initialValue: storerule && storerule.rulename ? storerule.rulename : ''
                            })(
                                <Input maxLength={20} />
                            )}
                        </FormItem>
                        <FormItem label="充值金额" {...formItemLayout}>
                            <div>
                                {getFieldDecorator('storeaccount', {
                                    rules: [{
                                        required: true, message: '请输入充值金额!'
                                    }],
                                    initialValue: storerule && storerule.storeaccount ? storerule.storeaccount.toString() : ''
                                })(
                                    <InputNumber min={0.01} max={9999.99} step={0.01} style={{width: `90%`}} />
                                )}
                                <span style={{marginLeft: 11}}>元</span>
                            </div>
                        </FormItem>
                        <FormItem label="赠送优惠" {...formItemLayout} className="gift-type-content-store">
                            {getFieldDecorator('storediscount', {
                                initialValue: storerule && storerule.storediscount ? storerule.storediscount : 0
                            })(
                                <RadioGroup>
                                    <Radio style={radioStyle} value={0}>
                                        送金额
                                        <InputNumber min={0.01} max={9999.99} step={0.01}
                                                     disabled={giftType == 0 ? false : true}
                                                     onChange={(e) => this.discountChange(e, 0)}
                                                     defaultValue={storerule && storerule.storediscount == 0 ? storerule.storediscountval : ''}
                                                     addonAfter="元" type="number"
                                                     style={{width: 150, marginLeft: 11}} /><span
                                        style={{marginLeft: 11}}>元</span>
                                    </Radio>
                                    <Radio style={radioStyle} value={1}>
                                        送积分
                                        <InputNumber min={1} max={9999} precision={0}
                                                     disabled={giftType == 1 ? false : true}
                                                     onChange={(e) => this.discountChange(e, 1)}
                                                     defaultValue={storerule && storerule.storediscount == 1 ? storerule.storediscountval : ''}
                                                     addonAfter="积分" type="number"
                                                     style={{width: 150, marginLeft: 11}} /><span
                                        style={{marginLeft: 11}}>积分</span>
                                    </Radio>
                                    <Radio style={radioStyle} value={2}>
                                        送优惠券
                                        <Button disabled={giftType == 2 ? false : true} type="primary" icon="plus"
                                                style={{marginLeft: 11}}
                                                onClick={this.addCoupon}>{couponName != '' ? couponName : '新建卡券'}</Button>
                                    </Radio>
                                </RadioGroup>
                            )}
                        </FormItem>
                        <FormItem label="状 态" {...formItemLayout}>
                            {getFieldDecorator('status', {
                                initialValue: storerule && storerule.status ? storerule.status : false
                            })(
                                <Switch checkedChildren="开" unCheckedChildren="关" />
                            )}
                        </FormItem>
                    </Form>
                </Modal>
                {/*赠送卡券新建模态框*/}
                <Modal
                    wrapClassName="add-coupon-modal"
                    title={couponId == 0 ? '添加卡券' : '修改卡券'}
                    visible={visibleCoupon}
                    footer={null}
                    onCancel={this.closeModalCoupon}
                    destroyOnClose={true}
                >
                    <AddCoupon ref='couponForm' rechargeRuleType={storerule == null ? 1 : 0}
                               couponScene={couponId ? 2 : 1} promoteType={4} couponSource="modalSource"
                               getCouponId={this.getCouponId} closeModalCoupon={this.closeModalCoupon}
                               couponId={couponId} />
                </Modal>
            </div>
        )
    }
}

export default Form.create()(StoreRuleOperate);