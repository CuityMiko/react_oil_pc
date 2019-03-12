import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classNames from 'classnames';
import {  Form, Input, Radio,message } from 'antd';

import { receiveData } from '@/base/redux/actions';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;

class EditInventory extends Component {
    // 参数类型
    static propTypes = {
        // 卡券名称
        name: PropTypes.string.isRequired,
        id:PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number,
        ]),
    };

    // 校验库存
    checkAmount = (rule, value, callback) => {
        var patt = /^[1-9][0-9]*$/;
        if(value===''||value===undefined){
            rule.message = '请填写库存';
            callback('请填写库存');
        }
        if(value==0){
            rule.message = '库存不能为0';
            callback('库存不能为0');
        }
        if(!patt.test(value)){
            rule.message = '格式不正确';
            callback('格式不正确');
        }
        callback();
    };

    render() {
        const {getFieldDecorator} = this.props.form;
        // 手机端还是电脑端
        const {responsive,name} = this.props;
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
            <div className="link-container">
                <Form onSubmit={this.handleSubmitInventory}>
                    <FormItem {...formItemLayout} label="卡券名称">
                        <div>{name}</div>
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="增减选择"
                    >  {getFieldDecorator('type', {
                        initialValue: 1
                    })(
                        <RadioGroup>
                            <Radio value={1}>增加</Radio>
                            <Radio value={-1}>减少</Radio>
                        </RadioGroup>)}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="库存"
                    >
                        {getFieldDecorator('amount', {
                            rules: [
                                // {required: true, message: '请填写库存'},
                                // {pattern: /^[1-9][0-9]*$/, message: '库存格式不正确!'}
                                {validator: this.checkAmount}
                            ]
                        })(
                            <Input autoComplete="off" maxLength={5} placeholder="请输入库存" />
                        )}
                    </FormItem>
                </Form>
            </div>
        )
    }
}
// 导出使用redux会影响模态框中的表单数据
export default Form.create()(EditInventory);
