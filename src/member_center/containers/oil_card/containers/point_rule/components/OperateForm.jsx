/**
 * 积分规则操作表单
 */

import React from 'react';
import {Form, Input, Row, Col, Checkbox, Button, message} from 'antd';
import PropTypes from 'prop-types';

import Panel from '@/common/components/panel/Panel';
import PointRuleService from '@/member_center/services/oil_card/point_rule/point_rule.service';

const FormItem = Form.Item;

class OperateForm extends React.Component {
    static propTypes = {
        title: PropTypes.string,
        resetForm: PropTypes.func,
        reload: PropTypes.func,
        cancelOperateForm: PropTypes.func,
        skus: PropTypes.array,
        cardid: PropTypes.string,
        currentData: PropTypes.object
    }

    state = {

    }

    /**
     * 新增的按钮
     */
    addBtns = () => {
        return (
            <div>
                <Button onClick={this.cancelAdd}>取 消</Button>
                <Button type="primary" onClick={this.addSave}>保 存</Button>
            </div>
        )
    }

    /**
     * 添加取消
     */
    cancelAdd = () => {
        this.props.cancelOperateForm();
    }

    /**
     * 添加保存
     */
    addSave = () => {
        const {cardid, title, reload, currentData} = this.props;
        this.props.form.validateFields((err, values) => {
            if (!err) {
                let params = {
                    cardSpecId: parseInt(cardid),
                    name: title,
                    skuIds: values.oiltype,
                    amount: parseFloat(values.price).toFixed(2),
                    score: parseInt(values.point)
                }
                if (currentData) { // 编辑
                    params.scoreRuleId = currentData.id;
                    params.name = currentData.name;
                    PointRuleService.UpdatePointRule(params).then(res => {
                        message.success('保存成功！', 2, () => {
                            reload();
                        })
                    })
                } else { // 新增
                    PointRuleService.AddPointRule(params).then(res => {
                        message.success('保存成功！', 2, () => {
                            reload();
                        })
                    })
                }
            }
        })
    }

    /**
     * 验证选择油品
     */
    validateOiltype = (rule, value, callback) => {
        const { getFieldValue } = this.props.form;
        const oiltypes = getFieldValue('oiltype');
        if (oiltypes == null || oiltypes.length <= 0) {
            callback('请选择油品！')
        }
        callback();
    }

    render() {
        const {getFieldDecorator} = this.props.form;
        const {title, skus, currentData} = this.props;
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 2 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 22 },
            },
        };

        const formItemLayout2 = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 6 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 18 },
            },
        };
        return (
            <Panel title={title == '' ? currentData != null ? currentData.name : '' : title} innerType="inner" headerBtnHtml={this.addBtns()} bordered={true}>
                <Form>
                    <FormItem label="油 品" {...formItemLayout}>
                        {getFieldDecorator('oiltype', {
                            rules: [{ validator: this.validateOiltype }],
                            initialValue: currentData && currentData.skuids ? currentData.skuids : []
                        })(
                            <Checkbox.Group style={{ width: "100%", marginTop: 10 }}>
                                <Row>
                                    {
                                        skus.map((sku, index) => {
                                            return <Col md={2} xs={6} key={index}><Checkbox disabled={currentData != null ? false : sku.disabled} value={sku.id}>{sku.name.length>3?(sku.name.substr(0,3).concat('...')):sku.name}</Checkbox></Col>
                                        })
                                    }
                                </Row>
                            </Checkbox.Group>
                        )}
                    </FormItem>
                    <Row>
                        <Col lg={8} md={8} xs={24}>
                            <FormItem label="每消费" {...formItemLayout2}>
                                {getFieldDecorator('price', {
                                    rules: [{
                                        required: true, message: '请输入金额!', whitespace: true
                                    },{
                                        pattern: /^(?!0+(\.0*)?$)\d{0,4}(\.\d{1,2})?$/, message: '输入的金额需大于0小于10000，且只有两位小数'
                                    }],
                                    initialValue: currentData && currentData.amount ? currentData.amount.toString() : ''
                                })(
                                    <Input min={0} addonAfter="元" type="number" style={{width: 200}} placeholder="请输入金额" />
                                )}
                            </FormItem>
                        </Col>
                        <Col lg={8} md={8} xs={24}>
                            <FormItem label="赠 送" {...formItemLayout2}>
                                {getFieldDecorator('point', {
                                    rules: [{
                                        required: true, message: '请输入积分!', whitespace: true
                                    },{
                                        pattern: /^([1-9]\d{0,3}|9999)$/, message: '输入积分需大于零小于10000的整数!',
                                    }],
                                    initialValue: currentData && currentData.score ? currentData.score.toString() : ''
                                })(
                                    <Input min={0} addonAfter="积分" type="number" style={{width: 200}} placeholder="请输入积分" />
                                )}
                            </FormItem>
                        </Col>
                    </Row>
                </Form>
            </Panel>
        )
    } 
}

export default Form.create()(OperateForm);

