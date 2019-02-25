import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {  Form, Input,InputNumber, Radio } from 'antd';

import { receiveData } from '@/base/redux/actions';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;

class EditScore extends Component {
    // 参数类型
    static propTypes = {
        availableScore:PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number,
        ]),
        id:PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number,
        ]),
    };

    // 校验积分
    checkScore = (rule, value, callback) => {
        const {availableScore} = this.props;
        var type = this.props.form.getFieldValue('type');
        var patt = /^[1-9][0-9]*$/;
        if(value===''||value===undefined){
            rule.message = '请填写积分';
            callback('请填写积分');
        }
        if(value===0){
            rule.message = '积分不能为0';
            callback('积分不能为0');
        }
        if(!patt.test(value)){
            rule.message = '积分格式不正确';
            callback('积分格式不正确');
        }
        if(type == -1){
            if(value > availableScore){
                rule.message = '减少积分不能大于当前可用积分';
                callback('减少积分不能大于当前可用积分');
            }
        }
        callback();
    };

    render() {
        const {getFieldDecorator} = this.props.form;
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
                        label="积分"
                    >
                        {getFieldDecorator('amount', {
                            rules: [
                                // {required: true, message: '请填写积分'},
                                // {pattern: /^[1-9][0-9]*$/, message: '积分格式不正确!'},
                                {validator: this.checkScore}
                            ]
                        })(
                            <InputNumber  autoComplete="off" placeholder="" />
                        )}
                    </FormItem>
                </Form>
            </div>
        )
    }
}
// 导出使用redux会影响模态框中的表单数据
export default Form.create()(EditScore);
