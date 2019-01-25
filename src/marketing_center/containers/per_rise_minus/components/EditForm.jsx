import React from 'react';
import PropTypes from 'prop-types';
import {
    Form, Input, Radio, DatePicker, Row, Col, Button, InputNumber, message
} from 'antd';

import moment from 'moment'

import oilManageService from '@/oil_manage/services/oil_manage.service.js'
import perRiseMinusService from '@/marketing_center/services/per_rise_minus/per_rise_minus.service'

import "./edit_form.less"

var _ = require('lodash');

const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const {MonthPicker, RangePicker} = DatePicker;
const {TextArea} = Input;

class editForm extends React.Component {
    static propTypes = {};

    state = {
        oilListSource: [],
        activityLists: [],
        isMemberSkusList: [],
        notMemberSkusList: [],
        editData: null
    };

    componentDidMount() {
        // 获取油品列表
        oilManageService.GetOilList().then(res => {
            let allSkus = [];
            for (let item of res) {
                allSkus.push(...item.skus)
            }
            //深拷贝
            let isMemberSkus = JSON.parse(JSON.stringify(allSkus));
            let notMemberSkus = JSON.parse(JSON.stringify(allSkus));
            this.setState({
                oilListSource: res,
                isMemberSkusList: isMemberSkus,
                notMemberSkusList: notMemberSkus
            })
            //如果是编辑获取该活动详情
            const _self = this;
            if (this.props.id) {
                perRiseMinusService.litreActivityGet(this.props.id).then(res => {
                    console.log(res)
                    this.setState({
                        editData: res
                    });
                    let _time = [];
                    _time.push(moment(res.startTime))
                    _time.push(moment(res.endTime))
                    _self.getList(_time, '');

                }).catch(err => {
                    console.log(err)
                })
            }
        }).catch(err => {
            console.log(err);
        });
        //获取活动列表 （新增活动时，已有活动将不显示，获取该列表做数据过滤）
        perRiseMinusService.litreActivityFindList().then(res => {
            //去除已结束的活动时间
            _.remove(res, function (i) {
                return i.status == 'OVER'
            });
            this.setState({
                activityLists: res
            })
        }).catch(err => {
            console.log(err);
        })
    }

    // 获取活动列表
    getList = (date, dateString) => {
        const {oilListSource, activityLists, editData, isMemberSkusList, notMemberSkusList} = this.state;
        console.log('getList', date[0]);
        //获取活动当前开始时间和结束时间
        let _startTime = date[0].format('x');
        let _endTime = date[1].format('x');
        console.log('time', _startTime, _endTime);
        let isMemberSkus = isMemberSkusList;
        let notMemberSkus = notMemberSkusList;
        console.log(notMemberSkus, 'notMemberSkus0', activityLists);
        //数据过滤
        if(activityLists){
            for (let activitylist of activityLists) {
                // 该活动不在当前设置的活动范围内
                if (_startTime > activitylist.endTime || _endTime < activitylist.startTime) {
                    continue
                } else {
                    // 循环该活动中对油品的优惠活动
                    for (let item of activitylist.details) {
                        // 这个SKU设置了会员立减价
                        if (item.mbrSubtract > 0) {
                            // 剔除数据
                            _.remove(isMemberSkus, function (i) {
                                return i.skuName == item.skuName
                            })
                        }
                        // 这个SKU设置了非会员立减价
                        console.log(item.nonMbrSubtract, '非会员', item.skuName);
                        if (item.nonMbrSubtract > 0) {
                            // 剔除数据
                            let rem = _.remove(notMemberSkus, function (i) {
                                return i.skuName == item.skuName
                            })
                        }
                        console.log(notMemberSkus, 'notMemberSkus');
                    }
                }
            }
        }

        console.log(notMemberSkus, 'notMemberSkus');
        // 如果是编辑
        if (editData) {
            console.log('是编辑')
            let _isMemberList = [];
            let _notMemberList = [];
            for (let item of editData.details) {
                let isMemberItem = {};
                let notMemberItem = {};
                _.remove(isMemberSkus, function (i) {
                    return i.skuName == item.skuName
                });
                _.remove(notMemberSkus, function (i) {
                    return i.skuName == item.skuName
                });
                isMemberItem.id = item.skuId;
                isMemberItem.skuName = item.skuName;
                isMemberItem.price = item.originalPrice;
                isMemberItem.mbrSubtract = item.mbrSubtract;
                notMemberItem.id = item.skuId;
                notMemberItem.skuName = item.skuName;
                notMemberItem.price = item.originalPrice;
                notMemberItem.nonMbrSubtract = item.nonMbrSubtract;
                _isMemberList.push(isMemberItem);
                _notMemberList.push(notMemberItem);
            }
            _isMemberList.push(...isMemberSkus);
            _notMemberList.push(...notMemberSkus);
            this.setState({
                isMemberSkusList: _isMemberList,
                notMemberSkusList: _notMemberList
            })
        } else {
            this.setState({
                isMemberSkusList: isMemberSkus,
                notMemberSkusList: notMemberSkus
            });
        }
    };

