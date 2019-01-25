import React from 'react';
import { Form, Icon, Input } from 'antd';
import PropTypes from 'prop-types';

import SendCode from '@/common/components/send_code/SendCode';
import CommonService from '@/common/services/common/common.service';

const FormItem = Form.Item;

class CodeForm extends React.Component {
    static propTypes = {
        handleSubmit: PropTypes.func.isRequired
    }

    /**
     * 处理发送验证码
     */
    handleSend = (callback) => {
        const {validateFields} = this.props.form;
        validateFields(['userPhone2'], (err, values) => {
            if (!err) {
                CommonService.SendCode({mobile: values.userPhone2}).then((res) => {
                    callback(true);
                }).catch(err => {
                    callback(false);    
                })
            } else {
                callback(false);
            }
        })
    }

    /**
     * 回车键表单提交
     */
    codeFormSubmit = (e) => {
        this.props.handleSubmit(e);
    }

    render() {
        const {form} = this.props;
        const {getFieldDecorator} = form;
        return (
            <Form>
                <FormItem>
                    {getFieldDecorator('userPhone2', {
                        rules: [{
                            required: true, message: '请输入手机号!', whitespace: true
                        }, {
                            pattern: /^[1][3,4,5,6,7,8,9][0-9]{9}$/, message: '请输入正确的手机号!',
                        }]
                    })(
                        <Input type="number" onPressEnter={this.codeFormSubmit} prefix={<Icon type="mobile" style={{ fontSize: 13 }} />} placeholder="请输入手机号" maxLength={11}/>
                    )}
                </FormItem>
                <SendCode name="phoneCode" form={form} handleSend={this.handleSend} formSubmit={this.codeFormSubmit}/>
            </Form>
        )
    }
}

export default Form.create()(CodeForm);