    render() {
        const {getFieldDecorator} = this.props.form;
        const {isMemberSkusList, notMemberSkusList, editData} = this.state;

        let _initTime = [];
        if (editData) {
            let _startTime = moment(editData.startTime).format("YYYY/MM/DD");
            let _endTime = moment(editData.endTime).format("YYYY/MM/DD");
            let startTime = moment(_startTime, "YYYY-MM-DD");
            let endTime = moment(_endTime, "YYYY-MM-DD");
            _initTime.push(startTime);
            _initTime.push(endTime);
        }


        const formItemLayout = {
            labelCol: {
                xs: {span: 24},
                sm: {span: 2},
            },
            wrapperCol: {
                xs: {span: 24},
                sm: {span: 9},
            },
        };

        const testLayout = {
            labelCol: {
                xs: {span: 24},
                // sm: {span: 12},
                sm: {span: 0}
            },
            wrapperCol: {
                xs: {span: 24},
                // sm: {span: 8,offset: 1},
                sm: {span: 24}
            },
        };

        //时间只能选择今日之后的时间
        function disabledDate(current) {
            // Can not select days before today and today
            return current && current < moment().startOf('day');
        }

        // 动态设置列表
        let isMemberElemList = [];
        let notMemberElemList = [];
        if (isMemberSkusList) {
            for (let sku of isMemberSkusList) {
                // 将isMember作为对象数组
                let isMemeberStr = 'isMember.' + sku.id;
                isMemberElemList.push(
                    <FormItem
                        {...testLayout}
                        className="mb-0"
                        key={sku.id}
                    >
                        <div>
                            <div className="list">{sku.skuName}(单价{sku.price}/升)立减</div>
                            {getFieldDecorator(isMemeberStr, {
                                initialValue: sku.mbrSubtract ? sku.mbrSubtract : null
                            })(
                                <InputNumber placeholder="请输入金额" className="input-width" min={0.01} max={sku.price}
                                             step={0.01} />
                            )}
                            <span className="field-tip-align">元/L</span>
                        </div>
                    </FormItem>
                )
            }
        }

        if (notMemberSkusList) {
            for (let sku of notMemberSkusList) {
                let notMemeberStr = 'notMember.' + sku.id;
                notMemberElemList.push(
                    <FormItem
                        {...testLayout}
                        className="mb-0"
                        key={sku.id}
                    >
                        <div>
                            <div className="list">{sku.skuName}(单价{sku.price}/升)立减</div>
                            {getFieldDecorator(notMemeberStr, {
                                initialValue: sku.nonMbrSubtract ? sku.nonMbrSubtract : null
                            })(
                                <InputNumber placeholder="请输入金额" className="input-width" min={0.01} max={sku.price}
                                             step={0.01} />
                            )}
                            <span className="field-tip-align">元/L</span>
                        </div>
                    </FormItem>
                )
            }
        }


        return (
            <div className="per-rise-minus-edit-form">
                <Form onSubmit={this.handleSubmit}>
                    <FormItem
                        {...formItemLayout}
                        label="活动名称"
                    >
                        <Row>
                            <Col span={21}>
                                {getFieldDecorator('name', {
                                    rules: [
                                        {required: true, message: '请输入活动名称'},
                                        {max: 20, message: '字符不能超过20'}],
                                    initialValue: editData ? editData.name : null
                                })(
                                    <Input placeholder="请输入" />
                                )}
                            </Col>
                            <Col span={3} className="unit">
                                <span className="field-tip-align">
                                    <span>{this.props.form.getFieldValue('name') && this.props.form.getFieldValue('name').length ? this.props.form.getFieldValue('name').length : '0'}</span>
                                    <span>/20</span>
                                </span>
                            </Col>
                        </Row>
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="活动时间"
                    >
                        <Row>
                            <Col span={21}>
                                {getFieldDecorator('time', {
                                    rules: [{required: true, message: '请选择活动时间'}],
                                    initialValue: editData ? _initTime : null
                                })(
                                    <RangePicker allowClear={false}
                                        onChange={this.getList}
                                        disabledDate={disabledDate}
                                        placeholder={["开始时间", "结束时间"]}
                                        lang="cn"
                                        format="YYYY-MM-DD"
                                        className="range-picker"
                                    />
                                )}
                            </Col>
                        </Row>
                    </FormItem>
                    <Row>
                        <Col xs={24} lg={2}>
                            <div className="ant-form-item-required label-title">油品优惠：</div>
                        </Col>
                        <Col xs={24} lg={22}>
                            <Row>
                                <Col xs={24} lg={12} className="is-member">
                                    <div className="identity">会员<span className="tip">&nbsp;(不设置优惠的油品可不填写)</span></div>
                                    <div className="list-conent">
                                        {isMemberElemList}
                                    </div>
                                </Col>
                                <Col xs={24} lg={{span: 10, offset: 2}} className="not-member">
                                    <div className="identity">非会员<span className="tip">&nbsp;(不设置优惠的油品可不填写)</span></div>
                                    <div className="list-conent">
                                        {notMemberElemList}
                                    </div>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </Form>
            </div>
        )
    }
}

const WrappedEditForm = Form.create()(editForm);

export default WrappedEditForm;